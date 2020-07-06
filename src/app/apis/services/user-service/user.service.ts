import { Injectable } from '@angular/core';
import {TimerUtils} from "../../utils/timer-utils";
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
   * set any timer not reaching up to the max time set in the backend.
   * 1 hour expire time on front end
   */
  private readonly loginExpirationTimer: number = 1000 * 60 * 60;
  private loggedInTime: Date;

  /** we want to assure the token gets a refresh timer in the backend each successful request with token */
  private authToken: string;

  constructor() {

  }

  public getAuthToken(): string {
    if(this.validateLogin()) {
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
  public resetAuthTokenTimer(): void {
    this.loggedInTime = new Date();
  }

  public logout(): void {
    this._onLogin.next(false);
    this.clearAuthToken();
    this.loggedInTime = null;
  }

  private clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * handles verifying against all login rules still good or not.
   * returns false if not good and true if still good.
   */
  private validateLogin(): boolean {
    let result: boolean = true;

    if(!this.authToken) {
      result = false;
    }

    if(result && this.isLoginExpired()){
      result = false;
    }

    return result;
  }

  /** expired if no loggedInTime */
  private isLoginExpired(): boolean {
    if(this.loggedInTime) {
      return !TimerUtils.lessThanOneHourAgo(this.loggedInTime);
    }
    return true;
  }
}
