import {HttpWrapperService} from "./http-wrapper.service";
import {Injectable} from "@angular/core";

/** do not extend or create constructor for mock services for best testing */
@Injectable()
export class HttpWrapperServiceTest {
  public getMerchantProducts: jasmine.Spy = spyOn(HttpWrapperService.prototype, 'getMerchantProducts');
  // public getMerchantList: jasmine.Spy = spyOn(HttpWrapperService.prototype, 'getMerchantList');
  // public login: jasmine.Spy = spyOn(HttpWrapperService.prototype, 'login');
  // public createNewAccount: jasmine.Spy = spyOn(HttpWrapperService.prototype,createNewAccount');

}
