import { Injectable } from '@angular/core';
import {loadStripe, Stripe} from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private stripe: Stripe;

  constructor() {
    loadStripe('pk_test_CGxkic4y63Qu2gnsXsbniZGh').then( s => {
      this.stripe = s;
    });
  }
}
