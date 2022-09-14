import { TestBed } from '@angular/core/testing';

import { AgencyDetailService } from './agency-detail.service';

describe('AgencyDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgencyDetailService = TestBed.get(AgencyDetailService);
    expect(service).toBeTruthy();
  });
});
