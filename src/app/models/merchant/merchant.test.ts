import {Merchant} from "./merchant";

export class MerchantTest extends Merchant {

  public getNameSpy: jasmine.Spy;

  public static createGeneric(): MerchantTest {
    return new MerchantTest(1, 'testMerchant');
  }

  public static create(id: number, name: string = 'testMerchant'): MerchantTest {
    return new MerchantTest(id, name);
  }

}
