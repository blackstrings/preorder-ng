import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../apis/objects/merchant/merchant";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {take} from "rxjs/operators";
import {ViewRoutes} from "../../view-routes";
import {Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";

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
    const result: Observable<Merchant[]> = this.http.getMerchantList();
    if(result) {
      result.pipe(take(1)).subscribe((data: Merchant[]) => {
        console.log(data);
        this.merchants = Merchant.deserializeArray(data);
        // clone the data into the merchants from the IMerchant[] shape
        // if the object is a blob, you can try to push it into its shape with
        // this.merchants = {...data}
        // this.merchants = [...data]
      }, (e) => {
        console.error('<< MerchantListView >> getMerchantList failed');
        console.error(e);
      });
    }
  }

  public goToUserCreateOrderView(id: number): void {
    this.router.navigate(['/' + ViewRoutes.USER_CREATE_ORDER, id])
      .then((success: boolean) => {
        if(!success){
          console.warn('<< UserMerchantListView >> goToUserCreateOrderView failed');
        }
      });;
  }

}
