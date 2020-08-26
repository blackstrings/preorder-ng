import {Product} from '../product/product';
import {Merchant} from '../merchant/merchant';
import {DeliveryType} from '../delivery/delivery-type';
import {User} from "../user/user";
import {OrderStatus} from "./OrderStatus";

export class Order {
	// turns to true when you run it against the OrderValidator.validate() and succeeds
	isValidateSuccess: boolean;

	public user: User;

	// the product this order carries
	public products: Product[] = [];

	// the merchant this product is from
	public merchant: Merchant;

	// represents a successful order created in the backend
	public orderID: string;

	// timestamp of order submission from front end
	public submitTime: string;

	// how the user wish to get the order
	public deliveryType: DeliveryType = DeliveryType.NONE;

	// for pickup and possible future for when to receive delivery time
	public anticipatedPickupTime: string;

	/**
   * the phase the order is in. [pending, processing, pickup_ready, complete, cancelled]
   */
	public order_status: OrderStatus = OrderStatus.NONE;

	public sub_total: string;
	public tax: string;

	/** the order during chekcout so the client can make payments */
	public client_token: string;

	constructor(){
  }

  setAnticipatedPickupTime(date: Date): void {
	  this.anticipatedPickupTime = date.toDateString();
  }

  getAnticipatedPickupTime(asString: boolean = false): string | Date {
	  if(this.deliveryType === DeliveryType.PICKUP){

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
   * @param model
   */
  public static deserialize(model: any): Order {
    const order: Order = new Order();

    // if you want all properties, hydrate the entire response into the order
    Object.assign(order, model.order);

    // hydrate and correct any special properties that may not have matching names
    order.order_status = OrderStatus.fromValue(model.order_status);
    order.orderID = model.order.id;
    order.client_token = model.client_token;

    // nested children deserialize
    if(model.order && model.order.products) {
      order.products = Product.deserializeAsArray(model.order.products);
    }


    // return the order
    return order;
  }
}
