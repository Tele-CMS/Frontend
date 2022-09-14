import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoapEncounterComponent } from './soap-encounter.component';

describe('SoapEncounterComponent', () => {
  let component: SoapEncounterComponent;
  let fixture: ComponentFixture<SoapEncounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoapEncounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoapEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
