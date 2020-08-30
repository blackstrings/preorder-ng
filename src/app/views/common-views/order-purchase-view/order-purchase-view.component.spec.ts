import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPurchaseViewComponent } from './order-purchase-view.component';

describe('OrderPurchaseViewComponent', () => {
  let component: OrderPurchaseViewComponent;
  let fixture: ComponentFixture<OrderPurchaseViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPurchaseViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPurchaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
