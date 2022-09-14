import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseManagementProgramComponent } from './disease-management-program.component';

describe('DiseaseManagementProgramComponent', () => {
  let component: DiseaseManagementProgramComponent;
  let fixture: ComponentFixture<DiseaseManagementProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiseaseManagementProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiseaseManagementProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
