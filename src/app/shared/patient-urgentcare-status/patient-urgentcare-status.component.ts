import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus, UrgentCareProviderActionInitModel } from "../models/callModel";
import { CommonService } from "src/app/platform/modules/core/services";
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { SchedulerService } from "src/app/platform/modules/scheduling/scheduler/scheduler.service";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";

@Component({
  selector: "app-urgentcare-status",
  templateUrl: "./patient-urgentcare-status.component.html",
  styleUrls: ["./patient-urgentcare-status.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class PatientUrgentCareStatusComponent implements OnInit {
    userId: number = null;
    appointmentId: number;
    masterDocumentTypes: any = []
    //addDocumentForm: FormGroup;
    fileList: any = [];
    dataURL: any;
    submitted: boolean = false;
    todayDate = new Date();
    constructor(private dialogModalRef: MatDialogRef<PatientUrgentCareStatusComponent>,
        private router: Router,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private notifier: NotifierService, private schedulerService: SchedulerService, private commonService: CommonService,private appService: AppService, private Dailog: MatDialog) {
          
      this.appointmentId = this.data;
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

    onDoneClick() {
      //this.dialogModalRef.close("close");
      this.Dailog.closeAll();
      //this.router.navigate(["/urgentcare-providers"]);
    }


    onAccept(){
        
        this.router.navigate(["/web/encounter/soap"], {
            queryParams: {
              apptId: this.appointmentId,
              encId: 0
            },
          });
        // this.router.navigate(["/web/waiting-room/"+this.appointmentId]);
        //   this.dialogModalRef.close();
    }
    
    onReject(){
        
        this.schedulerService
          .urgentCareRefundAppointmentFee(this.appointmentId)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
             
              this.callPatientInformProviderAvailability(this.appointmentId);
            } else {
              
            }
          });
    }
    

    callPatientInformProviderAvailability(pateintapptid:number){
        
        if (pateintapptid > 0 && this.userId > 0) {
            this.appService
              .getcallPatientInformProviderAvailability(pateintapptid, this.userId)
              .subscribe((res) => {
                console.log(res);
              });
          }
        //   let callInitModel: UrgentCareProviderActionInitModel = new UrgentCareProviderActionInitModel();
        //   callInitModel.AppointmentId = pateintapptid;
        //   //callInitModel.CallStatus = CallStatus.Picked;
        //   this.appService.ProviderActioncallStarted(callInitModel);
    }

}
