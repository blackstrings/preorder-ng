import {Address} from "../address/address";
import {PaymentIssuer} from "./payment-issuer";
import {PaymentType} from "./payment-type";

export class Payment {

  public firstName: string;
  public lastName: string;

  public address: Address;
  public paymentType: PaymentType;
  public paymentIssuer: PaymentIssuer;

  public cvc: number;
  public zip: string;
  public expirationMonth: number;
  public expirationYear: number;

  constructor(){}
}

/** payment examples
 .30
 2.99%

 10% = total charge of $1-100
 5% = total charege of $100-200

 1.23 = inlcudes .30 and 2.99% * 10%
 8.77
 10 * .1 = 1.00
 7.77

 15% = 1 = cust avg# 50
 10% = 2 = cust avg# 50-200
 5% = 3 = cust avg# 200+
 */
