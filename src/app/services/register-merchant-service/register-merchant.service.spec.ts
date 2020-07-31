import { TestBed } from '@angular/core/testing';

import { RegisterMerchantService } from './register-merchant.service';

describe('RegisterMerchantService', () => {
  let service: RegisterMerchantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterMerchantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
