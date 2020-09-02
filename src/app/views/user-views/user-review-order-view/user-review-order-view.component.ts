import { YesNoModalViewComponent } from './../../common-views/modals/yes-no-modal-view/yes-no-modal-view.component';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddToOrderValidatorContainer } from './../../../validators/add-to-order-validator-container';
import { ModalConfig } from './../../common-views/modals/modal-config';
import { ProductAddModalViewComponent } from './../../common-views/modals/product-add-view/product-add-modal-view.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/models/product/product';
import { ProductService } from './../../../services/product-service/product.service';
import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart-service/cart.service";
import {Merchant} from "../../../models/merchant/merchant";
import {Order} from "../../../models/order/order";
import {User} from "../../../models/user/user";
import {UserService} from "../../../services/user-service/user.service";
import {OrderValidator} from "../../../validators/order-validator/order-validator";
import {ViewRoutes} from "../../view-routes";
import {Router} from "@angular/router";
import {PaymentService} from "../../../services/payment-service/payment.service";
import {take} from "rxjs/operators";

/** this view allows user to review their orders or items before going to checkout */
@Component({
  selector: 'app-user-review-order-view',
  templateUrl: './user-review-order-view.component.html',
  styleUrls: ['./user-review-order-view.component.scss']
})
export class UserReviewOrderViewComponent implements OnInit {

  ViewRoutes = ViewRoutes;
  public order: Order;
  public merchant: Merchant;
  public merchantName: string;
  public merchantID: number;
  public user: User;

  public subTotal: number;
  public taxAmount: number;
  public orderTotal: number;

  public productNameMaxCharacter: number = 30;
  public checkoutError: boolean = false;

  constructor(private cartService: CartService, private userService: UserService, private router: Router,
              private paymentService: PaymentService, private productService: ProductService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.setupViewData();
  }

  /** creates the order into the record for the current user */
  public checkout(): void {
    if(this.validatePlacingOrder()){
      this.cartService.checkout(this.userService.getAuthToken())
        .subscribe( (order: Order) => {
            if(order) {
              // need to send the order ID from the returned order post in order to go to checkout
              // for now just store the order id in cookie session
              this.router.navigate([ViewRoutes.USER_ORDER_CHECKOUT, order.orderID]);
            } else {
              this.checkoutError = true;
            }
          },
          e => {
            console.error(e);
          }
        );
    } else {
      console.debug('<< UserReviewOrderView >> placeOrder failed, validation failed');
    }
  }

  /**
   * returns true if all validations are success for order submission to backend
   * - order
   * - products
   * - payment
   * - pickup times
   */
  private validatePlacingOrder(): boolean {
    let result: boolean = true;
    // order req
    if(result && !this.order) {result = false; }
    // products req
    if(result && !this.order.products) {result = false; }
    if(result && !OrderValidator.validate(this.order)) {result = false; }
    // todo payment required
    // if(result && this.order) {result = false; }
    return result;
  }

  public orderHasItems(): boolean {
    return this.order && this.order.products && this.order.products.length > 0;
  }

  /** required data that should be available on page init */
  private setupViewData(): void {
    this.order = this.order = this.cartService.getPendingOrder();
    if(this.order && this.order.products) {
      this.merchant = this.order.merchant;
      this.merchantName = this.merchant && this.merchant.name ? this.merchant.name : '';
      this.merchantID = this.merchant && this.merchant.id ? this.merchant.id : 0;
      this.user = this.order.user;

      this.displayPricing();

    } else {
      console.error('<< UserReviewOrderView >> setOrder failed, order null');
    }
  }

  /**
   * Shoudl send products to backend to get calculated.
   * We do not handle tax and total price calculation in front end.
   */
  private displayPricing(): void {
    // todo make fetch to get pricing from backend
    this.subTotal = this.order.getTotalPrice();
    this.taxAmount = this.subTotal * 0.055; // hard coded tax
    this.orderTotal = this.subTotal + this.taxAmount;
  }

  public showModalProductView(id: number): void {
    if(id) {
      const product: Product = this.productService.getProductFromCache(id);
      if(product) {

        // set config to not allow keyboard esc or click on backdrop to close
        const modalRef = this.modalService.open(ProductAddModalViewComponent, ModalConfig.requiresClickAndScrollable());
        if(modalRef.componentInstance instanceof ProductAddModalViewComponent) {
          modalRef.componentInstance.init(product);
          modalRef.componentInstance.onClose
            .pipe(take(1))
            .subscribe( (val: Product) => {
              if(val) {
                this.addToOrder(val);
              }
            });
        }

      } else {
        console.error('<< UserCreateOrderView >> showModalProductView failed, product null');
      }
    }
  }

  private addToOrder(product): void {
    if(this.merchant && product) {
      const container: AddToOrderValidatorContainer = new AddToOrderValidatorContainer(product, this.merchant);
      // if the product is of a different merchant,
      // we need to let the user know their previous order will have to be discarded
      if(this.cartService.addToOrderValidate(container)) {
        this.cartService.addToOrder(container);
      } else {
        console.warn('<< UserCreateOrderView >> addToCart interrupted, attempting to add new products from new store');
        this.showModalOrderOverrideWarning(container);
      }
    } else {
      console.error('<< UserCreateOrderView >> addToCart failed, product null or merchant was not set properly');
    }
  }

  /** show warning confirmation if user wants to start a new order overwriting current order */
  private showModalOrderOverrideWarning(container: AddToOrderValidatorContainer): void {
    // set modal config to not allow keyboard esc or click on backdrop to close
    const modalConfigs: NgbModalOptions = {backdrop: 'static', keyboard: false};
    // dynamically create the modal
    const modalRef = this.modalService.open(YesNoModalViewComponent, modalConfigs);
    // cast the modal to the correct type for easier property accessing
    if(modalRef.componentInstance instanceof YesNoModalViewComponent) {
      const header: string = 'Warning'
      let body: string = 'Your current order belongs to a different merchant. ';
      body += 'Discard all items in current order and start a new order?';
      modalRef.componentInstance.init(header, body);
      modalRef.componentInstance.onClose
        .pipe(take(1))
        .subscribe( (userClickYes: boolean) => {
          if(userClickYes) {
            this.cartService.startNewOrder(container);
            this.addToOrder(container.product);
          }
        });
    }
  }

}
