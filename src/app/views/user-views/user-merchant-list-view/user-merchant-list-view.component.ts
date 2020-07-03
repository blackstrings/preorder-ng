import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../apis/objects/merchant";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {take} from "rxjs/operators";
import {ViewRoutes} from "../../view-routes";
import {IMerchant} from "../../../apis/objects/i-merchant";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-merhchant-list-view',
  templateUrl: './user-merchant-list-view.component.html',
  styleUrls: ['./user-merchant-list-view.component.scss']
})
export class UserMerchantListViewComponent implements OnInit {

  ViewRoutes = ViewRoutes;
  public merchants: Merchant[] = [];

  constructor(private router: Router, private http: HttpWrapperService) {
  }

  ngOnInit(): void {
    this.http.getMerchantList().pipe(take(1)).subscribe((data: IMerchant[]) => {
      console.log(data);
      this.merchants = Merchant.deserializeArray(data);
      // clone the data into the merchants from the IMerchant[] shape
      // if the object is a blob, you can try to push it into its shape with
      // this.merchants = {...data}
      // this.merchants = [...data]
    }, (e) => {
      console.error('<< MerchantListView >> retrieving merchante lists failed');
      console.error(e);
    });
  }

  public goToUserCreateOrderView(id: number): void {
    this.router.navigate(['/' + ViewRoutes.USER_CREATE_ORDER, id]);
  }

}
