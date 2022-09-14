import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../users.service';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from '../../../core/modals/common-model';
import { UserDocumentModel } from '../users.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { format, addDays } from 'date-fns';
import { MatDialog } from '@angular/material';
import { AddUserDocumentComponent } from './add-user-document/add-user-document.component';
import { CommonService } from '../../../core/services';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-user-documents',
  templateUrl: './user-documents.component.html',
  styleUrls: ['./user-documents.component.css']
})
export class UserDocumentsComponent implements OnInit {
  documentFormGroup: FormGroup;
  @Input() userId: number = null;
  @Input() isSpecificUser: boolean = false;
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
  constructor(
    private dialogModal: MatDialog,
    private userService: UsersService,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private dialogService: DialogService
  ) {
  }

  ngOnInit() {
    this.userId
    if (!this.isSpecificUser) {
      this.documentFormGroup = this.formBuilder.group({
        userId: [],
        fromDate: [],
        toDate: []
      });
      this.getUserDocuments();
    }
    else this.getUserDocuments();

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.loginUserId = user.userID;
        this.locationId = user.currentLocationId;
        this.getUserByLocation();
      }
    });
    this.getUserPermissions();
  }
  get formControls() {
    return this.documentFormGroup.controls;
  }

  createModal() {
    if (this.userId != null) {
      let documentModal;
      documentModal = this.dialogModal.open(AddUserDocumentComponent, { data: this.userId })
      documentModal.afterClosed().subscribe((result: string) => {
        if (result == 'save')
          this.getUserDocuments();
      });
    }
    else this.notifier.notify('error', "Please select user");
  }
  applyFilter() {
    let values = this.documentFormGroup.value;
    this.userId = values.userId;
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
      this.userService.getUserDocuments(this.userId, this.fromDate, this.toDate).subscribe((response: ResponseModel) => {
        if (response != null) {
          this.documentList = (response.data != null && response.data.length > 0) ? response.data : [];
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

  getUserPermissions() {
    const actionPermissions = this.userService.getUserScreenActionPermissions('USER', 'USER_DOCUMENT_LIST');
    const { USER_DOCUMENT_LIST_UPLOAD, USER_DOCUMENT_LIST_DOWNLOAD, USER_DOCUMENT_LIST_DELETE } = actionPermissions;

    this.uploadPermission = USER_DOCUMENT_LIST_UPLOAD || false;
    this.downloadPermission = USER_DOCUMENT_LIST_DOWNLOAD || false;
    this.deletePermission = USER_DOCUMENT_LIST_DELETE || false;

  }
}
