import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewEncapsulation,
  EventEmitter,
  Output
} from "@angular/core";

import { SharedService } from "../shared.service";
import {
  HeaderInfo,
  NavItem,
  MessageNotificationModel,
  UserDocumentNotificationModel,
  NotificationsModel
} from "../models";
import { Router } from "@angular/router";
import { CommonService } from "../../platform/modules/core/services";
import { Subscription } from "rxjs";
import { LoginUser } from "../../platform/modules/core/modals/loginUser.modal";
import { MatDialog } from "@angular/material";
import { ChangePasswordComponent } from "../../platform/modules/agency-portal/change-password/change-password.component";
import { ResponseModel } from "../../super-admin-portal/core/modals/common-model";
import * as moment from "moment";
import { AuthenticationService } from "src/app/platform/modules/auth/auth.service";
import { NotifierService } from "angular-notifier";
@Component({
  selector: "app-layout-header",
  templateUrl: "header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() headerInfo: HeaderInfo;
  @Output() eventChangePassword: EventEmitter<any> = new EventEmitter<any>();
  userInfo: any;
  userNavigations: NavItem[];
  userLocations: Array<any>;
  currentLocationId: number;
  subscription: Subscription;
  messageNotifications: Array<MessageNotificationModel> = [];
  documentNotifications: Array<UserDocumentNotificationModel> = [];
  notificationsURL = "api/Notification/GetHeaderNotification";
  changeMessageStatusURL = "api/Message/ChangeMessageStatus";
  passwordExpiryColorCode = "Red";
  totalUnreadNotificationCount: number;
  isDarkMode:boolean = false;

  isSettingsSidebar:boolean = false;
  isDisplay:boolean = false;
  themeColorValue:string = '';
  themeSchemeValue:number = 0;
  themeLayoutValue:number = 0;

  constructor(
    private sharedService: SharedService,
    private commonService: CommonService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private notifierService:NotifierService
  ) {
    this.userLocations = [];
    this.userInfo = {};
    this.userNavigations = [];
    this.currentLocationId = null;
  }

  ngOnChanges(changes) {
    const headerInfo = changes.headerInfo || null;
    if (headerInfo && headerInfo.currentValue) {
      this.userInfo = headerInfo.currentValue.user;
      this.userLocations = headerInfo.currentValue.userLocations;
      this.userNavigations = headerInfo.currentValue.userNavigations;
    }
  }
  showSettings(value: any){
    this.isSettingsSidebar = value;
  }
  onSelectUserMenu(item: NavItem) {
    console.log("provider ",item);
    
    switch (item.route) {
      case "/web/sign-out":
        this.authenticationService.SetUserOffline();
        this.commonService.logout();
        //sessionStorage.setItem('redirectTo','/web/login');
        
        sessionStorage.setItem("redirectTo", "");
        window.location.href = "/web/login";
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

  onDropdownSelectionChange(value: number) {
    this.commonService.updateCurrentLoginUserInfo(value);
    this.router.navigate(["/web"]);
  }

  ngOnInit() { 
    this.handleGetThemeSettings();

    var themeMode = localStorage.getItem("theme-mode");

    if(themeMode == "dark"){
      this.isDarkMode = true;
    }else{
      this.isDarkMode = false;
    }

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLocationId = user.currentLocationId;
      }
    });
    this.getHeaderNotifications();  
    
  }

  handleGetThemeSettings(){ 
    this.sharedService.getThemeSettings(this.userInfo.id).subscribe((response) => {
      if(response){
        if(response.data){
          const {theme, themeScheme, themeLayout} = response.data;
          this.themeColorValue = theme;
          this.themeSchemeValue = themeScheme
          this.themeLayoutValue = themeLayout;
        }else{
          this.themeColorValue = "appSettings-amber-border-labels";
          this.themeSchemeValue = 1
          this.themeLayoutValue = 1;
        }
      }else{
        this.themeColorValue = "appSettings-amber-border-labels";
        this.themeSchemeValue = 1
        this.themeLayoutValue = 1;
      } 
    })
  }

  handleThemeColor(themeColor:string){
    this.themeColorValue = themeColor;
  }

  handleThemeScheme(themeScheme:number){
    this.themeSchemeValue = themeScheme;
  }

  handleThemeLayout(themeLayout:number){
    this.themeLayoutValue = themeLayout;
  }

  handleUpdateThemeSettings(event:any){
    event.preventDefault(); 
    var data = {
      userId: this.userInfo.id,
      theme: this.themeColorValue,
      themeScheme: this.themeSchemeValue,
      themeLayout: this.themeLayoutValue
    }

    this.sharedService.changeThemeSettings(data).subscribe((response) =>{ 
      if(response.message == "Success"){
        this.notifierService.notify("success", "Theme Settings have been saved successfully"); 
      }else{
        this.notifierService.notify("error", "unable to save theme settings");
      }  
    })
  }

  toggleSidenav() {
    this.sharedService.toggle();
  }
  getHeaderNotifications() {
    this.commonService
      .getAll(this.notificationsURL, {})
      .subscribe((response: ResponseModel) => {
        if (
          response &&
          response.data != undefined &&
          response.statusCode == 200
        ) {
          this.onReceiveNotification(response.data);
          this.messageNotifications =
            response.data.messageNotification != undefined
              ? response.data.messageNotification
              : [];
          // this.documentNotifications =
          //   response.data.userDocumentNotification != undefined
          //     ? response.data.userDocumentNotification
          //     : [];
        }
      });
  }
  // getHeaderNotifications() {
  //   this.commonService
  //     .getAll(this.notificationsURL, {}, false)
  //     .subscribe((response: ResponseModel) => {
  //       if (
  //         response &&
  //         response.data != undefined &&
  //         response.statusCode == 200
  //       ) {
  //         this.onReceiveNotification(response.data);
  //       }
  //     });
  // }
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
  openMailbox(messageId: number = null, parentMessageId = null) {
    if (messageId != null) {
      this.router.navigate(["/web/mailbox"], {
        queryParams: {
          mId: this.commonService.encryptValue(messageId, true),
          pId:
            parentMessageId != null
              ? this.commonService.encryptValue(parentMessageId, true)
              : null
        }
      });
    } else this.router.navigate(["/web/mailbox"]);
  }
  openUser(userInfo: any) {
    this.router.navigate(["/web/manage-users/user-profile"]);
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
