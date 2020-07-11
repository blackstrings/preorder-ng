import { Injectable } from '@angular/core';
import {Merchant} from "../../models/merchant/merchant";
import {Observable, of} from "rxjs";
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {ApiEndPoints} from "../../apis/api-end-points";
import {HttpOptions} from "../../apis/http-wrapper/http-options";
import {HttpBuilders} from "../../apis/http-builders/http-builders";
import {HttpErrorContainer} from "../../apis/http-wrapper/http-error-container";
import {map} from 'rxjs/operators';

/**
 * Handles querying merchants and caching.
 */
@Injectable({
  providedIn: 'root'
})
export class MerchantService {

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
  constructor(private httpWrapper: HttpWrapperService<Merchant[]>) { }

  /** adds incoming merchants into the cache preventing duplicates */
  public addToCache(incomingMerchants: Merchant[]): void {
    if(incomingMerchants && this.merchantsCached) {
      const newMerchants = incomingMerchants.filter( x => !(this.merchantsCached.some(y => y.getID() === x.getID())) );
      // const newMerchants = merchants.filter( x => !(this.merchantsCached.includes(x)) );
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
    return null;
  }

  /**
   * returns a all list of merchants.
   * When the data grows really big, this may not be appropriate and should be calling a filter api.
   */
  public getMerchantList(token: string): Observable<Merchant[] | HttpErrorContainer> {
    if(token) {
      const uri: string = ApiEndPoints.MERCHANT_LIST;
      const options: HttpOptions = HttpBuilders.getHttOptionsWithAuthHeaders(token);
      return this.httpWrapper.get(uri, options)
        .pipe(
          map( (resp: Merchant[]) => {
            this.addToCache(resp);
            return resp;
          })
        );
    } else {
      return of(null);
    }
  }

}
