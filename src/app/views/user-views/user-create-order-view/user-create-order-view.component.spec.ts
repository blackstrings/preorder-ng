import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateOrderViewComponent } from './user-create-order-view.component';
import {HttpWrapperServiceTest} from "../../../apis/http-wrapper/http-wrapper.service.test";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute} from "@angular/router";

describe('UserCreateOrderViewComponent', () => {
  let component: UserCreateOrderViewComponent;
  let fixture: ComponentFixture<UserCreateOrderViewComponent>;

  let httpWrapperServiceTest: HttpWrapperServiceTest;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule
      ],
      declarations: [ UserCreateOrderViewComponent ],
      providers: [
        {provide: HttpWrapperService, useValue: httpWrapperServiceTest}
      ]
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
