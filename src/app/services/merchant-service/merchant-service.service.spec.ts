import { TestBed } from '@angular/core/testing';

import { MerchantServiceService } from './merchant-service.service';
import {MerchantTest} from "../../models/merchant/merchant.test";

describe('MerchantServiceService', () => {
  let service: MerchantServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchantServiceService);
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

    it('should cache new merchants', () => {
      service['merchantsCached'] = merchantsCached;
      const newMerchants: MerchantTest[] = [MerchantTest.create(3), MerchantTest.create(4)];
      service.addToCache(newMerchants);
      expect(service['merchantsCached'].length).toBe(4);
    });

  });
});
