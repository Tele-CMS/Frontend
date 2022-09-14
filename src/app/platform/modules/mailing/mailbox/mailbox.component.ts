import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MailboxService } from '../mailbox.service';
import { ResponseModel, FilterModel } from '../../core/modals/common-model';
import { MessageCountModel, MessageModel } from '../mailbox.model';
import { CommonService } from '../../core/services';
import { LoginUser } from '../../core/modals/loginUser.modal';
import { format } from 'date-fns';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable, of } from 'rxjs';
import { startWith, map, switchMap, finalize } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { MediaMatcher } from '@angular/cdk/layout';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MailboxComponent implements OnInit {
  composeMsgForm: FormGroup;
  messageCounts: MessageCountModel;
  userId: number;
  subscription: any;
  messages: Array<MessageModel> = [];
  message: Array<MessageModel> = [];
  forStaff: boolean = true;
  inboxMsg: boolean = false;
  sentsg: boolean = false;
  delMsg: boolean = false;
  favMsg: boolean = false;
  currentDate = new Date();
  composeMessageFlag: boolean = false;
  filterModel: FilterModel;
  dataURL: any;
  fileList: any = [];
  mobileQuery: MediaQueryList;
  leftMenu: boolean;
  _mobileQueryListener: () => void;
  composeMessageObj: MessageModel;
  delMessagesArray: number[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  //separatorKeysCodes: number[] = [ENTER, COMMA];
  userControl = new FormControl();
  filteredUsers$: Observable<any[]>;
  users: any = []; ccusers: any = [];

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private mailboxService: MailboxService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    this.filterModel = new FilterModel();
    this.filterModel.pageSize = 100;
    this.getLoginUser();
    this.filteredUsers$ = this.userControl.valueChanges
      .pipe(
        startWith(''),
        // use switch map so as to cancel previous subscribed events, before creating new once
        switchMap(value => {
          if (value != null && typeof (value) == "string") {
            if (value.length > 2) {
              return this.getUserList(value).pipe()
            } else {
              // if no value is present, return null
              return of(null);
            }
          }
          else return of(null);
        })
      );
  }

  menuCollapseWithResize = () => {
    if (window.innerWidth < 1200) {
      this.leftMenu = false;
    }
    if (window.innerWidth > 1200) {
      this.leftMenu = true;
    }
  }

  toggleLeftMenu() {
    this.leftMenu = !this.leftMenu;
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let messageId = params.mId == undefined ? null : this.commonService.encryptValue(params.mId, false);
      let parentMessageId = params.pId == undefined ? null : this.commonService.encryptValue(params.pId, false);
      if (messageId != null && messageId != undefined)
        this.getMessageById(messageId, parentMessageId);
    });
    window.addEventListener('resize', this.menuCollapseWithResize);
    if (window.innerWidth < 1200) {
      this.leftMenu = false;
    }
    this.messageCounts = new MessageCountModel();
    this.getMessageCount();
    this.inboxMsg = true;
    this.getInboxMessages();

  }

  onNoClick(): void {
    this.message = null;
  }

  displayFn(user?: any): string | undefined {
    return user ? user.value : undefined;
  }
  composeMessage(id: number = null, show: boolean = false) {
    this.composeMessageFlag = show;
    this.users = [];
    this.composeMessageObj = new MessageModel();
    this.composeMessageObj.fromUserId = this.userId;
  }
  parentClick(event: any) {
    this.messages.forEach(x => {
      x.isCheckBoxClicked = event.checked;
      let index = this.delMessagesArray.findIndex(y => y == x.messageId);
      if (event.checked) {
        if (index == -1) this.delMessagesArray.push(x.messageId)
      }
      else {
        if (index != -1) this.delMessagesArray.splice(index, 1)
      }
    });
  }
  queueMessagesToRemove(event: any, id: number) {
    this.delMessagesArray.push(id);
  }
  deleteMessage(messageId: number, parentMessageId: number, isThreadType: boolean = false, fromInbox: boolean = false) {
    if (isThreadType && (parentMessageId == undefined || parentMessageId == null || parentMessageId == 0))
      parentMessageId = messageId;
    if (fromInbox == false) {
      this.mailboxService.deleteSentMessages({ id: [messageId] }).subscribe((response: ResponseModel) => {
        if (response != null) {
          if (response.statusCode == 200) {
            this.notifier.notify('success', response.message)

            this.getMessageCount();
            this.refreshMessagesData();
            this.getMessageById(messageId, parentMessageId);
          } else {
            this.notifier.notify('error', response.message)
          }
        }
      });
    }
    else {
      this.mailboxService.deleteInboxMessages({ id: [messageId] }).subscribe((response: ResponseModel) => {
        if (response != null) {
          if (response.statusCode == 200) {
            this.notifier.notify('success', response.message)
            this.getMessageCount();
            this.refreshMessagesData();
            this.getMessageById(messageId, parentMessageId);
          } else {
            this.notifier.notify('error', response.message)
          }
        }
      });
    }
  }
  deleteMessages() {
    if (this.delMessagesArray != null && this.delMessagesArray.length > 0) {
      this.mailboxService.deleteInboxMessages({ id: this.delMessagesArray }).subscribe((response: ResponseModel) => {
        if (response != null) {
          if (response.statusCode == 200) {
            this.composeMessageFlag = false;
            this.notifier.notify('success', response.message);
            this.getMessageCount();
            this.refreshMessagesData();
          } else {
            this.notifier.notify('error', response.message);
          }
        }
      });
    }
    else this.notifier.notify('error', "Please select atleast one message");
  }
  setMessageAsFavourite(messageId: number, fromInbox: boolean, parentMessageId: number, favourite: boolean = false, screen: string = '', isThreadType: boolean = false) {
    if (isThreadType && (parentMessageId == undefined || parentMessageId == null || parentMessageId == 0))
      parentMessageId = messageId;
    this.mailboxService.setMessageAsFavourite(messageId, fromInbox, (favourite == false ? true : false)).subscribe((response: ResponseModel) => {
      if (response != null) {
        if (response.statusCode == 200) {

          this.notifier.notify('success', response.message)

          if (screen == "list") {

            this.refreshMessagesData();
            if (this.message != undefined && this.message.length > 0) {
              this.getMessageById(messageId, parentMessageId);
            }
          }
          else if (screen == "msgDetail") {
            this.getMessageCount();
            this.refreshMessagesData();
            this.getMessageById(messageId, parentMessageId);
          }
        } else {
          this.notifier.notify('error', response.message)
        }

      }
    });
  }
  sendMessage() {
    if (this.users != null && this.users != null && this.users.length > 0) {
      //Chnage th functionaliti t avoid all the lopps used for arrachments
      let requestObj = {
        isStaff: this.forStaff,
        parentMessageId: this.composeMessageObj.parentMessageId,
        subject: this.composeMessageObj.subject,
        toUserIds: this.users.map(({ id }) => id),
        base64: this.fileList,
        fromUserId: this.composeMessageObj.fromUserId,
        text: this.composeMessageObj.text
      }
      let dic = {};
      requestObj.base64.forEach((element, index) => {
        dic[`${element.data}`] = `${element.ext}`;
      });
      requestObj.base64 = dic;
      this.mailboxService.composeMessage(requestObj).subscribe((response: ResponseModel) => {
        if (response != null) {
          if (response.statusCode == 200) {
            this.notifier.notify('success', response.message)
            this.getMessageCount();
            this.composeMessage(null, false);
          } else {
            this.notifier.notify('error', response.message)
          }
        }
      });
    }
    else this.notifier.notify('error', 'Please select atleast one recipient')
  }
  handleImageChange(e) {
    //if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
    let fileExtension = e.target.files[0].name.split('.').pop().toLowerCase();
    var input = e.target;
    var reader = new FileReader();
    reader.onload = () => {
      this.dataURL = reader.result;
      this.fileList.push({
        data: this.dataURL,
        ext: fileExtension,
        fileName: e.target.files[0].name
      });
    };
    reader.readAsDataURL(input.files[0]);
    // }
    // else
    //   this.notifier.notify('error', "Please select valid file type");
  }
  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }
  getMessageCount() {
    this.mailboxService.getMessageCount(this.forStaff).subscribe((response: ResponseModel) => {
      if (response != null)
        this.messageCounts = response.data == null ? new MessageCountModel() : response.data;
    });
  }
  toggleMailDetail(event: any, messageId: number) {
    event.currentTarget.textContent = event.currentTarget.textContent == "Hide Details" ? "Show Details" : "Hide Details";
    Array.from(document.getElementsByClassName("msgContent" + messageId)).forEach(function (item: any) {
      if (item.classList.contains('hideCont')) {
        item.classList.remove('hideCont');
        item.classList.add('shoeCont');
      }
      else {
        item.classList.remove('showCont');
        item.classList.add('hideCont');
      }
    });
  }
  toggleContent(messageId: number, index: number) {
    if (index + 1 != this.message.length) {
      Array.from(document.getElementsByClassName("contentClass" + messageId)).forEach(function (item: any) {
        if (item.classList.contains('hideCont')) {
          item.classList.remove('hideCont');
          item.classList.add('shoeCont');
        }
        else {
          item.classList.remove('showCont');
          item.classList.add('hideCont');
        }
      });
    }
  }
  loadMessages(type: string = '') {
    this.composeMessage(null, false);
    this.message = [];
    this.inboxMsg = type == "inbox" ? true : false;
    this.sentsg = type == "sent" ? true : false;
    this.delMsg = type == "deleted" ? true : false;
    this.favMsg = type == "fav" ? true : false;
    if (type == "inbox")
      this.getInboxMessages();
    if (type == "sent")
      this.getSentMessages();
    if (type == "deleted")
      this.getDeletedMessages();
    if (type == "fav")
      this.getFavouriteMessages();

  }
  getInboxMessages() {
    this.mailboxService.getInboxMessages(this.userId, this.forStaff, this.filterModel).subscribe((response: ResponseModel) => {
      if (response != null) {
        this.messages = response.statusCode == 200 ? this.updateMessagelist(response.data) : [];
      }
    });
  }
  updateMessagelist(input: Array<MessageModel>): Array<MessageModel> {
    //this.message = [];
    this.messages = [];
    input = input == null ? new Array<MessageModel>() : input;
    input.forEach(x => {
      let msgDate = new Date(x.messageDate);
      var diff = Math.abs(msgDate.getTime() - this.currentDate.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      let mod = msgDate.getFullYear() % 4;
      if (diffDays == 0)
        x.title = format(msgDate, "HH:mm");
      else if (diffDays > 0) {
        if (mod == 0 && diffDays > 366)
          x.title = format(msgDate, "MM/DD/YYYY");
        if (mod > 0 && diffDays > 365)
          x.title = format(msgDate, "MM/DD/YYYY");
        else x.title = format(msgDate, "MMM DD");
      }
    });
    return input;
  }
  getSentMessages() {
    this.mailboxService.getSentMessages(this.userId, this.forStaff, this.filterModel).subscribe((response: ResponseModel) => {
      if (response != null)
        this.messages = response.statusCode == 200 ? this.updateMessagelist(response.data) : [];
    });
  }
  getDeletedMessages() {
    this.mailboxService.getDeletedMessages(this.userId, this.forStaff, this.filterModel).subscribe((response: ResponseModel) => {
      if (response != null)
        this.messages = response.statusCode == 200 ? this.updateMessagelist(response.data) : [];
    });
  }
  getFavouriteMessages() {
    this.mailboxService.getFavouriteMessages(this.userId, this.forStaff, this.filterModel).subscribe((response: ResponseModel) => {
      if (response != null)
        this.messages = response.statusCode == 200 ? this.updateMessagelist(response.data) : [];
    });
  }
  getLoginUser() {
    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.userId = user.data.userID;
        this.forStaff = (user.data.users3 != null && user.data.users3.userRoles.roleName == "Client") ? false : true;
      }
    });
  }
  refreshMessages(value: string) {
    let sortColumn = "";
    let sortOrder = "";
    if (value == "date") {
      sortColumn = "sentdate";
      sortOrder = "desc";
    }
    else if (value == "name") {
      if (this.inboxMsg) {
        sortColumn = "from";
        sortOrder = "asc";
      }
      if (this.sentsg) {
        sortColumn = "to";
        sortOrder = "asc";
      }
    }
    this.setPaginatorModel(1, this.filterModel.pageSize, sortColumn, sortOrder, "");
    this.refreshMessagesData();
  }
  refreshMessagesData() {

    if (this.inboxMsg)
      this.getInboxMessages();
    else if (this.sentsg)
      this.getSentMessages();
    else if (this.delMsg)
      this.getDeletedMessages();
    else if (this.favMsg)
      this.getFavouriteMessages();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  getMessageById(messageId: number, parentMessageId: number) {
    if (parentMessageId == undefined) {
      this.mailboxService.getMessageById(messageId).subscribe((response: ResponseModel) => {
        if (response != null) {
          this.message = [];
          this.message.push(response.data);
          this.message.map(x => {
            x.isThreadType = false;
            return x;
          });
          console.log(this.message)
        }
      });
    }
    else
      this.mailboxService.getThreadMessage(parentMessageId, this.forStaff).subscribe((response: ResponseModel) => {
        if (response != null) {
          this.message = [];
          this.message = response.data;
          this.message.map(x => {
            x.isThreadType = true;
            return x;
          });
          console.log(this.message)
        }
      });
  }

  replyMessage(messageId: number) {
    this.composeMessageFlag = true;
    this.composeMessageObj = new MessageModel();
    this.mailboxService.replyMessage(messageId).subscribe((response: ResponseModel) => {
      if (response != null) {
        this.composeMessageObj = response.data;
        this.users = [];
        this.users.push({
          id: this.userId == this.composeMessageObj.fromUserId ? this.composeMessageObj.toUserId : this.composeMessageObj.fromUserId,
          value: this.userId == this.composeMessageObj.fromUserId ? this.composeMessageObj.toName : this.composeMessageObj.fromName
        });
        this.composeMessageObj.fromUserId = this.userId;
      }
    });
  }

  forwardMessage(messageId: number) {
    this.composeMessageFlag = true;
    this.composeMessageObj = new MessageModel();
    this.mailboxService.forwardMessage(messageId).subscribe((response: ResponseModel) => {
      if (response != null) {
        this.composeMessageObj = response.data; this.composeMessageObj.fromUserId = this.userId;
        this.users = [];
      }
    });
  }

  getUserList(searchText: string = 'sun'): any {
    return this.mailboxService.getUserList(this.forStaff, searchText)
      .pipe(map(x => {
        return x;
      }));

  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.users.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.userControl.setValue(null);
    }
  }

  remove(user: string): void {
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
  ccremove(user: string): void {
    const index = this.ccusers.indexOf(user);
    if (index >= 0) {
      this.ccusers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push({
      id: event.option.value.id,
      value: event.option.viewValue
    });
    this.userInput.nativeElement.value = '';
    this.userControl.setValue(null);
  }
  OnCCselected(event: MatAutocompleteSelectedEvent): void {
    this.ccusers.push({
      id: event.option.value.id,
      value: event.option.viewValue
    });
    this.userInput.nativeElement.value = '';
    this.userControl.setValue(null);
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    enableToolbar: false,
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
}
