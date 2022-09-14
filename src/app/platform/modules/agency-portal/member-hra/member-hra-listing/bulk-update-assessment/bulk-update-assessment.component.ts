import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MemberHRAModel } from '../member-hra.model';
import { NotifierService } from 'angular-notifier';
import { MemberHRAService } from '../../member-hra.service';
import { format } from 'date-fns';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { LayoutService } from 'src/app/platform/modules/core/services';

@Component({
  selector: 'app-bulk-update-assessment',
  templateUrl: './bulk-update-assessment.component.html',
  styleUrls: ['./bulk-update-assessment.component.css']
})
export class BulkUpdateAssessmentComponent implements OnInit {

  patientId: number;
  memberHRAModel: MemberHRAModel[];
  reqHRAData: MemberHRAModel[]
  submitted: boolean = false;
  headerText: string;
  patientDocIdArray: Array<string>;
  documentId: number;
  masterStatus: Array<any>;
  key: string;
  statusValue: string = ""
  memberListObj: any
  memberSelectedText: string
  filterModel: any
  distinctAssessmentCount: number
  linkedEncounterId: number;
  //nextAppointmentPresent: boolean;
  constructor(
    private dialogModalRef: MatDialogRef<BulkUpdateAssessmentComponent>, 
    private memberHRAService: MemberHRAService, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private notifier: NotifierService, 
    private dialogService: DialogService,
    private layoutService: LayoutService) {
    this.key = data.key
    this.filterModel = data.filterModel;
    this.distinctAssessmentCount = data.count
    this.patientDocIdArray = this.key == 'editbulk' ? data.patientDocIdArray : [];
    this.memberListObj = this.key == 'edit' ? data.memberListObj : null;
    this.masterStatus = data.masterStatus.filter(x => x.key.toLowerCase() == 'voided' || x.key.toLowerCase() == 'assigned')
    this.memberHRAModel = []
    this.headerText = this.key == 'editbulk' ? 'Update Assessments' : 'Update Assessment'
    this.memberSelectedText = this.key == 'edit' ? this.memberListObj.documentName : `${this.distinctAssessmentCount} assessment(s) selected.`
  }
  ngOnInit() {
    if (this.key == 'editbulk') {
      this.getAssessmentDataById()
    }
    // this.layoutService.clientDrawerData.subscribe(({ encounterId }) => {
    //   this.linkedEncounterId = encounterId;
    // });
  }
  getAssessmentDataById() {
    let patientDocIds = this.patientDocIdArray.join(',')
    this.memberHRAService.getBulkHRAData(patientDocIds).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.reqHRAData = response.data
        this.statusValue = this.reqHRAData[0].status || "";
      } else {
        this.reqHRAData = []
      }
    });
  }
  statusUpdate(e: any) { 
    // this.statusValue = e.source.triggerValue;
    this.statusValue = e; 
  }
  onSubmit(event: any) {
    this.submitted = true;
    let clickType = event.currentTarget.name;
    if (this.key == 'editbulk') {
      this.dialogService.confirm(`Are you sure you would like to make this change: Status to ${this.statusValue}. Number of records to be updated = ${this.distinctAssessmentCount}`).subscribe((result: any) => {
        if (result == true) {
          this.filterModel.expirationDate = format(this.reqHRAData[0].expirationDate, 'MM/DD/YYYY');
          this.filterModel.statusForUpdate = this.reqHRAData[0].statusId
          let constParams = {
            ...this.filterModel,
            programTypeId: (this.filterModel.programTypeId || []).join(','),
            careManagerIds: (this.filterModel.careManagerIds || []).join(','),
            relationship :(this.filterModel.relationship || []).join(','),
            conditionId:(this.filterModel.conditionId || []).join(',')
          }
          // this.filterModel.careManagerIds = (this.filterModel.careManagerIds || []).join(',')
          this.memberHRAService.updateBulkHRAData(constParams).subscribe((response: any) => {
            this.submitted = false;
            if (response.statusCode == 200) {
              this.notifier.notify('success', response.message)
              if (clickType == "Update Assessments")
                this.closeDialog('save');
            } else if (response.statusCode == 204) {
              this.notifier.notify('warning', response.message)
            } else {
              this.notifier.notify('error', response.message)

            }
          });
        } else {
          this.submitted = false;
        }
      })
    } else if (this.key == 'edit') {
      this.reqHRAData = []
      this.memberListObj.expirationDate = this.memberListObj.expirationDate ? format(this.memberListObj.expirationDate, 'MM/DD/YYYY') : null;
      this.memberListObj.completionDate = this.memberListObj.completionDate && format(this.memberListObj.completionDate, 'MM/DD/YYYY')
      this.memberListObj.linkedEncounterId = this.linkedEncounterId;
      this.reqHRAData.push(this.memberListObj)

      this.memberHRAService.updateHRAData(this.reqHRAData).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.submitted = false;
          if (clickType == "Update Assessments")
            this.closeDialog('save');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
}
