import { TestBed } from '@angular/core/testing';

import { ClearingHouseService } from './clearing-house.service';

describe('ClearingHouseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClearingHouseService = TestBed.get(ClearingHouseService);
    expect(service).toBeTruthy();
  });
});
