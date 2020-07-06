import { Injectable } from '@angular/core';
import {TimerUtils} from "../../utils/timer-utils/timer-utils";
import {Observable, ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // login subscription
  private _onLogin: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public onLogin: Observable<boolean> = this._onLogin.asObservable();

  /**
   * This is a front end expire timer regardless of what's set in the backend.
   * The technique is to have the backend have a longer expiration timer, while the front end has room to
   * set any time limit not exceeding the max time set in the backend.
   * 1 hour expire time on front end - convert accordingly depending on the method that intakes the param.
   */
  private readonly logoutExpirationTimeLimit: number = 1;
  private loggedInTime: Date;

  /** we want to assure the token gets a refresh timer in the backend each successful request with token */
  private authToken: string;

  constructor() {

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
