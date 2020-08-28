import {OrderItem} from "../order-item/order-item";

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
  public setId(val: number): Product {
    this.id = val;
    return this;
  }

  public setName(val: string): Product {
    this.title = val;
    return this;
  }

  public setDescription(val: string): Product {
    this.description = val;
    return this;
  }

  public setPrice(val: number): Product {
    this.price = val;
    return this;
  }

  public setAdditionalTime(val: string): Product {
    this.additional_time = val;
    return this;
  }

  public setAvailableStart(val: string): Product {
    this.available_start = val;
    return this;
  }

  public setAvailableEnd(val: string): Product {
    this.available_end = val;
    return this;
  }

  public setCreatedAt(val: string): Product {
    this.created_at = val;
    return this;
  }

  public setMerchantId(val: number): Product {
    this.merchant_id = val;
    return this;
  }

  public setTitle(val: string): Product {
    this.title = val;
    return this;
  }

  public setUpdatedAt(val: string): Product {
    this.updated_at = val;
    return this;
  }

  // GETTERS
  public getName(): string{
    return this.title;
  }

  public getDescription(): string{
    return this.description;
  }

  // loaded price may be a string so we return it as a number
  public getPrice(): number {
    let price: number = 0;
    if(this.price) {
      try{
        price = parseFloat(this.price as any)
      } catch(e) {
        console.warn('<< Product >> getPrice failed, parse failed for id: ' + this.id + ' returning 0');
      }
    }
    return price;
  }

  public getAdditionalTime(): string {
    return this.additional_time;
  }

  public getAvailableStart(): string {
    return this.available_start;
  }

  public getAvailableEnd(): string {
    return this.available_end;
  }

  public getId(): number {
    return this.id;
  }
  /*

  // turns serialized object into the concrete form
  public static deserialize(data: Product): Product {

    const p: Product = new Product();
    p.setAdditionalTime(data.additional_time)
    p.setAvailableEnd(data.available_end)
    p.setAvailableStart(data.available_start)
    p.setDescription(data.description)
    p.setCreatedAt(data.created_at)
    p.setId(data.id)
    p.setMerchantId(data.merchant_id)
    p.setPrice(data.price)
    p.setTitle(data.title)
    p.setUpdatedAt(data.updated_at);

    return p;
  }

  public static deserializeAsArray(data: any): Product[] {
    if(data) {
      const orderItems: OrderItem[] = [];
      const products: Product[] = [];
      data.forEach( (_orderItem: any) => {
        const orderItem: OrderItem = new OrderItem();
        Object.assign(orderItem, _orderItem);
        products.push(Product.deserialize(_orderItem));
      });
      return products;
    }
  }

}
