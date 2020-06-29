import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantListViewComponent } from './merchant-list-view.component';

describe('MerhchantListViewComponent', () => {
  let component: MerchantListViewComponent;
  let fixture: ComponentFixture<MerchantListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
