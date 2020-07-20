import { Address } from '../address/address';

export class User {

  public email: string;
  public password: string;
  public password2: string;
  public firstName: string;
  public lastName: string;
  public id: number;
  public addresses: Address[];

  constructor(){
    // empty as of now
  }
}
