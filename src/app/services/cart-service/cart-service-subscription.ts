import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Order} from "../../models/order/order";

@Injectable({
  providedIn: 'root'
})
export class CartServiceSubscription {

  /**
   * subscription to know when addToOrder was called, wired in CartService
   * @see CartService
   */
  public onOrderUpdate$: Observable<Order>;

  constructor(){
    console.debug('<< CartServiceSubscription >> Init');
  }
}
