import { InvitationStatusPipe } from './invitation-status.pipe';

describe('InvitationStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new InvitationStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
