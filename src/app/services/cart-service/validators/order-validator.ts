import {Order} from '../../../models/order/order';
import {Product} from '../../../models/product/product';
import {Merchant} from '../../../models/merchant/merchant';
import {DeliveryType} from '../../../models/delivery/delivery-type';

/** front end soft validator for an Order. Run the order through the validate() to pass a soft validation */
export class OrderValidator {

	/** calls all the validator method, if one fails, returns false */
	public static validate(order: Order): boolean {
		let result: boolean = true;
		const prefix: string = '<< OrderValidator >> validate failed on: ';
		if(result && !OrderValidator.isNotEmpty(order)) {
			console.error(prefix + 'isNotEmpty'); result = false;
		}
		if(result && !OrderValidator.allProductsBelongToMerchant(order)) {
			console.error(prefix + 'allProductsBelongToMerchant'); result = false;
		}
		if(result && !OrderValidator.hasDeliveryType(order)) {
			console.error(prefix + 'hasDeliveryType'); result = false;
		}
		return result;
	}

	/** checks order is not empty */
	public static isNotEmpty(order: Order): boolean {
		if(order){
			return order.products && order.products.length > 0;
		}
		return false;
	}

	/** checks all items in order belongs to merchatnt */
	public static allProductsBelongToMerchant(order: Order): boolean {
		if(order && order.products){
			order.products.some( (p: Product) => !OrderValidator.doesProductBelongToMerchant(p, order.merchant));
		}
		return false;
	}

	/** checks if the product and merchant are compatible base on merchant id matching */
	public static doesProductBelongToMerchant(product: Product, merchant: Merchant): boolean {
		if(product && merchant) {
			return product.merchant_id === merchant.id;
		}
		return false;
	}

	/** delivery type is required prior to submission */
	public static hasDeliveryType(order: Order): boolean {
		if(order && order.deliveryType === DeliveryType.NONE) {
			return false;
		}
	}

	/**
	 * soft check if order has a valid pickup time if order is for pickup
	 */
	public static hasValidPickupTime(order: Order): boolean {
		if(order && order.deliveryType === DeliveryType.PICKUP && order.anticipatedPickupTime) {
			console.error('<< OrderValidator >> not yet implemented');
			return false;
		}
	}
}
