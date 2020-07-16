import {Product} from '../product/product';
import {Merchant} from '../merchant/merchant';

export class Order {
	isSuccess: boolean;
	products: Product[];
	merchant: Merchant;
	orderID: string;
	submitTime: string;

	public getMerchantId(): number {
		if(this.merchant) {
			return this.merchant.id;
		}
		console.warn('<< Order >> getMerchantId failed, merchant null');
		return 0;
	}

	public add(product: Product): void {
		if(product) {
			this.products.push(product);
		}
	}

	public calculateTotalPrice(): number {
		// if(this.products && this.products.length) {
		// 	let total: number = 0;
		// 	this.products.forEach( p => {
		// 		total +=
		// 	});
		// }
		return 0;
	}
}
