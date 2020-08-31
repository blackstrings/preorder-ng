import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../../services/cart-service/cart.service";
import {Order} from "../../../models/order/order";
import {UserService} from "../../../services/user-service/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Observable, Subject} from "rxjs";
import {ViewRoutes} from "../../view-routes";
import {HttpErrorContainer} from "../../../apis/http-wrapper/http-error-container";
import {CardPaymentViewComponent} from "../../common-views/card-payment-view/card-payment-view.component";

/**
 * Mainly this page handles payment for the order or items in the order/cart.
 * User cannot edit the order anymore and must start a new order or start over if they wish to edit the order.
 */
@Component({
  selector: 'app-user-order-checkout-view',
  templateUrl: './user-order-checkout-view.component.html',
  styleUrls: ['./user-order-checkout-view.component.scss']
})
export class UserOrderCheckoutViewComponent implements OnInit, OnDestroy {

  // the customer's order id to be displayed on the page, doesn't get populated until data comes back
  // this is the main observable that needs to be completed to show the rest of the view
  public $order: Observable<Order | HttpErrorContainer>;

  // if static is false, use in ngAfter
  // if static is true, use in ngInit
  // subscribe changes should be used in ngInit
  @ViewChild('cardDomRef', {static: true, read: ElementRef})
  public cardDomElement: ElementRef<HTMLDivElement>;

  @ViewChild('placeOrderBtn', {static: true, read: ElementRef})
  public placeOrderBtn: ElementRef<HTMLButtonElement>;

  @ViewChild('cardErrorDom', {static: true, read: ElementRef})
  public cardErrorDom: ElementRef<HTMLDivElement>;

  @ViewChild('CardPaymentViewComponentChild', {static: false})
  public child: CardPaymentViewComponent;

  // during init - are we able to load the order from backend
  public isScreenInitError: boolean = false;

  // the state of the screen loading
  public isScreenLoading: boolean = true;

  // to unsub from subscriptions when this component dies
  private unSub: Subject<void> = new Subject<void>();

  public readonly productNameMaxCharacter: number = 20;
  public navigateUrlOnPaymentSuccess: string;

  public formPayment: FormGroup;
  public cardFC: FormControl;

  constructor(private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private userService: UserService)
  {
    console.log('<< UserOrderCheckoutView >> Init');
  }

  public ngOnInit(): void {
    this.setupView();
    this.setupForm();
  }

  ngOnDestroy() {
    this.unSub.next();
  }

  private setupForm(): void {
    this.formPayment = new FormGroup({});
  }

  /** pulls the orderID from the url if available */
  private setupView(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      // get orderId to load from url params
      let orderId: string = params.get('orderId');
      if(!orderId) {
        console.warn('<< UserOrderCheckoutView >> no orderId passed in, attempting to grab from cartService');
        // should the user not come directly from the review orders page
        // verify if the orderID can be retrieved from the cartService
        orderId = this.cartService.getSubmittedOrderID();
        if(!orderId) {
          console.error('<< UserOrderCheckoutView >> setupView failed, no orderId found');
        }
      }

      // after getting the order id, load the order from the backend
      if(orderId) {
        this.loadOrder(orderId);
      } else {
        this.isScreenInitError = true;
        this.isScreenLoading = false;
      }

    });

  }

  /**
   * load and display the order based on the orderID provided from the backend.
   * The payment token will be within the order.
   */
  private loadOrder(orderID: string): void {
    if(orderID) {
      const token: string = this.userService.getAuthToken();
      if(token) {

        // by referencing the observable, we can use the async pipe in the html to wait for the data
        this.$order = this.cartService.getCheckedOutOrder(orderID, token);
        this.$order
          .subscribe( (resp: Order) => {
              if(resp instanceof Order) {

                // to pass into orderPurchaseView and the goto url when payment is made placed
                this.navigateUrlOnPaymentSuccess = ViewRoutes.USER_ORDER_HISTORY + '/' + resp.orderID;

                if(resp.merchant) {
                  console.dir("<< UserOrderCheckOutView >> loadOrder success, no issues found");
                } else {
                  this.isScreenInitError = true;
                  console.dir("<< UserOrderCheckOutView >> loadOrder failed, merchant is null");
                }

              } else {
                console.error('<< UserOrderCheckoutView >> loadOrder failed, response not instanceof Order');
                this.isScreenInitError = true;
              }

              // loading complete
              this.isScreenLoading = false;

            },
            (e) => {
              console.error('<< UserOrderCheckoutView >> loadOrder failed, network error');
              console.error(e);
              this.isScreenInitError = true;
              this.isScreenLoading = false;
            });

      } else {
        console.error('<< UserOrderCheckoutView >> loadOrder failed, token null');
      }

    } else {
      console.error('<< UserOrderCheckoutView >> loadOrder failed, orderID null');
    }
  }


}
