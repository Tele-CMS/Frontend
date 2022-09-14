import { Component, OnInit } from '@angular/core';
import { PatientQuestionnaireAggregatedResponse, PatientDiseaseManagementProgramActivity, PatientDiseaseManagementProgramActivityNotification } from './disease-management-plan-activity.model';
import { DMPActivityService } from './disease-management-plan-activity.service';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DMPModalComponent } from './dmp-modal/dmp-modal.component';
import { Metadata, FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-disease-management-plan-activity',
  templateUrl: './disease-management-plan-activity.component.html',
  styleUrls: ['./disease-management-plan-activity.component.css']
})
export class DiseaseManagementPlanActivityComponent implements OnInit {
  dmpAcyivityData: PatientDiseaseManagementProgramActivity[];
  oldDmpActivityData: PatientDiseaseManagementProgramActivity[];
  dmpActivityObj: PatientDiseaseManagementProgramActivity;
  metaData: Metadata;
  assignActivityToPatient: boolean;
  expandedIds: Array<number>;
  filterModel: FilterModel;
  questionnaireAggregateResponse: PatientQuestionnaireAggregatedResponse;
  notificationsresponse: PatientDiseaseManagementProgramActivityNotification[];
  comparisionValue: boolean;
  masterFrequencyType: Array<any>;
  masterMeasureSign: Array<any>;
  patientId: number;
  diseaseManagmentProgramId: number;
  patientQuestionnaireId: number
  masterNotifications: Array<any>;
  notificationData: Array<any>;
  createUpdatePlan: boolean = false;
  masterUnitType: Array<any>;
  patientDiseaseManagementProgramActivityNotifications: PatientDiseaseManagementProgramActivityNotification[]
  constructor(private activatedRoute: ActivatedRoute,
    private dmpActivityDialogModal: MatDialog,
    private dmpActivityService: DMPActivityService,
    private commonService: CommonService,
    private notifier: NotifierService
  ) {
    this.expandedIds = [];
    this.activatedRoute.queryParams.subscribe(params => {
      this.patientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      this.diseaseManagmentProgramId = params.documentTypeId == undefined ? null : params.documentTypeId;
      this.patientQuestionnaireId = params.questionaireId == undefined ? null : params.questionaireId;
    });
  }
  ngOnInit() {
    this.filterModel = new FilterModel();

    this.getMasterData();
    this.getDmpActivityList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getDmpActivityList();
  }
  getMasterData() {
    let data = "MASTERFREQUENCY,MASTERSIGN,MASTERNOTIFICATIONTYPES,MASTERUNITTYPES";
    this.dmpActivityService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterFrequencyType = response.masterFrequencyTypes != null ? response.masterFrequencyTypes : [];
        this.masterMeasureSign = response.masterMeasureSign != null ? response.masterMeasureSign : [];
        this.masterNotifications = response.masterNotificationTypes != null ? response.masterNotificationTypes : [];
        this.masterUnitType = response.masterActivityUnitTypes != null ? response.masterActivityUnitTypes : [];
      }
    });
  }
  createDmpActivityData(dmpActivityObj: PatientDiseaseManagementProgramActivity, notificationsResponseArray: Array<PatientDiseaseManagementProgramActivityNotification>): PatientDiseaseManagementProgramActivity {
    let dmpActivity = new PatientDiseaseManagementProgramActivity();
    dmpActivity.diseaseManagementPlanPatientActivityId = dmpActivityObj.diseaseManagementPlanPatientActivityId;
    dmpActivity.diseaseManageProgramId = dmpActivityObj.diseaseManageProgramId;
    dmpActivity.diseaseManagementProgramActivityId = dmpActivityObj.diseaseManagementProgramActivityId;
    dmpActivity.descriptions = dmpActivityObj.descriptions;
    dmpActivity.activityType = dmpActivityObj.activityType;
    dmpActivity.frequency = dmpActivityObj.frequency;
    dmpActivity.frequencyValue = dmpActivityObj.frequencyValue;
    dmpActivity.frequencyDescription = dmpActivityObj.frequencyDescription;
    dmpActivity.goalResultValue = dmpActivityObj.goalResultValue;
    dmpActivity.value = dmpActivityObj.value;
    dmpActivity.patientEnrollmentNeeded = dmpActivityObj.patientEnrollmentNeeded;
    dmpActivity.assignActivityToPatient = dmpActivityObj.assignActivityToPatient;
    dmpActivity.activityUnitTypeId = dmpActivityObj.activityUnitTypeId;
    dmpActivity.sign = dmpActivityObj.sign;

    const activityNotifications = notificationsResponseArray.filter(x => x.diseaseManagmentPlanPatientActivityId == dmpActivityObj.diseaseManagementPlanPatientActivityId);
    if (activityNotifications.length > 0) {
      dmpActivity.patientDiseaseManagementProgramActivityNotifications = activityNotifications;
    } else {
      dmpActivity.patientDiseaseManagementProgramActivityNotifications = [new PatientDiseaseManagementProgramActivityNotification()];
    }
    return dmpActivity;
  }
  getDmpActivityList() {
    this.dmpActivityService.getById(this.patientId, this.diseaseManagmentProgramId, this.patientQuestionnaireId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.dmpAcyivityData = [];
        this.oldDmpActivityData = [];

        const notificationArray = response.data.PatientDiseaseManagementProgramActivityNotifications || [];

        this.notificationsresponse = notificationArray;

        (response.data.PatientDiseaseManagementProgramActivity || []).forEach(element => {
          this.dmpAcyivityData.push(this.createDmpActivityData(element, notificationArray));
          this.oldDmpActivityData.push(this.createDmpActivityData(element, notificationArray));
        });
        this.questionnaireAggregateResponse = response.data.PatientQuestionnaireAggregatedResponse ? response.data.PatientQuestionnaireAggregatedResponse[0] : {};

        this.patientDiseaseManagementProgramActivityNotifications = response.data.patientDiseaseManagementProgramActivityNotifications ? response.data.patientDiseaseManagementProgramActivityNotifications[0] : {};
        this.metaData = response.meta;


      } else {
        this.dmpAcyivityData = [];
        this.oldDmpActivityData = [];
        this.questionnaireAggregateResponse = null;
        this.metaData = null;
      }
    }
    );
  }
  openDialogForDailyDiary(dmpActivityObj: PatientDiseaseManagementProgramActivity) {
    let dmpActivityModal;
    dmpActivityModal = this.dmpActivityDialogModal.open(DMPModalComponent, { hasBackdrop: true, data: dmpActivityObj.diseaseManagementPlanPatientActivityId })
    dmpActivityModal.afterClosed().subscribe((result: string) => {
    });
  }
  getPatientDiseaseManagementProgramActivityNotifications(activityObj: PatientDiseaseManagementProgramActivity) {
    return (activityObj.patientDiseaseManagementProgramActivityNotifications || []).filter(x => !x.isDeleted);
  }
  onSubmit() {
    if (this.dmpAcyivityData && this.dmpAcyivityData.length) {

      const postData = this.dmpAcyivityData.filter((x) => {
        x.patientDiseaseManagementProgramActivityNotifications = x.patientDiseaseManagementProgramActivityNotifications.filter(notiObj => notiObj.notificationFrequency && notiObj.notificationTypeId && notiObj.notificationFrequencyValue);
        x.patientDiseaseManagementProgramActivityNotifications.map(y => {
          y.sign = null
        });
        return x.assignActivityToPatient == true || (x.assignActivityToPatient == false && x.diseaseManagementPlanPatientActivityId > 0)
      })
      if (postData && postData.length) {
        this.dmpActivityService.create(postData, this.patientId, this.diseaseManagmentProgramId).subscribe((response: any) => {
          if (response.statusCode == 200) {
            this.notifier.notify('success', response.message)
            this.getDmpActivityList();
          } else {
            this.notifier.notify('error', response.message)
          }
        });
      } else {
        this.notifier.notify('warning', 'Please select atleast one activity to create care plan.')
      }
    }
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  removePatientNotifications(activityIndex: number, iy: number, notificationObj: PatientDiseaseManagementProgramActivityNotification) {
    if (notificationObj.diseaseManagmentPlanPatientActivityNotificationId > 0) {
      notificationObj.isDeleted = true;
      this.dmpAcyivityData[activityIndex].patientDiseaseManagementProgramActivityNotifications[iy] = notificationObj
    } else {
      this.dmpAcyivityData[activityIndex].patientDiseaseManagementProgramActivityNotifications.splice(iy, 1);
    }

  }
  addPatientNotifications(activityIndex: number, notificationModel?: PatientDiseaseManagementProgramActivityNotification) {
    const notificationControls = notificationModel || new PatientDiseaseManagementProgramActivityNotification();
    this.dmpAcyivityData[activityIndex].patientDiseaseManagementProgramActivityNotifications.push(notificationControls);
  }

  handleExpandRow(diseaseManagementProgramActivityId: number, ActIndex: number) {

    if (ActIndex > -1) {
      const activityObj = this.dmpAcyivityData[ActIndex];
      if (!activityObj.patientDiseaseManagementProgramActivityNotifications || activityObj.patientDiseaseManagementProgramActivityNotifications.length == 0) {
        this.addPatientNotifications(ActIndex, new PatientDiseaseManagementProgramActivityNotification());
      }
    }

    const index = this.expandedIds.findIndex(obj => obj == diseaseManagementProgramActivityId);
    if (index > -1) {
      this.expandedIds.splice(index, 1);
    } else {
      this.expandedIds.push(diseaseManagementProgramActivityId);
    }
  }
}
