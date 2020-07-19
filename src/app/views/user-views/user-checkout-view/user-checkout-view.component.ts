import {Component, Input, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart-service/cart.service";

@Component({
  selector: 'app-user-checkout-view',
  templateUrl: './user-checkout-view.component.html',
  styleUrls: ['./user-checkout-view.component.scss']
})
export class UserCheckoutViewComponent implements OnInit {

  public order;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.order = this.cartService.getCurrentOrder();
  }

}
