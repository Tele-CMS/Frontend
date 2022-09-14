import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus } from "../models/callModel";
import { CommonService } from "src/app/platform/modules/core/services";
import { Router } from "@angular/router";
import { Observable, Subscription, Subject } from "rxjs";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";

@Component({
  selector: "app-call-button",
  templateUrl: "./call-button.component.html",
  styleUrls: ["./call-button.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CallButtonComponent implements OnInit {
  callInitModel: CallInitModel;
  loggedInUserName:any;
  userId;
  private subscription: Subscription;
  constructor(
    private appService: AppService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.callInitModel = new CallInitModel();
  }

  ngOnInit() { 
    this.appService.call.subscribe((callInitModel: CallInitModel) => {

      this.callInitModel = callInitModel;
    });
  this.checkLoggedInClient() ;

  }
  checkLoggedInClient() {
    this.subscription = this.commonService.loginUser.subscribe(
      (user: any) => {

        if (user.data) {
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "CLIENT") {

            this.loggedInUserName = user.patientData ? user.patientData.firstName + " " + user.patientData.lastName : '';
          }
          else {
            this.loggedInUserName = user.data.firstName + ' ' + user.data.lastName;
          }

      }})
  }

  pickCall() {

    this.callInitModel.CallStatus = CallStatus.Picked;
    this.appService.CheckCallStarted(this.callInitModel);
    localStorage.setItem('apptId', this.commonService.encryptValue(this.callInitModel.AppointmentId,true));
    this.commonService.userRole.subscribe((role) => {
      if (role.toLowerCase() == "provider") {
        // this.router.navigate(["/web/encounter/soap"], {
        //   queryParams: {
        //     apptId: this.commonService.encryptValue(this.callInitModel.AppointmentId,true),
        //     encId: 0,
        //   },
        // });
        this.router.navigate(["/web/waiting-room/check-in-soap/" + this.commonService.encryptValue(this.callInitModel.AppointmentId,true)]);

        //this.router.navigate(["/web/waiting-room/check-in-video-call/"+this.callInitModel.AppointmentId]);
      } else {
        // this.router.navigate(["/web/waiting-room/check-in-video-call/"+this.callInitModel.AppointmentId]);
        this.router.navigate(["/web/waiting-room/check-in-video-call/"+this.commonService.encryptValue(this.callInitModel.AppointmentId,true)]);
        // this.router.navigate(["/web/encounter/video-call"], {
        //   queryParams: {
        //     apptId: this.callInitModel.AppointmentId,
        //   },
        // });
      }
    });
  }
  declineCall() { 
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
    
        this.userId = user.data.userID;
      }
    });
          if (this.callInitModel.AppointmentId > 0 && Number(this.userId) > 0) {
          console.log("inside publisher method")
          this.appService
            .getEndCall(this.callInitModel.AppointmentId , Number(this.userId))
            .subscribe((res) => {
              
            });
          }
    this.callInitModel.CallStatus = CallStatus.Declined;
    this.callInitModel.AppointmentId = 0;
    this.appService.CheckCallStarted(this.callInitModel);
  }
}
