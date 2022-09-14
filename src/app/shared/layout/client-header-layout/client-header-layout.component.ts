import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewEncapsulation,
  EventEmitter,
  Output
} from "@angular/core";

import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LoginUser } from "../../../platform/modules/core/modals/loginUser.modal";
import { MatDialog } from "@angular/material";
import { ChangePasswordComponent } from "../../../platform/modules/agency-portal/change-password/change-password.component";
import { ResponseModel } from "../../../super-admin-portal/core/modals/common-model";
import { SharedService } from "../../shared.service";
import { CommonService } from "../../../platform/modules/core/services";
import * as moment from "moment";
import {
  HeaderInfo,
  NavItem,
  MessageNotificationModel,
  UserDocumentNotificationModel
} from "../../models";
import { debug } from "util";
import { HubConnection } from "src/app/hubconnection.service";

@Component({
  selector: "app-client-header-layout",
  templateUrl: "./client-header-layout.component.html",
  styleUrls: ["./client-header-layout.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class ClientHeaderLayoutComponent implements OnInit, OnChanges {
  @Input() headerInfo: HeaderInfo;
  @Output() eventChangePassword: EventEmitter<any> = new EventEmitter<any>();
  documentNotifications: Array<UserDocumentNotificationModel> = [];
  notificationsURL = "api/Notification/GetHeaderNotification";
  changeMessageStatusURL = "api/Message/ChangeMessageStatus";
  totalUnreadNotificationCount: number;
  userInfo: any;
  patientData: any;
  userNavigations: NavItem[];
  //userLocations: Array<any>;
  //currentLocationId: number;
  subscription: Subscription;
  isDarkMode:boolean = false;
  
  constructor(
    private sharedService: SharedService,
    private commonService: CommonService,
    private router: Router,
    private _hubConnection: HubConnection
  ) {
    //this.userLocations = [];
    this.userInfo = {};
    this.userNavigations = [];
    //this.currentLocationId = null;
  }

  ngOnChanges(changes) {
    const headerInfo = changes.headerInfo || null;
    if (headerInfo && headerInfo.currentValue) {
      this.userInfo = headerInfo.currentValue.user;
      //this.userLocations = headerInfo.currentValue.userLocations;
      this.userNavigations = headerInfo.currentValue.userNavigations;
    }
  }

  onSelectUserMenu(item: NavItem) {
    switch (item.route) {
      case "/web/sign-out":
        this.commonService.logout();
        //sessionStorage.setItem('redirectTo','/web/client-login');
        sessionStorage.setItem("redirectTo", "");
        window.location.href = "/web/client-login";
        // location.reload();
        break;
      case "":
        this.eventChangePassword.emit();
        break;
      default:
        item.route && this.router.navigate([item.route]);
        break;
    }
  }

  ngOnInit() {

    var themeMode = localStorage.getItem("theme-mode");

    if(themeMode == "dark"){
      this.isDarkMode = true;
    }else{
      this.isDarkMode = false;
    }

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user) {

        this.patientData = user.patientData;
      }
    });
    this.getHeaderNotifications();
    this.createHubConnection();
  }

  createHubConnection() {
    if (this._hubConnection) {
        this._hubConnection.createHubConnection(JSON.parse(localStorage.getItem('access_token')))
            .then(
                () => {
                    this.getMessages();
                    this.checkUserOnline();
                    this.getNotification();
                    this._hubConnection.getHubConnection().onclose(() => {
                        this.ReconnectOnClose();
                    });
                }
            )
    }
}

ReconnectOnClose() {
    setTimeout(() => {
        this._hubConnection.restartHubConnection().then(() => {
            this.getMessages();
            this.checkUserOnline();
            this.getNotification();
        });
    }, 5000);
}


  getMessages() {
    this._hubConnection.getHubConnection().on('ReceiveMessage', (result) => {
        console.log('message from server ', result);
        this.commonService.updateMessageNotification(result);
    });
}

getNotification() {
  this._hubConnection.getHubConnection().on('MobileNotificationResponse', (result) => {
      console.log('message from organization', result);
      this.onReceiveNotification(result.data);
  });
}

checkUserOnline() {
  this._hubConnection.getHubConnection().on('CheckOnline', (result) => {
      console.log('check online user ', result);
      this.commonService.updateUserStatus(result);
  });
}


  toggleSidenav() {
    this.sharedService.toggle();
  }

  getHeaderNotifications() {

    this.commonService
      .getAll(this.notificationsURL, {}, false)
      .subscribe((response: ResponseModel) => {
        if (
          response &&
          response.data != undefined &&
          response.statusCode == 200
        ) {
          this.onReceiveNotification(response.data);
        }
      });
  }
  onReceiveNotification(notificationResponse: any) {

    this.totalUnreadNotificationCount =
      notificationResponse.unReadNotificationCount.totalUnReadNotification;
    this.documentNotifications =
      notificationResponse.userDocumentNotification != undefined
        ? notificationResponse.userDocumentNotification
        : [];
    this.documentNotifications.forEach(v => {
      v.timeStamp = moment
        .utc(v.timeStamp)
        .local()
        .format("YYYY-MM-DD, h:mm a");
      switch (v.type) {
        case "UserInvitation":
          v.notificationAction = v.type;
          v.message = v.message;

          //  v.message = v.patientName + " has requested appointment at ";
          break;

        case "ChatMessage":
          v.message = v.message;
          break;
      }
    });
  }

  changeNotificationStatus(messageId: number) {
    this.commonService
      .patch(
        this.changeMessageStatusURL +
          "?MessageId=" +
          messageId +
          "&Unread=" +
          false,
        {}
      )
      .subscribe((response: ResponseModel) => {

        if (response != null && response.statusCode == 200) {
          this.getHeaderNotifications();
        }
      });
  }

  handleSwitchTheme(){ 
    if(this.isDarkMode){
      this.isDarkMode = false;
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme-mode","light");
    }else{
      this.isDarkMode = true;
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme-mode","dark");
    }  
  }
}
