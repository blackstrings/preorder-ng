import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";
import {MerchantService} from "../../../services/merchant-service/merchant.service";
import {UserService} from "../../../services/user-service/user.service";
import {take} from "rxjs/operators";
import {Merchant} from "../../../models/merchant/merchant";

@Component({
  selector: 'app-merchant-home-view',
  templateUrl: './merchant-home-view.component.html',
  styleUrls: ['./merchant-home-view.component.scss']
})
export class MerchantHomeViewComponent implements OnInit {

  public userMerchants: Merchant[] = [];
  constructor(private router: Router, private merchantService: MerchantService, private userService: UserService) { }

  ngOnInit(): void {
    this.getAllMerchantsForUser();
  }


  public goToRegisterStore(): void {
    this.router.navigate([ViewRoutes.MERCHANT_CREATE]);
  }

  public goToStoreEditor(merchantId: number): void {
    this.router.navigate([ViewRoutes.MERCHANT_STORE_EDITOR + '/' + merchantId]);
  }

  public getAllMerchantsForUser(): void {
    const token: string = this.userService.getAuthToken();
    if(token) {
      this.merchantService.getAllMerchantsForUser(token)
        .subscribe( (response: Merchant[]) => {
            this.userMerchants = response;
          },
          e => {
            console.error('<< MerchantHomeView >> getAllMerchantForUser failed');
            console.error(e);
          }
        )
    } else {
      console.error('<< MerchantHomeView >> getAllMerchantsForUser failed, token null');
    }
  }

}
