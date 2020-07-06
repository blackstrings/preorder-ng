import {Injectable} from "@angular/core";
import {UserService} from "./user.service";

/** do not extend or create constructor for mock services for best testing */
@Injectable()
export class UserServiceTest {
  public getAuthToken: jasmine.Spy = spyOn(UserService.prototype, 'getAuthToken');
  public setAuthToken: jasmine.Spy = spyOn(UserService.prototype, 'setAuthToken');
  public resetAuthTokenTimer: jasmine.Spy = spyOn(UserService.prototype, 'resetAuthTokenTimer');
  public logout: jasmine.Spy = spyOn(UserService.prototype, 'logout');
  // public clearAuthToken: jasmine.Spy = spyOn(UserService.prototype, 'clearAuthToken');
  // public isLoggedIn: jasmine.Spy = spyOn(UserService.prototype, 'isLoggedIn');
  // public isLoginExpired: jasmine.Spy = spyOn(UserService.prototype, 'isLoginExpired');

}
