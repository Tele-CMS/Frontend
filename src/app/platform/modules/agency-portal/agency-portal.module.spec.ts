import { AgencyPortalModule } from './agency-portal.module';

describe('AgencyPortalModule', () => {
  let agencyPortalModule: AgencyPortalModule;

  beforeEach(() => {
    agencyPortalModule = new AgencyPortalModule();
  });

  it('should create an instance', () => {
    expect(agencyPortalModule).toBeTruthy();
  });
});
