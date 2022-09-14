import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterNotesModelComponent } from './encounter-notes-model.component';

describe('EncounterNotesModelComponent', () => {
  let component: EncounterNotesModelComponent;
  let fixture: ComponentFixture<EncounterNotesModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterNotesModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterNotesModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
