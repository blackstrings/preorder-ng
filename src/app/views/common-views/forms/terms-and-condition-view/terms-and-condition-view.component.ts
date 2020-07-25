import {Component, OnInit} from '@angular/core';
import {OkayModalViewComponent} from "../../modals/okay-modal-view/okay-modal-view.component";
import {ModalConfig} from "../../modals/modal-config";
import {TermsAndCondition} from "../../../merchant-views/merchant-create-view/TermsAndCondition";
import {take} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-terms-and-condition-view',
  templateUrl: './terms-and-condition-view.component.html',
  styleUrls: ['./terms-and-condition-view.component.scss']
})
export class TermsAndConditionViewComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  // first value is just initial value
  public agreedToTermsFC = new FormControl(
    false, [
      Validators.required, Validators.requiredTrue
    ]);

  ngOnInit(): void {
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
