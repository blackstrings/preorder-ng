import {Merchant} from "./merchant";

export class MerchantTest extends Merchant {

  public static createGeneric(): MerchantTest {
    return MerchantTest.create(1, 'testMerchant');
  }

  public static create(id: number, name: string = 'testMerchant'): MerchantTest {
    const m: MerchantTest = new MerchantTest();
    m.name = name;
    m.id = id;
    return m;
  }

}
