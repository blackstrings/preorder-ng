export class PaymentResponseRK {
  public message: string;
  public status: boolean;
  public paymentIntentId: string;

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
