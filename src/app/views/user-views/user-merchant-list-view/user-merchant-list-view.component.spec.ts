import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMerchantListViewComponent } from './user-merchant-list-view.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {HttpWrapperServiceTest} from "../../../apis/http-wrapper/http-wrapper.service.test";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {UserServiceTest} from "../../../services/user-service/user.service.test";
import {UserService} from "../../../services/user-service/user.service";

describe('UserMerchantListViewComponent', () => {
  let component: UserMerchantListViewComponent;
  let fixture: ComponentFixture<UserMerchantListViewComponent>;

  let httpWrapperServiceTest: HttpWrapperServiceTest;
  let userServiceTest: UserServiceTest;

  beforeEach(async(() => {

    // create mock services
    httpWrapperServiceTest = new HttpWrapperServiceTest();
    userServiceTest = new UserServiceTest();

    TestBed.configureTestingModule({
      declarations: [ UserMerchantListViewComponent ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {provide: HttpWrapperService, useValue: httpWrapperServiceTest},
        {provide: UserService, useValue: userServiceTest},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMerchantListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
