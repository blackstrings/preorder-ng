import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../../services/cart-service/cart.service";
import {Order} from "../../../models/order/order";
import {UserService} from "../../../services/user-service/user.service";
import {PaymentService} from "../../../services/payment-service/payment.service";
import {StripeCardElement} from "@stripe/stripe-js";
import {FormControl, FormGroup} from "@angular/forms";
import {take} from "rxjs/operators";
import {PaymentResponseRK} from "../../../models/payment/payment-response-rk";
import {Observable} from "rxjs";
import {Merchant} from "../../../models/merchant/merchant";

/**
 * Mainly this page handles payment for the order or items in the order/cart.
 * User cannot edit the order anymore and must start a new order or start over if they wish to edit the order.
 */
@Component({
  selector: 'app-user-order-checkout-view',
  templateUrl: './user-order-checkout-view.component.html',
  styleUrls: ['./user-order-checkout-view.component.scss']
})
export class UserOrderCheckoutViewComponent implements OnInit {

  // the customer's order id to be displayed on the page, doesn't get populated until data comes back
  public order: Order = new Order();
  public merchant: Merchant;

  // if static is false, use in ngAfter
  // if static is true, use in ngInit
  // subscribe changes should be used in ngInit
  @ViewChild('cardDomRef', {static: true, read: ElementRef})
  public cardDomElement: ElementRef<HTMLDivElement>;

  @ViewChild('placeOrderBtn', {static: true, read: ElementRef})
  public placeOrderBtn: ElementRef<HTMLButtonElement>;

  @ViewChild('cardErrorDom', {static: true, read: ElementRef})
  public cardErrorDom: ElementRef<HTMLDivElement>;


  // during init - are we able to load the order from backend
  public isScreenInitError: boolean = false;

  // the state of the screen loading
  public isScreenLoading: boolean = true;

  // after placing order, did payment go through and is valid
  public isPaymentSuccess: boolean = true;

  // to display the error message in the view
  public paymentErrorMessage: string = '';

  // stripe card generated from the payment service, required for payment to process through
  private stripeCard: StripeCardElement

  public readonly productNameMaxCharacter: number = 20;

  public formPayment: FormGroup;
  public cardFC: FormControl;

  constructor(private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private userService: UserService,
              private paymentService: PaymentService,
              private cd: ChangeDetectorRef){

  }

  public ngOnInit(): void {
    this.setupView();
    this.setupCard();
    this.setupForm();
  }

  private setupForm(): void {
    this.formPayment = new FormGroup({});
  }

  /** pulls the orderID from the url if available */
  private setupView(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      // get order from url params
      let orderId: string = params.get('orderId');
      if(!orderId) {
        // should the user not come directly from the review orders page
        // verify if the orderID can be retrieved from the cartService
        orderId = this.cartService.getSubmittedOrderID();
      }

      // after getting the order id, load the order from the backend
      this.loadOrder(orderId);

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

        this.cartService.getCheckedOutOrder(orderID, token)
          .subscribe( (resp: Order) => {
              if(resp instanceof Order) {
                this.order = resp;
                this.merchant = this.order.merchant;

                this.checkOrderIsPaid(this.order).pipe(take(1)).subscribe((isOrderPaid: boolean) => {
                  if(isOrderPaid && !this.order.merchant) {
                    // the order has been paid for
                    this.isScreenInitError = true;
                  } else {
                    console.dir("<< UserOrderCheckOutView >> order not yet paid, okay to display");
                  }
                });

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

  /** setup the stripe card and dom element into the view */
  public setupCard(): void {

    // start off the form place order button as disabled
    if(this.placeOrderBtn) {
      this.placeOrderBtn.nativeElement.disabled = true;
    }

    // get card from payment service
    this.stripeCard = this.paymentService.createCard();
    try {
      if(this.stripeCard) {
        if(this.cardDomElement) {

          // insert stripe card element into the dom container
          // this is what displays the card form
          this.stripeCard.mount(this.cardDomElement.nativeElement);

          // detect and validate card on every card inputs
          this.stripeCard.on('change', (event) => {
            (this.placeOrderBtn.nativeElement as HTMLButtonElement).disabled = event.error || event.empty ? true : false;
            this.cardErrorDom.nativeElement.textContent = event.error ? event.error.message : '';
          });

          // test auto fill test card
          // stripeCard.update({cardNumber: '5513 8400 0382 1111'})

        } else {
          console.error('<< UserOrderCheckoutView >> setupCard failed, cardElementDom null');
        }
      } else {
        console.error('<< UserOrderCheckoutView >> setupCard failed, stripeCard null');
      }
    } catch(e) {
      console.error('<< UserOrderCheckoutView >> setupCard failed, error occurred');
      console.error(e);
    }
  }

  /**
   * Ensure customer isn't paying for an order that is already paid or invalid order.
   * This relies on the returned checked out order client token.
   * @param order
   */
  private checkOrderIsPaid(order: Order): Observable<boolean> {
    return new Observable<boolean>(subscriber =>  {

      if(order && order.client_token) {
        this.paymentService.checkOrderIsPaid(order.client_token).pipe(take(1)).subscribe((isOrderAlreadyPaid) => {
            // show error if order is already paid
            if(isOrderAlreadyPaid) {
              subscriber.next(true);
            } else {
              subscriber.next(false);
            }
          });
      } else {
        console.error('<< UserOrderCheckOutView >> checkOrderIsPaid failed, order or order client token null');
        subscriber.next(false);
      }

    });
  }

  /** when the user is ready to make their payments toward their order */
  public placeOrder(): void {
    this.disablePlaceOrderButton();

    this.checkOrderIsPaid(this.order).pipe(take(1)).subscribe(result => {

      if(!result) {
        this.paymentService.payWithCard(this.stripeCard, this.order.client_token)
          .pipe(take(1))
          .subscribe( (resp: PaymentResponseRK) => {
            if(resp && !resp.stripeError) {

              // ===============
              // payment Success
              console.dir('<< UserOrderCheckOutView >> Payment: ' + resp.message);

              console.warn('<< UserOrderCheckOutView >> setup webhook at backend to do payment fullfillment');
              // Note: not recommend to handle payment full fillment on clientside and then passing to remote
              // as user can close browser after submitting payment info
              // so backend should be using a webhook to listen async as soon as stripe acknowledge so is backend
              console.log(resp.paymentIntentId);

              // but for now we'll do a front handling to backend without webhook
              console.warn('todo send payment intent full fillment id to backend');

            } else {

              // ==============
              // payment failed
              console.dir('<< UserOrderCheckOutView >> Payment failed');
              console.warn('<< UserOrderCheckOutView >> Reason: ' + resp.message);
              this.paymentErrorMessage = resp.stripeError.code;
              console.error(this.paymentErrorMessage);
              this.isPaymentSuccess = false;
            }
          });
      } else {
        console.warn('<< UserOrderCheckoutView >> placeOrder failed, order already paid');
      }

    }); // end of check order is paid

  }

  /** when the user place order, we disable to prevent unnecessary processing until we hear back from payment service */
  private disablePlaceOrderButton(value: boolean = true): void {
    if(this.placeOrderBtn) {
      (this.placeOrderBtn.nativeElement as HTMLButtonElement).disabled = value;
    }
  }

}
