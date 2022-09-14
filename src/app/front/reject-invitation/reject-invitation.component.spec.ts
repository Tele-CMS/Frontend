import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectInvitationComponent } from './reject-invitation.component';

describe('RejectInvitationComponent', () => {
  let component: RejectInvitationComponent;
  let fixture: ComponentFixture<RejectInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
