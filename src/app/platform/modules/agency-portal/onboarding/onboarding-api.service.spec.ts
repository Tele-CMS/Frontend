import { TestBed } from '@angular/core/testing';

import { OnboardingApiService } from './onboarding-api.service';

describe('OnboardingApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnboardingApiService = TestBed.get(OnboardingApiService);
    expect(service).toBeTruthy();
  });
});
