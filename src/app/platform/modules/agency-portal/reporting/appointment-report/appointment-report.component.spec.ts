import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReportComponent } from './appointment-report.component';

describe('AppointmentReportComponent', () => {
  let component: AppointmentReportComponent;
  let fixture: ComponentFixture<AppointmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
