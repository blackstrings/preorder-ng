import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicNavViewComponent } from './basic-nav-view.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('BasicNavViewComponent', () => {
  let component: BasicNavViewComponent;
  let fixture: ComponentFixture<BasicNavViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        HttpClientTestingModule
      ],
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
