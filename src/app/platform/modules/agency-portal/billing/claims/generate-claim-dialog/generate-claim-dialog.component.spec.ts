import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateClaimDialogComponent } from './generate-claim-dialog.component';

describe('GenerateClaimDialogComponent', () => {
  let component: GenerateClaimDialogComponent;
  let fixture: ComponentFixture<GenerateClaimDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateClaimDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateClaimDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
