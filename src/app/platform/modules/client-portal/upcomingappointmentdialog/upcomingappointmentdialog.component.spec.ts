import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingappointmentdialogComponent } from './upcomingappointmentdialog.component';

describe('UpcomingappointmentdialogComponent', () => {
  let component: UpcomingappointmentdialogComponent;
  let fixture: ComponentFixture<UpcomingappointmentdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingappointmentdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingappointmentdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
