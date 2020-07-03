import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateOrderViewComponent } from './user-create-order-view.component';

describe('UserCreateOrderViewComponent', () => {
  let component: UserCreateOrderViewComponent;
  let fixture: ComponentFixture<UserCreateOrderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreateOrderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreateOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
