import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { format, addDays } from 'date-fns';
import { MemberHRAModel } from '../member-hra.model';
import { MemberHRAService } from '../../member-hra.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/platform/modules/core/services';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';

@Component({
    selector: 'app-assign-assessment-modal',
    templateUrl: './assign-assessment-modal.component.html',
    styleUrls: ['./assign-assessment-modal.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class AssignAssessmentModalComponent implements OnInit {
    docName: string;
    patientId: number;
    key: string;
    memberSelectedText: string;
    documentId: number;
    assignedBy: number;
    subscription: Subscription;
    memberHRAModel: MemberHRAModel[];
    submitted: boolean = false;
    headerText: string;
    masterDocuments: Array<any>
    filterParams: any
    assessmentId: number
    constructor(private formBuilder: FormBuilder, private dialogModalRef: MatDialogRef<AssignAssessmentModalComponent>, private memberHRAService: MemberHRAService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService, private commonService: CommonService, private dialogService: DialogService, ) {
        //assign data
        this.key = data.key
        this.docName = data.docName || '';
        this.filterParams = data.filterParams
        this.memberHRAModel = data.memberListData
        // let compDate: any = addDays(new Date(), 7)
        //     , expireDate: any = addDays(new Date(), 14)
        // this.memberHRAModel = this.memberHRAModel.map(x => {
        //     x.completionDate = format(compDate, 'MM/DD/YYYY'),
        //         x.expirationDate = format(expireDate, 'MM/DD/YYYY')
        //     return x;
        // });
        this.memberSelectedText = `${data.count} member(s) selected`
        this.documentId = data.documentId > 0 ? data.documentId : 0;
        this.masterDocuments = data.masterDocuments
        this.headerText = this.key == 'AssignBulkAssessment' ? 'Assign Bulk Assessment' : 'Assign Assessment'
    }

    ngOnInit() {
        this.subscription = this.commonService.currentLoginUserInfo.subscribe((user: any) => {
            if (user) {
                this.assignedBy = user.id;
            }
        });
    }
    onDocumentSelect(event: any) {
        this.assessmentId = event.value
        this.docName = event.source.triggerValue
    }
    onSubmit(event: any) {
        this.dialogService.confirm(`Are you sure you want to assign ${this.docName} to following patients.`).subscribe((result: any) => {
            if (result == true) {
                let clickType = "Assign Assessments";
                this.submitted = true;
                let expirationDate = this.memberHRAModel[0].expirationDate
                this.memberHRAModel.map(x => {
                    x.assignedBy = this.assignedBy,
                        x.documentId = this.assessmentId,
                        x.expirationDate = format(expirationDate, 'MM/DD/YYYY'),
                        x.assignedDate = format(new Date(), 'MM/DD/YYYY')
                    return x;
                })
                if (this.key == 'AssignAssessment') {
                    this.memberHRAService.assignDocumentToPatient(this.memberHRAModel).subscribe((response: any) => {
                        this.submitted = false;
                        if (response.statusCode == 200) {
                            this.notifier.notify('success', response.message)
                            if (clickType == "Assign Assessments")
                                this.closeDialog('save');
                        } else {
                            this.notifier.notify('error', response.message)
                        }
                    });
                } else if (this.key == 'AssignBulkAssessment') {
                    this.filterParams.expirationDate = format(expirationDate, 'MM/DD/YYYY'),
                        this.filterParams.assignedDate = format(new Date(), 'MM/DD/YYYY');
                        this.filterParams.assessmentId = this.documentId > 0 ? this.documentId : this.assessmentId
                        let constParams = {
                            ...this.filterParams,
                            programTypeId: (this.filterParams.programTypeId || []).join(','),
                            careManagerIds: (this.filterParams.careManagerIds || []).join(','),
                            relationship :(this.filterParams.relationship || []).join(','),
                            conditionId:(this.filterParams.conditionId || []).join(',')
                          }
                        // this.filterParams.careManagerIds = (this.filterParams.careManagerIds || []).join(',')
                    this.memberHRAService.assignBulkHRAData(constParams).subscribe((response: any) => {
                        this.submitted = false;
                        if (response.statusCode == 200) {
                            this.notifier.notify('success', response.message)
                            if (clickType == "Assign Assessments")
                                this.closeDialog('save');
                        } else if (response.statusCode == 204) {
                            this.notifier.notify('warning', response.message)
                        } else {
                            this.notifier.notify('error', response.message)
                        }
                    });
                }
            }
        })
    }
    //close popup
    closeDialog(action: string): void {
        this.dialogModalRef.close(action);
    }

}