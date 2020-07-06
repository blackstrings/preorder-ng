import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateOrderViewComponent } from './user-create-order-view.component';
import {HttpWrapperServiceTest} from "../../../apis/http-wrapper/http-wrapper.service.test";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute} from "@angular/router";
import {UserServiceTest} from "../../../apis/services/user-service/user.service.test";
import {UserService} from "../../../apis/services/user-service/user.service";

describe('UserCreateOrderViewComponent', () => {
  let component: UserCreateOrderViewComponent;
  let fixture: ComponentFixture<UserCreateOrderViewComponent>;

  let httpWrapperServiceTest: HttpWrapperServiceTest;
  let userServiceTest: UserServiceTest;

  beforeEach(async(() => {

    httpWrapperServiceTest = new HttpWrapperServiceTest();
    userServiceTest = new UserServiceTest();

    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule
      ],
      declarations: [ UserCreateOrderViewComponent ],
      providers: [
        {provide: HttpWrapperService, useValue: httpWrapperServiceTest},
        {provide: UserService, useValue: userServiceTest},
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
