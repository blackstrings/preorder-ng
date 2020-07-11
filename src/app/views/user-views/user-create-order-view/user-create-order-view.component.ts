import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../models/merchant/merchant";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../../../models/product";
import {UserService} from "../../../services/user-service/user.service";
import {ProductService} from "../../../services/product-service/product.service";
import {MerchantService} from "../../../services/merchant-service/merchant.service";

@Component({
  selector: 'app-user-create-order-view',
  templateUrl: './user-create-order-view.component.html',
  styleUrls: ['./user-create-order-view.component.scss']
})
export class UserCreateOrderViewComponent implements OnInit {

  public merchant: Merchant;
  public products: Product[];

  /**
   *
   * @param userService
   * @param productService
   * @param merchantService to get the merchant for which the products are for
   * @param activatedRoute
   */
  constructor(private userService: UserService, private productService: ProductService,
              private merchantService: MerchantService, private activatedRoute: ActivatedRoute) {
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

  /** retrieves products and sets target merchant */
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
              this.setMerchant(merchantID);
              console.log(this.products);
            }, (e) => {
              console.warn('<< UserCreateOrderView >> fetchMerchantProducts, http failed');
            });

        } else {
          console.error('<< UserCreateOrderView >> fetchMerchantProducts, id parse or token failed');
        }
      } else {
        console.error('<< UserCreateOrderView >> fetchMerchantProducts, id is invalid');
      }
    });
  }

  /** a separate call to get and set the merchant locally in here */
  private setMerchant(id: number): void {
    if(id){
      this.merchantService.setMerchantID(id);
      this.merchant = this.merchantService.getMerchantFromCache(id);
      if(!this.merchant) {
        const token: string = this.userService.getAuthToken();
        if(token) {
          this.merchantService.getMerchant(token, id)
            .subscribe( (resp: Merchant[]) => {
              console.debug('<< UserCreateOrderView >> merchant set through http call');
              if(resp && resp.length) {
                console.debug(resp[0]);
                this.merchant = resp[0];
              } else {
                console.error('<< UserCreateOrderView >> setMerchant failed, array null or empty');
              }
            });
        } else {
          console.error('<< UserCreateOrderView >> setMerchant failed, token null');
        }
      }
    } else {
      console.error('<< UserCreateOrderView >> setMerchant failed, id null');
    }

  }

}
