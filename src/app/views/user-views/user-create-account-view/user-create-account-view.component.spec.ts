import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateAccountView } from './user-create-account-view.component';
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {UserServiceTest} from "../../../services/user-service/user.service.test";

describe('CreateUserAccountComponent', () => {
  let component: UserCreateAccountView;
  let fixture: ComponentFixture<UserCreateAccountView>;

  let userServiceTest: UserServiceTest;

  beforeEach(async(() => {
    userServiceTest = new UserServiceTest();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ UserCreateAccountView ],
      providers: [
        {provide: HttpWrapperService, useValue: userServiceTest}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreateAccountView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
