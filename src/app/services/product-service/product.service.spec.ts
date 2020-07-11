import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import {HttpWrapperServiceTest} from "../../apis/http-wrapper/http-wrapper.service.test";
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";

describe('ProductService', () => {
  let service: ProductService;
  let httpWrapperTest: HttpWrapperServiceTest;

  beforeEach(() => {
    httpWrapperTest  = new HttpWrapperServiceTest();
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        {provide: HttpWrapperService, useValue: httpWrapperTest}
      ]
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
