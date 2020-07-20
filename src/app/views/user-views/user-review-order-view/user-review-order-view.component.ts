import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart-service/cart.service";
import {Merchant} from "../../../models/merchant/merchant";
import {Order} from "../../../models/order/order";
import {User} from "../../../models/user/user";
import {UserService} from "../../../services/user-service/user.service";
import {OrderValidator} from "../../../validators/order-validator";

@Component({
  selector: 'app-user-review-order-view',
  templateUrl: './user-review-order-view.component.html',
  styleUrls: ['./user-review-order-view.component.scss']
})
export class UserReviewOrderViewComponent implements OnInit {

  public order: Order;
  public merchant: Merchant;
  public user: User;

  public productNameMaxCharacter: number = 30;

  constructor(private cartService: CartService, private userService: UserService) { }

  ngOnInit(): void {
    this.setupOrderOnLoad();
  }

  public submitOrder(): void {
    if(this.validateOrderReview()){
      this.cartService.finalizeOrder(this.userService.getAuthToken())
        .subscribe( (resp: any) => {
            console.debug('<< UserReviewOrderView >> response returned');
            console.debug(resp);
          },
          e => {
            console.error(e);
          }
        );
    }
  }

  /**
   * returns true if all validations are success for order submission to backend
   * - order
   * - products
   * - payment
   * - pickup times
   */
  private validateOrderReview(): boolean {
    let result: boolean = true;
    if(this.order) {result = false; }
    // order req
    if(result && this.order) {result = false; }
    // products req
    if(result && this.order.products) {result = false; }
    if(result && !OrderValidator.validate(this.order)) {result = false; }
    // payment required
    // if(result && this.order) {result = false; }
    return result;
  }

  private setupOrderOnLoad(): void {
    this.order = this.order = this.cartService.getCurrentOrder();
    if(this.order && this.order.products) {
      this.merchant = this.order.merchant;
      this.user = this.order.user;
    } else {
      console.error('<< UserReviewOrderView >> setOrder failed, order null');
    }
  }

}
