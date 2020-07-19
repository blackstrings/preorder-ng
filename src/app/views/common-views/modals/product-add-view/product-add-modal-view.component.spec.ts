import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddModalViewComponent } from './product-add-modal-view.component';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

describe('ProductAddModalViewComponent', () => {
  let component: ProductAddModalViewComponent;
  let fixture: ComponentFixture<ProductAddModalViewComponent>;

  let modal: NgbActiveModal;

  beforeEach(async(() => {

    modal = new NgbActiveModal();

    TestBed.configureTestingModule({
      declarations: [ ProductAddModalViewComponent ],
      providers: [
        {provide: NgbActiveModal, useValue: modal}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddModalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
