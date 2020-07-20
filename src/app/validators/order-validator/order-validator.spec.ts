import {OrderValidator} from "./order-validator";
import {OrderTest} from "../../models/order/order.test";
import {MerchantTest} from "../../models/merchant/merchant.test";
import {ProductTest} from "../../models/product/product.test";

describe('OrderValidator', () => {

  let order: OrderTest;
  beforeEach(() => {
    order = OrderTest.createBasic();
  });

  describe('allProductsBelongToMerchant()', () => {
    it('should return true when all products belong to merchant', () => {
      const merchantID: number = 1;
      order.merchant = MerchantTest.create(merchantID);
      order.products = [ProductTest.create(1,merchantID), ProductTest.create(2,merchantID)];
      const result: boolean = OrderValidator.allProductsBelongToMerchant(order);
      expect(result).toBeTruthy();
    });
    it('should return false when one or more products do not belong to merchant', () => {
      const merchantID: number = 1;
      const merchantID2: number = 2;
      order.merchant = MerchantTest.create(merchantID);
      order.products = [ProductTest.create(1,merchantID), ProductTest.create(2,merchantID2)];
      const result: boolean = OrderValidator.allProductsBelongToMerchant(order);
      expect(result).toBeFalsy();
    });
  });

});
