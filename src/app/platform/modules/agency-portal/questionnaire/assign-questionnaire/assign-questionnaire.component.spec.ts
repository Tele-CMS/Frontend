import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignQuestionnaireComponent } from './assign-questionnaire.component';

describe('AssignQuestionnaireComponent', () => {
  let component: AssignQuestionnaireComponent;
  let fixture: ComponentFixture<AssignQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
