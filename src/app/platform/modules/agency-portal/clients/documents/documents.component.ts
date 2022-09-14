import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../core/services';
import { ResponseModel } from '../../../core/modals/common-model';
import { ClientsService } from '../clients.service';
import { UserDocumentModel } from '../client.model';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';
import { MatDialog } from '@angular/material';
import { AddDocumentComponent } from './add-document/add-document.component';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentsComponent implements OnInit {
  clientId: number;
  header: string = "Document Upload";
  userId: number = 714;

  locationId: number = 1;
  todayDate = new Date();
  fromDate: string;
  toDate: string;
  documentList: Array<UserDocumentModel> = [];
  locationUsers: any = [];
  uploadPermission: boolean;
  downloadPermission: boolean;
  deletePermission: boolean;

  constructor(private dialogModal: MatDialog, private activatedRoute: ActivatedRoute, private commonService: CommonService, private clientService: ClientsService, private notifier: NotifierService,private dialogService:DialogService) { }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      this.userId = params.uid == undefined ? null : this.commonService.encryptValue(params.uid, false);
      this.getUserDocuments();
    });
    this.getUserPermissions();
  }

  createModal() {
    if (this.userId != null) {
      let documentModal;
      documentModal = this.dialogModal.open(AddDocumentComponent, { data: this.userId })
      documentModal.afterClosed().subscribe((result: string) => {
        if (result == 'save')
          this.getUserDocuments();
      });
    }
    else this.notifier.notify('error', "Please select user");
  }

  getUserDocuments() {
    if (this.userId != null) {
      this.fromDate = this.fromDate == null ? '1990-01-01' : format(this.fromDate, "YYYY-MM-DD");
      this.toDate = this.toDate == null ? format(this.todayDate, "YYYY-MM-DD") : format(this.toDate, "YYYY-MM-DD");
      this.clientService.getUserDocuments(this.userId, this.fromDate, this.toDate).subscribe((response: ResponseModel) => {
        if (response != null) {
          this.documentList = (response.data != null && response.data.length > 0) ? response.data : [];
        }
      }
      );
    }
  }
  getUserDocument(value: UserDocumentModel) {
    this.clientService.getUserDocument(value.id).subscribe((response: any) => {
      this.clientService.downloadFile(response, response.type, value.url);
    }
    );
  }
  deleteUserDocument(id: number) {
    this.dialogService.confirm('Are you sure you want to delete this document?').subscribe((result: any) => {
      if (result == true) {
        this.clientService.deleteUserDocument(id).subscribe((response: ResponseModel) => {
          if (response != null) {
            this.notifier.notify('success', response.message);
            this.getUserDocuments();
          } else {
            this.notifier.notify('error', response.message);
          }
        });
      }
    });
  }

  getUserPermissions() {
    const actionPermissions = this.clientService.getUserScreenActionPermissions('CLIENT', 'CLIENT_DOCUMENT_LIST');
    const { CLIENT_DOCUMENT_LIST_UPLOAD, CLIENT_DOCUMENT_LIST_DOWNLOAD, CLIENT_DOCUMENT_LIST_DELETE } = actionPermissions;

    this.uploadPermission = CLIENT_DOCUMENT_LIST_UPLOAD || false;
    this.downloadPermission = CLIENT_DOCUMENT_LIST_DOWNLOAD || false;
    this.deletePermission = CLIENT_DOCUMENT_LIST_DELETE || false;
  }
}
