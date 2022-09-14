import { Inject, Injectable } from "@angular/core";
import { HubConnection } from "src/app/hubconnection.service";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus, UrgentCareProviderActionInitModel } from "src/app/shared/models/callModel";
import { ChatHistoryModel } from "../agency-portal/clients/profile/chat-history.model";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { TextChatService } from "src/app/shared/text-chat/text-chat.service";
import { CommonService } from "../core/services";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SaveDocumentComponent } from "src/app/front/save-document/save-document.component";
import { UrgentCareProviderActionComponent } from "src/app/shared/urgentcare-provideraction/urgentcare-provideraction.component";
import { PatientUrgentCareStatusComponent } from "src/app/shared/patient-urgentcare-status/patient-urgentcare-status.component";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { CallNotificationComponent } from "src/app/shared/call-notification/call-notification.component";

@Injectable({
  providedIn: "root",
})
export class HubService {
  private hubConnection: HubConnection;
  appointmentId: number;
  isClientLogin: boolean = false;
  userRole: string = "";
  private chatWidgetManagementNavigationSubject = new BehaviorSubject<any>({} as any);
  public chatWidgetManagementNavigationData = this.chatWidgetManagementNavigationSubject.asObservable().pipe(distinctUntilChanged());
  constructor(
    private appService: AppService,
    private commonService: CommonService,
    private activateRoute: ActivatedRoute,
    private textChatService: TextChatService,
    private appointmentDailog: MatDialog,
    //private dialogModalRef: MatDialogRef<UrgentCareProviderActionComponent>

  ) {
    this.hubConnection = new HubConnection();
    this.appointmentId = 0;
    // added by shubham i.e on 26/11/2021
    this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          if (user.users3 && user.users3.userRoles) {
            this.userRole = (user.users3.userRoles.userType || "").toUpperCase()
          }

          this.isClientLogin = this.userRole == "CLIENT";

        }

