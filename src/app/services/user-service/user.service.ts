import { Injectable } from '@angular/core';
import {TimerUtils} from "../../utils/timer-utils/timer-utils";
import {Observable, of, ReplaySubject} from "rxjs";
import {UserServiceSubscription} from "./user-service-subscription";
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {ResponseLogin} from "../../apis/responses/response-login";
import {catchError, map} from "rxjs/operators";
import {ApiEndPoints} from "../../apis/api-end-points";
import {HttpErrorContainer} from "../../apis/http-wrapper/http-error-container";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Use UserServiceSubscription to listen to the subjects
  private _onLogin: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  /**
   * This is a front end expire timer regardless of what's set in the backend.
   * The technique is to have the backend have a longer expiration timer, while the front end has room to
   * set any time limit not exceeding the max time set in the backend.
   * 1 hour expire time on front end - convert accordingly depending on the method that intakes the param.
   */
  private readonly logoutExpirationTimeLimit: number = 1;
  private loggedInTime: Date;
  private loginFailedAttempts: number = 0;

  private authToken: string;

  constructor(private userServiceSub: UserServiceSubscription, private httpWrapper: HttpWrapperService<ResponseLogin>) {

    // setup the observable so others can listen to the subscription service
    userServiceSub.onLogin = this._onLogin.asObservable();
  }

  /**
   * Returns the token if still valid
   * Each successful call will reset the authTokenTimer to indicate the user is still active.
   */
  public getAuthToken(): string {
    if(this.validateLogin()) {
      this.resetAuthTokenTimer();
      return this.authToken;
    }
    return null;
  }

  public setAuthToken(token: string): void {
    if(token) {
      this.authToken = token;
      this.resetAuthTokenTimer();
    }
  }

  /** reset the login timer on every request activity to monitor activeness */
  private resetAuthTokenTimer(): void {
    this.loggedInTime = new Date();
  }

  public login(email: string, password: string): Observable<ResponseLogin | HttpErrorContainer> {
    // build the http params
    const body = {'email': email, 'password': password}

    // by using the map, we can auto map the response json into our object ResponseLogin
    return this.httpWrapper.post(ApiEndPoints.USER_LOGIN, body)
      .pipe(
        map((resp: ResponseLogin) => {
          if (resp && resp.auth_token) {
            return this.processLogin(true, resp);
          } else {
            return this.processLogin(false, resp);
          }
        }),
        catchError( (e: HttpErrorContainer) => {
          return of(e)
        })
      );
  }

  /**
   * process necessary setups when login is successful.
   * @param success true for success otherwise false
   * @param resp the response from server
   */
  private processLogin(success: boolean, resp: ResponseLogin): ResponseLogin {
    if(success){
      if(resp && resp.auth_token) {
        this.setAuthToken(resp.auth_token);

        // publish user has logged in successfully
        this._onLogin.next(true);
        this.loginFailedAttempts = 0;

        // null the token and only send the flag back for security reason
        resp.auth_token = null;
        resp.isLoginSuccess = true;
      } else {
        throw new Error('<< UserService >> processLogin failed, response or token null');
      }
    } else {
      // publish logging in  failed
      this.loginFailedAttempts++;
      this._onLogin.next(false);
      resp.isLoginSuccess = false;
      return resp;
    }
    return resp;
  }


  public logout(): Observable<ResponseLogin | HttpErrorContainer> {
    console.log('<< UserService >> logout initiated');
    // if no token, we just do frontend logout no need do perform http call
    if(!this.getAuthToken()) {
      this.processLogout();
      const resp: ResponseLogin = {auth_token: null, isLoginSuccess: false};
      return of(resp);
    } else {
      // make http call
      return this.httpWrapper.post(ApiEndPoints.USER_LOGOUT)
        .pipe(
          map( (resp: ResponseLogin) => {
            console.log('<< UserService >> logout result returned status: ' + resp.isLoginSuccess);
            this.processLogout();
            return resp;
          }),
          catchError( (e: HttpErrorContainer) => {
            this.processLogout();
            return of(e);
          })
        );
    }
  }

  private processLogout(): void {
    this.authToken = null;
    this.loggedInTime = null;
    this._onLogin.next(false);
  }

  /**
   * handles verifying against all login rules still good or not.
   * returns false if not good and true if still good.
   */
  private validateLogin(): boolean {
    let result: boolean = true;

    if(!this.authToken) { result = false; }

    if(result && this.isLoginExpired()){ result = false; }

    return result;
  }

  /**
   * Checks if login has expired or not.
   * Note: Logging out will cause loggedInTime to be null.
   * @see logout()
   */
  private isLoginExpired(): boolean {
    if(this.loggedInTime) {
      return !TimerUtils.isWithinHoursAgo(this.loggedInTime, this.logoutExpirationTimeLimit);
    }
    return true;
  }
}
