import {OrderItemTest} from "./order-item.test";
import {OrderItem} from "./order-item";

describe('OrderItem', () => {

  let orderI: OrderItem;
  beforeEach(() => {
    orderI = new OrderItem();
  });

  describe('price()', () => {
    it('should return correct price', () => {
      orderI.price = '1.10';
      expect(orderI.price).toEqual('1.10');
    });
  });

  describe('isPriceOverLimit', () => {

    describe('when price is 1000 or over', () => {
      it('should return true if price is 1000', () => {
        spyOnProperty(orderI, 'price', 'get').and.returnValue(1001);
        expect(orderI.isPriceOverLimit()).toBeTrue();
      });
      it('should return true if price is 1001', () => {
        spyOnProperty(orderI, 'price', 'get').and.returnValue(1001);
        expect(orderI.isPriceOverLimit()).toBeTrue();
      });
    });
    describe('when price is under 1000', () => {
      it('should return false if price is 999', () => {
        spyOnProperty(orderI, 'price', 'get').and.returnValue(999);
        expect(orderI.isPriceOverLimit()).toBeFalse();
      });
      it('should return false if price is 1', () => {
        spyOnProperty(orderI, 'price', 'get').and.returnValue(1);
        expect(orderI.isPriceOverLimit()).toBeFalse();
      });
    });

  });

});
