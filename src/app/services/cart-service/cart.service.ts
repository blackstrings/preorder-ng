import { Injectable } from '@angular/core';
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {HttpErrorContainer} from "../../apis/http-wrapper/http-error-container";
import {Observable, of} from "rxjs";
import {ApiEndPoints} from "../../apis/api-end-points";
import {HttpOptions} from "../../apis/http-wrapper/http-options";
import {HttpBuilders} from "../../apis/http-builders/http-builders";
import {map} from "rxjs/operators";
import {Order} from '../../models/order/order';
import {OrderValidator} from './validators/order-validator';
import {AddToOrderValidatorContainer} from './validators/add-to-order-validator-container';

@Injectable({
	providedIn: 'root'
})
export class CartService {

	// the only order that can exist at any given time in the service
	// multi orders not supported unless business decides to need it
	private order: Order = new Order();

	/**
	 * Handles send order
	 * @param httpWrapper
	 */
	constructor(private httpWrapper: HttpWrapperService<Order>) {

	}

	/**
	 * validate order before allowing proceed to check and or submission of the order to merchant.
	 * - check order date is valid against the merchant open times
	 * - check order qty is legit against merchant's rules
	 */
	private preValidateOrder(token: string, order: Order): Observable<boolean | HttpErrorContainer> {

		let result: boolean = OrderValidator.validate(order);

		if(result) {
			const uri: string = ApiEndPoints.USER_PRE_VALIDATE_ORDER;
			const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);
			// return this.httpWrapper.get(uri, options)
			// 	.pipe(
			// 		map( (resp: Order) => {
			// 			// deserialize into order object
			// 			const order: Order = new Order();
			// 			Object.assign(order, resp); // copy the properties
			// 			return order;
			// 		})
			// 	);
		}
		return of(false);

	}

	/**
	 * Take user to checkout.
	 * when user is ready to make payments - take their order to checkout
	 * returns merchant products from http call and caches it
	 */
	public sendCartToCheckout(token): Observable<Order | HttpErrorContainer> {
		throw new Error('<< CartServices >> not yet implemented');
		if(token && this.order) {
			if(OrderValidator.validate(this.order)) {
				const uri: string = ApiEndPoints.USER_SUBMIT_ORDER;
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
			} else {
				console.error('<< CartService >> checkoutOrder failed, order validation failed');
			}
		}
		console.error('<< CartService >> checkoutOrder failed, token or order null');
		return of(null);
	}

	public addToOrderValidate(container: AddToOrderValidatorContainer): boolean {
    	let result: boolean = true;

    	if(!container) { result = false; }

		if(this.order) {
			if(!this.doesProductMatchCurrentOrderMerchant(container)) {
				result = false;
			}
		}

		if(result && OrderValidator.doesProductBelongToMerchant(container.product, container.merchant)){
			result = false;
		}

		// put more checks here if needed
		container.setValidationStatus(result);
		return result;
	}

	/**
	 * quick validation for product before adding to cart
	 * @returns true if product has same merchant as order merchant, otherwise false
	 */
	private doesProductMatchCurrentOrderMerchant(container: AddToOrderValidatorContainer): boolean {
		let result: boolean = false;
		if(container.product) {
			// check product can be added to current order base on having same merchant id
			if(this.order && this.order.merchant) {
				return this.order.getMerchantId() === container.product.merchant_id;
			} else {
				console.error('<< CartService >> doesProductMatchCurrentOderMerchant failed, order or merchant null');
			}
		}
		return result;
	}

	/**
	 * Note: Validate product before adding to cart.
	 * Adds product to the order.
	 * If the product is of a different merchant, a new order will start overriding the existing order.
	 * @see addToOrderValidate()
	 */
	public addToOrder(container: AddToOrderValidatorContainer): boolean {
		if(container) {
			if(container.getValidationStatus()) {
				if(this.doesProductMatchCurrentOrderMerchant(container)) {

					this.order.addProduct(container.product);
					console.debug('<< CartService >> product added');
					console.dir(this.order);
					return true;

				} else {
					console.debug('<< CartService >> addToCart failed, product merchant and order merchant mismatch');
				}
			} else {
				console.error('<< CartService >> addToCart failed, validation unsuccessful or not yet validated');
			}
		} else {
			console.error('<< CartService >> addToCart failed, container null');
		}
		return false;
	}

	/** called when the user wishes to start a new order overwriting existing order */
	public startNewOrder(container: AddToOrderValidatorContainer): void {
		if(container) {
			this.order = new Order();
			this.order.setMerchant(container.merchant);
		} else {
			throw new Error('<< CartServices >> startNewOrder failed, container null');
		}
	}

	/** returns direct reference of the current order */
	public getCurrentOrder(): Order {
		return this.order;
	}

}
