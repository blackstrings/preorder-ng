import {OrderItem} from "./order-item";
import {ProductTest} from "../product/product.test";

export class OrderItemTest extends OrderItem {
  public static createGeneric(): OrderItemTest {
    return new OrderItemTest();
  }

  public static createBasic(): OrderItemTest {
    return OrderItemTest.create();
  }

  public static create(): OrderItemTest {
    const order: OrderItemTest = new OrderItemTest();
    order.product = ProductTest.create(1);
    order.quantity = 1;
    order.price = '1.00';
    order.created_at = '';
    order.updated_at = '';
    return order;
  }
}
