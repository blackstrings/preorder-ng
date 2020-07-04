import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginViewComponent } from './user-login-view.component';
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {HttpWrapperServiceTest} from "../../../apis/http-wrapper/http-wrapper.service.test";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormBuilder} from "@angular/forms";

describe('UserLoginViewComponent', () => {
  let component: UserLoginViewComponent;
  let fixture: ComponentFixture<UserLoginViewComponent>;

  let httpWrapperServiceTest: HttpWrapperServiceTest;

  beforeEach(async(() => {

    // create the mock services¡
    httpWrapperServiceTest = new HttpWrapperServiceTest();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ UserLoginViewComponent ],
      providers: [
        {provider: HttpWrapperService, useValue: httpWrapperServiceTest}
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
