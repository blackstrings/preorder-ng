import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../../services/cart-service/cart.service";
import {Order} from "../../../models/order/order";
import {UserService} from "../../../services/user-service/user.service";

/**
 * Mainly this page handles payment for the order or items in the order/cart.
 * User cannot edit the order anymore and must start a new order or start over if they wish to edit the order.
 */
@Component({
  selector: 'app-user-order-checkout-view',
  templateUrl: './user-order-checkout-view.component.html',
  styleUrls: ['./user-order-checkout-view.component.scss']
})
export class UserOrderCheckoutViewComponent implements OnInit {

  // the customer's order id to be displayed on the page, doesn't get populated until data comes back
  public order: Order = new Order();

  // during init should the order not be able to load
  public isScreenInitError: boolean = false;
  public isScreenLoading: boolean = true;

  constructor(private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private userService: UserService) {
    this.setupView();
  }

  /** pulls the orderID from the url if available */
  private setupView(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let orderId: string = params.get('orderId');
      if(!orderId) {
        // should the user not come directly from the review orders page
        // verify if the orderID can be retrieved from the cartService
        orderId = this.cartService.getSubmittedOrderID();
      }

      // after getting the order id, load the order from the backend
      this.loadOrder(orderId);
    });
  }

  /** load and display the order. The payment token will be within the order.*/
  private loadOrder(orderID: string): void {
    if(orderID) {
      const token: string = this.userService.getAuthToken();
      if(token) {

        this.cartService.getCheckedOutOrder(orderID, token)
          .subscribe( (resp: Order) => {
              if(resp instanceof Order) {
                this.order = resp;
              } else {
                console.error('<< UserOrderCheckoutView >> loadOrder failed, response not instanceof Order');
                this.isScreenInitError = true;
              }
              this.isScreenLoading = false;
            },
            (e) => {
              console.error('<< UserOrderCheckoutView >> loadOrder failed, network error');
              console.error(e);
              this.isScreenInitError = true;
              this.isScreenLoading = false;
            });

      } else {
        console.error('<< UserOrderCheckoutView >> loadOrder failed, token null');
      }

    } else {
      console.error('<< UserOrderCheckoutView >> loadOrder failed, orderID null');
    }
  }

  ngOnInit(): void {
  }

  public placeOrder(): void {
    console.error('<< UserOrderCheckoutView >> placeOrder not yet implemented');
  }

}
