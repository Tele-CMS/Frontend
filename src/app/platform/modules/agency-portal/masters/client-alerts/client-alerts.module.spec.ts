import { ClientAlertsModule } from './client-alerts.module';

describe('ClientAlertsModule', () => {
  let clientAlertsModule: ClientAlertsModule;

  beforeEach(() => {
    clientAlertsModule = new ClientAlertsModule();
  });

  it('should create an instance', () => {
    expect(clientAlertsModule).toBeTruthy();
  });
});
