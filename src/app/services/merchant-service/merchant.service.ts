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

  private useCache: boolean = false;

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
      const newMerchants = incomingMerchants.filter( x => !(this.merchantsCached.some(y => y.id === x.id)) );
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

  /** returns a clone list of the cached merchants */
  public getMerchantListCached(): Merchant[] {
    if(this.merchantsCached) {
      return this.merchantsCached.slice();
    }
    console.warn('<< MerchantService >> getMerchantListCached failed, merchantsCached null, returning []');
    return [];
  }

  public clearCache(): void {
    this.useCache = false;
    if(this.merchantsCached) {
      this.merchantsCached = [];
    }
  }

  /**
   * http call to returns a new list of all merchants.
   * When the data grows really big, this may not be appropriate and should be calling a filter api.
   */
  public getMerchantList(token: string): Observable<Merchant[] | HttpErrorContainer> {
    if(this.useCache){
      console.log('<< MerchantService >> getMerchantList from cache');
      return of(this.getMerchantListCached());
    }
    if(token) {
      const uri: string = ApiEndPoints.MERCHANT_LIST;
      const options: HttpOptions = HttpBuilders.getHttOptionsWithAuthHeaders(token);
      return this.httpWrapper.get(uri, options)
        .pipe(
          map( (resp: Merchant[]) => {
            const temp: Merchant[] = [];

            resp.forEach( x => {
              // if you want to control what properties get carried on
              const m: Merchant = new Merchant();
              m.id = x.id;
              m.name = x.name;
              temp.push(m);
            });

            this.addToCache(temp);

            this.useCache = true;
            return this.getMerchantListCached();
          }),
          // if you just want to return all the returned properties on merchant
          // map( (resp: Merchant[]) => {
          //   resp.forEach( x => {
          //     const m: Merchant = new Merchant();
          //     Object.assign(m, x); // copy the properties
          //     this.addToCache([m]);
          //   });
          //   return this.getMerchantListCached();
          // })
        );
    } else {
      return of(null);
    }
  }

}
