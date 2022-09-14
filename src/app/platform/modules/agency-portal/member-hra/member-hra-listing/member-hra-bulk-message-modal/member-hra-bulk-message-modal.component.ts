import { Component, Inject, OnInit } from "@angular/core";
import { ViewEncapsulation } from "@angular/compiler/src/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { CommonService } from "src/app/platform/modules/core/services";
import { MemberBulkHRAEmail } from "../member-hra.model";
import { MemberHRAService } from "../../member-hra.service";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";

@Component({
  selector: 'app-member-hra-bulk-message-modal',
  templateUrl: './member-hra-bulk-message-modal.component.html',
  styleUrls: ['./member-hra-bulk-message-modal.component.css']
})
export class BulkMessageModalComponent implements OnInit {
  addBulkEmailForm: FormGroup;
  memberBulkHRAMessage: MemberBulkHRAEmail
  filterParams: any;
  submitted: boolean = false;
  emailObj: MemberBulkHRAEmail
  isMessageText: boolean
  masterEmailTemplates: Array<any> = []
  constructor(
    private memberHRAService: MemberHRAService,
    private dialogModalRef: MatDialogRef<BulkMessageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private formBuilder: FormBuilder) {
    this.memberBulkHRAMessage = new MemberBulkHRAEmail();
    this.filterParams = data.filterModel;
    this.emailObj = null
    this.isMessageText = false
  }

  //close popup
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  ngOnInit() {
    this.addBulkEmailForm = this.formBuilder.group({
      message: [''],
    });

  }
  get formControls() {
    return this.addBulkEmailForm.controls;
  }
  onSubmit() {
    if (this.addBulkEmailForm.invalid) {
      return;
    }
    this.submitted = true;
    var message = this.formControls.message.value;
    this.filterParams.message = message;
    let constParams = {
      ...this.filterParams,
      programTypeId: (this.filterParams.programTypeId || []).join(','),
      careManagerIds: (this.filterParams.careManagerIds || []).join(','),
      relationship :(this.filterParams.relationship || []).join(','),
      conditionId:(this.filterParams.conditionId || []).join(',')
    }
    // this.filterParams.programTypeId = (this.filterParams.programTypeId || []).join(',')
    // this.filterParams.careManagerIds = (this.filterParams.careManagerIds || []).join(',')
    // this.memberHRAService.sendBulkMessage(constParams).subscribe((response: any) => {
    //   if (response) {
    //     this.notifier.notify('success', "Please check the downloaded report for the logs")
    //     this.downLoadFile(response, response.type, "Report.xls");
    //     this.closeDialog('close');

    //   } else {
    //     this.notifier.notify('error', "Error")
    //     this.submitted = true

    //   }
    // }
    // );
  }

  downLoadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob, filename);
      return;
    }
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    document.body.appendChild(link);
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(data);
    }, 100);
  }
}