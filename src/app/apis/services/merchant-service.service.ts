import { Injectable } from '@angular/core';
import {Merchant} from "../objects/merchant/merchant";

@Injectable({
  providedIn: 'root'
})
export class MerchantServiceService {

  /** the current merchant the user has selected */
  private merchantSelected: Merchant;

  /**
   * depending if we want to store local cache of merchants
   * when say there are more than 300,000 merchants
   * but a user may not necessary be loading 300k merchants at a time
   * probably only 1000 at the most
   * provides a way to grab merchant info from the cache vs making extra calls
   */
  private merchantsCached: Merchant[] = [];

  /** handles merchant related services */
  constructor() { }

  /** adds incoming merchants into the cache preventing duplicates */
  public addToCache(merchants: Merchant[]): void {
    if(merchants && this.merchantsCached) {
      const newMerchants = merchants.filter( x => !(this.merchantsCached.includes(x)) );
      this.merchantsCached.push(...newMerchants);
    }
  }

  public getMerchantSelected(): Merchant {
    if(this.merchantSelected) {
      return this.merchantSelected;
    }
    console.warn('<< MerchantService >> getMerchantSelected failed, merchantSelected null');
  }

}
