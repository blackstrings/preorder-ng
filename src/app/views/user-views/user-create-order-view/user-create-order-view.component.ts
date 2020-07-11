import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../models/merchant/merchant";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../../../models/product";
import {UserService} from "../../../services/user-service/user.service";
import {ProductService} from "../../../services/product-service/product.service";

@Component({
  selector: 'app-user-create-order-view',
  templateUrl: './user-create-order-view.component.html',
  styleUrls: ['./user-create-order-view.component.scss']
})
export class UserCreateOrderViewComponent implements OnInit {

  public merchant: Merchant;
  public products: Product[];

  constructor(private userService: UserService, private productService: ProductService, private activatedRoute: ActivatedRoute) {
    console.log('<< UserCreateOrderView >> View Initiated');
    // using snapShot to get the param (older way and won't work if the component doesn't init again
    // this.merchantID = this.activatedRoute.snapshot.paramMap.get('id');
  }


  ngOnInit(): void {
    // use observable - better approach to grab params from url
    this.fetchMerchantProducts()
  }

  public addProduct(id: number): void {
    throw new Error('to be implemented' + id);
  }

  private fetchMerchantProducts(): void {
    // pull merchant id from route
    this.activatedRoute.paramMap.subscribe( params => {
      const id = params.get('id');
      if(id) {

        const merchantID: number = parseInt(id);
        const token: string = this.userService.getAuthToken();
        if(!isNaN(merchantID) && token) {

          // async http call
          this.productService.getProducts(token, merchantID)
            .subscribe( (data: Product[]) => {
              this.products = data;
              console.log(this.products);
            }, (e) => {
              console.warn('<< UserCreateOrderView >> getProductsFailed, http failed');
            });

        } else {
          console.error('<< UserCreateOrderView >> getProductsFailed, id parse or token failed');
        }
      } else {
        console.error('<< UserCreateOrderView >> getProductsFailed, id is invalid');
      }
    });
  }

}
