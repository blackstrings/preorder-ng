import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantHowItWorksViewComponent } from './merchant-how-it-works-view.component';

describe('MerchantHowItWorksViewComponent', () => {
  let component: MerchantHowItWorksViewComponent;
  let fixture: ComponentFixture<MerchantHowItWorksViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantHowItWorksViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantHowItWorksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
