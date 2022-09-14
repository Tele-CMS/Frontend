import { AppConfigModule } from './app-config.module';

describe('AppConfigModule', () => {
  let appConfigModule: AppConfigModule;

  beforeEach(() => {
    appConfigModule = new AppConfigModule();
  });

  it('should create an instance', () => {
    expect(appConfigModule).toBeTruthy();
  });
});
