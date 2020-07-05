import { Injectable } from '@angular/core';
import {Merchant} from "../../objects/merchant/merchant";

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
   *
   * In order to make cache merchants useful, we'd have to know
   * - when is it okay to cache
   * - when to clear the cache
   * - when to read from the cache.
   *
   * ## when to cache
   * - navigating to another view
   *
   * ## when to read from cache
   * - coming back from a nested view
   *
   * ## when to clear the cache
   * - typing new address location
   * - typing new keywords
   */
  private merchantsCached: Merchant[] = [];

  /** handles merchant related services */
  constructor() { }

  /** adds incoming merchants into the cache preventing duplicates */
  public addToCache(merchants: Merchant[]): void {
    if(merchants && this.merchantsCached) {
      const newMerchants = merchants.filter( x => !(this.merchantsCached.includes(x)) );
      if(newMerchants) {
        this.merchantsCached.push(...newMerchants);
      }
    }
  }

  public getMerchantSelected(): Merchant {
    if(this.merchantSelected) {
      return this.merchantSelected;
    }
    console.warn('<< MerchantService >> getMerchantSelected failed, merchantSelected null');
  }

}
