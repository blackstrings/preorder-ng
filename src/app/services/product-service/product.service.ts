import { Injectable } from '@angular/core';
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {HttpErrorContainer} from "../../apis/http-wrapper/http-error-container";
import {Product} from "../../models/product/product";
import {Observable, of} from "rxjs";
import {ApiEndPoints} from "../../apis/api-end-points";
import {HttpOptions} from "../../apis/http-wrapper/http-options";
import {HttpBuilders} from "../../apis/http-builders/http-builders";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpWrapper: HttpWrapperService<Product[]>) {

  }

  /** returns merchant products */
  public getProducts(token: string, merchantID: number): Observable<Product[] | HttpErrorContainer> {
    if(token && merchantID) {
      const uri: string = ApiEndPoints.MERCHANT + '/' + merchantID + '/' + ApiEndPoints.MERCHANT_PRODUCTS;
      const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);
      return this.httpWrapper.get(uri, options)
        .pipe(
          // if you just want to return all the returned properties on merchant
          map( (resp: Product[]) => {
            const temp: Product[] = [];
            resp.forEach( x => {
              const m: Product = new Product();
              Object.assign(m, x); // copy the properties
              temp.push(m);
            });
            return temp;
          })
        );
    }
    return of(null);

  }
}
