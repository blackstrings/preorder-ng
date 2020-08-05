import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrderCheckoutViewComponent } from './user-order-checkout-view.component';

describe('UserOrderCheckoutViewComponent', () => {
  let component: UserOrderCheckoutViewComponent;
  let fixture: ComponentFixture<UserOrderCheckoutViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOrderCheckoutViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrderCheckoutViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
