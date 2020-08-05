import { MerchantBusiness } from '../../models/merchantBusiness/merchant-business';
import { Merchant } from '../../models/merchant/merchant';
import { Injectable } from '@angular/core';
import {Observable, of, throwError} from "rxjs";
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
  private selectedMerchantID: number;

  /** should be flag to true after pulls in serach results. But on each new search it should be flagged off */
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
  constructor(private httpWrapper: HttpWrapperService<Merchant[]>) {
    console.debug('<< MerchantService >> Init');
  }

  /** adds incoming merchants into the cache preventing duplicates */
  private addToCache(incomingMerchants: Merchant[]): void {
    if(incomingMerchants && this.merchantsCached) {
      const newMerchants = incomingMerchants.filter( x => !(this.merchantsCached.some(y => y.id === x.id)) );
      // const newMerchants = merchants.filter( x => !(this.merchantsCached.includes(x)) );
      if(newMerchants) {
        this.merchantsCached.push(...newMerchants);
      }
    }
  }

  /** set the selected merchant, only sets the ID for security */
  public setMerchantID(id: number): void {
    if(id) {
      this.selectedMerchantID = id;
    } else {
      console.error('<< MerchantService >> setMerchant failed, id null');
    }
  }

  /** returns a single merchant from the cache */
  public getMerchantFromCache(id: number): Merchant {
    let merchant: Merchant = null;
    if(id && this.merchantsCached && this.merchantsCached.length) {
      // some will stop the loop soon as it finds one
      merchant = this.merchantsCached.filter(m => m.id === id)[0];
    } else {
      console.error('<< MerchantService >> getMerchantFromCache failed, one or more params invalid');
    }
    return merchant;
  }

  public createMerchant(token: string, merchantBusiness: MerchantBusiness): Observable<Merchant[] | HttpErrorContainer> {
    const uri: string = ApiEndPoints.MERCHANT_CREATE;
    const body = {'name': merchantBusiness.businessName, 'description': merchantBusiness.description};
    const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);

    // Swap from Merchant to BusinessMerchant -> Double check!
    return this.httpWrapper.post(uri, body, options).pipe(
      map( (resp: Merchant[]) => {
        //return this.modelToMerchant(resp);
        return resp;
      })
    );
  }

  /**
   * Use this when not available in the cache.
   * http call to get the merchant.
   * returns as an array due to the interface protocol
   */
  public getMerchant(token: string, id: number): Observable<Merchant[] | HttpErrorContainer> {
    if(id){
      let merchant: Merchant = this.getMerchantFromCache(id);
      if(merchant) {
        return of([merchant]);
      } else {

        const uri: string = ApiEndPoints.MERCHANT + '/' + id;
        const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);
        this.httpWrapper.get(uri, options)
          .pipe(
            // it's an array to follow the interface but only one should return
            map( (resp: Merchant[]) => {
              return this.modelToMerchant(resp);
            })
          )
      }
    } else {
      return throwError('<< MerchantService >> getMerchant failed, id null');
    }
  }

  /** returns selected merchant from cache if set and available */
  public getMerchantSelected(): Merchant {
    if(this.selectedMerchantID) {
      return this.getMerchantFromCache(this.selectedMerchantID);
    }
    console.warn('<< MerchantService >> getMerchantSelected failed, merchantSelected null');
    return null;
  }

  /** returns a clone list of ALL the cached merchants */
  public getMerchantsFromCache(): Merchant[] {
    if(this.merchantsCached && this.merchantsCached.length) {
      return this.merchantsCached.slice();
    }
    console.warn('<< MerchantService >> getMerchantsFromCache failed, merchantsCached null, returning []');
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
      console.debug('<< MerchantService >> getMerchantList, fetching from cache');
      const merchants: Merchant[] = this.getMerchantsFromCache();
      return of(merchants);
    }
    if(token) {
      const uri: string = ApiEndPoints.MERCHANT_LIST;
      const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);
      return this.httpWrapper.get(uri, options)
        .pipe(
          map( (resp: Merchant[]) => {
            const temp: Merchant[] = [];

            // validate keys from data still match model on just one model
            if(resp && resp.length) {
              if(!this.verifyKeys(resp[0])) {
                console.error('<< MerchantService >> modelToMerchant conversion failed, mis-match keys - model has changed');
              }
            }

            resp.forEach( x => {
              // if you want to control what properties get carried on
              const m: Merchant = this.modelToMerchant(x);
              temp.push(m);
            });

            this.addToCache(temp);

            // for now it's better to just always fetch new data, so turning cache off
            // this.useCache = true;

            return this.getMerchantsFromCache();
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

  private modelToMerchant(model: any): Merchant {
    if(model) {
      const m: Merchant = new Merchant();
      m.id = model.id;
      m.name = model.name;
      return m;
    }
  }

  private verifyKeys(model: any): boolean {
    let result: boolean = true;
    // todo match all keys
    // Object.keys(Merchant).some( (i,k) => {
    //
    //
    // });
    return result;
  }

}
