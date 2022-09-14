import { TestBed } from '@angular/core/testing';

import { ServiceCodeService } from './service-code.service';

describe('ServiceCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceCodeService = TestBed.get(ServiceCodeService);
    expect(service).toBeTruthy();
  });
});
