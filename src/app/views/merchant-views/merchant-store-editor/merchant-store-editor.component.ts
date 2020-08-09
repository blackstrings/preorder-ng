import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product/product';
import {ProductTest} from "../../../models/product/product.test";
import {Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";
import {MerchantService} from "../../../services/merchant-service/merchant.service";

/** Admin store editor for a particular selected store */
@Component({
  selector: 'app-merchant-store-editor',
  templateUrl: './merchant-store-editor.component.html',
  styleUrls: ['./merchant-store-editor.component.scss']
})
export class MerchantStoreEditorComponent implements OnInit {

  public allProductsInStore: Product[] = ProductTest.createMocks();

  constructor(private router: Router, private merchantService: MerchantService) { }

  ngOnInit(): void {

  }



}
