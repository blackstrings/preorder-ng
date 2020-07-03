import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../apis/objects/merchant";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {ActivatedRoute} from "@angular/router";
import {IProduct} from "../../../apis/objects/i-product";

@Component({
  selector: 'app-user-create-order-view',
  templateUrl: './user-create-order-view.component.html',
  styleUrls: ['./user-create-order-view.component.scss']
})
export class UserCreateOrderViewComponent implements OnInit {

  public merchant: Merchant;
  public products: IProduct[];

  constructor(private http: HttpWrapperService, private activatedRoute: ActivatedRoute) {

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
        if(!isNaN(merchantID)) {

          this.http.getMerchantProducts(merchantID).subscribe( (data: IProduct[]) => {
            this.products = [...data];
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
