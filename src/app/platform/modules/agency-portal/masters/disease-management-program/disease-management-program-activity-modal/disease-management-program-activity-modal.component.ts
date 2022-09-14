import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { DiseaseMangementProgramActivityModel, DiseaseMangementProgramModel } from '../disease-management.model';
import { DiseaseManagementProgramService } from '../disease-management.service';
import { FilterModel, ResponseModel, Metadata } from '../../../../core/modals/common-model'

@Component({
  selector: 'app-disease-management-program-activity-modal',
  templateUrl: './disease-management-program-activity-modal.component.html',
  styleUrls: ['./disease-management-program-activity-modal.component.css']
})
export class DiseaseManagementProgramActivityModalComponent implements OnInit {
  diseaseMangementProgramId: number;
  diseaseMangementProgramActivityForm: FormGroup;
  submitted: boolean = false;
  metaData: Metadata;
  filterModel: FilterModel;
  isLoading: boolean = false;
  diseaseMangementProgramActivityData: DiseaseMangementProgramActivityModel[];

  displayedColumns: Array<any> = [
    { displayName: 'Activity Type', key: 'activityType', isSort: true, class: '', width: '50%', type: "50" },
    { displayName: 'Description', key: 'descriptions', isSort: true, class: '', width: '50%', type: "50" },
  ];
  actionButtons: Array<any> = [];
  constructor(private formBuilder: FormBuilder,
    private diseaseMangementProgramActivityDialogModalRef: MatDialogRef<DiseaseManagementProgramActivityModalComponent>,
    private diseaseMangementProgramActivityService: DiseaseManagementProgramService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.diseaseMangementProgramId = data;
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
    this.getDiseaseManagementProgramActivityList();
  }
  getDiseaseManagementProgramActivityList() {
    this.isLoading = true;
    this.diseaseMangementProgramActivityService.getDiseaseManagementProgramActivityList(this.diseaseMangementProgramId, this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.isLoading = false;
        this.diseaseMangementProgramActivityData = response.data;
        this.metaData = response.meta;
      } else {
        this.isLoading = false;
        this.diseaseMangementProgramActivityData = [];
        this.metaData = null;
      }
    }
    );
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getDiseaseManagementProgramActivityList();
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
  }
  closeDialog(type?: string): void {
    this.diseaseMangementProgramActivityDialogModalRef.close(type);
  }



}
