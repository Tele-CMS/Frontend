import { TestBed } from '@angular/core/testing';

import { EncounterGraphService } from './encounter-graph.service';

describe('EncounterGraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncounterGraphService = TestBed.get(EncounterGraphService);
    expect(service).toBeTruthy();
  });
});
