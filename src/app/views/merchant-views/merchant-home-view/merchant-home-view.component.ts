import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";
import {Merchant} from "../../../models/merchant/merchant";

@Component({
  selector: 'app-merchant-home-view',
  templateUrl: './merchant-home-view.component.html',
  styleUrls: ['./merchant-home-view.component.scss']
})
export class MerchantHomeViewComponent implements OnInit {

  public testMerchants: {name: string}[] = [
    {name: 'Burger King'},
    {name: 'McDonalds'}
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  public goToRegisterStore(): void {
    this.router.navigate([ViewRoutes.MERCHANT_CREATE]);
  }

}
