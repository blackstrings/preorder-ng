import {Product} from '../product/product';
import {Merchant} from '../merchant/merchant';
import {DeliveryType} from '../delivery/delivery-type';

export class Order {
	// turns to true when you run it against the OrderValidator.validate() and succeeds
	isValidateSuccess: boolean;

	// the product this order carries
	products: Product[] = [];

	// the merchant this product is from
	merchant: Merchant;

	// represents a successful order created in the backend
	orderID: string;

	// timestamp of order submission from front end
	submitTime: string;

	// how the user wish to get the order
	deliveryType: DeliveryType = DeliveryType.PICKUP;

	// for pickup and possible future for when to receive delivery time
	anticipatedPickupTime: string;

	constructor(){
  }

	public getMerchantId(): number {
		if(this.merchant) {
			return this.merchant.id;
		}
		console.warn('<< Order >> getMerchantId failed, merchant null');
		return 0;
	}

	public addProduct(product: Product): void {
		if(product && this.products) {
		  // it is important we do not check for duplicate here, since a product may be the same but has variant
      this.products.push(product);
			this.rollUpSameProductsTogether();
		} else {
			console.error('<< Order >> addProduct failed, product null');
		}
	}

	/**
   * This is one is tricky, and have to be careful - maybe we dont' do roll ups at all.
   * roll up the duplicates and accumulate the qty - only works when adding one at a time.
   * If there are already multiple duplicates, need to use a new function
   */
	private rollUpSameProductsTogether(): void {
	  if(this.products) {

	    // use map to insert each item from array for faster lookup
      // this.products = this.groupBy(this.products, 'id');

      /*
      this.products = Array.from(
        this.products.reduce(
          (entryMap, e) => {

            return entryMap.set(
              e.id, {...entryMap.get(e.id) || {}, ...e}
            )
          },
          new Map()
        ).values()
      );
      */
    }
  }

	public setMerchant(merchant: Merchant): void {
	  this.merchant = merchant;
  }

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
		if(this.products) {
			return this.products.length;
		}
	}
}
