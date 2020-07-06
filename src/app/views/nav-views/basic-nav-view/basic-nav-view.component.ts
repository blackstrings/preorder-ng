import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {take} from "rxjs/operators";
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

  constructor(private router: Router,
              private userServiceSub: UserServiceSubscription,
              private userService: UserService,
              private http: HttpWrapperService<ResponseLogin>)
  {
    // wire in subscription
    userServiceSub.onLogin.subscribe( result => {
      this.isLogin = result;
    });
  }

  public logout(): void {
    //todo might want to just move this all into the http wrapper
    this.http.logout()
      .pipe(take(1))
      .subscribe( result => {
          this.userService.logout();
          this.router.navigate([ViewRoutes.LOGIN]);
        }, (e) => {
          console.error('<< UserCreateAccount >> logout errored in backend, logging out front end anyways');
          this.userService.logout();
          this.router.navigate([ViewRoutes.LOGIN]);
        }
      );
  }
}
