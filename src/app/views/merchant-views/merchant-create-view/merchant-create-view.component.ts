import { MerchantBusiness } from './../../../models/merchantBusiness/merchant-business';
import { Address } from './../../../models/address/address';
import { UserService } from './../../../services/user-service/user.service';
import { MerchantService } from './../../../services/merchant-service/merchant.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user/user";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {take, takeUntil} from "rxjs/operators";
import {ModalConfig} from "../../common-views/modals/modal-config";
import { OkayModalViewComponent } from '../../common-views/modals/okay-modal-view/okay-modal-view.component';
import {TermsAndCondition} from "./TermsAndCondition";
import { Merchant } from '../../../models/merchant/merchant';

@Component({
  selector: 'app-create-merchant-view',
  templateUrl: './merchant-create-view.component.html',
  styleUrls: ['./merchant-create-view.component.scss']
})
export class MerchantCreateViewComponent implements OnInit, AfterViewInit {

  public showFormIncomplete: boolean = false;
  public showServerError: boolean = false;

  // instantiate the merchant right away
  //public merchant: Merchant = MerchantCreateViewComponent.populateMerchant();
  public merchantBusiness: MerchantBusiness = MerchantCreateViewComponent.populateMerchantBusiness();

  // the form on this page
  public mainForm: FormGroup;

  private readonly termsCondition: string = '';

  // for unsubscription when component is destroyed
  private _unSub: Subject<boolean> = new Subject();  // subjects vs replay won't replay when reinitialize
  private unSub: Observable<boolean> = this._unSub.asObservable();

  constructor(private modalService: NgbModal, private merchantService: MerchantService, private userService: UserService) {

  }

  /** creates a merchant object */
  public static populateMerchantBusiness(): MerchantBusiness {
    const merchantBusiness: MerchantBusiness = new MerchantBusiness();
    merchantBusiness.merchant = new Merchant();
    merchantBusiness.merchant.user = new User();
    merchantBusiness.merchant.address = new Address();
    merchantBusiness.merchant.address2 = new Address();
    return merchantBusiness;
  }

  ngOnInit(): void {

    // create the form group
    // you can access the formControl by using formControlName in the html
    this.mainForm = new FormGroup({
      business: this.businessNameFC,
      businessTax: this.businessTaxFC,
      businessType: this.businessTypeFC,
      merchantCategory: this.merchantCategoryFC,
      firstName: this.firstNameFC,
      lastName: this.lastNameFC,
      dateOfBirthM: this.dateOfBirthMFC,
      dateOfBirthD: this.dateOfBirthDFC,
      dateOfBirthY: this.dateOfBirthYFC,
      last4ssn: this.last4ssnFC,
      address1: this.address1FC,
      address2: this.address2FC,
      description: this.descriptionFC,
      agreedToTerms: this.agreedToTermsFC
    });

  }

