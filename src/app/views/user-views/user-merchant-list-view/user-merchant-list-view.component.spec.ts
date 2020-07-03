import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMerchantListViewComponent } from './user-merchant-list-view.component';

describe('MerhchantListViewComponent', () => {
  let component: UserMerchantListViewComponent;
  let fixture: ComponentFixture<UserMerchantListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMerchantListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMerchantListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
