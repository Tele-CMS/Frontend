import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimServiceCodeDialogComponent } from './claim-service-code-dialog.component';

describe('ClaimServiceCodeDialogComponent', () => {
  let component: ClaimServiceCodeDialogComponent;
  let fixture: ComponentFixture<ClaimServiceCodeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimServiceCodeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimServiceCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
