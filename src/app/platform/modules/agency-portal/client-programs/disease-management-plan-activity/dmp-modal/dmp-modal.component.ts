import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DMPActivityService } from '../disease-management-plan-activity.service';
import { DailyDiaryModel } from '../disease-management-plan-activity.model';
import { ResponseModel, Metadata } from 'src/app/super-admin-portal/core/modals/common-model';
import { FilterModel } from '../../../../core/modals/common-model';

@Component({
  selector: 'app-dmp-modal',
  templateUrl: './dmp-modal.component.html',
  styleUrls: ['./dmp-modal.component.css']
})
export class DMPModalComponent implements OnInit {
  dailyDiaryModel: DailyDiaryModel;
  dailyDairyData: DailyDiaryModel[];
  meta: Metadata;
  filterModel: FilterModel
  diseaseManagementPlanPatientActivityId: number;
  displayedColumns: Array<any> = [
    { displayName: 'Activity Value', key: 'value', isSort: true, class: '', width: '50%' },
    { displayName: 'Logged Date', key: 'loggedDate', isSort: true, class: '', width: '50%', type: 'date' },
  ];

  actionButtons: Array<any> = [];
  constructor(
    private insuranceTypeDialogModalRef: MatDialogRef<DMPModalComponent>,
    private dmpActivityService: DMPActivityService,
    @Inject(MAT_DIALOG_DATA) public data: any, ) {
    this.diseaseManagementPlanPatientActivityId = data;
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
    this.getDailyDiaryData();
  }
  getDailyDiaryData() {
    this.dmpActivityService.getDailyDiaryData(this.diseaseManagementPlanPatientActivityId, this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.dailyDairyData = response.data || [];
        this.meta = response.meta;
      } else {
        this.dailyDairyData = [];
        this.meta = null;
      }
    }
    );
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getDailyDiaryData();
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  closeDialog(type?: string): void {
    this.insuranceTypeDialogModalRef.close(type);
  }



}
