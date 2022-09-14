import { ClientProgramsModule } from './client-programs.module';

describe('ClientProgramsModule', () => {
  let clientProgramsModule: ClientProgramsModule;

  beforeEach(() => {
    clientProgramsModule = new ClientProgramsModule();
  });

  it('should create an instance', () => {
    expect(clientProgramsModule).toBeTruthy();
  });
});
