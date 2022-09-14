import { MailingModule } from './mailing.module';

describe('MailingModule', () => {
  let mailingModule: MailingModule;

  beforeEach(() => {
    mailingModule = new MailingModule();
  });

  it('should create an instance', () => {
    expect(mailingModule).toBeTruthy();
  });
});
