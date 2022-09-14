import { Component, OnInit, Input, OnChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../chat.service';
import * as moment from 'moment';
import { HubConnection } from 'src/app/hubconnection.service';
import { ScrollbarComponent } from 'ngx-scrollbar';
import { format } from 'date-fns';
import { CommonService } from '../../../core/services';
import { HubService } from '../../../main-container/hub.service';
import { LoginUser } from '../../../core/modals/loginUser.modal';

class MessageModel {
  id: number;
  message: string;
  chatDate: string;
  isRecieved: boolean;
  chatDateForWebApp?: string;
}

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css']
})
export class ChatMessagesComponent implements OnInit, OnChanges {
  @Input() chatUserId: number;
  @Input() loginUserId: number;
  @Input() chatUserName: string;
  @Input() chatUserImage: string;
  @Output() onShowHide = new EventEmitter();
  @Input() isOnline: boolean;  
  @ViewChild("scrollbarRef") scrollbarRef: ScrollbarComponent;
  chatMessages: Array<MessageModel>;
  meta: any;
  message: string;
  thumbnailImage: string;
  isMessageLoading: boolean;
  loadingEarlierMsg: boolean;
  pageNo: number;
  pageSize: number;
  previousValue: number;
  userId;
  constructor(
    private commonService: CommonService,
    private chatService: ChatService,
    private _hubConnection: HubConnection,
    private hubService: HubService,
  ) {
    // this.thumbnailImage = '/assets/img/doctor.png';
    this.thumbnailImage = '/assets/img/provider-default-user.svg';
    this.chatMessages = [];
    this.pageNo = 1;
    this.pageSize = 10;
  }

  ngOnInit() {
    this.commonService.loginUser.subscribe(

      (user: LoginUser) => {  
        if (user.data) {
          this.userId = user.data.userID;
          this.hubService.createHubConnection(user.data.userID);
        }});
        this.createHubConnection();
    this.getMessages();
    this.getMessagesWhenChannelCreates()
    
  }
  getMessagesWhenChannelCreates(){
    this.hubService.chatWidgetManagementNavigationData.subscribe((response:any) =>{  
      if (response.toUserId ==  this.userId) { 
        this.getChatHistory();
      }
    })
  }
  showHide() {
    this.onShowHide.emit();
  }

  getMessages() { 
    this.commonService.messageNotificationData.subscribe(
      userMessageObj => {
        if (userMessageObj && userMessageObj.fromUserId == this.chatUserId) {
          this.appendNewMessage(userMessageObj);
        }
      }
    );
    this.commonService.chatUserStatusData.subscribe(
      userObj => {
        if (userObj && userObj.userId > 0) {
          if (userObj.userId == this.chatUserId) {
            this.isOnline = userObj.isOnline || false;
          }
        }
      }
    );
  }

  appendNewMessage(msgObj: MessageModel, isRecieved: boolean = true) {  
    
    //const messageObj: MessageModel = {
    //  id: msgObj.id,
    // // chatDate: moment.utc(msgObj.chatDate).local().format('YYYY-MM-DDTHH:mm:ss'),
    //  chatDate: format(msgObj.chatDate, 'YYYY-MM-DDTHH:mm:ss'),
    //  chatDateForWebApp: format(msgObj.chatDateForWebApp, 'YYYY-MM-DDTHH:mm:ss'),
    //  message: msgObj.message,
    //  isRecieved: isRecieved,
    //}
    msgObj.chatDateForWebApp = format(msgObj.chatDateForWebApp.slice(0, -1), 'YYYY-MM-DDTHH:mm:ss');
    msgObj.chatDate = format(msgObj.chatDate, 'YYYY-MM-DDTHH:mm:ss');
    msgObj.isRecieved = isRecieved;
    this.chatMessages.push(msgObj);
    this.scrollbarRef && this.scrollbarRef.scrollToBottom(200);
  }

  ngOnChanges(changes) { 
    const chatUserId = changes.chatUserId.currentValue || null;
    if (chatUserId > 0 && chatUserId != changes.chatUserId.previousValue) {
      this.chatMessages = [];
      this.pageNo = 1;
      this.isOnline = changes.isOnline && changes.isOnline.currentValue || false;
      this.getChatHistory();
    }
  }

