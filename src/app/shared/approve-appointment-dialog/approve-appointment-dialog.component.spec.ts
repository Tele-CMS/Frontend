import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveAppointmentDialogComponent } from './approve-appointment-dialog.component';

describe('ApproveAppointmentDialogComponent', () => {
  let component: ApproveAppointmentDialogComponent;
  let fixture: ComponentFixture<ApproveAppointmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveAppointmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
