import { TestBed } from '@angular/core/testing';

import { UserInvitationService } from './user-invitation.service';

describe('UserInvitationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserInvitationService = TestBed.get(UserInvitationService);
    expect(service).toBeTruthy();
  });
});
