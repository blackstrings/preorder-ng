import {Order} from "./order";
import {ProductTest} from "../product/product.test";

describe('order', () => {

  let order: Order;
  beforeEach(() => {
    order = new Order();
  });

  describe('rollUpSameProductsTogether()', () => {

    describe('with two products of same id but different qty', () => {
      it('should roll up two products into one', () => {
        const p1: ProductTest = ProductTest.create(1, 2);
        const p2: ProductTest = ProductTest.create(1, 3);
        order.products = [p1, p2];
        order['rollUpSameProductsTogether']();
        expect(order.products.length).toEqual(1);
      });
      it('should roll up the qty to be 5 ', () => {
        const p1: ProductTest = ProductTest.create(1, 2);
        const p2: ProductTest = ProductTest.create(1, 3);
        order.products = [p1, p2];
        order['rollUpSameProductsTogether']();
        expect(order.products[0].orderQTY).toEqual(5);
      });
    });

    describe('with mixed products', () => {

      it('should roll up product1 and product 2, with length of 2', () => {
        const p1: ProductTest = ProductTest.create(1, 2);
        const p2: ProductTest = ProductTest.create(2, 1);
        const p3: ProductTest = ProductTest.create(1, 3);
        order.products = [p1, p2, p3];
        order['rollUpSameProductsTogether']();
        expect(order.products.length).toEqual(2);
      });
      it('should roll up product1 to qty of 5', () => {
        const p1: ProductTest = ProductTest.create(1, 2);
        const p2: ProductTest = ProductTest.create(2, 1);
        const p3: ProductTest = ProductTest.create(1, 3);
        order.products = [p1, p2, p3];
        order['rollUpSameProductsTogether']();
        expect(order.products[0].orderQTY).toEqual(5);
        expect(order.products[1].orderQTY).toEqual(1);
      });
      it('should roll up product2 to qty of 10', () => {
        const p1: ProductTest = ProductTest.create(1, 1);
        const p2: ProductTest = ProductTest.create(2, 5);
        const p3: ProductTest = ProductTest.create(1, 1);
        const p4: ProductTest = ProductTest.create(2, 5);
        order.products = [p1, p2, p3, p4];
        order['rollUpSameProductsTogether']();
        expect(order.products[1].orderQTY).toEqual(10);
      });

    });

  });

});
