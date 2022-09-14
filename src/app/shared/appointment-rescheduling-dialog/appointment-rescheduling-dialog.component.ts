import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus, UrgentCareProviderActionInitModel } from "../models/callModel";
import { CommonService } from "src/app/platform/modules/core/services";
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { SchedulerService } from "src/app/platform/modules/scheduling/scheduler/scheduler.service";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { UrgentCareProviderActionComponent } from "../urgentcare-provideraction/urgentcare-provideraction.component";
import { PreponeAppointmentComponent } from "../prepone-appointment/prepone-appointment.component";
import { PostponeAppointmentComponent } from "../postpone-appointment/postpone-appointment.component";

@Component({
  selector: "app-appointment-rescheduling",
  templateUrl: "./appointment-rescheduling-dialog.component.html",
  styleUrls: ["./appointment-rescheduling-dialog.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AppointmentReschedulingDialogComponent implements OnInit {
    userId: number = null;
    appointmentId: number;
    masterDocumentTypes: any = []
    //addDocumentForm: FormGroup;
    fileList: any = [];
    dataURL: any;
    submitted: boolean = false;
    todayDate = new Date();
    
    constructor(private dialogModalRef: MatDialogRef<AppointmentReschedulingDialogComponent>,private dailog: MatDialog,
        private router: Router,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private notifier: NotifierService, private schedulerService: SchedulerService, private commonService: CommonService,private appService: AppService) {
          
      //this.appointmentId = this.data;
    }
  
    ngOnInit() {
     
        this.commonService.loginUser.subscribe((user: LoginUser) => {
            if (user.data) {
              this.userId = user.data.userID;
             
            }
          });
    }
    
  
    closeDialog(action: string): void {
      this.dialogModalRef.close(action);
    }

    openPreponeDialog(){
    
        let dbModal;
        dbModal = this.dailog.open(PreponeAppointmentComponent, {
          hasBackdrop: true,
          data: this.data,
          width:'55%'
        });
        dbModal.afterClosed().subscribe((result: string) => {
          if (result == "SAVE") {
            
          }
        });
        this.dialogModalRef.close();
      }

      openPostPoneDialog(){
    
        let dbModal;
        dbModal = this.dailog.open(PostponeAppointmentComponent, {
          hasBackdrop: true,
          data: this.data,
          width:'70%'
        });
        dbModal.afterClosed().subscribe((result: string) => {
          if (result == "SAVE") {
            
          }
        });
        this.dialogModalRef.close();
      }
       
}
