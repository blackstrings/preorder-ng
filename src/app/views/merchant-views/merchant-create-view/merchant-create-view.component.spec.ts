import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCreateViewComponent } from './merchant-create-view.component';

describe('CreateVendorViewComponent', () => {
  let component: MerchantCreateViewComponent;
  let fixture: ComponentFixture<MerchantCreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantCreateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
