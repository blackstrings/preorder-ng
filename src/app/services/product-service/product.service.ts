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

  /** the products the merchant carries - populated each time on product fetch */
  private availableProducts: Product[];

  /**
   * Handles products and cart.
   * @param httpWrapper
   */
  constructor(private httpWrapper: HttpWrapperService<Product[]>) {

  }

  /** returns merchant products from http call and caches it to available products */
  public fetchProducts(token: string, merchantID: number): Observable<Product[] | HttpErrorContainer> {
    if(token && merchantID) {
      const uri: string = ApiEndPoints.MERCHANT + '/' + merchantID + '/' + ApiEndPoints.MERCHANT_PRODUCTS;
      const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);
      return this.httpWrapper.get(uri, options)
        .pipe(
          // if you just want to return all the returned properties on merchant
          map( (resp: Product[]) => {
            const fetchedProducts: Product[] = [];
            resp.forEach( x => {
              const m: Product = new Product();
              Object.assign(m, x); // copy the properties
              fetchedProducts.push(m);
            });
            this.setAvailableProducts(fetchedProducts);
            return fetchedProducts;
          })
        );
    }
    return of(null);

  }

  private setAvailableProducts(products: Product[]): void {
    if(products && products.length) {
      this.availableProducts = products;
    } else {
      console.error('<< ProductServices >> setAvailableProducts failed, products null or empty');
    }
  }

  /** returns a deep cloned product from available products - todo ensure it's always a deep clone */
  public getProductFromCache(id: number): Product {
    if(this.availableProducts && this.availableProducts.length) {
      const product: Product = this.availableProducts.filter(x => x.id === id)[0];
      return product.clone();
    }
  }

  /**
   * returns shallow copies of all current cached products of the selected merchant
   * Note: May not be needed
   */
  public getCurrentProducts(): Product[] {
    return this.availableProducts.slice();
  }
}
