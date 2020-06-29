import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {ViewRoutes} from "../view-routes";
import {Injectable} from "@angular/core";

/**
 * Ensures before user is able to visit a view, at minimum a auth token needs to be present
 * or the user will auto get routed back to the login view.
 */
@Injectable()
export class BasicViewGuard implements CanActivate {

  constructor(private http: HttpWrapperService, private router: Router){

  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.http && this.http.getAuthToken()) {
      return true;
    } else {
      console.warn('<< BasicViewGuard >> View is prevented, http or token is null, routing to login');
    }
    // go to login view
    this.router.navigate([ViewRoutes.LOGIN]);
    return false;
  }

}
