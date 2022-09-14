import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseManagementPlanActivityComponent } from './disease-management-plan-activity.component';

describe('DiseaseManagementPlanActivityComponent', () => {
  let component: DiseaseManagementPlanActivityComponent;
  let fixture: ComponentFixture<DiseaseManagementPlanActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiseaseManagementPlanActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiseaseManagementPlanActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
