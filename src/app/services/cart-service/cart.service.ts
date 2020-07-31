import {Injectable} from '@angular/core';
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {HttpErrorContainer} from "../../apis/http-wrapper/http-error-container";
import {Observable, of, Subject} from "rxjs";
import {ApiEndPoints} from "../../apis/api-end-points";
import {HttpOptions} from "../../apis/http-wrapper/http-options";
import {HttpBuilders} from "../../apis/http-builders/http-builders";
import {map} from "rxjs/operators";
import {Order} from '../../models/order/order';
import {OrderValidator} from '../../validators/order-validator/order-validator';
import {AddToOrderValidatorContainer} from '../../validators/add-to-order-validator-container';
import {CartServiceSubscription} from "./cart-service-subscription";
import {Product} from "../../models/product/product";
import {DeliveryType} from "../../models/delivery/delivery-type";

@Injectable({
	providedIn: 'root'
})
export class CartService {

  // setup other classes to listen to CartServices using subscriptions
  private _onAddToOrder: Subject<Order> = new Subject<Order>();

	// the only order that can exist at any given time in the service
	// multi orders not supported unless business decides to need it
	private order: Order = new Order();

	/**
	 * Handles send order
	 * @param httpWrapper
	 */
	constructor(private sub: CartServiceSubscription, private httpWrapper: HttpWrapperService<Order>) {
	  console.debug('<< CartService >> Init');
	  sub.onAddToOrder = this._onAddToOrder.asObservable();

	  // make this first order by default pickup
	  if(this.order){
	    this.order.deliveryType = DeliveryType.PICKUP;
    }
	}

  /**
   * When all orders and payments are validated then we send it to the backend to get process.
   * todo incomplete
   */
  public placeOrder(token): Observable<Order | HttpErrorContainer> {
    if(token && this.order) {
      if(OrderValidator.validate(this.order)) {
        // const uri: string = ApiEndPoints.USER_SUBMIT_ORDER;
        const uri: string = 'merchants/' + this.order.merchant.id + '/products/';

        const products: Product[] = this.order.getProducts();
        let orderItemsArray: any = products.map(p => {
          return {product_id: p.id, quantity_id: p.orderQTY}
        });

        // for encapsulating the array into another order_items object if needed
        const body =
          {
            order: {
              items: orderItemsArray,
              merchant_id: this.order.merchant.id
            }
          };

        const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);
        return this.httpWrapper.post(uri, body)
          .pipe(
            map( (resp: any) => {
              console.warn('<< CarServices >> finalizeOrder response not yet implemented, returning resp as any');
              // deserialize into order object
              // const order: Order = new Order();
              // Object.assign(order, resp); // copy the properties
              return resp;
            })
          );
      } else {
        console.error('<< CartService >> checkoutOrder failed, order validation failed');
      }
    }
    console.error('<< CartService >> checkoutOrder failed, token or order null');
    return of(null);
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
	 * quick validation for product before adding to existing order
	 * @returns true if product has same merchant as order merchant, otherwise false
	 */
	private doesProductMatchCurrentOrderMerchant(container: AddToOrderValidatorContainer): boolean {
		let result: boolean = false;
		if(container && container.product) {
			// check product can be added to current order base on having same merchant id
			if(this.order && this.order.merchant) {
				return this.order.getMerchantId() === container.product.merchant_id;
			} else {
				console.error('<< CartService >> doesProductMatchCurrentOderMerchant failed, order or merchant null');
			}
		} else {
      console.error('<< CartService >> doesProductMatchCurrentOderMerchant failed, container product null');
    }
		return result;
	}

	/** Validates product before adding to order */
  public addToOrderValidate(container: AddToOrderValidatorContainer): boolean {
    let result: boolean = true;
    // container exist
    if(!container) { result = false; }

    // order is not null and the product being add matches the current order's merchant
    if(this.order) {
      // if first time running app, there is no merchant set in the order,
      // so we handle setting the initial merchant into order here.
      if(!this.order.merchant) {
        this.order.setMerchant(container.merchant);
      }
      if(!this.doesProductMatchCurrentOrderMerchant(container)) {
        result = false;
      }
    }

    // checks the product and the target merchant belongs to each other
    if(result && !OrderValidator.doesProductBelongToMerchant(container.product, container.merchant)){
      result = false;
    }

    // after all validations, set the final result success on the container
    // one false validation will trigger a false validation status
    container.setValidationStatus(result);
    return result;
  }

	/**
	 * Adds product to the order.
	 * Must validate with AddToOrderValidatorContainer before passing container into here.
   * If the product is of a different merchant, a new order will start overriding the existing order.
	 * @see addToOrderValidate()
	 */
	public addToOrder(container: AddToOrderValidatorContainer): boolean {
		if(container) {
			if(container.getValidationStatus()) {

					this.order.addProduct(container.product);
					this._onAddToOrder.next(this.order);
					console.debug('<< CartService >> product added');
					console.dir(this.order);
					return true;

			} else {
				console.error('<< CartService >> addToOrder failed, validation unsuccessful or not yet validated');
			}
		} else {
			console.error('<< CartService >> addToOrder failed, container null');
		}
		return false;
	}

	/**
   * called when the user wishes to start a new order overwriting existing order.
   * Currently user cannot have two orders, only one. So we discard current for new orders.
   */
	public startNewOrder(container: AddToOrderValidatorContainer): void {
		if(container) {
			this.order = new Order();
      this.order.deliveryType = DeliveryType.PICKUP;
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
