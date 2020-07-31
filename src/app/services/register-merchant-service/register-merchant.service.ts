import { Injectable } from '@angular/core';
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";

/**
 * For registering new merchants
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterMerchantService {

  constructor(private httpWrapper: HttpWrapperService<boolean>) { }

  public register(): void {
    console.error('<< RegisterMerchantService >> register not yet implemented');
  }
}
