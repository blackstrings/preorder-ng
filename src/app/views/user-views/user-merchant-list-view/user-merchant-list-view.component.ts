import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../models/merchant/merchant";
import {take} from "rxjs/operators";
import {ViewRoutes} from "../../view-routes";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user-service/user.service";
import {MerchantService} from "../../../services/merchant-service/merchant.service";

@Component({
  selector: 'app-user-merhchant-list-view',
  templateUrl: './user-merchant-list-view.component.html',
  styleUrls: ['./user-merchant-list-view.component.scss']
})
export class UserMerchantListViewComponent implements OnInit {

  ViewRoutes = ViewRoutes;

  public merchants: Merchant[] = [];

  constructor(private router: Router, private userService: UserService, private merchantService: MerchantService) {
    console.log('<< UserMerchantListView >> View Initiated');
  }

  ngOnInit(): void {
    const token: string = this.userService.getAuthToken();

    // todo check if need to fetch new merchants or not, if not, grab from cache instead
    this.merchantService.getMerchantList(token)
      .pipe(take(1))
      .subscribe((data: Merchant[]) => {
        console.debug(data);
        this.merchants = data;
        // clone the data into the merchants from the IMerchant[] shape
        // if the object is a blob, you can try to push it into its shape with
        // this.merchants = {...data}
        // this.merchants = [...data]
      }, (e) => {
        console.error(e);
        console.error('<< MerchantListView >> getMerchantList failed');
      });
  }

  public goToUserCreateOrderView(id: number): void {
    this.router.navigate(['/' + ViewRoutes.USER_CREATE_ORDER, id])
      .then((success: boolean) => {
        if(!success){
          console.warn('<< UserMerchantListView >> goToUserCreateOrderView failed');
        }
      });
  }

}
