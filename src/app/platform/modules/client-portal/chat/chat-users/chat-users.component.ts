import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { CommonService } from '../../../core/services';
import * as moment from 'moment';

class UserModel {
  id: number;
  value: string;
  photoThumbnailPath: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.css']
})
export class ChatUsersComponent implements OnInit {
  usersList: Array<UserModel>
  currentLocationId: number;
  loginClientId: number;
  isRoleClient: boolean;
  selectedUserId: number;
  selectedUserName: string;
  selectedUserImage: string;
  selectedUserOnline: boolean;
  loginUserId: number;
  thumbnailImage: string;
  showChatUserList: boolean;
  unReadMessagesList: Array<any>;
  onlineUserIds: Array<any>;
  constructor(
    private chatService: ChatService,
    private commonService: CommonService
  ) {
    this.showChatUserList = false;
    this.usersList = [];
    this.unReadMessagesList = [];
    this.onlineUserIds = [];
    // this.thumbnailImage = '/assets/img/doctor.png';
    this.thumbnailImage = '/assets/img/provider-default-user.svg';
   }

   onShowHide() {
     this.showChatUserList = !this.showChatUserList;
   }
   onHideShow() {
    this.showChatUserList = !this.showChatUserList;
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.isRoleClient = user.users3 && user.users3.userRoles && (user.users3.userRoles.userType || '').toUpperCase() == 'CLIENT';
        if (this.isRoleClient) {
          this.loginClientId = user.id;
          this.currentLocationId = user.locationID;
          this.loginUserId = user.userID;  
          this.getCareManagersList();
        }
      }
    });
    this.commonService.messageNotificationData.subscribe(
      userMessageObj => {
        if (userMessageObj && userMessageObj.fromUserId != this.selectedUserId) {
          this.unReadMessagesList.push(userMessageObj);
        }
      }
    );
    this.commonService.chatUserStatusData.subscribe(
      userObj => {
        if (userObj && userObj.userId > 0) {
          if(userObj.isOnline)
            this.onlineUserIds.push(userObj.userId);
          else {
            const index = this.onlineUserIds.findIndex(x => x == userObj.userId);
            this.onlineUserIds.splice(index, 1);
          }
        }
      }
    );
  }

  onSearchUser(event) {
    let searchText = event.target.value;
    if ((searchText && searchText.trim().length >=3) || searchText == '')
      this.getCareManagersList(searchText);
  }

  getCareManagersList(searchText: string = '') { 
    this.chatService.getCareManagersList(this.loginClientId, searchText, 1, 20).subscribe(
      response => {
        if(response.statusCode == 200) {
          this.usersList = response.data || [];
          this.onlineUserIds = this.usersList.filter(x => x.isOnline == true).map(x => x.id);
        } else {
          this.usersList = [];
        }
      }
    )
  }

  onClickUser(userId: number, userName: string, img: string) {
    this.selectedUserId = userId;
    this.selectedUserName = userName;
    this.selectedUserImage = img;
    this.selectedUserOnline = this.onlineUserIds.includes(userId) || false;

    let unReadIndex = this.unReadMessagesList.findIndex(x => x.fromUserId == this.selectedUserId);
    if(unReadIndex > -1)
      this.unReadMessagesList = this.unReadMessagesList.filter(x => x.fromUserId != this.selectedUserId);
  }

  checkForUnreadCounts(userId: number) {
    return (this.unReadMessagesList || []).filter(x => x.fromUserId == userId).length;
  }

  unreadTimeFromNow(userId: number) {
    return moment((this.unReadMessagesList || []).filter(x => x.fromUserId == userId).sort((a, b) => b.id - a.id)[0].chatDate).fromNow();
  }

}
