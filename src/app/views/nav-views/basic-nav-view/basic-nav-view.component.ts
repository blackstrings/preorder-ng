import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";
import {UserService} from "../../../services/user-service/user.service";
import {ResponseLogin} from "../../../apis/responses/response-login";
import {UserServiceSubscription} from "../../../services/user-service/user-service-subscription";
import {CartServiceSubscription} from "../../../services/cart-service/cart-service-subscription";
import {Order} from "../../../models/order/order";

@Component({
  selector: 'app-basic-nav-view',
  templateUrl: './basic-nav-view.component.html',
  styleUrls: ['./basic-nav-view.component.scss']
})
export class BasicNavViewComponent {

  // reference so we can use in html
  ViewRoutes = ViewRoutes;

  public isLogin: boolean = false;
  public shoppingCartItemCount: number = 0;

  // to display at top header
  public userFirstName: string;
  public firstNameMaxChar: number = 5;

  constructor(private router: Router,
              private userServiceSub: UserServiceSubscription,
              private userService: UserService,
              private cartServiceSub: CartServiceSubscription)
  {
    // login subscription
    this.userServiceSub.onLogin.subscribe( result => {
      this.isLogin = result;
      this.userFirstName = this.userService.getUserFirstName();
    });

    // add product to order subscription
    this.cartServiceSub.onOrderUpdate$.subscribe( (order: Order) => {
      this.shoppingCartItemCount = order.getNumberOfProducts();
    });
  }

  /** log out the user */
  public logout(): void {
    this.userService.logout()
      .subscribe( (resp: ResponseLogin) => {
          this.router.navigate([ViewRoutes.LOGIN]);
        },
        (e) => {
          console.error(e);
          this.router.navigate([ViewRoutes.LOGIN]);
        }
      );
  }

}
