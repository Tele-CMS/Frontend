import { TestBed } from '@angular/core/testing';

import { ClientAlertsService } from './client-alerts.service';

describe('ClientAlertsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientAlertsService = TestBed.get(ClientAlertsService);
    expect(service).toBeTruthy();
  });
});
