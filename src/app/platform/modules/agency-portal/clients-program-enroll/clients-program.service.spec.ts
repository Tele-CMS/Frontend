import { TestBed } from '@angular/core/testing';

import { ClientsProgramService } from './clients-program.service';

describe('ClientsProgramService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientsProgramService = TestBed.get(ClientsProgramService);
    expect(service).toBeTruthy();
  });
});
