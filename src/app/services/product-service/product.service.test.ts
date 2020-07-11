import {Injectable} from "@angular/core";
import {ProductService} from "./product.service";

/** do not extend or create constructor for mock services for best testing */
@Injectable()
export class ProductServiceTest {
  public getProducts: jasmine.Spy = spyOn(ProductService.prototype, 'getProducts');
}
