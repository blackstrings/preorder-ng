import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";

@Component({
  selector: 'app-basic-nav-view',
  templateUrl: './basic-nav-view.component.html',
  styleUrls: ['./basic-nav-view.component.scss']
})
export class BasicNavViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public goToMerchantCreateView(): void {
    this.router.navigate([ViewRoutes.MERCHANT_LIST]);
  }

}
