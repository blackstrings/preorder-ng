import { TestBed } from '@angular/core/testing';

import {MerchantService} from './merchant.service';
import {MerchantTest} from "../../models/merchant/merchant.test";
import {HttpWrapperServiceTest} from "../../apis/http-wrapper/http-wrapper.service.test";
import {HttpWrapperService} from "../../apis/http-wrapper/http-wrapper.service";

describe('MerchantService', () => {
  let service: MerchantService;

  let httpWrapperTest: HttpWrapperServiceTest;

  beforeEach(() => {
    httpWrapperTest  = new HttpWrapperServiceTest();

    TestBed.configureTestingModule({
      providers: [
        MerchantService,
        {provide: HttpWrapperService, useValue: httpWrapperTest}
      ]
    });

    service = TestBed.inject(MerchantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToCache()', () => {

    let merchantsCached: MerchantTest[];
    beforeEach(() => {
      merchantsCached = [MerchantTest.create(1), MerchantTest.create(2)];
    });

    it('should prevent duplicates', () => {
      service['merchantsCached'] = merchantsCached;
      service.addToCache(merchantsCached);
      expect(service['merchantsCached'].length).toBe(2);
    });

    it('should prevent duplicates with same ID but different instances', () => {
      service['merchantsCached'] = merchantsCached;
      const newMerchants: MerchantTest[] = [MerchantTest.create(1), MerchantTest.create(3)];
      service.addToCache(newMerchants);
      expect(service['merchantsCached'].length).toBe(3);
    });

    it('should cache new merchants', () => {
      service['merchantsCached'] = merchantsCached;
      const newMerchants: MerchantTest[] = [MerchantTest.create(3), MerchantTest.create(4)];
      service.addToCache(newMerchants);
      expect(service['merchantsCached'].length).toBe(4);
    });

  });
});
