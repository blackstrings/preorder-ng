import { ActivatedRoute } from '@angular/router';
import { Merchant } from './../../../models/merchant/merchant';
import { RegisterMerchantService } from './../../../services/register-merchant-service/register-merchant.service';
import { MerchantService } from './../../../services/merchant-service/merchant.service';
import { UserService } from './../../../services/user-service/user.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import { Product } from '../../../models/product/product';

@Component({
  selector: 'app-merchant-add-product-view',
  templateUrl: './merchant-add-product-view.component.html',
  styleUrls: ['./merchant-add-product-view.component.scss']
})
export class MerchantAddProductViewComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public product: Product = new Product();
  public merchant: Merchant;
  public merchantID: number;

  public initSuccess: boolean = false;

  constructor(private userService: UserService, private registerMerchantService: RegisterMerchantService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe( (params) => {
      const id = params.get('id');
      if(id){

        try{
          this.merchantID = parseInt(id);
          this.initSuccess = true;
        } catch(e) {
          console.error('<< MerchantAddProductView >> merchant id parse error');
        }

      } else {
        console.error('<< MerchantAddProductView >> merchant id null or invalid');
      }
    });
  }

  public productNameFC: FormControl = new FormControl(
    this.product.getName(), [
      Validators.required
    ]
  );

  public productDescriptionFC: FormControl = new FormControl(
    this.product.getDescription(), [
      Validators.required
    ]
  );

  public productPriceFC: FormControl = new FormControl(
    this.product.getPrice(), [
      Validators.required
    ]
  );

  public productAdditionalTimeFC: FormControl = new FormControl(
    this.product.getAdditionalTime(), [
      Validators.required
    ]
  );

  public productAvailableStartFC: FormControl = new FormControl(
    this.product.getAvailableStart(), [
      Validators.required
    ]
  );

  public productAvailableEndFC: FormControl = new FormControl(
    this.product.getAvailableEnd(), [
      Validators.required
    ]
  );

  private _unsub: Subject<boolean> = new Subject();
  public unsub: Observable<boolean> = this._unsub.asObservable();

  ngOnInit(): void {

    this.form = new FormGroup({
      productName: this.productNameFC,
      productDescription: this.productDescriptionFC,
      productPrice: this.productPriceFC,
      productAdditionalTime: this.productAdditionalTimeFC,
      productAvailableStart: this.productAvailableStartFC,
      productAvailableEnd: this.productAvailableEndFC
    });

    this.productNameFC.valueChanges.pipe(takeUntil(this.unsub)).subscribe((val) => {
      this.product.setName(val);
    });

    this.productDescriptionFC.valueChanges.pipe(takeUntil(this.unsub)).subscribe((val) => {
      this.product.setDescription(val);
    });

    this.productPriceFC.valueChanges.pipe(takeUntil(this.unsub)).subscribe((val) => {
      this.product.setPrice(val);
    });

    this.productAdditionalTimeFC.valueChanges.pipe(takeUntil(this.unsub)).subscribe((val) => {
      this.product.setAdditionalTime(val);
    });

    this.productAvailableStartFC.valueChanges.pipe(takeUntil(this.unsub)).subscribe((val) => {
      this.product.setAvailableStart(val);
    });

    this.productAvailableEndFC.valueChanges.pipe(takeUntil(this.unsub)).subscribe((val) => {
      this.product.setAvailableEnd(val);
    });
  }

  public registerProduct(): void {
    if(this.validateForm()){
      this.registerMerchantService.registerProduct(this.userService.getAuthToken(), this.product, this.merchantID).subscribe((resp) => {
        console.log(resp);
      });
    }
  }

  public ngOnDestroy(): void{
    this._unsub.next(false);
  }

  public validateForm(): boolean{
    // check if product object exists
    if(this.product){
      // check to make sure all fields are not empty
      if(this.product.getName() &&
        this.product.description &&
        this.product.price &&
        this.product.additional_time &&
        this.product.available_start &&
        this.product.available_end)
      {
          console.log("Product field valid");
          return true;
      }
    }

    console.log("Product field not valid");
    return false;
  }

}
