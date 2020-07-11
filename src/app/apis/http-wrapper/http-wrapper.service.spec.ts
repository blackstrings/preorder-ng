import { TestBed } from '@angular/core/testing';

import { HttpWrapperService } from './http-wrapper.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {UserServiceTest} from "../../services/user-service/user.service.test";
import {UserService} from "../../services/user-service/user.service";

describe('HttpWrapperService', () => {
  let service: HttpWrapperService<any>;
  let userServiceMock: UserServiceTest;

  beforeEach(() => {

    // instantiate mock services
    userServiceMock = new UserServiceTest();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        HttpWrapperService,
        {provide: UserService, useValue: userServiceMock}
      ]
    });
    service = TestBed.inject(HttpWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
