import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrenceRuleComponent } from './recurrence-rule.component';

describe('RecurrenceRuleComponent', () => {
  let component: RecurrenceRuleComponent;
  let fixture: ComponentFixture<RecurrenceRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurrenceRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurrenceRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
