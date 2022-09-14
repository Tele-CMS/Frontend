import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CommonService } from "../../platform/modules/core/services";
import { ChatHistoryModel } from "../../platform/modules/agency-portal/clients/profile/chat-history.model";
import { HubConnection } from "../../hubconnection.service";
import { ScrollbarComponent } from "ngx-scrollbar";
import * as moment from 'moment';
import { format } from "date-fns";
import { HubService } from "src/app/platform/modules/main-container/hub.service";
@Component({
  selector: "app-chat-widget",
  templateUrl: "./chat-widget.component.html",
  styleUrls: ["./chat-widget.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ChatWidgetComponent implements OnInit, AfterViewInit {
  @Input() fromUserId: number;
  @Input() toUserId: number;
  @Input() allMessageArray: Array<ChatHistoryModel>;
  @Input() imgSource: string = "";
  @Input() badge: number;
  @Input() title: string = "";
  @Input() subTitle: string = "";
  @Input() showCloseButton: boolean = false;
  @Input() autoFocus: boolean = true;
  @Input() isRoleClient: boolean = false;
  // @Input() meta: any;
  // @Output() onLoadEarlier = new EventEmitter();
  message: string;
  hubConnection: HubConnection;
  @ViewChild("scrollbar") scrollbarRef: ScrollbarComponent;

  showChatModal: boolean;
  careManagerId: number = null;
  // loadingEarlierMsg: boolean = false;
  // pageNo: number = 1;
  // previousScrollPosition: number;
  constructor(
    private commonService:CommonService,
    private hubConnetionService: HubService
  ) {
    this.showChatModal = false;
    this.message = "";
    this.hubConnection = new HubConnection();
  }

  onToggleChatModal() {
    this.showChatModal = !this.showChatModal;
    if(this.showChatModal){
      setTimeout(() => {
        this.scrollbarRef && this.scrollbarRef.scrollToBottom();
        this.scrollbarRef.update();
      }, 1000);
    } 
  }
  // loadEarlierMessages() {
  //   if (this.pageNo < (this.meta && this.meta.totalPages)) {
  //     this.pageNo = this.pageNo + 1;
  //     this.loadingEarlierMsg = true;
  //     this.onLoadEarlier.emit({ pageNo: this.pageNo });
  //     this.previousScrollPosition = this.scrollbarRef.view.offsetWidth;
  //     // this.scrollbarRef && this.scrollbarRef.scrollToBottom()
  //   }
  // }
  ngOnInit() {    
    
    this.createHubConnection();
    this.commonService.chatNavigationData.subscribe(({ isOpenChat, careManagerId }) => { 
      
      if (isOpenChat) {
        this.showChatModal = true;
        this.careManagerId = careManagerId > 0 ? careManagerId : null
        if (this.careManagerId != null && this.isRoleClient) {
          // this.isCMSelected = true
          // this.onCareManagerSelection.emit({ CMId: this.careManagerId, CMName: '' })
        }
        setTimeout(() => {
          this.scrollbarRef && this.scrollbarRef.scrollToBottom();
          this.scrollbarRef.update();
        }, 1000);
      }
    });
    this.getMessagesWhenChannelCreates(); 
  }
  getMessagesWhenChannelCreates(){
    this.hubConnetionService.chatWidgetManagementNavigationData.subscribe((response:any) =>{ 
      
      if (response.fromUserId == this.toUserId) { 
        var currentDate = new Date();
        const messageObj: ChatHistoryModel = {
          message: response.message,
          isRecieved: true, 
          chatDate: currentDate.toString(),
          chatDateForWebApp: currentDate.toString(),
          fromUserId: response.fromUserId,
          fileType: response.fileType,
          messageType: response.messageType,
        };
        this.allMessageArray.push(messageObj);
        if(this.showChatModal){
          setTimeout(() => {
            this.scrollbarRef && this.scrollbarRef.scrollToBottom();
            this.scrollbarRef.update();
          }, 1000);
        }
        
      }
    })
  }
  createHubConnection() {
    if (this.hubConnection) {
      var token = JSON.parse(localStorage.getItem("access_token"));
      this.hubConnection.createHubConnection(token).then(response => {
        this.hubConnection.getHubConnection().onclose(() => {
          this.ReconnectOnClose(this.fromUserId);
        });
        this.hubConnection
          .ConnectToServerWithUserId(this.fromUserId, 1)
          .then(res => {
            this.getMessageNotifications();
          });
      });
    }
  }

  ngAfterViewInit() { 
    // this.scrollbarRef.scrollToBottom(2000);
  }
  sendMessage(event: any, input: any) {
    if (!this.message || !this.message.trim()) {
      input.focus();
      return false;
    }
    const chatDate = format(new Date(), 'YYYY-MM-DDTHH:mm:ss');
    this.handleNewUserMessage(this.message, chatDate);
    this.message = '';
    input.focus();
  }

  compareDate(date, dateIndex) {  
    let datesArray = this.allMessageArray.map((obj, index) => obj.chatDateForWebApp.split('T')[0]);
    return new Date(date) < new Date() && datesArray.indexOf(date.split('T')[0]) === dateIndex ? true : false;
  }
  // handleNewUserMessage(message: string = "") {
  //   // if (this.hubConnection.isConnected()) {
  //   //   this.hubConnection
  //   //     .getHubConnection()
  //   //     .invoke("SendMessage", message, this.fromUserId, this.toUserId)
  //   //     .catch(err => console.error(err, "ReceiveMessageReceiveMessageerror"));
  //   //   return message;
  //   // } else {
  //   //   this.hubConnection.restartHubConnection().then(() => {
  //   //     this.hubConnection
  //   //       .getHubConnection()
  //   //       .invoke("SendMessage", message, this.fromUserId, this.toUserId)
  //   //       .catch(err =>
  //   //         console.error(err, "ReceiveMessageReceiveMessageerror")
  //   //       );
  //   //     return message;
  //   //   });
  //   // }
  //   const chatDate = moment().format('YYYY-MM-DDTHH:mm:ss');
  //   const chatModel = {
  //     id: null,
  //     fromUserId: this.fromUserId,
  //     toUserId: this.toUserId,
  //     message,
  //     chatDate: chatDate,
  //     isMobileUser: true,
  //   }
  //   if (this.hubConnection.isConnected()) {
  //     this.hubConnection.getHubConnection()
  //       .invoke('SendMessages', chatModel).then((res) => {
         
  //         if(res && res.data) {
  //         this.appendNewMessage(res.data, false);
  //       }
  //       })
  //       .catch((err) => console.error(err, 'ReceiveMessageReceiveMessageerror'));
  //     return message;
  //   } else {
  //     this.hubConnection.restartHubConnection().then(() => {
  //       this.hubConnection.getHubConnection()
  //         .invoke('SendMessages', chatModel).then((res) => {
         
  //           if(res && res.data) {
  //             this.appendNewMessage(res.data, false);
  //         }
  //         })
  //         .catch((err) => console.error(err, 'ReceiveMessageReceiveMessageerror'));
  //       return message;
  //     });
  //   }
  // }
  handleNewUserMessage(message: string = '', chatDate: string) {
    const chatModel = {
      id: null,
      fromUserId: this.fromUserId,
      toUserId: this.toUserId,
      message,
      chatDate: chatDate,
      isMobileUser: this.isRoleClient ? true : false,
      chatType : 1
    }
    if (this.hubConnection.isConnected()) {
      this.hubConnection.getHubConnection()
        .invoke('SendMessages', chatModel).then((res) => {
          if (res && res.data) {
            this.appendNewMessage(res.data, false);
          }
        })
        .catch((err) => console.error(err, 'ReceiveMessageReceiveMessageerror'));
      return message;
    } else {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection.getHubConnection()
          .invoke('SendMessages', chatModel).then((res) => {
            if (res && res.data) {
              this.appendNewMessage(res.data, false);
            }
          })
          .catch((err) => console.error(err, 'ReceiveMessageReceiveMessageerror'));
        return message;
      });
    }
  }
  
  getMessageNotifications() {
    this.hubConnection
      .getHubConnection()
      .on("ReceiveMessage", (result, fromUserId) => {  
        
        if (fromUserId == this.toUserId) { 
          
          const messageObj: ChatHistoryModel = {
            message: result,
            isRecieved: true,
            
          };
          this.allMessageArray.push(messageObj); 
          
          this.scrollbarRef.scrollToBottom();
        }
      });
  }
  ReconnectOnClose(fromUserId) {
    setTimeout(() => {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection.ConnectToServerWithUserId(fromUserId, 1).then(() => {
          // console.log('Restart Connection: user id sent to server : ' + fromUserId);
        });
      });
    }, 5000);
  }


  appendNewMessage(msgObj: ChatHistoryModel, isRecieved: boolean = true) {
    //const messageObj: ChatHistoryModel = {
    //  id: msgObj.id,
    //  // chatDate: moment.utc(msgObj.chatDate).local().format('YYYY-MM-DDTHH:mm:ss'),
    //  chatDateForWebApp: format(msgObj.chatDateForWebApp, 'YYYY-MM-DDTHH:mm:ss'),
    //  message: msgObj.message,
    //  isRecieved: isRecieved,
    //}
    msgObj.chatDateForWebApp = format(msgObj.chatDateForWebApp.slice(0, -1), 'YYYY-MM-DDTHH:mm:ss');
    msgObj.isRecieved = isRecieved;
    this.allMessageArray.push(msgObj);
    this.scrollbarRef && this.scrollbarRef.scrollToBottom(200);
  }

}
