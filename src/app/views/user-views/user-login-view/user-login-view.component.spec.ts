import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {UserLoginViewComponent} from './user-login-view.component';
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {HttpWrapperServiceTest} from "../../../apis/http-wrapper/http-wrapper.service.test";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {UserServiceTest} from "../../../apis/services/user-service/user.service.test";
import {UserService} from "../../../apis/services/user-service/user.service";

describe('UserLoginViewComponent', () => {
  let component: UserLoginViewComponent;
  let fixture: ComponentFixture<UserLoginViewComponent>;

  let httpWrapperServiceTest: HttpWrapperServiceTest;
  let userServiceTest: UserServiceTest;

  beforeEach(async(() => {

    // create the mock services¡
    httpWrapperServiceTest = new HttpWrapperServiceTest();
    userServiceTest = new UserServiceTest();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ UserLoginViewComponent ],
      providers: [
        {provider: HttpWrapperService, useValue: httpWrapperServiceTest},
        {provider: UserService, useValue: userServiceTest},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
