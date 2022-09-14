import { Component, OnInit, Input } from '@angular/core';
//import { UsersService } from '../users.service';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from '../../../core/modals/common-model';
//import { UserDocumentModel } from '../users.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { format, addDays } from 'date-fns';
import { MatDialog } from '@angular/material';
//import { AddUserDocumentComponent } from './add-user-document/add-user-document.component';
//import { CommonService } from '../../../core/services';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { UserDocumentModel } from '../../users/users.model';
import { UsersService } from '../../users/users.service';
import { AddUserDocumentComponent } from '../../users/user-documents/add-user-document/add-user-document.component';
import { AddProviderDocumentComponent } from '../add-provider-document/add-provider-document.component';
import { LoggedInUserModel, LoginUser } from '../../../core/modals/loginUser.modal';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../core/services';
import { ProviderDocumentService } from '../provider-documents.service';
import { DocViewerComponent } from 'src/app/shared/doc-viewer/doc-viewer.component';
//import { CommonService } from '../../../core/services/common.service';

@Component({
  selector: 'app-provider-documents',
  templateUrl: './providerdocuments.component.html',
  styleUrls: ['./providerdocuments.component.css']
})
export class ProviderDocumentsComponent implements OnInit {
  documentFormGroup: FormGroup;
  userId:number;
  //@Input() isSpecificUser: boolean = false;
  locationId: number;
  todayDate = new Date();
  fromDate: string;
  toDate: string;
  documentList: Array<UserDocumentModel> = [];
  locationUsers: any = [];
  loginUserId: number;
  uploadPermission: boolean;
  downloadPermission: boolean;
  deletePermission: boolean;
  subscription: Subscription;
  loggedInUserModel: LoggedInUserModel;
  documentstatus:boolean;
  myFlagForSlideToggle: boolean;
  constructor(
    private dialogModal: MatDialog,
    private userService: UsersService,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private dialogService: DialogService,
    private providerDocumentService : ProviderDocumentService
  ) {
  }

  ngOnInit() {

    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {

        if (user.data) {
            this.userId = user.data.userID;
        }
      });

      this.documentFormGroup = this.formBuilder.group({
        userId: [],
        fromDate: [],
        toDate: []
      });


      //this.checkLoggedinUser();


      this.getUserDocuments();
    //this.getUserPermissions();
  }

//   checkLoggedinUser(){
//     this.providerDocumentService.getUserRole().subscribe((response: any) => {
//         if(response != null && response.statusCode == 200){
//             this.loggedInUserModel  =response.data;

//         }
//       });
// }

  get formControls() {
    return this.documentFormGroup.controls;
  }

  createModal() {
    if (this.userId != null) {
      let documentModal;
      documentModal = this.dialogModal.open(AddProviderDocumentComponent, { data: this.userId })
      documentModal.afterClosed().subscribe((result: string) => {
        if (result == 'save')
          this.getUserDocuments();
      });
    }
    else this.notifier.notify('error', "Please select user");
  }
  applyFilter() {

    let values = this.documentFormGroup.value;
    //this.userId = this.loginUserId;//values.userId;
    this.fromDate = values.fromDate;
    this.toDate = values.toDate;
    this.getUserDocuments();
  }
  clearfilters() {
    this.documentFormGroup.reset();
    this.userId = null;
    this.documentList = [];
  }
  getUserDocuments() {

    if (this.userId != null) {
      this.fromDate = this.fromDate == null ? '1990-01-01' : format(this.fromDate, "YYYY-MM-DD");
      this.toDate = this.toDate == null ? format(this.todayDate, "YYYY-MM-DD") : format(this.toDate, "YYYY-MM-DD");
      this.userService.getprovidereductaionalDocuments(this.userId, this.fromDate, this.toDate).subscribe((response: ResponseModel) => {
        if (response != null) {

          this.documentList = (response.data != null && response.data.length > 0) ? response.data : [];
          if(response.statusCode== 404){
            this.notifier.notify('error', "No Records Found")
          }
        }
      }
      );
    }
  }

  getUserByLocation() {
    this.userService.getUserByLocation(this.locationId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.data.staff != null && response.data.staff.length > 0) {
        this.locationUsers = response.data.staff;
      }
    }
    );
  }
  getUserDocument(value: UserDocumentModel) {
    this.userService.getUserDocument(value.id).subscribe((response: any) => {
      this.userService.downloadFile(response, response.type, value.url);
    }
    );
  }

  onOpenDocViewer(url:string) {

    const modalPopup = this.dialogModal.open(
        DocViewerComponent,
      {
        hasBackdrop: true,
        width:"62%",
        data: url
      }
    );

    // modalPopup.afterClosed().subscribe((result) => {
    //   // if (result === "SAVE") this.fetchEvents();
    // });
  }
  // deleteUserDocument(id: number) {
  //   this.userService.deleteUserDocument(id).subscribe((response: ResponseModel) => {
  //     if (response != null) {
  //       this.notifier.notify('success', response.message);
  //       this.getUserDocuments();
  //     } else {
  //       this.notifier.notify('error', response.message);
  //     }
  //   }
  //   );
  // }

  deleteUserDocument(id: number) {
    this.dialogService.confirm('Are you sure you want to delete this document?').subscribe((result: any) => {
      if (result == true) {
        this.userService.deleteUserDocument(id)
          .subscribe((response: any) => {
            if (response.statusCode === 204) {
              this.notifier.notify('success', response.message)
              this.getUserDocuments();
            } else if (response.statusCode === 401) {
              this.notifier.notify('warning', response.message)
            } else {
              this.notifier.notify('error', response.message)
            }
          })
      }
    })
  }

  gettogglevalue(event,id:number){

this.documentstatus=event.source.checked;
this.updateDocumentActiveStatus(id);
  }

  updateDocumentActiveStatus(id: number) {

        this.userService.updateDocumentStatus(id,this.documentstatus)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifier.notify('success', response.message)
              this.getUserDocuments();
            } else if (response.statusCode === 401) {
              this.notifier.notify('warning', response.message)
            } else {
              this.notifier.notify('error', response.message)
            }
          })
      }



//   getUserPermissions() {
//     const actionPermissions = this.userService.getUserScreenActionPermissions('USER', 'USER_DOCUMENT_LIST');
//     const { USER_DOCUMENT_LIST_UPLOAD, USER_DOCUMENT_LIST_DOWNLOAD, USER_DOCUMENT_LIST_DELETE } = actionPermissions;

//     this.uploadPermission = USER_DOCUMENT_LIST_UPLOAD || false;
//     this.downloadPermission = USER_DOCUMENT_LIST_DOWNLOAD || false;
//     this.deletePermission = USER_DOCUMENT_LIST_DELETE || false;

//   }
}
