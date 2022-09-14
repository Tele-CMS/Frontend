import { TestBed } from '@angular/core/testing';

import { ClientEncounterService } from './client-encounter.service';

describe('ClientEncounterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientEncounterService = TestBed.get(ClientEncounterService);
    expect(service).toBeTruthy();
  });
});
