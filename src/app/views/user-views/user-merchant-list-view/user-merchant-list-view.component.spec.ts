import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMerchantListViewComponent } from './user-merchant-list-view.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {HttpWrapperServiceTest} from "../../../apis/http-wrapper/http-wrapper.service.test";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('UserMerchantListViewComponent', () => {
  let component: UserMerchantListViewComponent;
  let fixture: ComponentFixture<UserMerchantListViewComponent>;

  let httpWrapperServiceTest: HttpWrapperServiceTest;

  beforeEach(async(() => {

    // create mock services
    httpWrapperServiceTest = new HttpWrapperServiceTest();

    TestBed.configureTestingModule({
      declarations: [ UserMerchantListViewComponent ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {provide: HttpWrapperService, useValue: httpWrapperServiceTest}
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
