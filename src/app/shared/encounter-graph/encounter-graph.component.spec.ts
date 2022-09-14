import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterGraphComponent } from './encounter-graph.component';

describe('EncounterGraphComponent', () => {
  let component: EncounterGraphComponent;
  let fixture: ComponentFixture<EncounterGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
