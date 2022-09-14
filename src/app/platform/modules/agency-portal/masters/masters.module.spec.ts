import { MastersModule } from './masters.module';

describe('MastersModule', () => {
  let mastersModule: MastersModule;

  beforeEach(() => {
    mastersModule = new MastersModule();
  });

  it('should create an instance', () => {
    expect(mastersModule).toBeTruthy();
  });
});
