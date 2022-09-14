import { ClearingHouseModule } from './clearing-house.module';

describe('ClearingHouseModule', () => {
  let clearingHouseModule: ClearingHouseModule;

  beforeEach(() => {
    clearingHouseModule = new ClearingHouseModule();
  });

  it('should create an instance', () => {
    expect(clearingHouseModule).toBeTruthy();
  });
});
