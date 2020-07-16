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

	public getMerchantId(): number {
		if(this.merchant) {
			return this.merchant.id;
		}
		console.warn('<< Order >> getMerchantId failed, merchant null');
		return 0;
	}

	public addProduct(product: Product): void {
		if(product) {
			this.products.push(product);
		} else {
			console.error('<< Order >> addProduct failed, product null');
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
