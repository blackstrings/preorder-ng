import {OrderItemTest} from "./order-item.test";
import {OrderItem} from "./order-item";

describe('OrderItem', () => {

  it('should', () => {
    const o: OrderItem = new OrderItem()
    o.price = '1.10';
    expect(o.price).toEqual('1.10');
  });

});
