import {Merchant} from "../merchant/merchant";

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

  // how much qty of this product - used during purchase
  public orderQTY: number = 1;
  // should there be a max qty limit for this product per order
  public maxQTY : number;

  // to have nested products such as ingredients etc
  public products: Product[];

  constructor(){}

  /** deep copy */
  public clone(): Product {
    const newProduct: Product = new Product();
    return Object.assign(newProduct, JSON.parse(JSON.stringify(this)) );
  }

  /**
   * returns the total price for the product
   * NOTE: This algorithm and the server algorithm should match.
   */
  public calculateTotalPrice(): number {
    let total: number = this.price; // starting price

    // loop through nested products and accumulate all sub product prices
    if(this.products && this.products.length) {
      this.products.forEach( p => {
        total += p.calculateTotalPrice();
      });
    }

    total = total * this.orderQTY;
    return total;
  }


  // SETTERS
  public setName(val: string): void{
    this.title = val;
  }

  public setDescription(val: string): void{
    this.description = val;
  }

  public setPrice(val: number): void{
    this.price = val;
  }

  public setAdditionalTime(val: string): void{
    this.additional_time = val;
  }

  public setAvailableStart(val: string): void{
    this.available_start = val;
  }

  public setAvailableEnd(val: string): void{
    this.available_end = val;
  }

  // GETTERS
  public getName(): string{
    return this.title;
  }

  public getDescription(): string{
    return this.description;
  }

  public getPrice(): number{
    return this.price;
  }

  public getAdditionalTime(): string{
    return this.additional_time;
  }

  public getAvailableStart(): string{
    return this.available_start;
  }

  public getAvailableEnd(): string{
    return this.available_end;
  }

  public getId(): number {
    return this.id;
  }
  /*

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
