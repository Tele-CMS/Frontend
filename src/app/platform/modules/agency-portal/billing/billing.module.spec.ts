import { BillingModule } from './billing.module';

describe('BillingModule', () => {
  let billingModule: BillingModule;

  beforeEach(() => {
    billingModule = new BillingModule();
  });

  it('should create an instance', () => {
    expect(billingModule).toBeTruthy();
  });
});
