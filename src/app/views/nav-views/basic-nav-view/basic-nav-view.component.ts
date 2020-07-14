import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";
import {UserService} from "../../../services/user-service/user.service";
import {ResponseLogin} from "../../../apis/responses/response-login";
import {UserServiceSubscription} from "../../../services/user-service/user-service-subscription";

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
              private userService: UserService)
  {
    // wire in subscription
    userServiceSub.onLogin.subscribe( result => {
      this.isLogin = result;
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
