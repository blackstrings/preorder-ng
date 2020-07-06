import { Injectable } from '@angular/core';
import {TimerUtils} from "../../utils/timer-utils/timer-utils";
import {Observable, of, ReplaySubject} from "rxjs";
import {UserServiceSubscription} from "./user-service-subscription";
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {ResponseLogin} from "../../apis/responses/response-login";
import {catchError, map} from "rxjs/operators";

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

  private authToken: string;

  constructor(private userServiceSub: UserServiceSubscription, private httpWrapper: HttpWrapperService<ResponseLogin>) {

    // wire the subscription
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
      this._onLogin.next(true);
      this.resetAuthTokenTimer();
    }
  }

  /** reset the login timer on every request activity to monitor activeness */
  private resetAuthTokenTimer(): void {
    this.loggedInTime = new Date();
  }

  public login(email: string, password: string): Observable<boolean> {
    return this.httpWrapper.login(email, password)
      .pipe(
        map((resp: ResponseLogin) => {
          if (resp && resp.auth_token) {
            this.setAuthToken(resp.auth_token);
            this._onLogin.next(true);
            return of(resp.loginSuccess);
          } else {
            return of(false);
          }
        }),
        catchError( e => {return of(e)})
      );
  }

  public logout(): void {
    console.log('<< UserService >> logout initiated');
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
