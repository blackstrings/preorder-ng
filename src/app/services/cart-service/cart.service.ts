import { Injectable } from '@angular/core';
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {HttpErrorContainer} from "../../apis/http-wrapper/http-error-container";
import {Product} from "../../models/product/product";
import {Observable, of} from "rxjs";
import {ApiEndPoints} from "../../apis/api-end-points";
import {HttpOptions} from "../../apis/http-wrapper/http-options";
import {HttpBuilders} from "../../apis/http-builders/http-builders";
import {map} from "rxjs/operators";
import {Order} from '../../models/order/order';
import {MerchantTest} from '../../models/merchant/merchant.test';
import { Merchant } from 'src/app/models/merchant/merchant';

@Injectable({
	providedIn: 'root'
})
export class CartService {

	private order: Order = new Order();

	/**
	 * Handles send order
	 * @param httpWrapper
	 */
	constructor(private httpWrapper: HttpWrapperService<Order>) {

	}

	/**
	 * when user is ready to make payments - take their order to checkout
	 * returns merchant products from http call and caches it
	 */
	public checkoutOrder(token): Observable<Order | HttpErrorContainer> {
		throw new Error('<< CartServices >> not yet implemented');
		if(token && this.order) {
			const uri: string = ApiEndPoints.MERCHANT + '/' + this.order.getMerchantId() + '/' + ApiEndPoints.MERCHANT_PRODUCTS;
			const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);
			return this.httpWrapper.get(uri, options)
				.pipe(
					map( (resp: Order) => {
						// deserialize into order object
						const order: Order = new Order();
						Object.assign(order, resp); // copy the properties
						return order;
					})
				);
		}
		return of(null);

	}

	public canAddProductToOrder(product: Product, merchant: Merchant): boolean {
    let result: boolean = true;
	  if(this.order && this.order.merchant) {
      if(!this.doesProductMatchCurrentOrderMerchant(product)) {
        result = false;
      }
    } else {
	    this.startNewOrder(product, merchant);
    }
		return result;
	}

	/** quick validation for product before adding to cart */
	private doesProductMatchCurrentOrderMerchant(product: Product): boolean {
		let result: boolean = false;
		if(product) {
			// check product can be added to current order base on having same merchant id
			if(this.order) {
				return this.order.getMerchantId() === product.merchant_id;
			}
		}
		return result;
	}

	/**
	 * Validate product if can be added to cart before adding to cart.
	 * If the product is of a different merchant, a new order will start overriding the existing order.
	 */
	public addToCart(merchant: Merchant, product: Product): boolean {
		if(merchant && product) {

			if(!this.doesProductMatchCurrentOrderMerchant(product)) {
			  console.debug('<< CartService >> addToCart, starting new order product does not belong to current merchant');
				this.order = new Order();
				this.order.merchant = merchant;
			}

			if(this.validateProductBelongsToMerchant(product, merchant)) {
        this.order.add(product);
        console.debug('<< CartService >> product added');
        console.dir(this.order);
        return true;
      } else {
			  console.error('<< CartService >> addToCart failed, product not belong to merchant');
			  return false;
      }

		} else {
			console.error('<< CartService >> addToCart failed, merchantID or product null');
		}
		return false;
	}

	/** ensures the product being added belongs to correct merchant */
	private validateProductBelongsToMerchant(product: Product, merchant: Merchant): boolean {
		if(product && merchant) {
			return product.merchant_id === merchant.id;
		} else {
			console.error('<< CartService >> productBelongsToMerchant failed, product or merchantID null');
		}
	}

	private startNewOrder(product: Product, merchant: Merchant): void {
		this.order = new Order();
		this.order.setMerchant(merchant);
	}

	/** returns direct reference of the current order */
	public getCurrentOrder(): Order {
		return this.order;
	}

}
