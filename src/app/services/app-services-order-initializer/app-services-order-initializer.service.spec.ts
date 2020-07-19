import { TestBed } from '@angular/core/testing';

import { AppServicesOrderInitializer } from './app-services-order-initializer.service';

describe('AppServicesOrderInitializerService', () => {
  let service: AppServicesOrderInitializer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppServicesOrderInitializer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
