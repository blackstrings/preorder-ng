
/** custom enum
 * [none, cancelled, pending, processing, received, accepted, ready, complete]
 **/
export class OrderStatus {
  protected static values: Map<string, OrderStatus> = new Map<string, OrderStatus>();

  public static readonly NONE = new OrderStatus('none');
  public static readonly PROCESSING = new OrderStatus('processing');
  public static readonly PICKUP_READY = new OrderStatus('pickup_ready');
  public static readonly COMPLETE = new OrderStatus('complete');
  public static readonly CANCELLED = new OrderStatus('cancelled');

  // test
  public static readonly CART = new OrderStatus('cart');

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
