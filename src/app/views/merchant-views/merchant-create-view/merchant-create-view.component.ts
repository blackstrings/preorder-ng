import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Merchant} from "../../../models/merchant/merchant";
import {User} from "../../../models/user/user";
import {Address} from "../../../models/address/address";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {take} from "rxjs/operators";
import {Product} from "../../../models/product/product";
import {ModalConfig} from "../../common-views/modals/modal-config";
import { OkayModalViewComponent } from '../../common-views/modals/okay-modal-view/okay-modal-view.component';
import {TermsAndCondition} from "./TermsAndCondition";

@Component({
  selector: 'app-create-merchant-view',
  templateUrl: './merchant-create-view.component.html',
  styleUrls: ['./merchant-create-view.component.scss']
})
export class MerchantCreateViewComponent implements OnInit {

  public showFormIncomplete: boolean = false;
  public showServerError: boolean = false;

  // instantiate the merchant right away
  public merchant: Merchant = MerchantCreateViewComponent.populateMerchant();

  // the form on this page
  public mainForm: FormGroup;

  private readonly termsCondition: string = '';

  constructor(private modalService: NgbModal) {

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
    this.mainForm = new FormGroup({
      firstName: this.firstNameFC,
      lastName: this.lastNameFC,
      agreedToTerms: this.agreedToTermsFC
    });
  }

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

  public agreedToTermsFC = new FormControl(
    this.merchant.agreedToTerms, [
      Validators.required, Validators.requiredTrue
    ]);

  /** send the form to backend */
  public registerAccount(): void {
    console.warn('register not yet implemented');
  }

  public openTermsAndConditionModal(): void {
    // set config to not allow keyboard esc or click on backdrop to close
    const modalRef = this.modalService.open(OkayModalViewComponent, ModalConfig.getCloseByAnyKeyScrollable());
    if(modalRef.componentInstance instanceof OkayModalViewComponent) {
      modalRef.componentInstance.init('Terms and Conditions', TermsAndCondition);
      modalRef.componentInstance.onClose.pipe(take(1));
    }
  }

}
