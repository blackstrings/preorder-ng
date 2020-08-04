import { Address } from '../address/address';

export class User {

  public email: string;
  public password: string;
  public password2: string;
  public firstName: string;
  public lastName: string;

  public dateOfBirthM: number;
  public dateOfBirthD: number;
  public dateOfBirthY: number;

  public personalPhone: string;
  public personalEmail: string;

  public last4ssn: number;

  public id: number;
  public addresses: Address[];

  constructor(){
    // empty as of now
  }
}
