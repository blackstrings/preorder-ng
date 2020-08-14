import { Merchant } from './../../models/merchant/merchant';
import { Product } from './../../models/product/product';
import { Injectable } from '@angular/core';
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {MerchantBusiness} from "../../models/merchantBusiness/merchant-business";
import {Observable} from "rxjs";
import {HttpErrorContainer} from "../../apis/http-wrapper/http-error-container";
import {ApiEndPoints} from "../../apis/api-end-points";
import {HttpOptions} from "../../apis/http-wrapper/http-options";
import {HttpBuilders} from "../../apis/http-builders/http-builders";
import {map} from "rxjs/operators";

/**
 * For registering new merchants
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterMerchantService {

  constructor(private httpWrapper: HttpWrapperService<boolean>) { }


  /** Registers the new merchant into the database, returns a true if success */
  public registerAccount(token: string, merchantBusiness: MerchantBusiness): Observable<boolean | HttpErrorContainer> {
    const uri: string = ApiEndPoints.MERCHANT_CREATE;
    const body = {'name': merchantBusiness.businessName, 'description': merchantBusiness.description};
    const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);

    // Swap from Merchant to BusinessMerchant -> Double check!
    return this.httpWrapper.post(uri, body, options).pipe(
      map((resp: boolean) => {
        return resp;
      })
    );
  }

  public registerProduct(token: string, product: Product, merchantID: number): Observable<boolean | HttpErrorContainer> {
    const uri: string = ApiEndPoints.MERCHANT + "/" + merchantID + "/" + ApiEndPoints.MERCHANT_ADD_PRODUCT;
    const body = product;
    const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);

    // Swap from Merchant to BusinessMerchant -> Double check!
    return this.httpWrapper.post(uri, body, options).pipe(
      map((resp: boolean) => {
        return resp;
      })
    );
  }

}
