import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResponseModel, Metadata } from 'src/app/super-admin-portal/core/modals/common-model';
import { FilterModel } from '../../../../core/modals/common-model';
import { ClientProgramsService } from '../../client-programs.service';
import { DMProgramsModel, ProgramsDataModel } from '../program.model';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';
import { iif } from 'rxjs';
import { element } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-assign-program-modal',
  templateUrl: './assign-program-modal.component.html',
  styleUrls: ['./assign-program-modal.component.css']
})
export class AssignProgramModalComponent implements OnInit {
  programsDataModel: ProgramsDataModel[];
  programListData: DMProgramsModel[];
  meta: Metadata;
  filterModel: FilterModel;
  checkedIds: Array<any>;
  clientId: number;
  diseaseManagementPlanPatientActivityId: number;
  programStatusList: Array<any>;
  programFrequencyList: Array<any>;
  careManagersList: Array<any>;
  isEdit: boolean = false;
  currentLocationId: number;
  loginStaffId: number;
  statusId: number;
  isFrequencyOther: boolean;
  programDataIndex: number;
  checkProgramsIds: Array<any> = [];
  otherFrequencyDescription: string;
  indecesArray: Array<any>


  constructor(
    private programsDialogModalRef: MatDialogRef<AssignProgramModalComponent>,
    private clientProgramsService: ClientProgramsService,
    private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any, ) {
    this.clientId = data.clientId;
    this.currentLocationId = data.currentLocationId;
    this.loginStaffId = data.loginStaffId;
    this.filterModel = new FilterModel();
    this.checkedIds = [];
    this.programsDataModel = (data.programsData && data.programsData.patientDiseaseManagementPrograms) || [];
    this.programStatusList = [];
    this.programFrequencyList = [];
    this.careManagersList = [];
    this.getMasterData();
  }

  ngOnInit() {
    this.fetchStaffs();
    if (this.programsDataModel.length > 0) {
      this.isEdit = true;
      this.checkedIds = this.programsDataModel.map(x => x.programId);
    } else
      this.getProgramList();
  }
  getProgramList() {
    this.clientProgramsService.getDiseaseManagementProgramList(this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.programListData = response.data || [];
        this.meta = response.meta;
        if (this.programListData && this.programListData.length > 0)
          this.createProgramFields();
      } else {
        this.programListData = [];
        this.meta = null;
      }
    }
    );
  }

  createProgramFields() {
    this.programsDataModel = (this.programListData || []).map(obj => {
      return {
        programName: obj.description,
        programId: obj.id,
        dateOfEnrollment: format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
        graduationDate: null,
        dateOfTermination: null,
        statusId: this.programStatusList && this.programStatusList != null && this.programStatusList.length>0 && this.programStatusList.find(x => x.key == 'Active').id,
        frequencyId: null,
        careManagerId: this.loginStaffId,
        otherFrequencyDescription: null
      }
    })
  }

  onCheckIds(id: number) {
    const index = this.checkedIds.findIndex(obj => obj == id);
    if (index > -1) {
      this.checkedIds.splice(index, 1);
    } else {
      this.checkedIds.push(id);
    }
  }
  onSubmit() {
    let postData;
    const assignPrograms: ProgramsDataModel[] = this.programsDataModel.filter(x => this.checkedIds.includes(x.programId)).map(x => {
      return {
        ...x,
        dateOfEnrollment: format(x.dateOfEnrollment, 'YYYY-MM-DDTHH:mm:ss'),
        dateOfTermination: x.dateOfTermination && format(x.dateOfTermination, 'YYYY-MM-DDTHH:mm:ss'),
        graduationDate: x.graduationDate && format(x.graduationDate, 'YYYY-MM-DDTHH:mm:ss'),
        statusId: x.statusId,
        otherFrequencyDescription: x.otherFrequencyDescription
      }
    })
    postData = {
      patientId: this.clientId,
      patientDiseaseManagementPrograms: assignPrograms,
    }
    if (this.checkedIds && this.checkedIds.length > 0) {
      this.clientProgramsService.savePrograms(postData).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.closeDialog('save');
        } else if (response.statusCode == 400) {
          this.notifier.notify('warning', response.message)
          this.closeDialog()
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    } else {
      this.notifier.notify('warning', 'Please select atleast one program to add.')
    }
  }
  closeDialog(type?: string): void {
    this.programsDialogModalRef.close(type);
  }

  getMasterData() {
    const masterData = { masterdata: "PATIENTPROGRAMSTATUS,PATIENTPROGRAMFREQUENCY" };
    this.clientProgramsService.getMasterData(masterData)
      .subscribe((response: any) => {
        if (response)
          this.programStatusList = response.patientProgramStatus || []
        this.programFrequencyList = response.patientProgramFrequency || [];
      });
  }

  fetchStaffs(): void {
    this.clientProgramsService.getStaffAndPatientByLocation(this.currentLocationId)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.careManagersList = [];
        } else {
          this.careManagersList = response.data.staff || [];
        }
      })
  }

  onSelectFrequency(id: any, item: any, ix: number) {

    let otherFrequencyArray = this.programFrequencyList.filter(x => x.id == id && x.key == 'Other')
    if (otherFrequencyArray.length > 0) {
      (this.checkProgramsIds || []).push(ix)
    }
    else {
      const index = (this.checkProgramsIds || []).findIndex(element => element == ix);
      if (index >= 0)
        (this.checkProgramsIds || []).splice(index, 1);
    }

  }

  isShowText(ix: number, id: number) {
    if (id > 0) {
      return this.programFrequencyList.filter(x => x.id == id && x.key == 'Other').length > 0 ? true : false
    }
    else {
      return (this.checkProgramsIds || []).find(element => element == ix) > -1
    }


  }

  // onSelectFrequency(event: any, item: any, ix: number) {
  //   
  //   let valueName = event.source.triggerValue
  //   let index = this.indecesArray.findIndex(x => x == ix)
  //   let indx = this.programsDataModel.findIndex(x => x.programId == item.programId)
  //   if (valueName.toLowerCase() == 'other') {
  //     this.indecesArray.push(indx)
  //   } else {
  //     if (index > -1)
  //       this.indecesArray.splice(index, 1)
  //   }
  // }

}
