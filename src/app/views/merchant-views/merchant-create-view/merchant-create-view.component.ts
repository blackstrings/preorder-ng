import { MerchantBusiness } from './../../../models/merchantBusiness/merchant-business';
import { UserService } from './../../../services/user-service/user.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {take, takeUntil} from "rxjs/operators";
import {ModalConfig} from "../../common-views/modals/modal-config";
import { OkayModalViewComponent } from '../../common-views/modals/okay-modal-view/okay-modal-view.component';
import {TermsAndCondition} from "./TermsAndCondition";
import {RegisterMerchantService} from "../../../services/register-merchant-service/register-merchant.service";
import {Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";

/**
 * A form page for merchant to register their store
 */
@Component({
  selector: 'app-create-merchant-view',
  templateUrl: './merchant-create-view.component.html',
  styleUrls: ['./merchant-create-view.component.scss']
})
export class MerchantCreateViewComponent implements OnInit, AfterViewInit, OnDestroy {

  public showFormIncomplete: boolean = false;
  public showServerError: boolean = false;

  // instantiate the merchant right away
  //public merchant: Merchant = MerchantCreateViewComponent.populateMerchant();
  public merchantBusiness: MerchantBusiness = new MerchantBusiness();

  // the form on this page
  public mainForm: FormGroup;

  private readonly termsCondition: string = '';

  // for unsubscription when component is destroyed
  private _unSub: Subject<boolean> = new Subject();  // subjects vs replay won't replay when reinitialize
  private unSub: Observable<boolean> = this._unSub.asObservable();

  constructor(private modalService: NgbModal,
              private merchantService: RegisterMerchantService,
              private userService: UserService,
              private router: Router) {

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

  ngOnDestroy(): void {
    // unsubscribe all form fields from listening to value changes when this component dies
    this._unSub.next();
  }

  ngAfterViewInit(): void {

    // wire the form inputs so on every change it will update the values in the model
    this.businessNameFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setBusinessName(val);
    });

    this.businessTaxFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setBusinessTax(val);
    });

    this.businessTypeFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setBusinessType(val);
    });

    this.merchantCategoryFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      this.merchantBusiness.setMerchantCategory(val);
    });

    this.firstNameFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setFirstName(val);
    });

    this.lastNameFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setLastName(val);
    });

    this.dateOfBirthMFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      this.merchantBusiness.setDOBMonth(val);
    });

    this.dateOfBirthDFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      this.merchantBusiness.setDOBDay(val);
    });

    this.dateOfBirthYFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      this.merchantBusiness.setDOBYear(val);
    });

    this.last4ssnFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: number) => {
      const temp: string = val.toString();
      if(temp.length > 4) {
        val = parseInt(temp.slice(0,3));
        this.last4ssnFC.setValue(val,{onlySelf: true});
      }
      this.merchantBusiness.setLast4SSN(val);
    });

    this.address1FC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setAddress1(val);
    });

    this.address2FC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setAddress2(val);
    });

    this.businessPhoneFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setBusinessPhone(val);
    });

    this.personalPhoneFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setPersonalPhone(val);
    });

    this.businessEmailFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setBusinessEmail(val);
    });

    this.personalEmailFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setPersonalEmail(val);
    });

    this.descriptionFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchantBusiness.setBusinessDescription(val);
    });

    this.agreedToTermsFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: boolean) => {
      this.merchantBusiness.setAgreedToTerms(val);
    });

  }

  /** add more control to the form */
  public addFormControl(name: string, control: FormControl): void {
    if(this.mainForm && name && control) {
      this.mainForm.addControl(name, control);
    }
  }

  public businessNameFC = new FormControl(
    this.merchantBusiness.getBusinessName(), [
      Validators.required
    ]);

  public businessTaxFC = new FormControl(
    this.merchantBusiness.getBusinessTax(), [
      Validators.required
    ]);

  public businessTypeFC = new FormControl(
    this.merchantBusiness.getBusinessType(), [
      Validators.required
    ]);

  public merchantCategoryFC = new FormControl(
    this.merchantBusiness.getMerchantCategory(), [
      Validators.required
    ]);

  public firstNameFC = new FormControl(
    this.merchantBusiness.getFirstName(), [
      Validators.required
    ]);

  public lastNameFC = new FormControl(
    this.merchantBusiness.getLastName(), [
      Validators.required
    ]);

  public dateOfBirthMFC = new FormControl(
    this.merchantBusiness.getDOBMonth(), [
      Validators.required
    ]);

  public dateOfBirthDFC = new FormControl(
    this.merchantBusiness.getDOBDay(), [
      Validators.required
    ]);

  public dateOfBirthYFC = new FormControl(
    this.merchantBusiness.getDOBYear(), [
      Validators.required
    ]);

  public last4ssnFC = new FormControl(
    this.merchantBusiness.getLast4SSN(), [
      Validators.required, Validators.maxLength(4), Validators.maxLength(4)
    ]);

  public address1FC = new FormControl(
    this.merchantBusiness.getAddress1(), [
      Validators.required
    ]);

  public address2FC = new FormControl(
    this.merchantBusiness.getAddress2(), [
      Validators.required
    ]);

  public businessPhoneFC = new FormControl(
    this.merchantBusiness.getBusinessPhone(), [
      Validators.required
    ]);

  public personalPhoneFC = new FormControl(
    this.merchantBusiness.getPersonalPhone(), [
      Validators.required
    ]);

  public businessEmailFC = new FormControl(
    this.merchantBusiness.getBusinessEmail(), [
      Validators.required
    ]);

  public personalEmailFC = new FormControl(
    this.merchantBusiness.getPersonalEmail(), [
      Validators.required
    ]);

  public descriptionFC = new FormControl(
    this.merchantBusiness.getBusinessDescription(), [
      Validators.required
    ]);

  public agreedToTermsFC = new FormControl(
    this.merchantBusiness.getAgreedToTerms(), [
      Validators.required, Validators.requiredTrue
    ]);

  /** create the merchant account - send the form to backend */
  public registerAccount(): void {

    if(this.validateForm()){
      this.merchantService.registerAccount(this.userService.getAuthToken(), this.merchantBusiness).subscribe((resp: boolean) => {
        if(resp){
          this.showServerError = false;
          this.router.navigate([ViewRoutes.MERCHANT_HOW_IT_WORKS]);
        } else {
          this.showServerError = true;
        }
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
      if(this.merchantBusiness.getBusinessName() &&
        this.merchantBusiness.getBusinessTax() &&
        this.merchantBusiness.getBusinessType() &&
        this.merchantBusiness.getMerchantCategory() &&
        this.merchantBusiness.getBusinessDescription() &&
        this.merchantBusiness.getFirstName() &&
        this.merchantBusiness.getLastName() &&
        this.merchantBusiness.getDOBYear() &&
        this.merchantBusiness.getDOBMonth() &&
        this.merchantBusiness.getDOBDay() &&
        this.merchantBusiness.getLast4SSN() &&
        this.merchantBusiness.getAddress1() &&
        this.merchantBusiness.getAddress2() &&
        this.merchantBusiness.getBusinessPhone() &&
        this.merchantBusiness.getPersonalPhone() &&
        this.merchantBusiness.getPersonalEmail() &&
        this.merchantBusiness.getBusinessEmail()&&
        this.merchantBusiness.getAgreedToTerms())
      {
          console.log("Merchant field valid");
          return true;
        }
    }

    console.log("Merchant field not valid");
    return false;
  }

}
