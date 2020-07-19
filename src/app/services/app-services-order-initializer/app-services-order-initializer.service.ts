import { Injectable } from '@angular/core';
import {CartService} from "../cart-service/cart.service";
import {UserService} from "../user-service/user.service";

/**
 * Controls what services should get initialize early before app components do.
 * Notice we don't inject in root, as it will be done in the appModule.
 */
@Injectable()
export class AppServicesOrderInitializer {

  /** list the services in the constructor here, no need to list their subscriptions as they will do so already */
  constructor(private cartService: CartService, private userService: UserService) {
    console.debug('<< AppServicesOrderInitializer >> Init');
  }
}
