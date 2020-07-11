import {Merchant} from "./merchant/merchant";

export class Product {

  // properties
  public additional_time: string;
  public available_end: string;
  public available_start: string;
  public created_at: string;
  public description: string;
  public id: number;
  public merchant_id: number;
  public price: number;
  public title: string;
  public updated_at: string;
  public merchant: Merchant;

  constructor(){}

  /*
  public getId(): number {
    return this.id;
  }

  public getPrice(): number {

    // let num: number = 0;
    // if(typeof this.price === 'string') {
    //   num = parseFloat(this.price);
    //   return parseFloat(num.toFixed(2));
    // }
    return this.price;
  }

  // turns serialized object into the concrete form
  public static deserialize(data: Product): Product {

    return new Product(
      data.additional_time,
      data.available_end,
      data.available_start,
      data.created_at,
      data.description,
      data.id,
      data.merchant_id,
      parseFloat(data.price as any),
      data.title,
      data.updated_at,
      data.merchant
    );
  }

  public static deserializeAsArray(data: Product[]): Product[] {
    if(data) {
      const products: Product[] = [];
      data.forEach(d => {
        products.push(Product.deserialize(d));
      });
      return products;
    }
  }
  */
}
