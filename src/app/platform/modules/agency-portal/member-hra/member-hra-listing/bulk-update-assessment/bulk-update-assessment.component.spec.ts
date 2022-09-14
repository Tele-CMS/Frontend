import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUpdateAssessmentComponent } from './bulk-update-assessment.component';

describe('BulkUpdateAssessmentComponent', () => {
  let component: BulkUpdateAssessmentComponent;
  let fixture: ComponentFixture<BulkUpdateAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUpdateAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUpdateAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
