import { ProductService } from './../../../services/product-service/product.service';
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
  public pageViewType: string = "view";

  public productID: number;

  constructor(private userService: UserService, private registerMerchantService: RegisterMerchantService, private activatedRoute: ActivatedRoute, private productService: ProductService) {
    this.activatedRoute.paramMap.subscribe( (params) => {
      const id = params.get('id');
      this.productID = parseInt(params.get('productID'));

      this.pageViewType = params.get('action');
      if(this.pageViewType === 'edit'){

        this.product = this.productService.getCurrentProducts().filter(product => product.id === this.productID)[0];
      }

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

    // if the form is on the update form, then fill in all the product fields of that product
    if(this.pageViewType === 'edit'){
      this.loadProductDetails();
    }

    //console.log(this.productService.getCurrentProducts().filter(product => product.id === this.productID)[0].getName());
  }

  // when the user click the submit button
  public registerProduct(): void {

    if(this.pageViewType === 'edit'){
      this.updateProduct();
    }else{
      this.addProduct();
    }
  }

  public updateProduct(): void {

  }

  public addProduct(): void{
    if(this.validateForm()){
      this.registerMerchantService.registerProduct(this.userService.getAuthToken(), this.product, this.merchantID).subscribe((resp) => {
        console.log(resp);
      });
    }
  }

  public loadProductDetails(): void{
    this.productNameFC.setValue(this.product.getName());
    this.productDescriptionFC.setValue(this.product.getDescription());
    this.productPriceFC.setValue(this.product.getPrice());

    // these values will be undefined until the backends sets them onto the product
    this.productAdditionalTimeFC.setValue(this.product.getAdditionalTime());
    this.productAvailableStartFC.setValue(this.product.getAvailableStart());
    this.productAvailableEndFC.setValue(this.product.getAvailableEnd());

    console.log(this.productAvailableStartFC.setValue(this.product.getAvailableStart()));
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

  public isViewType(val: string): boolean{

    return this.pageViewType === val;
  }

}
