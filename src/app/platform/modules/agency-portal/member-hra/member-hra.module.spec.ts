import { MemberHraModule } from './member-hra.module';

describe('MemberHraModule', () => {
  let memberHraModule: MemberHraModule;

  beforeEach(() => {
    memberHraModule = new MemberHraModule();
  });

  it('should create an instance', () => {
    expect(memberHraModule).toBeTruthy();
  });
});
