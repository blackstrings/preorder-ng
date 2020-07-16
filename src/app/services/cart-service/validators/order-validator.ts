import {Order} from '../../../models/order/order';
import {Product} from '../../../models/product/product';
import {Merchant} from '../../../models/merchant/merchant';
import {DeliveryType} from '../../../models/delivery/delivery-type';

/** front end soft validator for Order */
export class OrderValidator {

	/** calls all the validator method, if one fails, returns false */
	public static validate(order: Order): boolean {
		let result: boolean = true;
		const prefix: string = '<< OrderValidator >> validate failed: ';
		if(result && !OrderValidator.hasProducts(order)) {
			console.error(prefix + 'hasProducts'); result = false;
		}
		if(result && !OrderValidator.allProductsBelongToMerchant(order)) {
			console.error(prefix + 'allProductsBelongToMerchant'); result = false;
		}
		return result;
	}

	public static hasProducts(order: Order): boolean {
		if(order){
			return order.products && order.products.length > 0;
		}
		return false;
	}

	public static allProductsBelongToMerchant(order: Order): boolean {
		if(order && order.products){
			order.products.some( (p: Product) => !OrderValidator.doesProductBelongToMerchant(p, order.merchant));
		}
		return false;
	}

	public static doesProductBelongToMerchant(product: Product, merchant: Merchant): boolean {
		if(product && merchant) {
			return product.merchant_id === merchant.id;
		}
		return false;
	}

	public static hasValidPickupTime(order: Order): boolean {
		if(order && order.deliveryType === DeliveryType.PICKUP) {
			console.error('<< OrderValidator >> not yet implemented');
			return false;
		}
	}
}
