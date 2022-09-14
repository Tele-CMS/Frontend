import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NotifierService } from "angular-notifier";
import { ReportingService } from '../../reporting.service';

@Component({
  selector: 'app-client-listing-message-modal',
  templateUrl: './send-message-modal.component.html',
  styleUrls: ['./send-message-modal.component.css']
})
export class SendMessageModalComponent implements OnInit {
  filterParams: any;
  submitted: boolean = false;
  subject: string;
  message: string;
  constructor(
    private reportingService: ReportingService,
    private dialogModalRef: MatDialogRef<SendMessageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.filterParams = data.filterModel;
  }

  //close popup
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  ngOnInit() {  
    this.message = '';
  }
  onSubmit() {
    if (!this.message) {
      return;
    }
    this.submitted = true;
    
    const postFilters = {
      ...this.filterParams,
      message: this.message,      
      programTypes: this.filterParams.programTypes ? this.filterParams.programTypes.join(',') : null,
      enrolledPrograms: this.filterParams.enrolledPrograms ? this.filterParams.enrolledPrograms.join(',') : null
    }
    
    this.reportingService.sendBulkMessage(postFilters).subscribe((response: any) => {
      // if (response.statusCode == 200) {
      //   this.notifier.notify('success', response.message)
      // }else{
        //   this.notifier.notify('error', response.message)
        // }
        if (response) {
          //this.isDialogLoading = false;
          this.notifier.notify('success', "Please check the downloaded report for exported results")
          this.downLoadFile(response, response.type, "Report.xls");
            this.closeDialog('close');
        
        } else {
        this.notifier.notify('error', "Error")
        }
    }
    );
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
