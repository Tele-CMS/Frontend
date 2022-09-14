import { Component, OnInit,Inject } from '@angular/core';
import { CommonService } from "./../../platform/modules/core/services/common.service";
import { Observable } from "rxjs";
import { debug } from "util";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FollowupModal } from './followup.modal'
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { SchedulerService } from "./../../platform/modules/scheduling/scheduler/scheduler.service";
@Component({
  selector: 'app-followup-appointment',
  templateUrl: './followup-appointment.component.html',
  styleUrls: ['./followup-appointment.component.css']
})
export class FollowupAppointmentComponent implements OnInit {
lastAppointmentStartTime:any;
lastAppointmentEndTime:any;
appointmentId:any;
notes:any;
bookingMode:any;
lastAppointment:any;
providerInfo:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private dialogModalRef: MatDialogRef<FollowupModal>,
private schedulerService: SchedulerService,) { 
 this.appointmentId=data.id,
     this.lastAppointmentStartTime=data.lastAppointmentStartTime;
     this.lastAppointmentEndTime=data.lastAppointmentEndTime;
     this.notes=data.notes;
     this.bookingMode=data.bookingMode;


  }

  ngOnInit() {
    
    if(this.appointmentId)
    {
    this.getAppointmentDetails();
    }
  }
  getAppointmentDetails()
  {
       this.schedulerService
      .getAppointmentDetails(this.appointmentId)
      .subscribe(response => {
        this.lastAppointment = response.data;
        if (response.statusCode == 200) {
        }
      });
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
}
