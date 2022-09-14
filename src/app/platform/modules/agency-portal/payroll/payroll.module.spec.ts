import { PayrollModule } from './payroll.module';

describe('PayrollModule', () => {
  let payrollModule: PayrollModule;

  beforeEach(() => {
    payrollModule = new PayrollModule();
  });

  it('should create an instance', () => {
    expect(payrollModule).toBeTruthy();
  });
});
