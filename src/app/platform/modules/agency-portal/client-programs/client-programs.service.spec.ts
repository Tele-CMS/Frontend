import { TestBed } from '@angular/core/testing';
import { ClientProgramsService } from './client-programs.service';

describe('ClientProgramsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientProgramsService = TestBed.get(ClientProgramsService);
    expect(service).toBeTruthy();
  });
});
