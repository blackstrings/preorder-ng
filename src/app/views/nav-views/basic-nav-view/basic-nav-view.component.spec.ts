import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicNavViewComponent } from './basic-nav-view.component';

describe('CustomerToolbarViewComponent', () => {
  let component: BasicNavViewComponent;
  let fixture: ComponentFixture<BasicNavViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicNavViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicNavViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
