
/**
 * To track the current state of the payment status
 */
export class PaymentStatus {
  protected static values: Map<string, PaymentStatus> = new Map<string, PaymentStatus>();

  // not yet started or is in the beginning default state
  public static readonly NONE = new PaymentStatus('none');

  // backend has given permission for payment to begin next phase
  public static readonly READY_FOR_PAYMENT = new PaymentStatus('ready_for_payment');

  /**
   * backend has been notified user has submitted payment for processing
   * This status also represents any errors that may have occurred.
   */
  public static readonly PROCESSING = new PaymentStatus('processing');

  /**
   * backend has verified payment is complete
   * This should be the common status for completed successful orders
   */
  public static readonly COMPLETE = new PaymentStatus('complete');

  // backend has verified payment was cancelled
  public static readonly CANCELLED = new PaymentStatus('cancelled');

  // backend has verified payment has started a refund process
  public static readonly REFUND_PROCESSING = new PaymentStatus('refund_processing');

  // backend has verified payment refund is complete
  public static readonly REFUND_COMPLETE = new PaymentStatus('refund_complete');

  protected constructor(protected value: string) {
    PaymentStatus.values.set(value, this);
    // if extending this order status
    //super(value);
  }

  public static fromValue(value: string): PaymentStatus {
    return PaymentStatus.values.has(value) ? PaymentStatus.values.get(value) : null;
  }

  protected toString(): string {
    return this.value;
  }
}
