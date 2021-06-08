import {Product} from '../product/product';
import {Merchant} from '../merchant/merchant';
import {DeliveryType} from '../delivery/delivery-type';
import {User} from "../user/user";
import {OrderStatus} from "./OrderStatus";
import { OrderItem } from '../order-item/order-item';
import {PaymentStatus} from "../payment/payment-status";

/**
 * The main container to hold selected items under one order.
 */
export class Order {
	// turns to true when you run it against the OrderValidator.validate() and succeeds
	isValidateSuccess: boolean;

	public order_total: string;
	public sub_total: string;
	public tax: string;

	public user: User;

  /**
   * the product this order carries during user selection
   * used up to the point when the order is process for payment
   */
	public products: Product[] = [];

  /**
   * Once products are put into an order and checked out
   * this is for storing ordered items that are ready for payment or for displaying an order that is paid
   */
	public orderItems: OrderItem[] = [];

	// the merchant this product is from
	public merchant: Merchant;

  /**
   * The backend generates this id
   * This can be used to lookup the order and find all information on the order status
   */
	public orderID: string;

	// timestamp of order submitted from front end to backend
	public submitTime: string;

	// how the user wish to get the order (pick_up, delivery, etc)
	public deliveryType: DeliveryType = DeliveryType.NONE;

	// for pickup and possible future for when to receive delivery time
	public anticipatedPickupTime: string;

	public order_token: string;

	/**
   * the order status.
   * the phase the order is in. [pending, processing, pickup_ready, complete, cancelled]
   */
	public status: OrderStatus = OrderStatus.NONE;

  /**
   * To track the payment status.
   */
	public paymentStatus: PaymentStatus = PaymentStatus.NONE;


	/** the order during chekcout so the client can make payments */
	public client_token: string;

	public token: string;

	constructor(){
  }

  setAnticipatedPickupTime(date: Date): void {
	  this.anticipatedPickupTime = date.toDateString();
  }

  getAnticipatedPickupTime(asString: boolean = false): string | Date {
	  if(this.deliveryType === DeliveryType.PICK_UP){

	    if(this.anticipatedPickupTime){

        if(asString) {
          return this.anticipatedPickupTime;
        } else {
          return new Date(this.anticipatedPickupTime);
        }
      } else {
	      console.warn('<< Order >> getAnticipatedPickupTime failed, no time set');
      }
    } else {
      console.warn('<< Order >> getAnticipatedPickupTime failed, order not set to pickup');
    }
	  return null;
  }

	public getMerchantId(): number {
		if(this.merchant) {
			return this.merchant.id;
		}
		console.warn('<< Order >> getMerchantId failed, merchant null');
		return 0;
	}

	/** add a product into the order. Validations should be done prior to adding */
	public addProduct(product: Product): void {
		if(product && this.products) {
		  // it is important we do not check for duplicate here, since a product may be the same but has variant
      this.products.push(product);
      // now its safer to check for duplicates after we add to products array
			this.rollUpSameProductsTogether();
		} else {
			console.error('<< Order >> addProduct failed, product null');
		}
	}

  /**
   * Qty is converted to 1 for easier comparison
   * @param p product to convert to json
   */
	private convertProductForEqualityCheck(p: Product): string {
	  if(p) {
      const clonedProduct: Product = p.clone();
      clonedProduct.orderQTY = 1;
      return JSON.stringify(clonedProduct);
    }
  }

	/**
   * This is one is tricky, and have to be careful. We don't want to roll up same products
   * but with different variants, those should be unique.
   * roll up the duplicates and accumulate the qty.
   * If there are already multiple duplicates, need to use a new function
   * It uses the stringify method for equality checking.
   */
	private rollUpSameProductsTogether(): void {
	  if(this.products && this.products.length > 1) {
	    const productsTemp: Product[] = [...this.products];
	    const rolledUpProducts: Product[] = [];

	    // loop from the current index up to the last index
	    for(let i=0; i<productsTemp.length; i++) {
	      const currentProduct: Product = productsTemp[i].clone();
	      let rolledQty: number = currentProduct.orderQTY;
        const currentProductJSON: string = this.convertProductForEqualityCheck(currentProduct);

	      // loop from end index back down to current index
        for(let k=productsTemp.length-1; k>i; k--) {
          const tempQty: number = productsTemp[k].orderQTY;
          const productFromEndJSON: string = this.convertProductForEqualityCheck(productsTemp[k]);
          if(currentProductJSON === productFromEndJSON) {
            // both product are same, accumulate qty
            rolledQty += tempQty;
            productsTemp.splice(k,1);
          }
        }

        currentProduct.orderQTY = rolledQty;
        rolledUpProducts.push(currentProduct);

      }

	    this.products = rolledUpProducts;
    }
  }

	public setMerchant(merchant: Merchant): void {
	  this.merchant = merchant;
  }

  /**
   * todo we should only be reading an order total pricing from backend once we hit the backend.
   * Front end total calculations should only be estimates.
   */
	public getTotalPrice(): number {
		if(this.products && this.products.length) {
			// short way
			return this.products.reduce( (accumulatorValue, p: Product) => accumulatorValue + p.calculateTotalPrice(), 0);
			// long way
			// let total: number = 0;
			// this.products.forEach( p => {
			// 	total += p.calculateTotalPrice();
			// });
		}
		return 0;
	}

	/**
	 * returns the number of top tier products within this order.
	 * does not count sub items in product.
	 */
	public getNumberOfProducts(): number {
		if(this.products && this.products.length) {
		  return this.products.reduce( (a,x) => { return a + x.orderQTY; }, 0 );
			//return this.products.length;
		}
		return 0;
	}

	public getProducts(): Product[] {
	  return this.products;
  }

  public getSubTotal(): number {
    return this.stringCurrencyToUSD(this.sub_total);
  }

  public getTax(): number {
	  return this.stringCurrencyToUSD(this.tax);
  }

  private stringCurrencyToUSD(val: string): number {
	  let result: number = 0;
    try{
      result = parseFloat(this.sub_total);
    } catch(e) {
      console.warn('<< Order >> stringCurrencyToUSD failed, parseFloat error');
    }
    return result;
  }

  /**
   * Converts the returned response model to Order object.
   * The model structur depends on the backend response.
   * @param model
   */
  public static deserialize(model: any): Order {
    const order: Order = new Order();

    // implicit transforms
    // if you want all properties, hydrate the entire response into the order
    Object.assign(order, model);

    // explicit transforms
    // hydrate and correct any special properties that may not have matching names
    order.status = OrderStatus.fromValue(model.status);
    order.deliveryType = DeliveryType.PICK_UP;
    order.orderID = model.id;

    // nested children deserialize
    if(model.items) {
      order.orderItems = OrderItem.deserializeAsArray(model.items);
    }

    // return the order
    return order;
  }
}