        // this.cdr.detectChanges(); // added by shubham i.e on 9/11/2021
      }
    );
    /// added by shubham i.e on 26/11/2021
  }
  createHubConnection(userId: number) {
    if (this.hubConnection) {
      var token = localStorage.getItem("business_token");
      this.hubConnection.createHubConnection(token).then((response) => {
        this.hubConnection.getHubConnection().onclose(() => {
          this.ReconnectOnClose(userId);
        });

        this.hubConnection.ConnectWithBussinessToken(userId).then((res) => {
       //   alert("connect")
          this.getIncomingCallNotifications();
          this.getCallEndNotifications();
          this.getMessageNotifications();
          this.getIncomingUrgentCareProviderNotifications();
          this.getIncomingUrgentCarePatientNotifications();
          console.log("Connection: connection id to server : " + res);
        });
      });
    }
  }
  private ReconnectOnClose(userId: number) {
    setTimeout(() => {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection.ConnectWithBussinessToken(userId).then((res) => {
         // alert("Reconnect")
          this.getIncomingCallNotifications();
          this.getCallEndNotifications();
          console.log("Restart Connection: connection id to server : " + res);
          // console.log('Restart Connection: user id sent to server : ' + fromUserId);
        });
      });
    }, 5000);
  }
  getIncomingCallNotifications() {

    this.hubConnection
      .getHubConnection()
      .on(
        "CallInitiated",
        (appointmentId: number, fromUserId: number, toUserId: number) => {
          //this.dialogModalRef.close();
          this.appointmentDailog.closeAll();
          let previousCallModel: CallInitModel = new CallInitModel();
          this.appService.call.subscribe((callInitModel: CallInitModel) => {
            previousCallModel = callInitModel;
          });
          console.log(
            "Previous Call Initiated For Appointment Id : ",
            previousCallModel.AppointmentId
          );
          let callInitModel = new CallInitModel();
          callInitModel.CallStatus = CallStatus.Started;
          callInitModel.AppointmentId = appointmentId;
          if (previousCallModel.AppointmentId != appointmentId) {
            console.log("Call MOdel Changed : ", callInitModel);
            this.appService.CheckCallStarted(callInitModel);
          }
          console.log("Call Initiated For Appointment : ", appointmentId);
          //var callButton = document.getElementById("divCallButton");
          //callButton.classList.add("active");
        }
      );

      this.hubConnection
      .getHubConnection()
      .on(
        "CallEnd",
        (appointmentId: number, fromUserId: number, toUserId: number,callerName:string,userType:string) => {
          // this.appointmentDailog.closeAll();
          // let previousCallModel: CallInitModel = new CallInitModel();
          // this.appService.call.subscribe((callInitModel: CallInitModel) => {
          //   previousCallModel = callInitModel;
          // });
          console.log(
            "CALL Ended in hub service : "

          ); 
          this.openEndCallActionDialog(callerName,userType);
          // let callInitModel = new CallInitModel();
          // callInitModel.CallStatus = CallStatus.Started;
          // callInitModel.AppointmentId = appointmentId;
          // callInitModel.CallerName=callerName;
          // if (previousCallModel.AppointmentId != appointmentId) {
          //   this.appService.CheckCallStarted(callInitModel);
          // }

        }
      );
  }

  handleIncomingCall(appointmentId: number, userId: number) {
    if (this.hubConnection.isConnected()) {
      this.hubConnection
        .getHubConnection()
        .invoke("CallInitiate", appointmentId, userId)
        // .then(() => {
        //   this.getMessageNotifications();
        // })
        .catch((err) => console.error(err, "Receive Incoming Call"));
      return appointmentId;
    } else {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection
          .getHubConnection()
          .invoke("CallInitiate", appointmentId, userId)
          // .then(() => {
          //   this.getMessageNotifications();
          // })
          .catch((err) => console.error(err, "Receive Incoming Call"));
        return appointmentId;
      });
    }
  }

  getCallEndNotifications() {
    console.log("28 getendcallnotification  is called from hub service  ");

    this.hubConnection
      .getHubConnection()
      .on(
        "CallEnd1",
        (appointmentId: number, fromUserId: number, toUserId: number,callerName:string,userType:string) => {
          // this.appointmentDailog.closeAll();
          // let previousCallModel: CallInitModel = new CallInitModel();
          // this.appService.call.subscribe((callInitModel: CallInitModel) => {
          //   previousCallModel = callInitModel;
          // });
          console.log(
            "CALL Ended in hub service : "

          ); 
          this.openEndCallActionDialog(callerName,userType);
          // let callInitModel = new CallInitModel();
          // callInitModel.CallStatus = CallStatus.Started;
          // callInitModel.AppointmentId = appointmentId;
          // callInitModel.CallerName=callerName;
          // if (previousCallModel.AppointmentId != appointmentId) {
          //   this.appService.CheckCallStarted(callInitModel);
          // }

        }
      );
  }
  openProviderActionDialog(appointmentId: number) {

    const modalPopup = this.appointmentDailog.open(
      UrgentCareProviderActionComponent,
      {
        hasBackdrop: true,
        data: appointmentId,
        width:"60%"
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      // if (result === "SAVE") this.fetchEvents();
    });
  }

  openEndCallActionDialog(callerName: string,userType:string) {

    console.log("29 openendcallactiondialog  is called from hub service  ");
    const modalPopup = this.appointmentDailog.open(
      CallNotificationComponent,
      {
        hasBackdrop: true,
        data: {callerName:callerName,userType:userType},
        width:"60%",
        panelClass: 'notication-modalbox'
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      // if (result === "SAVE") this.fetchEvents();
    });
  }
  openPatientActionDialog() {

    const modalPopup = this.appointmentDailog.open(
      PatientUrgentCareStatusComponent,
      {
        hasBackdrop: true,
        //data: ,
        width:"60%"
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      // if (result === "SAVE") this.fetchEvents();
    });
  }

  // closeDialog(action: string): void {
  //   this.dialogModalRef.close(action);
  // }

  getIncomingUrgentCareProviderNotifications() {

    this.hubConnection
      .getHubConnection()
      .on(
        "CallProviderUrgentCare",
        (appointmentId: number, fromUserId: number, toUserId: number) => {
          this.openProviderActionDialog(appointmentId);
        //   let previousCallModel: UrgentCareProviderActionInitModel = new UrgentCareProviderActionInitModel();
        //   this.appService.ProviderActioncall.subscribe((callInitModel: UrgentCareProviderActionInitModel) => {
        //     previousCallModel = callInitModel;
        //   });
        //   console.log(
        //     "Previous Urgent Call Initiated For Appointment Id : ",
        //     previousCallModel.AppointmentId
        //   );
        //   let callInitModel = new UrgentCareProviderActionInitModel();
        //  // callInitModel.CallStatus = CallStatus.Started;
        //   callInitModel.AppointmentId = appointmentId;

        //     console.log("Call UrgentCare Model Changed : ", callInitModel);
        //     this.appService.ProviderActioncallStarted(callInitModel);

        //   console.log("Urgebt care Call Initiated For Appointment : ", appointmentId);

          //var callButton = document.getElementById("divCallButton");
          //callButton.classList.add("active");
        }
      );
  }

  getIncomingUrgentCarePatientNotifications() {

    this.hubConnection
      .getHubConnection()
      .on(
        "CallPatientUrgentCare",
        (appointmentId: number, fromUserId: number, toUserId: number) => {

          this.openPatientActionDialog();

        }
      );
  }

  getMessageNotifications() {
    this.hubConnection
      .getHubConnection()
      .on("ReceiveMessage", (result, UserId, currentRoomId,appointmentId) => {
        this.chatWidgetManagementNavigationSubject.next(result);
        console.log("message from server", result, currentRoomId);
        //hub service // if call is in progress and if someone send msg then chat window open automaticaly
        if (appointmentId > 0) {
          this.appointmentId = appointmentId;
          this.openChatRoom(this.appointmentId);
        }
        //
        if (
          currentRoomId == 0//this.currentRoomId
        ) {
          result.forEach((element) => {
            var currentDate = new Date();
            const messageObj: ChatHistoryModel = {
              message: element.message,
              isRecieved:
                element.isRecieved != undefined ? element.isRecieved : true,
              chatDate: currentDate.toString(),
              fromUserId: UserId,
              fileType: element.fileType,
              messageType: element.messageType,
            };
            // this.allMessageArray.push(messageObj);
            // this.scrollbarRef.scrollToBottom(1000);
            // console.log(this.allMessageArray);
          });
        }
      });
  }
  openChatRoom(appointmentId: number) {
    this.commonService.loginUser.subscribe((response: any) => {
      if (response.access_token) {
        var chatInitModel = new ChatInitModel();
        chatInitModel.isActive = true;
        chatInitModel.AppointmentId = appointmentId;
        chatInitModel.UserId = response.data.userID;
        if(this.isClientLogin){
          chatInitModel.UserRole = response.data.users3.userRoles.userType;
        }else{
          chatInitModel.UserRole = response.data.userRoles.userType;
        }
        //chatInitModel.UserRole = response.data.userRoles.userType;
        this.appService.CheckChatActivated(chatInitModel);
        //
        this.textChatService.setAppointmentDetail(
          chatInitModel.AppointmentId,
          chatInitModel.UserRole
        );
        //
        this.textChatService.setRoomDetail(
          chatInitModel.UserId,
          chatInitModel.AppointmentId
        );
      }
    });
  }

}
