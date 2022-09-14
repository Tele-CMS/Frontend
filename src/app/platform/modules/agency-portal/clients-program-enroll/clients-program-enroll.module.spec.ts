import { ClientsProgramEnrollModule } from './clients-program-enroll.module';

describe('ClientsProgramEnrollModule', () => {
  let clientsProgramEnrollModule: ClientsProgramEnrollModule;

  beforeEach(() => {
    clientsProgramEnrollModule = new ClientsProgramEnrollModule();
  });

  it('should create an instance', () => {
    expect(clientsProgramEnrollModule).toBeTruthy();
  });
});
