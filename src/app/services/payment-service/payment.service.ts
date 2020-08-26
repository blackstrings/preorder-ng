import {Injectable} from '@angular/core';
import {loadStripe, Stripe, StripeCardElement} from '@stripe/stripe-js';
import {Observable, of} from "rxjs";
import {PaymentResponseRK} from "../../models/payment/payment-response-rk";

/**
 * In order for stripe front end to work with backend, you need your stripe secret key put in the .bashrc file.
 * Make sure this service is required early in the app so the methods calling to stripe won't run into race condition.
 * Calling methods at the same time loading this service will run into race condition.
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private stripe: Stripe;

  constructor() {
    this.loadStripe();
  }

  /**
   * When you import loadStripe it will auto load the stripe script you common see if using js vanilla imports.
   * For security reasons, angular does not allow script imports directly in the html files as it will ignore.
   */
  private loadStripe(): void {
    loadStripe('pk_test_CGxkic4y63Qu2gnsXsbniZGh').then( (s: Stripe) => {
      this.stripe = s;
    });
  }

  /**
   * when the user has entered their card payment. By default this is set to card type payment
   * @param card the stripe card
   * @param clientSecret aka the client_token provided from the backend when you recall an order ready to make payment.
   */
  public payWithCard(card: StripeCardElement, clientSecret: string): Observable<PaymentResponseRK> {
    return new Observable<PaymentResponseRK>( subscriber => {
      if(this.stripe) {

        // Calls stripe.confirmCardPayment
        // If the card requires authentication Stripe shows a pop-up modal to
        // prompt the user to enter authentication details without leaving your page.

        // show loading icon?
        // loading(true);

        this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card
          }
        }).then(function(result) {

          if (result.error) {

            // Show error to customer
            // it could be the clientSecret has already been paid for
            // paymentIntent is inside the stripeError
            const resp: PaymentResponseRK = new PaymentResponseRK()
              .setStatus(false)
              .setMessage(result.error.payment_intent.status)
              .setStripeError(result.error);

            subscriber.next(resp);
            subscriber.complete();

          } else {

            // The payment to stripe succeeded!
            // if there is no error, there is a paymentIntent
            const resp: PaymentResponseRK = new PaymentResponseRK()
              .setStatus(true)
              .setMessage(result.paymentIntent.status)
              .setPaymentIntentId(result.paymentIntent.id);

            subscriber.next(resp);
            subscriber.complete();

          }
        });

      } else {
        console.error('<< PaymentService >> payWithCard failed, stripe null');
        const resp: PaymentResponseRK = new PaymentResponseRK()
          .setStatus(false);
        subscriber.next(resp);
        subscriber.complete();
      }

    });

  }

  public checkOrderIsPaid(orderClientToken: string): Observable<boolean> {

    return new Observable<boolean>((subscriber) => {

      this.stripe.retrievePaymentIntent(orderClientToken).then(function(response) {
        let status: string;
        if(response && response.paymentIntent) {
          status = response.paymentIntent.status;
        }
        if (status === 'succeeded') {
          // Handle successful payment here
          subscriber.next(true);
          subscriber.complete();

        } else if(status === 'requires_payment_method') {
          // Handle unpaid, processing, or canceled payments and API errors here
          subscriber.next(false);
          subscriber.complete();

        } else {
          // Handle unsuccessful, processing, or canceled payments and API errors here
          subscriber.next(false);
          subscriber.complete();
        }
      });

    });
  }

  /**
   * Returns a stripe card configured dom element.
   * Note: Stripe can return many other card format and bank forms.
   */
  public createCard(divContainer?: HTMLDivElement): StripeCardElement {
    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    // var style = {
    //   base: {
    //     color: "#32325d",
    //   }
    // };

    // Create an instance of the card Element.
    const elements = this.stripe.elements();

    if(elements){
      const card: StripeCardElement = elements.create("card", {style: style});

      // if a dom container was provided, set the stripe card dom element into it, else call mount at a later time
      if(divContainer) {
        card.mount(divContainer);
      }
      return card;
    }
    return null;

  }
}
