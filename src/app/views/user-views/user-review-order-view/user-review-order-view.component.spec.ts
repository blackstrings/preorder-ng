import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReviewOrderViewComponent } from './user-review-order-view.component';

describe('UserCheckoutViewComponent', () => {
  let component: UserReviewOrderViewComponent;
  let fixture: ComponentFixture<UserReviewOrderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReviewOrderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReviewOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
