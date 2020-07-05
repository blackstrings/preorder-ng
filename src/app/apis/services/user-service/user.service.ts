import { Injectable } from '@angular/core';
import {TimerUtils} from "../../utils/timer-utils";

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  constructor() { }

  public getAuthToken(): string {
    return this.authToken;
  }

  public setAuthToken(token: string): void {
    if(token) {
      this.authToken = token;
      this.resetAuthTokenTimer();
    }
  }

  /** reset the login timer on auth token */
  private resetAuthTokenTimer(): void {
    this.loggedInTime = new Date();
  }

  /** handles verifying against all login rules */
  private isLoginValid(): boolean {
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
