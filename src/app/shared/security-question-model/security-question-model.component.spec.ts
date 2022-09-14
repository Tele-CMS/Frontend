import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestionModelComponent } from './security-question-model.component';

describe('SecurityQuestionModelComponent', () => {
  let component: SecurityQuestionModelComponent;
  let fixture: ComponentFixture<SecurityQuestionModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityQuestionModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuestionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
