import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCheckoutViewComponent } from './user-checkout-view.component';

describe('UserCheckoutViewComponent', () => {
  let component: UserCheckoutViewComponent;
  let fixture: ComponentFixture<UserCheckoutViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCheckoutViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCheckoutViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
