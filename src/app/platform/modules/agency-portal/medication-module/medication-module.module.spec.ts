import { MedicationModuleModule } from './medication-module.module';

describe('MedicationModuleModule', () => {
  let medicationModuleModule: MedicationModuleModule;

  beforeEach(() => {
    medicationModuleModule = new MedicationModuleModule();
  });

  it('should create an instance', () => {
    expect(medicationModuleModule).toBeTruthy();
  });
});
