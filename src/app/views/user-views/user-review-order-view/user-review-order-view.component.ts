import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart-service/cart.service";
import {Merchant} from "../../../models/merchant/merchant";
import {Order} from "../../../models/order/order";
import {User} from "../../../models/user/user";
import {UserService} from "../../../services/user-service/user.service";
import {OrderValidator} from "../../../validators/order-validator/order-validator";
import {ViewRoutes} from "../../view-routes";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-review-order-view',
  templateUrl: './user-review-order-view.component.html',
  styleUrls: ['./user-review-order-view.component.scss']
})
export class UserReviewOrderViewComponent implements OnInit {

  ViewRoutes = ViewRoutes;
  public order: Order;
  public merchant: Merchant;
  public merchantName: string;
  public merchantID: number;
  public user: User;

  public subTotal: number;
  public taxAmount: number;
  public orderTotal: number;

  public productNameMaxCharacter: number = 30;

  constructor(private cartService: CartService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.setupViewData();
  }

  public checkout(): void {
    if(this.validatePlacingOrder()){
      this.cartService.placeOrder(this.userService.getAuthToken())
        .subscribe( (resp: any) => {
            console.debug('<< UserReviewOrderView >> response returned');
            console.debug(resp);
            this.router.navigate([ViewRoutes.USER_ORDER_CHECKOUT]);
          },
          e => {
            console.error(e);
          }
        );
    } else {
      console.debug('<< UserReviewOrderView >> placeOrder failed, validation failed');
    }
  }

  /**
   * returns true if all validations are success for order submission to backend
   * - order
   * - products
   * - payment
   * - pickup times
   */
  private validatePlacingOrder(): boolean {
    let result: boolean = true;
    // order req
    if(result && !this.order) {result = false; }
    // products req
    if(result && !this.order.products) {result = false; }
    if(result && !OrderValidator.validate(this.order)) {result = false; }
    // todo payment required
    // if(result && this.order) {result = false; }
    return result;
  }

  public orderHasItems(): boolean {
    return this.order && this.order.products && this.order.products.length > 0;
  }

  /** required data that should be available on page init */
  private setupViewData(): void {
    this.order = this.order = this.cartService.getCurrentOrder();
    if(this.order && this.order.products) {
      this.merchant = this.order.merchant;
      this.merchantName = this.merchant && this.merchant.name ? this.merchant.name : '';
      this.merchantID = this.merchant && this.merchant.id ? this.merchant.id : 0;
      this.user = this.order.user;

      this.displayPricing();

    } else {
      console.error('<< UserReviewOrderView >> setOrder failed, order null');
    }
  }

  /**
   * Shoudl send products to backend to get calculated.
   * We do not handle tax and total price calculation in front end.
   */
  private displayPricing(): void {
    // todo make fetch to get pricing from backend
    this.subTotal = this.order.getTotalPrice();
    this.taxAmount = this.subTotal * 0.055; // hard coded tax
    this.orderTotal = this.subTotal + this.taxAmount;
  }

}