  ngAfterViewInit(): void {

    // wire the form inputs so on every change it will update the values in the model
    this.businessNameFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.businessName = val;
    });

    this.businessTaxFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.businessTax = val;
    });

    this.businessTypeFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.businessType = val;
    });

    this.merchantCategoryFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      this.merchantBusiness.merchantCategory = val;
    });

    this.firstNameFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.merchant.user.firstName = val;
    });

    this.lastNameFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.merchant.user.lastName = val;
    });

    this.dateOfBirthMFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      this.merchantBusiness.merchant.user.dateOfBirthM = val;
    });

    this.dateOfBirthDFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      this.merchantBusiness.merchant.user.dateOfBirthD = val;
    });

    this.dateOfBirthYFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      this.merchantBusiness.merchant.user.dateOfBirthY = val;
    });

    this.last4ssnFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      this.merchantBusiness.merchant.user.last4ssn = val;
    });

    this.address1FC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.merchant.address.address1 = val;
    });

    this.address2FC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.merchant.address2.address2 = val;
    });

    this.businessPhoneFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.businessPhone = val;
    });

    this.personalPhoneFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.merchant.user.personalPhone = val;
    });

    this.businessEmailFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.businessEmail = val;
    });

    this.personalEmailFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.merchant.user.personalEmail = val;
    });

    this.descriptionFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.description = val;
    });

    this.agreedToTermsFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: boolean) => {
      this.merchantBusiness.merchant.agreedToTerms = val;
    });

  }

  /** add more control to the form */
  public addFormControl(name: string, control: FormControl): void {
    if(this.mainForm && name && control) {
      this.mainForm.addControl(name, control);
    }
  }

  public businessNameFC = new FormControl(
    this.merchantBusiness.businessName, [
      Validators.required
    ]);

  public businessTaxFC = new FormControl(
    this.merchantBusiness.businessTax, [
      Validators.required
    ]);

  public businessTypeFC = new FormControl(
    this.merchantBusiness.businessType, [
      Validators.required
    ]);

  public merchantCategoryFC = new FormControl(
    this.merchantBusiness.merchantCategory, [
      Validators.required
    ]);

  public firstNameFC = new FormControl(
    this.merchantBusiness.merchant.user.firstName, [
      Validators.required
    ]);

  public lastNameFC = new FormControl(
    this.merchantBusiness.merchant.user.lastName, [
      Validators.required
    ]);

  public dateOfBirthMFC = new FormControl(
    this.merchantBusiness.merchant.user.dateOfBirthM, [
      Validators.required
    ]);

  public dateOfBirthDFC = new FormControl(
    this.merchantBusiness.merchant.user.dateOfBirthM, [
      Validators.required
    ]);

  public dateOfBirthYFC = new FormControl(
    this.merchantBusiness.merchant.user.dateOfBirthM, [
      Validators.required
    ]);

  public last4ssnFC = new FormControl(
    this.merchantBusiness.merchant.user.last4ssn, [
      Validators.required
    ]);

  public address1FC = new FormControl(
    this.merchantBusiness.merchant.address.address1, [
      Validators.required
    ]);

  public address2FC = new FormControl(
    this.merchantBusiness.merchant.address2.address2, [
      Validators.required
    ]);

  public businessPhoneFC = new FormControl(
    this.merchantBusiness.businessPhone, [
      Validators.required
    ]);
  
  public personalPhoneFC = new FormControl(
    this.merchantBusiness.merchant.user.personalPhone, [
      Validators.required
    ]);

  public businessEmailFC = new FormControl(
    this.merchantBusiness.businessEmail, [
      Validators.required
    ]);

  public personalEmailFC = new FormControl(
    this.merchantBusiness.merchant.user.personalEmail, [
      Validators.required
    ]);

  public descriptionFC = new FormControl(
    this.merchantBusiness.description, [
      Validators.required
    ]);

  public agreedToTermsFC = new FormControl(
    this.merchantBusiness.merchant.agreedToTerms, [
      Validators.required, Validators.requiredTrue
    ]);

  /** send the form to backend */
  public registerAccount(): void {

    if(this.validateForm()){
      // do something
      this.merchantService.createMerchant(this.userService.getAuthToken(), this.merchantBusiness).subscribe((resp) => {
        console.log(resp);
      });
    }
  }

  public openTermsAndConditionModal(): void {
    // set config to not allow keyboard esc or click on backdrop to close
    const modalRef = this.modalService.open(OkayModalViewComponent, ModalConfig.anyKeyToCloseAndScrollable());
    if(modalRef.componentInstance instanceof OkayModalViewComponent) {
      modalRef.componentInstance.init('Terms and Conditions', TermsAndCondition);
      modalRef.componentInstance.onClose.pipe(take(1));
    }
  }

  // final validation, to chekc if they fill out all the fields(soft checks)
  public validateForm(): boolean{
    // check if merchant object exists
    if(this.merchantBusiness){
      // check to make sure all fields are not empty
      if(this.merchantBusiness.businessName &&
        this.merchantBusiness.businessTax &&
        this.merchantBusiness.businessType &&
        this.merchantBusiness.merchantCategory &&
        this.merchantBusiness.description &&
        this.merchantBusiness.merchant.user.firstName &&
        this.merchantBusiness.merchant.user.lastName &&
        this.merchantBusiness.merchant.user.dateOfBirthM &&
        this.merchantBusiness.merchant.user.dateOfBirthD &&
        this.merchantBusiness.merchant.user.dateOfBirthY &&
        this.merchantBusiness.merchant.user.last4ssn &&
        this.merchantBusiness.merchant.address.address1 &&
        this.merchantBusiness.merchant.address2.address2 &&
        this.merchantBusiness.businessPhone &&
        this.merchantBusiness.merchant.user.personalPhone &&
        this.merchantBusiness.businessEmail &&
        this.merchantBusiness.merchant.user.personalEmail &&
        this.merchantBusiness.merchant.agreedToTerms){
          console.log("Merchant field valid");
          return true;
        }
    }

    console.log("Merchant field not valid");
    return false;
  }

}
