import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../models/merchant/merchant";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../../../models/product/product";
import {UserService} from "../../../services/user-service/user.service";
import {ProductService} from "../../../services/product-service/product.service";
import {MerchantService} from "../../../services/merchant-service/merchant.service";
import {ViewRoutes} from "../../view-routes";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {ProductAddModalViewComponent} from "../../common-views/product-add-view/product-add-modal-view.component";
import {CartService} from '../../../services/cart-service/cart.service';
import {take} from "rxjs/operators";
import {YesNoModalViewComponent} from "../../common-views/yes-no-modal-view/yes-no-modal-view.component";

@Component({
  selector: 'app-user-create-order-view',
  templateUrl: './user-create-order-view.component.html',
  styleUrls: ['./user-create-order-view.component.scss']
})
export class UserCreateOrderViewComponent implements OnInit {

  ViewRoutes = ViewRoutes;
  public merchant: Merchant;
  public products: Product[];

  /** prevent displaying long product names in the view */
  public readonly productNameMaxCharacter: number = 30;

  /**
   *
   * @param userService
   * @param productService
   * @param merchantService to get the merchant for which the products are for
   * @param activatedRoute
   */
  constructor(private userService: UserService, private productService: ProductService,
              private merchantService: MerchantService, private cartService: CartService,
              private activatedRoute: ActivatedRoute, private modalService: NgbModal) {
    console.log('<< UserCreateOrderView >> View Initiated');
    // using snapShot to get the param (older way and won't work if the component doesn't init again
    // this.merchantID = this.activatedRoute.snapshot.paramMap.get('id');
  }

  /** on init it will fetch all products for the user to choose from */
  ngOnInit(): void {
    this.fetchMerchantProducts()
  }

  /**
   * opens up the product in a separate modal view.
   * We pass an ID rather than the product directly because we need a new deep copy of the product.
   * When grabbing a product from productService it returns a deep copy so we can mutate it for use
   * without affecting the original.
   */
  public showModalProductView(id: number): void {
    if(id) {
      const product: Product = this.productService.getProductFromCache(id);
      if(product) {

        // set config to not allow keyboard esc or click on backdrop to close
        const modalConfigs: NgbModalOptions = {backdrop: 'static', keyboard: false, scrollable: true};
        const modalRef = this.modalService.open(ProductAddModalViewComponent, modalConfigs);
        if(modalRef.componentInstance instanceof ProductAddModalViewComponent) {
          modalRef.componentInstance.init(product);
          modalRef.componentInstance.onClose
            .pipe(take(1))
            .subscribe( (val: Product) => {
              if(val) {
                this.addToCart(val);
              }
            });
        }

      } else {
        console.error('<< UserCreateOrderView >> viewProduct failed, product null');
      }
    }
  }

  /** attempts to add product to the cart */
  private addToCart(product): void {
    if(this.merchant && product) {
      // if the product is of a different merchant,
      // we need to let the user know their previous order will have to be discarded
      if(this.cartService.canAddProductToOrder(product, this.merchant)) {
        this.cartService.addToCart(this.merchant, product);
      } else {
        console.warn('<< UserCreateOrderView >> addToCart interrupted, attempting to add new products from new store');
        this.showModalOrderOverrideWarning(product);
      }
    }
  }

  private showModalOrderOverrideWarning(product: Product): void {
    // set modal config to not allow keyboard esc or click on backdrop to close
    const modalConfigs: NgbModalOptions = {backdrop: 'static', keyboard: false};
    // dynamically create the modal
    const modalRef = this.modalService.open(YesNoModalViewComponent, modalConfigs);
    // cast the modal to the correct type for easier property accessing
    if(modalRef.componentInstance instanceof YesNoModalViewComponent) {
      const header: string = 'Warning'
      const body: string = 'You have products from another merchant in the cart. ' +
        'Proceed and start a new order from this merchant?';
      modalRef.componentInstance.init(header, body);
      modalRef.componentInstance.onClose
        .pipe(take(1))
        .subscribe( (val: boolean) => {
        if(val) {
          this.cartService.addToCart(this.merchant, product);
        }
      });
    }
  }

  /** retrieves products for the merchant in the url. It also sets target merchant. */
  private fetchMerchantProducts(): void {
    // pull merchant id from route
    this.activatedRoute.paramMap.subscribe( params => {
      const id = params.get('id');
      if(id) {

        const merchantID: number = parseInt(id);
        const token: string = this.userService.getAuthToken();
        if(!isNaN(merchantID) && token) {

          // async http call
          this.productService.fetchProducts(token, merchantID)
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

  /**
   * Sets the merchant from the cache,
   * if merchant not found in cache, it goes to makes http call for the merchant and set it.
   */
  private setMerchant(id: number): void {
    if(id){

      // try to get merchant from cache
      this.merchantService.setMerchantID(id);
      this.merchant = this.merchantService.getMerchantFromCache(id);

      // http call to get merchant from server
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
