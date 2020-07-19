import {Component, SkipSelf} from '@angular/core';
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

  constructor(private router: Router,
              private userServiceSub: UserServiceSubscription,
              private userService: UserService,
              @SkipSelf() private cartServiceSub: CartServiceSubscription)
  {
    // login subscription
    this.userServiceSub.onLogin.subscribe( result => {
      this.isLogin = result;
    });

    // add product to order subscription
    this.cartServiceSub.onAddToOrder.subscribe( (order: Order) => {
      this.shoppingCartItemCount = order.getNumberOfProducts();
    });
  }



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

  public test(): void {
    this.shoppingCartItemCount++;
  }
}
