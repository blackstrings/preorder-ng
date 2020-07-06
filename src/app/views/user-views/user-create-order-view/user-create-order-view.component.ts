import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../apis/objects/merchant/merchant";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../../../apis/objects/product";
import {UserService} from "../../../apis/services/user-service/user.service";

@Component({
  selector: 'app-user-create-order-view',
  templateUrl: './user-create-order-view.component.html',
  styleUrls: ['./user-create-order-view.component.scss']
})
export class UserCreateOrderViewComponent implements OnInit {

  public merchant: Merchant;
  public products: Product[];

  constructor(private userService: UserService, private http: HttpWrapperService, private activatedRoute: ActivatedRoute) {
    console.log('<< UserCreateOrderView >> View Initiated');
    // using snapShot to get the param (older way and won't work if the component doesn't init again
    // this.merchantID = this.activatedRoute.snapshot.paramMap.get('id');

    // use observable - better approach to grab params from url
    this.fetchMerchantProducts()

  }

  private fetchMerchantProducts(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      const id = params.get('id');
      if(id) {
        const merchantID: number = parseInt(id);
        const token: string = this.userService.getAuthToken();
        if(!isNaN(merchantID) && token) {

          this.http.getMerchantProducts(merchantID, token).subscribe( (data: Product[]) => {
            this.products = [...data];
            //this.merchant = Merchant.deserialize(this.products[0].merchant);
            console.log(this.products);
          }, (e) => {
            console.warn('<< UserCreateOrderView >> getProductsFailed, http failed');
          });

        } else {
          console.error('<< UserCreateOrderView >> getProductsFailed, id parse failed');
        }
      } else {
        console.error('<< UserCreateOrderView >> getProductsFailed, id is invalid');
      }
    });
  }

  ngOnInit(): void {

  }

  public addProduct(id: number): void {
    // do nothing yhet
  }

}
