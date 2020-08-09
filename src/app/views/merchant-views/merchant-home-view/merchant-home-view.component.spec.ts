import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantHomeViewComponent } from './merchant-home-view.component';

describe('MerchantHomeViewComponent', () => {
  let component: MerchantHomeViewComponent;
  let fixture: ComponentFixture<MerchantHomeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantHomeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantHomeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
