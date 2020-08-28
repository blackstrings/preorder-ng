import {Order} from "./order";
import {ProductTest} from "../product/product.test";
import {MerchantTest} from "../merchant/merchant.test";
import {DeliveryType} from "../delivery/delivery-type";

export class OrderTest extends Order {
  public static createGeneric(): OrderTest {
    return new OrderTest();
  }

  public static createBasic(): OrderTest {
    return OrderTest.create();
  }

  public static create(): OrderTest {
    const order: OrderTest = new OrderTest();
    order.products = [ProductTest.create(1)];
    order.merchant = MerchantTest.createGeneric();
    order.deliveryType = DeliveryType.PICK_UP;
    return order;
  }
}
