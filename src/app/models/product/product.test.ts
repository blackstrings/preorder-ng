import {Product} from "./product";

export class ProductTest extends Product {

  public static createGeneric(): ProductTest {
    return ProductTest.create(1);
  }

  public static create(
    id: number,
    orderQTY: number = 1,
    merchant_id: number = 1,
    title: string = 'Test Product',
    price: number = 1.99,
    description: string = 'test product description'): ProductTest {
    const p: ProductTest = new ProductTest();
    p.id = id;
    p.orderQTY = orderQTY;
    p.merchant_id = merchant_id;
    p.title = title;
    p.price = price;
    p.description = description;
    return p;
  }

}
