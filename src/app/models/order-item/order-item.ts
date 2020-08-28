/**
 * products under an order are orderItems in the backend
 * So we sending products to the backend, we have to transform products into orderItem
 */
import {Product} from "../product/product";

export class OrderItem {
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get price(): string {
    return this._price;
  }

  set price(value: string) {
    this._price = value;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
  }

  get updated_at(): string {
    return this._updated_at;
  }

  set updated_at(value: string) {
    this._updated_at = value;
  }

  get created_at(): string {
    return this._created_at;
  }

  set created_at(value: string) {
    this._created_at = value;
  }

  get product(): Product {
    return this._product;
  }

  set product(value: Product) {
    this._product = value;
  }
  private _id: number;
  private _price: string;
  private _quantity: number;
  private _updated_at: string;
  private _created_at: string;
  private _product: Product;

  public static deserialize(data: any): OrderItem {
    const o: OrderItem = new OrderItem();
    o.id = data.id;
    o.price = data.price;
    o.quantity = data.quantity;
    o.updated_at = data.updated_at;
    o.created_at = data.created_at;
    o.product = Product.deserialize(data.product);

    return o;
  }

  public static deserializeAsArray(data: any[]): OrderItem[] {
    const orderItems: OrderItem[] = [];
    if(data) {
      data.forEach( (_orderItem: any) => {
        orderItems.push(OrderItem.deserialize(_orderItem));
      });
    }
    return orderItems;
  }

}
