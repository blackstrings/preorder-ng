import { Merchant } from '../merchant/merchant';
import {User} from "../user/user";
import {Address} from "../address/address";

/** holds sensitive info about the buisness for registering */
export class MerchantBusiness {

    public merchant: Merchant;
    public businessName: string;
    public businessType: string;
    public description: string;
    public agreedToTerms: boolean;

    public user: User;

    public businessTax: string;
    public merchantCategory: number;

    private last4ssn: number;

    private businessEmail: string;
    public businessPhone: string;


    constructor() {
      this.merchant = new Merchant();
      this.merchant.address = new Address();
      this.user = new User();
    }

    public setMerchant(val: Merchant): void {
      this.merchant = val;
    }

    public getMerchant(): Merchant {
      return this.merchant;
    }

    public setBusinessName(val: string): void {
      this.businessName = val;
    }

    public getBusinessName(): string {
      return this.businessName;
    }

    public setBusinessType(val: string): void {
      this.businessType = val;
    }

    public getBusinessType(): string {
      return this.businessType;
    }

    public setBusinessDescription(val: string): void {
      this.description = val;
    }

    public getBusinessDescription(): string {
      return this.description;
    }

    public setBusinessTax(val: string): void {
      this.businessTax = val;
    }

    public getBusinessTax(): string {
      return this.businessTax;
    }

    public setLast4SSN(val: number): void {
      this.last4ssn = val;
    }

    public getLast4SSN(): number {
      return this.last4ssn;
    }

    public setBusinessEmail(val: string): void {
      this.businessEmail = val;
    }

    public getBusinessEmail(): string {
      return this.businessEmail;
    }

    public setPersonalEmail(val: string): void {
      this.user.personalEmail = val;
    }
    public getPersonalEmail(): string {
      return this.user.personalEmail;
    }

    public setBusinessPhone(val: string): void {
      this.businessPhone = val;
    }

    public getBusinessPhone(): string {
      return this.businessPhone;
    }

    public setPersonalPhone(val: string): void {
      this.user.personalPhone = val;
    }

    public getPersonalPhone(): string {
      return this.user.personalPhone
    }

    public setMerchantCategory(val: number): void {
      this.merchantCategory = val;
    }

    public getMerchantCategory(): number {
      return this.merchantCategory;
    }

    public setAddress1(val: string): void {
      this.merchant.address.address1 = val;
    }

    public getAddress1(): string {
      return this.merchant.address.address1;
    }

    public setAddress2(val: string): void {
      this.merchant.address.address2 = val;
    }

    public getAddress2(): string {
      return this.merchant.address.address2;
    }

    public setFirstName(val: string): void {
      this.user.firstName = val;
    }

    public getFirstName(): string {
      return this.user.firstName;
    }

    public setLastName(val: string): void {
      this.user.lastName = val;
    }

    public getLastName(): string {
      return this.user.lastName;
    }

    public setDOBMonth(val: number): void {
      this.user.dateOfBirthM = val;
    }
    public getDOBMonth(): number {
      return this.user.dateOfBirthM;
    }

    public setDOBDay(val: number): void {
      this.user.dateOfBirthD = val;
    }

    public getDOBDay(): number {
      return this.user.dateOfBirthD;
    }

    public setDOBYear(val: number): void {
      this.user.dateOfBirthY = val;
    }

    public getDOBYear(): number {
      return this.user.dateOfBirthY;
    }

    public setAgreedToTerms(val: boolean): void {
      this.agreedToTerms = val;
    }

    public getAgreedToTerms(): boolean {
      return this.agreedToTerms;
    }


}
