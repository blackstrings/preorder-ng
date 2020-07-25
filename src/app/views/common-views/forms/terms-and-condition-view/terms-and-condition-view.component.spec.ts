import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionViewComponent } from './terms-and-condition-view.component';

describe('TermsAndConditionViewComponent', () => {
  let component: TermsAndConditionViewComponent;
  let fixture: ComponentFixture<TermsAndConditionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
