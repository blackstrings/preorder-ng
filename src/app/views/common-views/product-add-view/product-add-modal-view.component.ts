import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../models/product/product";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-product-add-modal-view',
  templateUrl: './product-add-modal-view.component.html',
  styleUrls: ['./product-add-modal-view.component.scss']
})
export class ProductAddModalViewComponent implements OnInit {


  @Input() product: Product;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
