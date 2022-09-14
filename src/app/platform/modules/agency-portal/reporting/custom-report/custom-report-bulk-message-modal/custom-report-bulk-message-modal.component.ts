import { Component, Inject, OnInit } from "@angular/core";
import { ViewEncapsulation } from "@angular/compiler/src/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";
import { CustomReportBulkMessageEmail } from "../custom-report.model";
import { ReportingService } from "../../reporting.service";

@Component({
  selector: 'app-custom-report-bulk-message-modal',
  templateUrl: './custom-report-bulk-message-modal.component.html',
  styleUrls: ['./custom-report-bulk-message-modal.component.css']
})
export class CustomBulkMessageModalComponent implements OnInit {
  addBulkEmailForm: FormGroup;
  customBulkMessage: CustomReportBulkMessageEmail
  filterParams: any;
  submitted: boolean = false;
  emailObj: CustomReportBulkMessageEmail;
  isMessageText: boolean;
  masterEmailTemplates: Array<any> = [];
  changeFilters: any;
  constructor(
    private customBulkService: ReportingService,
    private dialogModalRef: MatDialogRef<CustomBulkMessageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private formBuilder: FormBuilder) {
    this.customBulkMessage = new CustomReportBulkMessageEmail();
    this.filterParams = data.filterModel;
    this.emailObj = null;
    this.isMessageText = false;
    this.changeFilters = data.changeFiltersData;
  }

  //close popup
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  ngOnInit() {
    this.addBulkEmailForm = this.formBuilder.group({
         message: [this.customBulkMessage.message],
    });

  }
  get formControls() {
    return this.addBulkEmailForm.controls;
  }
  onSubmit() {
    if (this.addBulkEmailForm.invalid) {
      return;
    }
  
    var message = this.formControls.message.value;
  
    this.filterParams = {
      subject: '',
      message: message
    }

    this.filterParams.ruleId = this.changeFilters.ruleId;
    this.filterParams.isBiometricsComplete = this.changeFilters.isBiometricsComplete;
    this.filterParams.isEncountersCompliant = this.changeFilters.isEncountersCompliant;
    this.filterParams.pageNumber = this.changeFilters.pageNumber;
    this.filterParams.pageSize = this.changeFilters.pageSize;
    this.filterParams.sortColumn = this.changeFilters.sortColumn;
    this.filterParams.sortOrder = this.changeFilters.sortOrder;

    this.submitted = true;

    this.customBulkService.sendBulkMessageQB(this.filterParams).subscribe((response: any) => {

      this.submitted = false;
      if (response) {
        this.notifier.notify('success', "Please check the downloaded report for the logs")
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
