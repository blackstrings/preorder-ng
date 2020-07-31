import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantAddProductViewComponent } from './merchant-add-product-view.component';

describe('MerchantAddProductViewComponent', () => {
  let component: MerchantAddProductViewComponent;
  let fixture: ComponentFixture<MerchantAddProductViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantAddProductViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantAddProductViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
