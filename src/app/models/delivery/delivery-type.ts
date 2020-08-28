/**
 * custom enum for delivery type
 */
export class DeliveryType {
  protected static values: Map<string, DeliveryType> = new Map<string, DeliveryType>();

  public static readonly NONE = new DeliveryType('none');
  public static readonly PICK_UP = new DeliveryType('pick_up');
  public static readonly UBER = new DeliveryType('uber');
  public static readonly SHIP_TO_BUYER = new DeliveryType('ship_to_buyer');

  protected constructor(protected value: string) {
    DeliveryType.values.set(value, this);
    // if extending this order status
    //super(value);
  }

  public static fromValue(value: string): DeliveryType {
    return DeliveryType.values.has(value) ? DeliveryType.values.get(value) : null;
  }

  protected toString(): string {
    return this.value;
  }
}
