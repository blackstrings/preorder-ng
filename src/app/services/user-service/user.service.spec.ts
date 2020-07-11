import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpWrapperServiceTest} from "../../apis/http-wrapper/http-wrapper.service.test";
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";
import {UserServiceSubscriptionTest} from "./user-service-subscription.test";
import {UserServiceSubscription} from "./user-service-subscription";

describe('UserServiceService', () => {
  let service: UserService;
  let httpWrapperServiceTest: HttpWrapperServiceTest;
  let userServiceSubTest: UserServiceSubscriptionTest;

  beforeEach(() => {
    httpWrapperServiceTest = new HttpWrapperServiceTest();
    userServiceSubTest = new UserServiceSubscriptionTest();

    TestBed.configureTestingModule({
      providers: [
        UserService,
        {provide: HttpWrapperService, useValue: httpWrapperServiceTest},
        {provide: UserServiceSubscription, useValue: userServiceSubTest}
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
