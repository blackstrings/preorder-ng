import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddModalViewComponent } from './product-add-modal-view.component';

describe('ProductAddModalViewComponent', () => {
  let component: ProductAddModalViewComponent;
  let fixture: ComponentFixture<ProductAddModalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAddModalViewComponent ]
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
