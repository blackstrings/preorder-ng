import { TestBed } from '@angular/core/testing';

import { HttpWrapperService } from './http-wrapper.service';

describe('HttpServiceService', () => {
  let service: HttpWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
