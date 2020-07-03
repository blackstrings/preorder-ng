import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrderHistoryViewComponent } from './user-order-history-view.component';

describe('OrderHistoryComponent', () => {
  let component: UserOrderHistoryViewComponent;
  let fixture: ComponentFixture<UserOrderHistoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOrderHistoryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrderHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