  getChatHistory(isNewUser: boolean = true) {
    isNewUser ? this.isMessageLoading = true : this.loadingEarlierMsg = true;
    this.chatService.getCareChatHistory(this.loginUserId, this.chatUserId, this.pageNo, this.pageSize).subscribe(
      response => {
      isNewUser ? this.isMessageLoading = false : this.loadingEarlierMsg = false;
    if (response.statusCode == 200) {
          if (response.data != null && response.data.length > 0) {
              this.chatMessages.splice(0, 0, ...response.data);
            this.chatMessages.forEach((x) => {
              //x.chatDate = moment.utc(x.chatDate).local().format('YYYY-MM-DDTHH:mm:ss'); //Added code on 02-12-2020 for show the Patient Loaction wise dateTime
              x.chatDateForWebApp = format(x.chatDateForWebApp, 'YYYY-MM-DDTHH:mm:ss');
            })
            this.chatMessages.sort((a, b) => a.id - b.id);
            if (isNewUser) {
              setTimeout(() => {
                this.scrollbarRef && this.scrollbarRef.scrollToBottom();
                this.previousValue = 0;
              }, 100);
            } else {
              let scrollHeight = this.scrollbarRef && this.scrollbarRef.view.scrollHeight;
              if (scrollHeight > 0)
              setTimeout(() => {
                  this.scrollbarRef && this.scrollbarRef.scrollYTo(scrollHeight - (this.previousValue || 0));
                  this.previousValue = scrollHeight;
                }, 100);
            }
          }
          this.meta = response.data != null && response.meta ? response.meta : {};
        } else {
          this.chatMessages = [];
        }
      }, () => { isNewUser ? this.isMessageLoading = false : this.loadingEarlierMsg = false; }
    )
  }

  onInputMessage(inputBox:any) {  
    const msg = this.message;
    if (!msg || !msg.trim()) {
      inputBox.focus();
      return false;
    }
    const chatDate = moment().format('YYYY-MM-DDTHH:mm:ss');
    this.SendMessage(msg, chatDate)
    this.message = '';
    inputBox.focus();
  }

  loadEarlierMessages() { 
    if (this.pageNo < (this.meta && this.meta.totalPages)) {
          this.pageNo = this.pageNo + 1;
          this.getChatHistory(false);
        }
  }

  compareDate(date, dateIndex) {
    let datesArray = this.chatMessages.map((obj, index) => obj.chatDateForWebApp.split('T')[0]);
  return new Date(date) <= new Date()  && datesArray.indexOf(date.split('T')[0]) === dateIndex? true : false;
}
  // singalR methods --------

  createHubConnection() { 
    if (this._hubConnection) {
      var token = localStorage.getItem("business_token");
      this._hubConnection.createHubConnection(token).then((response) => {
        this._hubConnection.getHubConnection().onclose(() => {
          this.ReconnectOnClose(
            this.userId,
            0
          );
        //  this.getMessageNotifications();
        //  this.getChatRoomUserList();
        });
        this._hubConnection
          .ConnectToServerWithUserId(
            this.userId,
           0
          )
          .then((res) => {
          //  this.getMessageNotifications();
           // this.getChatRoomUserList();
          });
      });
    }
  }

  ReconnectOnClose(userId, roomId) {
    setTimeout(() => {
      this._hubConnection.restartHubConnection().then(() => {
        this._hubConnection
          .ConnectToServerWithUserId(userId, roomId)
          .then((roomId) => {
            // console.log('Restart Connection: user id sent to server : ' + fromUserId);
          });
      });
    }, 5000);
  }
  SendMessage(message: string = '', chatDate: string) {
  
    const chatModel = {
      id: null,
      fromUserId: this.loginUserId,
      toUserId: this.chatUserId,
      message,
      chatDate: chatDate,
      isMobileUser: true,
      chatType : 2
    }
    if (this._hubConnection.isConnected()) {
      this._hubConnection.getHubConnection()
        .invoke('SendMessages', chatModel).then((res) => {
         
          if(res && res.data) {
          this.appendNewMessage(res.data, false);
        }
        })
        .catch((err) => console.error(err, 'ReceiveMessageReceiveMessageerror'));
      return message;
    } else {
      this._hubConnection.restartHubConnection().then(() => {
        this._hubConnection.getHubConnection()
          .invoke('SendMessages', chatModel).then((res) => {
         
            if(res && res.data) {
              this.appendNewMessage(res.data, false);
          }
          })
          .catch((err) => console.error(err, 'ReceiveMessageReceiveMessageerror'));
        return message;
      });
    }
  }
}
