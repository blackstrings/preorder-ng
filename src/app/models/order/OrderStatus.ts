
/** custom enum
 * [none, cancelled, pending, processing, received, accepted, ready, complete]
 **/
export class OrderStatus {
  protected static values: Map<string, OrderStatus> = new Map<string, OrderStatus>();

  // fresh new order, clean, just started, and no items added
  public static readonly NONE = new OrderStatus('none');

  /** user has moved their order to checkout */
  public static readonly PENDING_FOR_SUBMISSION = new OrderStatus('pending_for_submission');

  /**
   * user has placed their order
   * Order has been submitted to backend with payment, the vendor will soon get notify if success
   */
  public static readonly submitted = new OrderStatus('submitted');

  /** order most likely paid for and merchant accepted order and is working on it */
  public static readonly PROCESSING = new OrderStatus('processing');

  /** vendor has completed the order or is ready for pickup */
  public static readonly ORDER_READY = new OrderStatus('order_ready');  // order ready for pickup

  /** the order has been delivered or picked up */
  public static readonly COMPLETED = new OrderStatus('completed'); // order received

  /**
   * the order was cancelled - to know reason of cancel must look further into the cancellation type
   * This can be due to many reasons, errors, invalid time frame, overdue timeframe
   * canceled by vendor/merchant/corporation
   * Note: A cancelled order cannot and should not be reopened.
   * If it needs to reopen, create a new order instead based off the cancelled order with valid params.
   */
  public static readonly CANCELLED = new OrderStatus('cancelled');

  protected constructor(protected value: string) {
    OrderStatus.values.set(value, this);
    // if extending this order status
    //super(value);
  }

  public static fromValue(value: string): OrderStatus {
    return OrderStatus.values.has(value) ? OrderStatus.values.get(value) : null;
  }

  protected toString(): string {
    return this.value;
  }
}
