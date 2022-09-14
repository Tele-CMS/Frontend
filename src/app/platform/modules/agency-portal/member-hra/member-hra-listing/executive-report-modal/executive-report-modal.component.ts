import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { MemberHRAService } from '../../member-hra.service';
import { format, addYears } from 'date-fns';

class ExecutiveSummaryFilter {
  documentId: number;
  fromDate: Date;
  toDate: Date;

}
@Component({
  selector: 'app-executive-report-modal',
  templateUrl: './executive-report-modal.component.html',
  styleUrls: ['./executive-report-modal.component.css']
})
export class ExecutiveReportModalComponent implements OnInit {
  executiveSummaryForm: FormGroup;
  submitted: boolean = false;
  assignedBy: string;
  // master value fields
  masterDocuments: any = [];
  patientDocumentId: number;
  executiveSummaryModel: ExecutiveSummaryFilter
  constructor(private formBuilder: FormBuilder,
    private executiveReportDialogModalRef: MatDialogRef<ExecutiveReportModalComponent>,
    private memberHRAService: MemberHRAService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.masterDocuments = data.masterDocuments;
    this.executiveSummaryModel = new ExecutiveSummaryFilter()
    this.executiveSummaryModel.toDate = new Date();
    this.executiveSummaryModel.fromDate = addYears(new Date(), -1);
  }


  ngOnInit() {
    this.executiveSummaryForm = this.formBuilder.group({
      documentId: [this.executiveSummaryModel.documentId],
      toDate: [this.executiveSummaryModel.toDate],
      fromDate: [this.executiveSummaryModel.fromDate],
    });

  }

  get formControls() { return this.executiveSummaryForm.controls; }

  printExecutiveSummary() {
    if (this.executiveSummaryForm.invalid) {
      return false;
    }
    let documentId = this.executiveSummaryForm.value.documentId,
      fromDate = format(this.executiveSummaryForm.value.fromDate,'YYYY-MM-DD'),
      toDate = format(this.executiveSummaryForm.value.toDate,'YYYY-MM-DD');
    this.submitted = true;
    this.executiveSummaryModel = this.executiveSummaryForm.value;
    this.memberHRAService.generateExecutiveSummaryPDF(documentId, fromDate, toDate).subscribe((response: any) => {
      this.submitted = false;
      this.memberHRAService.downLoadFile(response, 'application/pdf', `Executive_Summary.pdf`)
      this.closeDialog('print');
    });
  }

  closeDialog(action: string): void {
    this.executiveReportDialogModalRef.close(action);
  }

}
