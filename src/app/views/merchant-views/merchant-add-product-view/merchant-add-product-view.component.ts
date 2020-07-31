import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-merchant-add-product-view',
  templateUrl: './merchant-add-product-view.component.html',
  styleUrls: ['./merchant-add-product-view.component.scss']
})
export class MerchantAddProductViewComponent implements OnInit {

  public formAddProduct: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.formAddProduct = new FormGroup({});
  }

  public registerProduct(): void {

  }

}
