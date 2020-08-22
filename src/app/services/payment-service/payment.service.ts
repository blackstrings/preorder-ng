import {Injectable} from '@angular/core';
import {loadStripe, Stripe, StripeCardElement} from '@stripe/stripe-js';
import {Observable, of} from "rxjs";

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
    loadStripe('pk_test_CGxkic4y63Qu2gnsXsbniZGh').then( (s: Stripe) => {
      this.stripe = s;
    });
  }

  public placeOrder(): Observable<boolean> {
    if(this.stripe) {


    } else {
      return of(false);
    }
  }

  public createCard(): StripeCardElement {
    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    // const style = {
    //   base: {
    //     color: '#32325d',
    //     fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //     fontSmoothing: 'antialiased',
    //     fontSize: '16px',
    //     '::placeholder': {
    //       color: '#aab7c4'
    //     }
    //   },
    //   invalid: {
    //     color: '#fa755a',
    //     iconColor: '#fa755a'
    //   }
    // };

    // Create an instance of the card Element.
    const elements = this.stripe.elements();

    var style = {
      base: {
        color: "#32325d",
      }
    };

    let card;

    if(elements){
      const card: StripeCardElement = elements.create("card", {style: style});
      // Add an instance of the card Element into the `card-element` <div>.
      return card;
    }
    return null;

  }
}
