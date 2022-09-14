import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from "@angular/router";
import { PublisherComponent } from 'src/app/platform/modules/agency-portal/encounter/video-chat/publisher/publisher.component';
import { OpentokService } from 'src/app/platform/modules/agency-portal/encounter/opentok.service';
import { NotifierService } from 'angular-notifier';
import { TextChatService } from "./../../../app/shared/text-chat/text-chat.service";
import { AppService } from "./../../app-service.service";
import { state } from "@angular/animations";
import { CommonService } from "./../../../app/platform/modules/core/services/common.service";
import { HubService } from 'src/app/platform/modules/main-container/hub.service';
@Component({
  selector: 'app-call-notification',
  templateUrl: './call-notification.component.html',
  styleUrls: ['./call-notification.component.css'],
  providers:[PublisherComponent]
})
export class CallNotificationComponent implements OnInit {
  
  callerName:any;
  userType:any;
  
  
  constructor
    (

    
      private dialogRef: MatDialogRef<CallNotificationComponent>,
      private diaglog: MatDialog,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private publisher:PublisherComponent,
      private opentokService: OpentokService,
      private notifierService: NotifierService,
      private commonService: CommonService,
      private appService: AppService,
      private textChatService: TextChatService,

      @Inject(MAT_DIALOG_DATA) public data: any,

      // private encounterService: EncounterService,
      // private notifierService: NotifierService
    ) {
      this.callerName=this.data.callerName;
      this.userType=this.data.userType;
      this.publisher=new PublisherComponent(opentokService,commonService,router,activatedRoute,null,appService,textChatService);
    // this.patientname = data.patientname;
    // this.isEndCall = data.isEndCall;
    // this.isUrgentCall = data.isUrgentCall;
   // this.CallerName = this.notificationPayload.callerName;
    // this.telehealthSessionDetailId = this.notificationPayload.telehealthSessionDetailId;
    // this.notificationType = this.notificationPayload.notificationType;



    
  }

  ngOnInit() {

    
  }
  // Ok(flag: any) {
  //   this.dialogRef.close();
  //   if (flag == 1) {
  //     if (!this.router.url.includes('/web/encounter/soap'))
  //       this.router.navigate(["/web/encounter/soap"], {
  //         queryParams: {
  //           apptId: this.appointmentId,
  //           encId: 0
  //         }
  //       });

  //      this.commonService.changeAppointmentId(0);
  //   }
  //   else if (flag == 2) {
  //     if (!this.router.url.includes('/web/encounter/urgentcall-notes')) {
  //       let urgentCallNoteId = 0;
  //       urgentCallNoteId = Number(localStorage.getItem('urgentCallNoteId'));
  //       this.router.navigate(["/web/encounter/urgentcall-notes"],
  //         {
  //           queryParams: { urgentCallNoteId: urgentCallNoteId }
  //         });
  //       }
  //       this.commonService.changeToUgrentCall(false);
  //   }
  //   else if (flag == 3) {
  //     this.commonService.changeAppointmentId(0);
  //     this.commonService.changePatientAppointmentId(0);
  //   }
  // }
 

  declineCall(): void {
     this.publisher.endCallPublisher();
    this.dialogRef.close('close');
    
console.log(this.userType);
    if (this.userType=='patient') this.router.navigate(["/web/scheduling"]);
    else this.router.navigate(["/web/client/my-scheduling"]);
  }

}





