import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../models/merchant/merchant";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../../../models/product/product";
import {UserService} from "../../../services/user-service/user.service";
import {ProductService} from "../../../services/product-service/product.service";
import {MerchantService} from "../../../services/merchant-service/merchant.service";
import {ViewRoutes} from "../../view-routes";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductAddModalViewComponent} from "../../common-views/product-add-view/product-add-modal-view.component";
import {CartService} from '../../../services/cart-service/cart.service';

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


  ngOnInit(): void {
    // use observable - better approach to grab params from url
    this.fetchMerchantProducts()
  }

  /** opens up the product in a separate modal view */
  public viewProduct(id: number): void {
    if(id) {
      const product: Product = this.productService.getProductFromCache(id);
      if(product) {

        const modalRef = this.modalService.open(ProductAddModalViewComponent, {scrollable: true});
        // pass in the product to the component modal
        modalRef.componentInstance.product = product;
		    // listen to modal on close
        (modalRef.componentInstance as ProductAddModalViewComponent).onClose.subscribe( (val: Product) => {
        	if(val) {
        		this.addToCart(val);
			    }
        });

      } else {
        console.error('<< UserCreateOrderView >> openProduct failed, product null');
      }
    }
  }

  private addToCart(product): void {
  	if(this.merchant && product) {
  		// if the product is of a different merchant,
		// we need to let the user know their previous order will have to be discarded
  		if(this.cartService.canAddProductToOrder(product)) {
			this.cartService.addToCart(this.merchant, product);
		} else {
  			console.warn('<< UserCreateOrderView >> addToCart failed, attempting to add new products from new store');
			// todo add yesNo modal
			const modalRef = this.modalService.open(ProductAddModalViewComponent);
			const header: string = 'Discard all orders from previous merchant and start new order?';
			modalRef.componentInstance.product = product; // change this to a header string instead
			(modalRef.componentInstance as ProductAddModalViewComponent).onClose.subscribe( (val: Product) => {
				if(val) {
					this.cartService.addToCart(this.merchant, product);
				}
			});
		}
	}
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
   * Sets the merchant from the cache, it not avaiable
   * makes http call to set the merchant.
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
