import { StripeError } from '@stripe/stripe-js';

/** use as a returned response after attempting to make payments on the client side */
export class PaymentResponseRK {
  public message: string;
  public status: boolean;
  public paymentIntentId: string;
  public stripeError: StripeError;

  public setStripeError(val: StripeError): this {
    this.stripeError = val;
    return this;
  }

  public setMessage(val: string): this {
    this.message = val;
    return this;
  }

  public setStatus(val: boolean): this {
    this.status = val;
    return this;
  }

  public setPaymentIntentId(val: string): this {
    this.paymentIntentId = val;
    return this;
  }

}
