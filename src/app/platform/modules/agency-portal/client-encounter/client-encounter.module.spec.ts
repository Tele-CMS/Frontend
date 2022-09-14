import { ClientEncounterModule } from './client-encounter.module';

describe('ClientEncounterModule', () => {
  let clientEncounterModule: ClientEncounterModule;

  beforeEach(() => {
    clientEncounterModule = new ClientEncounterModule();
  });

  it('should create an instance', () => {
    expect(clientEncounterModule).toBeTruthy();
  });
});
