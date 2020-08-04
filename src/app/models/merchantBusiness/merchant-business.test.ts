import { MerchantBusiness } from './merchant-business';
export class MerchantBusinessTest extends MerchantBusiness {

    public static createGeneric(): MerchantBusinessTest {
      return MerchantBusinessTest.create('testMerchantBusiness', 200000);
    }
  
    public static create(name: string = 'testMerchantBusiness', businessTax: number = 200000): MerchantBusinessTest {
      const m: MerchantBusinessTest = new MerchantBusinessTest();
      m.businessName = name;
      m.businessTax = businessTax;
      return m;
    }
  
  }
  