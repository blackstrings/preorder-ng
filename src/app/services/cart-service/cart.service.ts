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
import {OrderItem} from "../../models/order-item/order-item";

@Injectable({
	providedIn: 'root'
})
export class CartService {

  // setup other classes to listen to CartServices using subscriptions
  private onOrderUpdate: Subject<Order> = new Subject<Order>();

  /**
   * the only order that can exist at any given time in the service
   * multi orders not supported unless business decides to need it
   * this is the order that has not been checked out yet
   */
	private pendingOrder: Order = new Order();

	// when the order is checked out, the order id should be saved in case of a quick recall
	private submittedOrderID: string;

	/** when an order is checked out, backend will return this to get the order ready for payment */
	private client_token: string;

	/**
	 * Handles sending order to the cart or getting the current active order from the cart.
	 * @param httpWrapper
	 */
	constructor(private sub: CartServiceSubscription, private httpWrapper: HttpWrapperService<Order>) {
	  console.debug('<< CartService >> Init');
	  sub.onOrderUpdate$ = this.onOrderUpdate.asObservable();

	  // make this first order by default pickup
	  if(this.pendingOrder){
	    this.pendingOrder.deliveryType = DeliveryType.PICK_UP;
    }
	}

	public getSubmittedOrderID(): string {
	  return this.submittedOrderID;
  }

  /**
   * Reset the front and backend cart. This is needed to be done in the following scenarios:
   * - order has been verified and paid for on the front end.
   * - there is something invalid with the order and must start fresh.
   */
  public resetCart(token: string): Observable<boolean> {
    this.pendingOrder = null; // clear front end regardless of backend success or not
    if(token) {
      const uri: string = ApiEndPoints.USER_RESET_SHOPPING_CART;
      const body = {};
      const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);
      return this.httpWrapper.delete(uri, options)
        .pipe(
          map((resp: any) => {
            console.log('<< CartService >> resetCart success');
            console.log(resp);
            return resp;
          })
        );
    } else {
      console.log('<< CartService >> resetCart failed, token null');
      return of(false);
    }
  }

  /**
   * Checks out the order and prepares it for the payment page.
   * This will creat an order record in the backend.
   * On return if successful it will store the order id for later retrieving the order for payment processing.
   */
  public checkout(token): Observable<Order | HttpErrorContainer> {
    if(token && this.pendingOrder) {
      if(OrderValidator.validate(this.pendingOrder)) {
        const uri: string = ApiEndPoints.USER_SUBMIT_ORDER;
        // const uri: string = 'merchants/' + this.order.merchant.id + '/products/';

        // construct the products into a model that matches the backend input structure
        const products: Product[] = this.pendingOrder.getProducts();
        let orderItemsArray: OrderItem[] = products.map(p => {
          const orderItem: any = {product_id: p.id, quantity_id: p.orderQTY};
          return orderItem;
        });

        // construct the body structure for the backend
        const body =
          {
            order: {
              items: orderItemsArray,
              merchant_id: this.pendingOrder.merchant.id
            }
          };

        // create the header
        const options: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);

        // treat all currently as guest, store order id in cookies
        return this.httpWrapper.post(uri, body, options)
          .pipe(
            map( (resp: any) => {

              // success is expected
              if(resp.success) {
                console.log('<< CarServices >> order reloaded for checkout success');
                // deserialize into order object
                const order: Order = new Order();
                // Object.assign(order, resp); // copy all the properties into the order object
                order.orderID = resp.orderID;
                this.submittedOrderID = order.orderID;
                resp = order;
              } else {
                console.error('<< CarServices >> checkout failed, back end error, returning null');
                resp = null;
              }

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
   * todo
	 * - if order is for current business day, check order date is valid against the merchant's open time
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
			if(this.pendingOrder && this.pendingOrder.merchant) {
				return this.pendingOrder.getMerchantId() === container.product.merchant_id;
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
    if(this.pendingOrder) {
      // if first time running app, there is no merchant set in the order,
      // so we handle setting the initial merchant into order here.
      if(!this.pendingOrder.merchant) {
        this.pendingOrder.setMerchant(container.merchant);
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

					this.pendingOrder.addProduct(container.product);
					this.onOrderUpdate.next(this.pendingOrder);
					console.debug('<< CartService >> product added');
					console.dir(this.pendingOrder);
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
			this.pendingOrder = new Order();
      this.pendingOrder.deliveryType = DeliveryType.PICK_UP;
			this.pendingOrder.setMerchant(container.merchant);
		} else {
			throw new Error('<< CartServices >> startNewOrder failed, container null');
		}
	}

	/** returns direct reference of the current pending order */
	public getPendingOrder(): Order {
		return this.pendingOrder;
	}

	/**
   * returns the order the user checked out on
   * Goes to the backend to retrieve order.
   * This allows the user to begin the payment process.
   * Used for during navigating the user to the payment processing view to display the order.
   */
	public getCheckedOutOrder(orderID: string, token: string): Observable<Order | HttpErrorContainer> {
	  const uri: string = ApiEndPoints.USER_ORDER + '/' + orderID + '/' + ApiEndPoints.EDIT;
	  const opts: HttpOptions = HttpBuilders.getHttpOptionsWithAuthHeaders(token);
	  // we only map, don't subscribe, the caller to this method is the one subscribing
	  return this.httpWrapper.get(uri, opts).pipe(
	    map( (resp: any) => {
	      // handling deserialization
	      if(resp) {
	        // prep to hydrate the json into the real object
	        return Order.deserialize(resp);
        }
	      return null;
      })
    );
  }

  //** removes a product based on the passed in product id */
  public removeProduct(id: number) {
    const index: number = this.pendingOrder.products.indexOf(this.pendingOrder.products.filter(x => x.id === id)[0]);
    if(index >= 0) {
    	this.pendingOrder.products.splice(index, 1);
    	this.onOrderUpdate.next(this.pendingOrder);
    } else {
    	console.warn('<< CartService >> removeProduct failed, index null');
    }
  }


}
