import { FormioTemplateModule } from './formio-template.module';

describe('FormioTemplateModule', () => {
  let formioTemplateModule: FormioTemplateModule;

  beforeEach(() => {
    formioTemplateModule = new FormioTemplateModule();
  });

  it('should create an instance', () => {
    expect(formioTemplateModule).toBeTruthy();
  });
});
