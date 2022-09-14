import { PayersModule } from './payers.module';

describe('PayersModule', () => {
  let payersModule: PayersModule;

  beforeEach(() => {
    payersModule = new PayersModule();
  });

  it('should create an instance', () => {
    expect(payersModule).toBeTruthy();
  });
});
