import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../models/product/product";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-product-add-modal-view',
  templateUrl: './product-add-modal-view.component.html',
  styleUrls: ['./product-add-modal-view.component.scss']
})
export class ProductAddModalViewComponent implements OnInit {

	/**
	 * Should represent a new product not yet referenced in a state elsewhere.
	 * As this product will get mutated through selections in the modal.
	 */
  @Input() product: Product;

  private _onClose: Subject<Product> = new Subject<Product>();
  public onClose: Observable<Product> = this._onClose.asObservable();

  // default starting qty
  public qty: number = 1;

  // the product's totol price
  public totalPrice: number;

  /**
   * On add to bag, it returns the product, so the caller must handle the returned product
   * Do not bring any other services in here other than the modal.
   */
  constructor(public activeModal: NgbActiveModal) {

  }

  public init(product: Product): void {
    this.product = product;
    this.totalPrice = this.product.price;
  }

  ngOnInit(): void {
  }

  /** up the qty - highest can go is 99 */
  public add(): void {
    // todo adding a product should be passing in the id and qty it wishes to add
    // public add(productID: number, qty): void {
    this.qty++;
    if(this.qty > 99) {
      this.qty = 99;
    }
    this.updateTotalPrice();
  }

  /** lower the qty - lowest can go is 1 */
  public remove(): void {
    this.qty--;
    if(this.qty < 1) {
      this.qty = 1;
    }
    this.updateTotalPrice()
  }

  public updateTotalPrice(): void {
    this.product.orderQTY = this.qty;
    this.totalPrice = this.product.calculateTotalPrice();
  }

  /** exits the modal and returns the product to be further process */
  public addToBag(): void {
    this.activeModal.close(this.product);
  }

  /** publish the result then dismiss - order matters*/
  public dismiss(): void {
  	this.activeModal.dismiss();
  	this._onClose.next(null);
  }

  /** publish the result then close - order matters*/
  public close(): void {
  	this.activeModal.close();
  	this._onClose.next(this.product);
  }

}
