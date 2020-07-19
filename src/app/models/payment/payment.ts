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
