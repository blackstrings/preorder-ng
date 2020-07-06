import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {ViewRoutes} from "../view-routes";
import {Injectable} from "@angular/core";
import {UserService} from "../../apis/services/user-service/user.service";

/**
 * Ensures before user is able to visit a view, at minimum a auth token needs to be present
 * or the user will auto get routed back to the login view.
 */
@Injectable()
export class BasicViewGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router){

  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.userService && this.userService.getAuthToken()) {
      return true;
    } else {
      console.warn('<< BasicViewGuard >> View is prevented, http or token is null, routing to login');
    }
    // force logout
    this.userService.logout();
    // go to login view
    this.router.navigate([ViewRoutes.LOGIN]);
    return false;
  }

}
