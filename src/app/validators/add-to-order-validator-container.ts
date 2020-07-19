import {Merchant} from '../models/merchant/merchant';
import {Product} from '../models/product/product';

/**
 * used in conjunction with validation, when when adding a product to an order
 * main purpose is to have product and merchant in a container for easier passing the two objects
 * around to get validated.
 */
export class AddToOrderValidatorContainer {

	/** if set to true, it means all validations checks have been successfully ran against this container */
	private isValidationSuccess: boolean = false;

	constructor(public product: Product, public merchant: Merchant){
		if(!product || !merchant) {
			throw new Error('<< AddToOrderValidatorContainer >> constructor failed, params null');
		}
	}

	public setValidationStatus(val: boolean): void {
		this.isValidationSuccess = val;
	}

	/** returns true if the container has been through a successful validation */
	public getValidationStatus(): boolean {
		return this.isValidationSuccess;
	}
}
