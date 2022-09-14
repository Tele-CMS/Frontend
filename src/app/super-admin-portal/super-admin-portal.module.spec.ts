import { SuperAdminPortalModule } from './super-admin-portal.module';

describe('SuperAdminPortalModule', () => {
  let superAdminPortalModule: SuperAdminPortalModule;

  beforeEach(() => {
    superAdminPortalModule = new SuperAdminPortalModule();
  });

  it('should create an instance', () => {
    expect(superAdminPortalModule).toBeTruthy();
  });
});
