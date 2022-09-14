import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationTabsComponent } from './medication-tabs.component';

describe('MedicationTabsComponent', () => {
  let component: MedicationTabsComponent;
  let fixture: ComponentFixture<MedicationTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicationTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
