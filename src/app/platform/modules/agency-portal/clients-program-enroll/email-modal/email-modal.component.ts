import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ClientBulkMessageEmail } from '../programs-listing/program.model';
import { ClientsProgramService } from '../clients-program.service';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})
export class EmailModalComponent implements OnInit {
  addBulkEmailForm: FormGroup;
  clientBulkEmail: ClientBulkMessageEmail
  filterParams: any;
  submitted: boolean = false;
  emailObj: ClientBulkMessageEmail
  isMessageText: boolean
  masterEmailTemplates: Array<any> = [];
  constructor(private clientProgramsService: ClientsProgramService,
    private dialogModalRef: MatDialogRef<EmailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private formBuilder: FormBuilder) {
    this.clientBulkEmail = new ClientBulkMessageEmail();
    this.filterParams = data;
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  ngOnInit() {
    this.addBulkEmailForm = this.formBuilder.group({
      templateId: [this.clientBulkEmail.id],
      message: [this.clientBulkEmail.message],
      subject: [this.clientBulkEmail.subject],
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
    let subject = this.formControls.subject.value;
    let message = this.formControls.message.value;
    const filters = {
      ...this.filterParams,
      subject: subject,
      message: message,
      ConditionIds: this.filterParams.conditionId
    }
    // this.clientProgramsService.sendBulkEmail(filters).subscribe((response: any) => {

    //   this.submitted = false;
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
  getTemplateData(event: any) {
    this.emailObj = null
    this.emailObj = this.masterEmailTemplates.find(x => x.id == event.value)
    this.addBulkEmailForm.get("subject").patchValue(this.emailObj.subject);
    this.isMessageText = true
  }

}

