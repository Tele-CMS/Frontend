import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseManagementProgramModalComponent } from './disease-management-program-modal.component';

describe('DiseaseManagementProgramModalComponent', () => {
  let component: DiseaseManagementProgramModalComponent;
  let fixture: ComponentFixture<DiseaseManagementProgramModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiseaseManagementProgramModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiseaseManagementProgramModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
