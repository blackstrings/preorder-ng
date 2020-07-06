import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserServiceSubscription {

  /** listen when there is a login or logout event */
  public onLogin: Observable<boolean>;

  constructor(){

  }
}
