import {Component, ElementRef, OnInit, ViewChild, Input, OnDestroy, AfterViewInit} from '@angular/core';
import {PaymentService} from "../../../services/payment-service/payment.service";
import {StripeCardElement} from '@stripe/stripe-js';
import {Observable, Subject} from "rxjs";
import {take, takeUntil} from "rxjs/operators";
import {PaymentResponseRK} from "../../../models/payment/payment-response-rk";
import {Order} from "../../../models/order/order";
import {Router} from "@angular/router";

/**
 * A view for customer to enter their card payment information.
 * Use the paymentService to listen to when the payment is complete.
 * Checks on init if the order is payable or not base on being paid already or not.
 */
@Component({
  selector: 'app-card-payment-view',
  templateUrl: './card-payment-view.component.html',
  styleUrls: ['./card-payment-view.component.scss']
})
export class CardPaymentViewComponent implements OnInit, AfterViewInit, OnDestroy {

  private stripeCard: StripeCardElement;

  // if static is false, use in ngAfter
  // if static is true, use in ngInit
  // subscribe changes should be used in ngInit
  @ViewChild('cardDomRef', {static: true, read: ElementRef})
  public cardDomElement: ElementRef<HTMLDivElement>;

  @ViewChild('cardErrorDom', {static: true, read: ElementRef})
  public cardErrorDom: ElementRef<HTMLDivElement>;

  @ViewChild('placeOrderBtn', {static: true, read: ElementRef})
  public placeOrderBtn: ElementRef<HTMLButtonElement>;

  // helper flag to ensure everything is valid before allowing user to make purchase, such as order not yet paid
  private enablePaymentProcessing: boolean = false;

  // after placing order, did payment go through and is valid
  public isPaymentSuccess: boolean = true;

  // to display the error message in the view
  public paymentErrorMessage: string = '';

  /** when user places the order */
  private onOrderPlacedProcessing: Subject<boolean> = new Subject<boolean>();
  public onOrderPlacedProcessing$: Observable<boolean> = this.onOrderPlacedProcessing.asObservable();

  @Input()
  public loadedOrder: Order;

  /** option if provided, it will auto route when payment completess */
  @Input()
  public navigateUrlOnPaymentSuccess: string;

  private unSub: Subject<void> = new Subject<void>();

  constructor(private paymentService: PaymentService, private router: Router) {
    console.log('<< CardPaymentView >> Init');
    if(this.navigateUrlOnPaymentSuccess) {
      console.log('<< CardPaymentView >> navigateUrlOnPaymentSuccess is null so next routing will be handled in here');
    } else {
      console.log('<< CardPaymentView >> navigateUrlOnPaymentSuccess was provided, on payment success' +
        ' routing will go to ' + this.navigateUrlOnPaymentSuccess);
    }
  }

  ngOnInit(): void {
    // check if order is passed in
    if(this.loadedOrder) {
      this.checkOrderIsPaid(this.loadedOrder)
        .pipe(takeUntil(this.unSub), take(1))
        .subscribe( (isPaid: boolean) => {
          if(!isPaid) {
            this.setupCard();
            this.enablePaymentProcessing = true;
            console.log('<< CardPaymentView >> Order is not yet paid and ready for payment');
          } else {
            console.error('<< CardPaymentView >> Order seem like it is already paid');
            this.disablePlaceOrderButton(true);
            this.enablePaymentProcessing = false;
          }
      });
    } else {
      console.error('<< CardPaymentView >> init failed, loadedOrder null');
    }

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    this.unSub.next();
  }

  /**
   * when the user is ready to make their payments toward their order
   * If the user disconnects after placing the order, we just have to check our server to find out
   * where they last left off and continue from there.
   */
  public placeOrder(): void {
    if(this.enablePaymentProcessing) {

      this.disablePlaceOrderButton();

      // todo
      // notify the backend the user wants to place the order
      // const validateOrderReadyForPayment: Observable<any> = new Observable<any>(() => {
        // return this.paymentService.setOrderReadyForPayment(this.loadedOrder.orderID, this.loadedOrder.client_token)
        //   .pipe(take(1))
        //   .subscribe((isOkayToProcessPayment) => {
            // once backend is notify, return back and process the payment
      this.onOrderPlacedProcessing.next(true);
      this.processPayment();
      //     });
      // });


    } else {
      console.warn('<< CardPaymentView >> palceOrder failed, enablePaymentProcessing is false due to invalid errors');
    }
  }

  /**
   * Call this only after checking with backend to validate is okay to proceed with payment.
   * There may be cases where the order is already paid for and if so, route to the receipt view.
   * the caller can Subscribe to the paymentService to know when the payment is success or not
   */
  private processPayment(): void {
    this.paymentService.payWithCard(this.stripeCard, this.loadedOrder.client_token)
      .pipe(take(1), takeUntil(this.unSub))
      .subscribe((resp: PaymentResponseRK) => {
          if (resp && !resp.stripeError) {

            // ===============
            // payment Success
            console.dir('<< CardPaymentView >> Payment: ' + resp.message);

            console.warn('<< CardPaymentView >> setup webhook at backend to do payment fullfillment');
            // Note: not recommend to handle payment full fillment on clientside and then passing to remote
            // as user can close browser after submitting payment info
            // so backend should be using a webhook to listen async as soon as stripe acknowledge so is backend
            console.log(resp.paymentIntentId);

            // but for now we'll do a front handling to backend without webhook
            console.warn('todo send payment intent full fillment id to backend to change order status in backend');

            // call to BE to notify payment on frontend went through and pass successfully
            if (this.navigateUrlOnPaymentSuccess) {
              console.log('<< CardPaymentView >> processPayment success, navigateUrl provided, so routing to ' + this.navigateUrlOnPaymentSuccess);
              this.router.navigate([this.navigateUrlOnPaymentSuccess]);
            }

          } else {

            // ==============
            // payment failed
            console.dir('<< CardPaymentView >> Payment failed');
            console.warn('<< CardPaymentView >> Reason: ' + resp.message);
            this.paymentErrorMessage = resp.stripeError.code;
            console.error(this.paymentErrorMessage);
            this.isPaymentSuccess = false;

          }
          // processing is done - notify loading to stop
          this.onOrderPlacedProcessing.next(false);
        },
        (e) => {
          console.error('<< CardPaymentView >> placeOrder error');
          console.error(e);
        });
  }

  /** when the user place order, we disable to prevent unnecessary processing until we hear back from payment service */
  private disablePlaceOrderButton(value: boolean = true): void {
    if(this.placeOrderBtn) {
      (this.placeOrderBtn.nativeElement as HTMLButtonElement).disabled = value;
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
        console.error('<< CardPaymentView >> checkOrderIsPaid failed, order or order client token null');
        subscriber.next(false);
      }

    });
  }

}
