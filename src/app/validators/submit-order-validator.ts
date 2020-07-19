/** Use to validate order when order is in its finalize state and is ready to send to back end */
import {Order} from "../models/order/order";
import {Payment} from "../models/payment/payment";

export class SubmitOrderValidator {

  constructor(order: Order, payment: Payment) {
    throw new Error('not implemented');
  }

}
