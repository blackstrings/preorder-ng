import {Component, OnInit} from '@angular/core';
import { Product } from 'src/app/models/product/product';
import {ActivatedRoute, Router} from "@angular/router";
import {MerchantService} from "../../../services/merchant-service/merchant.service";
import {ProductService} from "../../../services/product-service/product.service";
import {UserService} from "../../../services/user-service/user.service";
import {take} from "rxjs/operators";
import {AppDefaults} from "../../../utils/AppDefaults";
import {Merchant} from "../../../models/merchant/merchant";

/** Admin store editor for a particular selected store */
@Component({
  selector: 'app-merchant-store-editor',
  templateUrl: './merchant-store-editor.component.html',
  styleUrls: ['./merchant-store-editor.component.scss']
})
export class MerchantStoreEditorComponent implements OnInit {

  AppDefaults = AppDefaults;
  public allProductsInStore: Product[];
  public invalidMerchantID: boolean = false;

  public merchant: Merchant;

  // toggles between product sorting from A-Z and vice versa
  private isSortOrderAZ: boolean = false;

  // so we don't get invalid merchant.name at init
  public merchantName: string = '';

  constructor(private router: Router, private userService: UserService,
              private merchantService: MerchantService,
              private productService: ProductService,
              private activatedRoute: ActivatedRoute)
  {
    console.log('<< MerchantStoreEditor >> init');
  }

  ngOnInit(): void {
    this.loadStoreAndAllProducts();
  }

  public sortProductsAZ(): void {
    this.isSortOrderAZ = !this.isSortOrderAZ; // inverse the value
    this.allProductsInStore.sort((a,b) => {
      // handle reverse and inverse order depending on which order they start in
      if(a.title.charAt(0) < b.title.charAt(0)) {
        return this.isSortOrderAZ ? -1 : 1;
      }
      if(a.title.charAt(0) > b.title.charAt(0) ) {
        return this.isSortOrderAZ ? 1 : -1;
      }
      return 0;
    });
  }

  /** high level call to load the merchant and products */
  private loadStoreAndAllProducts(): void {
    // get the merchant id from the route and fetch products for that merchant
    this.activatedRoute.paramMap.pipe(take(1)).subscribe( params => {
      const id: string = params.get('id');
      if(id) {

        let merchantID: number;

        try {
          merchantID = parseInt(id);
        } catch(e) {
          this.alertInvalidMerchantID();
        }

        if(isNaN(merchantID)) {
          this.alertInvalidMerchantID();
        } else {
          this.loadMerchant(merchantID);
        }

      }
    });
  }

  /** get the products to display for the selected merchant */
  private loadProducts(merchantID: number): void {
    const token: string = this.userService.getAuthToken();
    if(token) {
      this.productService.fetchProducts(token, merchantID)
        .pipe(take(1))
        .subscribe( (resp: Product[]) => {
            this.allProductsInStore = resp;
          },
          e => {
            console.error(e);
          });
    }
  }

  /** load the target merchant to edit then loads the products for the merchant */
  public loadMerchant(merhcantID: number): void {
    const token: string = this.userService.getAuthToken();
    if(token) {
      this.merchantService.getAllMerchantsForUser(token)
        .subscribe( (response: Merchant[]) => {
            if(response && response.length) {
              // response will return all merchants for the user
              // but we filter for the correct merchant being selected
              const merchant: Merchant = response.filter( m => m.id === merhcantID)[0];
              if(merchant) {
                this.merchant = merchant;
                this.merchantName = this.merchant.name;
                this.loadProducts(merhcantID);
              } else {
                console.error('<< MerchantStoreEditor >> loadMerchant failed, merchant null');
              }
            } else {
              console.error('<< MerchantStoreEditor >> loadMerchant failed, response null or empty');
            }
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

  private alertInvalidMerchantID(): void {
    this.invalidMerchantID = true;
  }



}
