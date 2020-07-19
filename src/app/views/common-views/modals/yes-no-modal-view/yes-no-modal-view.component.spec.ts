import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoModalViewComponent } from './yes-no-modal-view.component';

describe('YesNoModalViewComponent', () => {
  let component: YesNoModalViewComponent;
  let fixture: ComponentFixture<YesNoModalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YesNoModalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoModalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
