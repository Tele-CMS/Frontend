import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendUserInvitationComponent } from './send-user-invitation.component';

describe('SendUserInvitationComponent', () => {
  let component: SendUserInvitationComponent;
  let fixture: ComponentFixture<SendUserInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendUserInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendUserInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
