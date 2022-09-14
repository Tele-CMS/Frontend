import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ClientBulkMessageEmail } from '../programs-listing/program.model';
import { ClientsProgramService } from '../clients-program.service';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css']
})
export class MessageModalComponent implements OnInit {
  addClientBulkMessageForm:FormGroup
  clientBulkMessage: ClientBulkMessageEmail
  filterParams: any;
  submitted: boolean = false;
  //: CustomReportBulkMessageEmail
  isMessageText: boolean
  constructor(private formBuilder: FormBuilder,
    private clientProgramsService: ClientsProgramService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private dialogModalRef: MatDialogRef<MessageModalComponent>,) {
    
    this.clientBulkMessage = new ClientBulkMessageEmail();
    this.filterParams = data;
   
    this.isMessageText = false;
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  ngOnInit() {
    this.addClientBulkMessageForm = this.formBuilder.group({
      message: [this.clientBulkMessage.message],
 });
  }

  get formControls() {
    return this.addClientBulkMessageForm.controls;
  }
  onSubmit() {
    if (this.addClientBulkMessageForm.invalid) {
      return;
    }
    this.submitted = true;
    let message = this.formControls.message.value;
    const filters = {
      ...this.filterParams,
      message:message,
      ConditionIds:(this.filterParams.conditionId || []).join(',')
    }
    // this.clientProgramsService.sendBulkMessage(filters).subscribe((response: any) => {

    //   if (response) {
    //     this.notifier.notify('success', "Please check the downloaded report for the logs")
    //     this.downLoadFile(response, response.type, "Report.xls");
    //     this.closeDialog('close');

    //   } else {
    //     this.notifier.notify('error', "Error")

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
