import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-order-checkout-view',
  templateUrl: './user-order-checkout-view.component.html',
  styleUrls: ['./user-order-checkout-view.component.scss']
})
export class UserOrderCheckoutViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public placeOrder(): void {
    console.error('<< UserOrderCheckoutView >> placeOrder not yet implemented');
  }

}
