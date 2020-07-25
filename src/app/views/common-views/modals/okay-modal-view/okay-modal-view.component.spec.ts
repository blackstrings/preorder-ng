import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkayModalViewComponent } from './okay-modal-view.component';

describe('OkayModalViewComponent', () => {
  let component: OkayModalViewComponent;
  let fixture: ComponentFixture<OkayModalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkayModalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkayModalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
