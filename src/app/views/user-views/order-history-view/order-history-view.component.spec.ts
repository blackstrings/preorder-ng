import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryViewComponent } from './order-history-view.component';

describe('OrderHistoryComponent', () => {
  let component: OrderHistoryViewComponent;
  let fixture: ComponentFixture<OrderHistoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHistoryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
