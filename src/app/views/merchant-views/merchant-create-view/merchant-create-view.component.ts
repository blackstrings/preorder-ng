import { UserService } from './../../../services/user-service/user.service';
import { MerchantService } from './../../../services/merchant-service/merchant.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Merchant} from "../../../models/merchant/merchant";
import {User} from "../../../models/user/user";
import {Address} from "../../../models/address/address";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {take, takeUntil} from "rxjs/operators";
import {ModalConfig} from "../../common-views/modals/modal-config";
import { OkayModalViewComponent } from '../../common-views/modals/okay-modal-view/okay-modal-view.component';
import {TermsAndCondition} from "./TermsAndCondition";

@Component({
  selector: 'app-create-merchant-view',
  templateUrl: './merchant-create-view.component.html',
  styleUrls: ['./merchant-create-view.component.scss']
})
export class MerchantCreateViewComponent implements OnInit, AfterViewInit {

  public showFormIncomplete: boolean = false;
  public showServerError: boolean = false;

  // instantiate the merchant right away
  public merchant: Merchant = MerchantCreateViewComponent.populateMerchant();

  // the form on this page
  public mainForm: FormGroup;

  private readonly termsCondition: string = '';

  // for unsubscription when component is destroyed
  private _unSub: Subject<boolean> = new Subject();  // subjects vs replay won't replay when reinitialize
  private unSub: Observable<boolean> = this._unSub.asObservable();

  constructor(private modalService: NgbModal, private merchantService: MerchantService, private userService: UserService) {

  }

  /** creates a merchant object */
  public static populateMerchant(): Merchant {
    const merchant: Merchant = new Merchant();
    merchant.user = new User();
    merchant.address = new Address();
    return merchant;
  }

  ngOnInit(): void {

    // create the form group
    // you can access the formControl by using formControlName in the html
    this.mainForm = new FormGroup({
      business: this.businessNameFC,
      firstName: this.firstNameFC,
      lastName: this.lastNameFC,
      address1: this.address1FC,
      description: this.descriptionFC,
      agreedToTerms: this.agreedToTermsFC
    });

  }

  ngAfterViewInit(): void {

    // wire the form inputs so on every change it will update the values in the model
    this.businessNameFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchant.businessName = val;
    });

    this.firstNameFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchant.user.firstName = val;
    });

    this.lastNameFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchant.user.lastName = val;
    });

    this.address1FC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchant.address.address1 = val;
    });

    this.descriptionFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.merchant.description = val;
    });

    this.agreedToTermsFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: boolean) => {
      this.merchant.agreedToTerms = val;
    });

    

  }

  /** add more control to the form */
  public addFormControl(name: string, control: FormControl): void {
    if(this.mainForm && name && control) {
      this.mainForm.addControl(name, control);
    }
  }


  public businessNameFC = new FormControl(
    this.merchant.businessName, [
      Validators.required
    ]);

  public firstNameFC = new FormControl(
    this.merchant.user.firstName, [
      Validators.required
    ]);

  public lastNameFC = new FormControl(
    this.merchant.user.lastName, [
      Validators.required
    ]);

  public address1FC = new FormControl(
    this.merchant.address.address1, [
      Validators.required
    ]);

  public descriptionFC = new FormControl(
    this.merchant.description, [
      Validators.required
    ]);

  public agreedToTermsFC = new FormControl(
    this.merchant.agreedToTerms, [
      Validators.required, Validators.requiredTrue
    ]);

  /** send the form to backend */
  public registerAccount(): void {

    if(this.validateForm()){
      // do something
      this.merchantService.createMerchant(this.userService.getAuthToken(), this.merchant).subscribe((resp) => {
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
    if(this.merchant){
      // check to make sure all fields are not empty
      if(this.merchant.businessName && this.merchant.user.firstName &&
        this.merchant.user.lastName && this.merchant.address.address1 && this.merchant.description
        && this.merchant.agreedToTerms){
          console.log("Merchant field valid");
          return true;
        }
    }

    console.log("Merchant field not valid");
    return false;
  }

}
