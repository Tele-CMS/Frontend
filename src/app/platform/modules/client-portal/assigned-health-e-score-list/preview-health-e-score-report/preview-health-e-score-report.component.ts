import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-preview-health-e-score-report',
  templateUrl: './preview-health-e-score-report.component.html',
  styleUrls: ['./preview-health-e-score-report.component.css']
})
export class PreviewHealtheScoreReportComponent implements OnInit {
  urlSafe:any;
  submitted: boolean = false;
  constructor(private dialogModalRef: MatDialogRef<PreviewHealtheScoreReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService, private formBuilder: FormBuilder, private commonService: CommonService) {
    this.urlSafe = data.urlSafe;
  }

  ngOnInit() {

  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  
}
