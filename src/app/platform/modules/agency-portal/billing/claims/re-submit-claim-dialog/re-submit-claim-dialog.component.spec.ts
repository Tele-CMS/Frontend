import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReSubmitClaimDialogComponent } from './re-submit-claim-dialog.component';

describe('ReSubmitClaimDialogComponent', () => {
  let component: ReSubmitClaimDialogComponent;
  let fixture: ComponentFixture<ReSubmitClaimDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReSubmitClaimDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReSubmitClaimDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
