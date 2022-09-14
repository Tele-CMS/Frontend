import { TextChatModel } from "src/app/shared/text-chat/textChatModel";
//import { TextChatService } from "./text-chat.service";

import { SchedulerService } from "./../../platform/modules/scheduling/scheduler/scheduler.service";

import { AppService } from "./../../app-service.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
  Renderer2,
  ElementRef,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CommonService } from "../../platform/modules/core/services";
import { ChatHistoryModel } from "../../platform/modules/agency-portal/clients/profile/chat-history.model";
import { HubConnection } from "../../hubconnection.service";
import { ScrollbarComponent } from "ngx-scrollbar";
import { DOCUMENT } from "@angular/common";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { $ } from "protractor";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TextChatService } from "./text-chat.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-text-chat",
  templateUrl: "./text-chat.component.html",
  styleUrls: ["./text-chat.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class TextChatComponent implements OnInit {
  @Input() chatInitModel: ChatInitModel;
  @Input() currentRoomId: any;
  @Input() allMessageArray: Array<any> = [];
  @Input() textChatModel: TextChatModel;
  @Input() userInChatRoom: any = [];
  message: string;
  hubConnection: HubConnection;
  isLoading: boolean = false;
  isAdminLogin: boolean = false;
  isClientLogin: boolean = false;
  loaderImage = "../../assets/loader.gif";
  @ViewChild("scrollbar") scrollbarRef: ScrollbarComponent;
  //@ViewChild("scrollMe") private myScrollContainer: ElementRef;
  showChatModal: boolean;
  isMinimalView: boolean = false;
  isWindowHide: boolean = false;
  appointmentDetail: any;
  // callerName: string = "";
  // calleeName: string = "";
  // callerImage: string = "";
  // calleeImage: string = "";
  userRole: string = "";
  appointmentId: number;
  currentLoginUserId: number;
  // @ViewChild("scrollMe") scrollFrame: ElementRef;
  // @ViewChildren("item") itemElements: QueryList<any>;

  // private itemContainer: any;
  // private scrollContainer: any;
  // private items = [];
  // private isNearBottom = true;

  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document,
    private appService: AppService, //private textChatService: TextChatService,
    private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private activateRoute: ActivatedRoute,
    private textChatService: TextChatService
  ) {
    this.appointmentId = 0;
    this.showChatModal = false;
    this.message = "";
    this.hubConnection = new HubConnection();
    this.userInChatRoom = [];
    this.allMessageArray = [];
    this.currentRoomId = 0;
  }

  ngOnInit() { 
    //this.dragElement(document.getElementsByClassName("chat-card")[0]);
    if (
      this.chatInitModel &&
      this.chatInitModel.UserId > 0 &&
      this.chatInitModel.AppointmentId > 0
    )
      this.createHubConnection();
    this.appService.loadingState.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    if (this.allMessageArray.length > 0) {
      //this.scrollToBottom();
      this.scrollbarRef.scrollToBottom(2000);
    }

    this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {

          this.currentLoginUserId = user.id;

          if (user.users3 && user.users3.userRoles) {
            this.userRole = (user.users3.userRoles.userType || "").toUpperCase()
          }

          this.isAdminLogin =
            user.users3 &&
            user.users3.userRoles &&
            (user.users3.userRoles.userType || "").toUpperCase() == "ADMIN";
          this.isClientLogin = this.userRole == "CLIENT";  

        }

        // this.cdr.detectChanges(); // added by shubham i.e on 9/11/2021
      }
    );
  }

  onToggleChatModal() {
    this.showChatModal = !this.showChatModal;
  }
  appendScript(src: string, type: string, tag: string) {
    const s = this.renderer2.createElement(tag);
    s.type = type;
    s.src = src;
    s.text = ``;
    this.renderer2.appendChild(this._document.body, s);
  }
  addClassMinimal() {
    var card = document.getElementsByClassName("chat-card");
    card[0].classList.add("card-minimal");
    this.isMinimalView = true;
  }
  removeClassMinimal() {
    var card = document.getElementsByClassName("chat-card");
    card[0].classList.remove("card-minimal");
    this.isMinimalView = false;
  }
  hideChatWindow() {
    this.isWindowHide = true;
    var chatInitModel1 = new ChatInitModel();
    this.appService.CheckChatActivated(chatInitModel1);
    var textChatModel = new TextChatModel();
    this.appService.ChatUserInit(textChatModel);
    this.appService.SetChatRoomDetail(0);
  }
  dragElement(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById("chatHeader")) {
      // if present, the header is where you move the DIV from:
      document.getElementById("chatHeader").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  createHubConnection() {
    if (this.hubConnection) {
      var token = localStorage.getItem("business_token");
      this.hubConnection.createHubConnection(token).then((response) => {
        this.hubConnection.getHubConnection().onclose(() => {
          this.ReconnectOnClose(
            this.chatInitModel.UserId,
            this.chatInitModel.AppointmentId
          );
          this.getMessageNotifications();
          this.getChatRoomUserList();
        });
        this.hubConnection
          .ConnectToServerWithUserId(
            this.chatInitModel.UserId,
            this.chatInitModel.AppointmentId
          )
          .then((res) => {
            this.getMessageNotifications();
            this.getChatRoomUserList();
          });
      });
    }
  }

  ngAfterViewInit() {
    this.scrollbarRef.scrollToBottom(2000);
    //this.scrollToBottom();
    //this.scrollbarRef.scrollState.subscribe(e => console.log(e));
  }
  sendMessage(event) {
    if (!this.message || !this.message.trim()) return false;
    this.handleNewUserMessage(this.message);
    var currentDate = new Date();
    const messageObj: ChatHistoryModel = {
      message: this.message,
      isRecieved: false,
      chatDate: currentDate.toString(),
      fromUserId: this.chatInitModel.UserId,
      fileType: "",
      messageType: 0,
    };
    this.allMessageArray.push(messageObj);
    this.message = "";
    this.scrollbarRef.scrollToBottom(2000);
    //this.scrollToBottom();
  }
  public uploadFinished = (event) => {
    if (event.statusCode == 200) {
      var currentDate = new Date();
      var data = event.data;
      data.forEach((element) => {
        const messageObj: ChatHistoryModel = {
          message: element.message,
          isRecieved: false,
          chatDate: currentDate.toString(),
          fromUserId: this.chatInitModel.UserId,
          fileType: element.fileType,
          messageType: element.messageType,
        };
        this.allMessageArray.push(messageObj);
        this.scrollbarRef.scrollToBottom(1000);
      });
    }
    // console.log("Upload Finish");
    // console.log(event);
  };
  // private onItemElementsChanged(): void {
  //   if (this.isNearBottom) {
  //     this.scrollToBottom();
  //   }
  // }

  // private scrollToBottom(): void {
  //   this.scrollContainer.scroll({
  //     top: this.scrollContainer.scrollHeight,
  //     left: 0,
  //     behavior: "smooth"
  //   });
  // }

  // private isUserNearBottom(): boolean {
  //   const threshold = 150;
  //   const position =
  //     this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
  //   const height = this.scrollContainer.scrollHeight;
  //   return position > height - threshold;
  // }

  // scrolled(event: any): void {
  //   this.isNearBottom = this.isUserNearBottom();
  // }
  // scrollToBottom(): void {
  //   try {
  //     var scrollHeight = this.myScrollContainer.nativeElement.scrollHeight;
  //     var scrollTop = this.myScrollContainer.nativeElement.scrollTop;
  //     this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  //   } catch (err) {}
  // }
  handleNewUserMessage(message: string = "") {
    if (this.hubConnection.isConnected()) {
      this.hubConnection
        .getHubConnection()
        .invoke(
          "SendMessage",
          message,
          this.chatInitModel.UserId,
          this.currentRoomId,
          this.chatInitModel.AppointmentId
        )
        // .then(() => {
        //   this.getMessageNotifications();
        // })
        .catch((err) =>
          console.error(err, "ReceiveMessageReceiveMessageerror")
        );
      return message;
    } else {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection
          .getHubConnection()
          .invoke(
            "SendMessage",
            message,
            this.chatInitModel.UserId,
            this.currentRoomId,
            this.chatInitModel.AppointmentId
          )
          // .then(() => {
          //   this.getMessageNotifications();
          // })
          .catch((err) =>
            console.error(err, "ReceiveMessageReceiveMessageerror")
          );
        return message;
      });
    }
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
  getMessageNotifications() { 
    this.hubConnection
      .getHubConnection()
      .on("ReceiveMessage", (result, UserId, currentRoomId, appointmentId) => { 
        
        console.log("message from server", result, currentRoomId, appointmentId);
        //text chat component // if call is in progress and if send msg then automaticaly open chat window
        if (appointmentId > 0) {   
          this.appointmentId = appointmentId;
          this.openChatRoom(this.appointmentId);
        }
        //
        if (
          //UserId == this.chatInitModel.UserId &&
          currentRoomId == this.currentRoomId
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
            this.allMessageArray.push(messageObj);
            this.scrollbarRef.scrollToBottom(1000);  
          });
        }
      });
  }
  ReconnectOnClose(userId, roomId) {
    setTimeout(() => {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection
          .ConnectToServerWithUserId(userId, roomId)
          .then((roomId) => {
            // console.log('Restart Connection: user id sent to server : ' + fromUserId);
          });
      });
    }, 5000);
  }

  getChatRoomUserList() {
    this.hubConnection
      .getHubConnection()
      .on("UserConnected", (userId, room) => {
 
        console.log("New User Connected : ", userId);
        var index = this.userInChatRoom.findIndex((x) => x.userId == userId);
        if (index == -1) {
          this.appService
            .getUserInChatRoom(this.currentRoomId, false)
            .subscribe((res) => {
              if (res.statusCode == 200) {
                this.userInChatRoom = res.data;
              }
            });
          //console.log(this.allMessageArray);
        }
      });
  }
  fileToUpload: any;
  url: any;
  files: Array<any> = [];
  onSelectFile(files: FileList) {
    if (files.length === 0) return;

    this.fileToUpload = files.item(0);

    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(this.fileToUpload);

    fileReader.onload = (event: any) => {
      this.url = event.target.result;
    };

    this.files.push({
      data: this.fileToUpload,
      fileName: this.fileToUpload.name,
    });
    this.handleNewChatFile(this.files[0]);
  }
  handleNewChatFile(file: any) {
    if (this.hubConnection.isConnected()) {
      this.hubConnection
        .getHubConnection()
        .invoke(
          "SendFileInMessage",
          file,
          this.chatInitModel.UserId,
          this.currentRoomId
        )
        // .then(() => {
        //   this.getMessageNotifications();
        // })
        .catch((err) =>
          console.error(err, "ReceiveMessageReceiveMessageerror")
        );
      return file;
    } else {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection
          .getHubConnection()
          .invoke(
            "SendFileInMessage",
            file,
            this.chatInitModel.UserId,
            this.currentRoomId
          )
          // .then(() => {
          //   this.getMessageNotifications();
          // })
          .catch((err) =>
            console.error(err, "ReceiveMessageReceiveMessageerror")
          );
        return file;
      });
    }
  }
  videoUrl: string = "";
  isPlay: boolean = false;
  videoRecordPlayback($event: any) {
    
    this.videoUrl = "";
    //var iframe = document.getElementById("iframeVideo");
    this.isPlay = false;
    if ($event != null) {
      //iframe.attributes.("src").set $event.url;);
      this.videoUrl = $event.url; //this.sanitizer.bypassSecurityTrustResourceUrl($event.url);
      this.isPlay = true;
    }
  }
}
