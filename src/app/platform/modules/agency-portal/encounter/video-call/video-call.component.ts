import { CommonService } from "src/app/platform/modules/core/services";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EncounterService } from "../encounter.service";
//import { ChatService } from "src/app/platform/modules/agency-portal/encounter/mean-video/chat.service";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { HubService } from "../../../main-container/hub.service";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus } from "src/app/shared/models/callModel";

@Component({
  selector: "app-video-call",
  templateUrl: "./video-call.component.html",
  styleUrls: ["./video-call.component.css"],
})
export class VideoCallComponent implements OnInit, OnDestroy {
  appointmentId: number;
  encounterId: number;
  patientAppointmentDetails: any;
  patientAppointment: any;
  staffDetails: any;
  userId: number = 0;

  constructor(
    private activateRoute: ActivatedRoute,
    private encounterService: EncounterService,
    //private chatService: ChatService,
    private commonService: CommonService,
    private hubSevice: HubService,
    private appService: AppService
  ) {
    this.appointmentId = 0;
    this.encounterId = 0;
    this.patientAppointmentDetails = null;
    this.staffDetails = null;
    this.patientAppointment = null;
  }

  ngOnInit() {
    let fullName = "";
    if (localStorage.getItem("access_token")) {
      this.commonService.loginUser.subscribe((user: LoginUser) => {
        if (user.data) {
          let userInfo: any;
          
          this.userId = user.data.userID;
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "CLIENT") {
            userInfo = user.patientData;
            fullName = userInfo.lastName + " " + userInfo.firstName;
          } else {
            userInfo = user.data;
            fullName = "Dr. " + userInfo.lastName + " " + userInfo.firstName;
          }
        } else {
        }
      });
    }

    if (this.activateRoute.snapshot.url[0] && this.activateRoute.snapshot.url[0].path == "check-in-video-call") {
       
      const apptId = this.activateRoute.snapshot.paramMap.get('id');
      var decryptAppID = this.commonService.encryptValue(apptId,false); 
      this.appointmentId = Number(decryptAppID);
      this.encounterId = 0;
      if(this.appointmentId)
      this.getPatientAppointmentDetails();

    } else {
    this.activateRoute.queryParams.subscribe((params) => {
      this.appointmentId =
        params.apptId == undefined ? 0 : parseInt(params.apptId);
      if (this.appointmentId) {
        this.getPatientAppointmentDetails();
        //this.hubSevice.handleIncomingCall(this.appointmentId, this.userId);
        // this.chatService.changename({
        //   username: fullName,
        //   roomname: "room" + this.appointmentId.toString()
        // });
      }
    });
  }
    if (this.appointmentId > 0 && this.userId > 0) {
      this.appService
        .getCallInitiate(this.appointmentId, this.userId)
        .subscribe((res) => {
          console.log(res);
        });
    }
    let callInitModel: CallInitModel = new CallInitModel();
    callInitModel.AppointmentId = this.appointmentId;
    callInitModel.CallStatus = CallStatus.Picked;
    this.appService.CheckCallStarted(callInitModel);
  }

  getPatientAppointmentDetails() {
    this.encounterService
      .GetPatientEncounterDetails(this.appointmentId, this.encounterId, false)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.patientAppointmentDetails =
            response.data.patientAppointment || null;
          if (
            this.patientAppointmentDetails.appointmentStaffs != null &&
            this.patientAppointmentDetails.appointmentStaffs != undefined &&
            this.patientAppointmentDetails.appointmentStaffs.length > 0
          )
            this.staffDetails = this.patientAppointmentDetails.appointmentStaffs[0];
        } else {
          this.patientAppointmentDetails = null;
          this.staffDetails = null;
        }
      });
  }
  ngOnDestroy(): void {
    this.appService.newSelectedScreenSizeSubject.next("1:4");
    const top = screen.height * .10;
    const left = screen.width * .70;
    this.appService.newSelectedVideoPositionSubject.next(left+","+top);
  }
}
