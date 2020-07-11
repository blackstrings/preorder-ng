import {Injectable} from "@angular/core";
import {MerchantService} from "./merchant.service";

/** do not extend or create constructor for mock services for best testing */
@Injectable()
export class MerchantServiceTest {
  public addToCache: jasmine.Spy = spyOn(MerchantService.prototype, 'addToCache');
  public getMerchantSelected: jasmine.Spy = spyOn(MerchantService.prototype, 'getMerchantSelected');
  public getMerchantsFromCache: jasmine.Spy = spyOn(MerchantService.prototype, 'getMerchantsFromCache');
  public clearCache: jasmine.Spy = spyOn(MerchantService.prototype, 'clearCache');
  public getMerchantList: jasmine.Spy = spyOn(MerchantService.prototype, 'getMerchantList');
}
