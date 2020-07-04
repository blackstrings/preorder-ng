import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateAccountView } from './user-create-account-view.component';
import {HttpWrapperServiceTest} from "../../../apis/http-wrapper/http-wrapper.service.test";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('CreateUserAccountComponent', () => {
  let component: UserCreateAccountView;
  let fixture: ComponentFixture<UserCreateAccountView>;

  let httpWrapperServiceTest: HttpWrapperServiceTest;

  beforeEach(async(() => {
    httpWrapperServiceTest = new HttpWrapperServiceTest();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ UserCreateAccountView ],
      providers: [
        {provide: HttpWrapperService, useValue: httpWrapperServiceTest}
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
