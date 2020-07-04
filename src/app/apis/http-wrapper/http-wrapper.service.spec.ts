import { TestBed } from '@angular/core/testing';

import { HttpWrapperService } from './http-wrapper.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";

describe('HttpWrapperService', () => {
  let service: HttpWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        HttpWrapperService,
      ]
    });
    service = TestBed.inject(HttpWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
