import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateOrderViewComponent } from './user-create-order-view.component';
import {HttpWrapperServiceTest} from "../../../apis/http-wrapper/http-wrapper.service.test";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {RouterTestingModule} from "@angular/router/testing";
import {UserServiceTest} from "../../../services/user-service/user.service.test";
import {UserService} from "../../../services/user-service/user.service";
import {MerchantService} from "../../../services/merchant-service/merchant.service";
import {MerchantServiceTest} from "../../../services/merchant-service/merchant.service.test";
import {ProductServiceTest} from "../../../services/product-service/product.service.test";
import {ProductService} from "../../../services/product-service/product.service";

describe('UserCreateOrderViewComponent', () => {
  let component: UserCreateOrderViewComponent;
  let fixture: ComponentFixture<UserCreateOrderViewComponent>;

  let httpWrapperServiceTest: HttpWrapperServiceTest;
  let userServiceTest: UserServiceTest;
  let merchantServiceTest: MerchantServiceTest;
  let productServiceTest: ProductServiceTest;

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
        {provide: MerchantService, useValue: merchantServiceTest},
        {provide: ProductService, useValue: productServiceTest},
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
