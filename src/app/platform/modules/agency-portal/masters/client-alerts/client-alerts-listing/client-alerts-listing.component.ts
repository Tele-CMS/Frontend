import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientAlerts } from './client-alerts.model';
import { Metadata, ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { ClientAlertsService } from '../client-alerts.service';
import { FilterModel } from '../../../../core/modals/common-model';
import { MatPaginator, MatDialog } from '@angular/material';
import { merge } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../core/services';
import { format } from 'date-fns';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { ReminderModalComponent } from '../reminder-modal/reminder-modal.component';

@Component({
  selector: 'app-client-alerts-listing',
  templateUrl: './client-alerts-listing.component.html',
  styleUrls: ['./client-alerts-listing.component.scss']
})
export class ClientAlertsListingComponent implements OnInit {
  clientAlerts: ClientAlerts;
  clientId: number;
  alertMetaData: any;
  headers: Array<any>;
  masterAlertTypes: any = [];
  filterModel: FilterModel;
  isLoadingExportPrint: boolean = false;
  isDialogLoading: boolean;
  pageSize: number;
  isAlertExportButtonDisabled: boolean = true;
  isLoading: boolean = false;
  metaData: any;
  defaultAlertTypeId: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  masterEnrollmentTypeFilter: Array<any>;
  currentLocationId: number;
  masterStaffs: Array<any>;
  masterEligibleDD: Array<any>;
  programsData: Array<any> = [];
  masterRelationship: Array<any> = [];
  masterGender: Array<any> = [];
  masterChronicCondition: Array<any> = [];
  masterRiskData: Array<any> = [];
  nextAppointmentList: Array<any> = [
    { id: true, value: 'Upcoming Appointment' },
    { id: false, value: 'No Upcoming Appointment' }
  ];
  displayedColumns: Array<any> = [
    { displayName: 'Patient Name', key: 'patientName', class: '', width: '100px', type: 'link', url: '/web/client/alerts', queryParamsColumn: 'queryParamsPatientObj' },
    { displayName: 'Load Date', key: 'loadDate', class: '', width: '100px', type: 'date' },
    { displayName: 'Alert Type', key: 'alertType', class: '', width: '100px' },
    { displayName: 'Details        ', key: 'details', class: '', width: '300px', type: "50", isInfo: true },
    // { displayName: 'DOB', key: 'dob', isSort: true, class: '', width: '100px', type: 'date' },
    { displayName: 'Age', key: 'age', class: '', width: '80px' },
    // { displayName: 'Medical Id', key: 'medicalId', isSort: true, class: '', width: '100px' },
    // { displayName: 'Eligibility Status', key: 'eligibilityStatus', class: '', width: '100px' },
    // { displayName: 'Risk', key: 'risk', class: '', width: '100px' },
    { displayName: 'Provider Team', key: 'careTeamNames', class: '', width: '110px', type: "15", isInfo: true },
    { displayName: 'Programs', key: 'programNames', class: '', width: '110px', type: "15", isInfo: true },
    { displayName: 'Gender', key: 'gender', class: '', width: '100px' },
    // { displayName: 'Relationship', key: 'relationship', class: '', width: '110px' },
    // { displayName: 'Primary Condition', key: 'primaryCondition', class: '', width: '110px' },
    // { displayName: 'Comorbid Conditions', key: 'comorbidConditions', class: '', width: '110px', type: "18", isInfo: true },
    // { displayName: 'Upcoming Appointment', key: 'nextAppointmentDate', isSort: true, class: '', width: '10%', type: 'datetime' },
  ];
  actionButtons: Array<any> = [];
  alertsList: Array<any>;
  defaultEnrollmentId: number;
  constructor(
    private clientAlertsService: ClientAlertsService,
    private notifier: NotifierService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private dialogModal: MatDialog
  ) {

    this.filterModel = new FilterModel();
    this.clientAlerts = new ClientAlerts();
    this.clientAlerts = {
      ...this.clientAlerts,
      AlertTypeIds: [],
      StartDate: null,
      EndDate: null,
      CareManagerIds: [],
      EnrollmentId: null,
      dob: '',
      medicalID: '',
      eligibilityStatus: '',
      startAge: null,
      endAge: null,
      riskIds: [],
      ProgramIds: [],
      GenderIds: [],
      RelationshipIds: [],
      PrimaryConditionId: null,
      ComorbidConditionIds: [],
      nextAppointmentPresent: null,
    }
    this.masterEligibleDD = [
      { id: 1, value: 'Yes' },
      { id: 2, value: 'No' },
      { id: 3, value: 'All' }
    ]
    this.metaData = new Metadata();
    this.alertMetaData = new Metadata();
    this.masterEnrollmentTypeFilter = [];
    this.masterStaffs = [];
    this.alertsList = []

  }

  ngOnInit() {

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLocationId = user.currentLocationId;
        this.clientAlerts.CareManagerIds = [parseInt(user.id, 10)];
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      let Id = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      let caremanagerIds = params.cmId ? this.commonService.encryptValue(params.cmId, false) : null,
        cmId = caremanagerIds ? (caremanagerIds || '').split(',').map(x => parseInt(x, 10)) : null,
        enrollId = params.enrollId == undefined ? null : this.commonService.encryptValue(params.enrollId, false);
      this.clientAlerts.nextAppointmentPresent = params.nextApp == undefined ? null : Boolean(JSON.parse(params.nextApp));

      if (Id > 0) {
        this.clientAlerts.AlertTypeIds = [parseInt(Id, 10)];
      }
      if (cmId && cmId.length > 0)
        this.clientAlerts.CareManagerIds = cmId;
      else if (Id > 0) {
        this.clientAlerts.CareManagerIds = [];
      }
      if (enrollId > 0)
        this.clientAlerts.EnrollmentId = parseInt(enrollId, 10);

    });
    this.getMasterData();
    this.getStaffsByLocation();
    this.getProgramList();
  }
  getProgramList() {
    this.clientAlertsService.getDiseaseProgramsWithEnrollmentsList().subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.programsData = response.data || [];
      } else {
        this.programsData = [];
      }
    }
    );
  }
  getDataLoadAlerts() {
    this.isLoading = true;
    const clientAlerts = {
      ...this.clientAlerts,
      StartDate: this.clientAlerts.StartDate && format(this.clientAlerts.StartDate, 'YYYY-MM-DD'),
      EndDate: this.clientAlerts.EndDate && format(this.clientAlerts.EndDate, 'YYYY-MM-DD'),
      dob: this.clientAlerts.dob && format(this.clientAlerts.dob, 'YYYY-MM-DD'),
    }
    this.clientAlertsService.getDataLoadAlerts(clientAlerts).subscribe((response) => {
      this.isLoading = false;
      if (response.statusCode == 200) {
        this.alertsList = (response.data || []).map(x => {
          x['queryParamsPatientObj'] = { id: x.patientId > 0 ? this.commonService.encryptValue(x.patientId, true) : null };
          return x;
        });
        this.isAlertExportButtonDisabled = this.alertsList.length > 0 ? false : true;
        this.alertMetaData = response.meta;
        // this.headers = Object.keys(this.reportData && this.reportData.length > 0 ? this.reportData[0] : [])
        // if(this.headers && this.headers.length > 0) {
        //   this.headers.shift();
        //   this.headers.pop();
        // }
      } else {
        this.isLoading = false;
        this.alertsList = [];
        this.alertMetaData = new Metadata();
      }
      this.alertMetaData.pageSizeOptions = [5,10,25,50,100];
    });
  }
  getMasterData() {
    this.clientAlertsService.getMasterData('alertsindicatorfilter,MASTERRISKINDICATOR,MASTERENROLLMENTTYPEFILTER,MASTERGENDER,MEMBERRELATIONSHIP,MASTERDISEASECONDITIONMAPPEDWITHDMP').subscribe((response: any) => {
      if (response != null) {
        this.masterAlertTypes = response.masterLoadAlerts != null ? response.masterLoadAlerts : [];
        this.masterEnrollmentTypeFilter = response.masterEnrollmentTypeFilter || [];
        this.masterRiskData = response.masterRiskIndicator != null ? response.masterRiskIndicator : [];
        this.masterEnrollmentTypeFilter = response.masterEnrollmentTypeFilter || [];
        this.masterGender = response.masterGender != null ? response.masterGender : [];
        this.masterRelationship = response.memberRelationship != null ? response.memberRelationship : [];
        this.masterChronicCondition = response.masterDiseaseConditionMappedWithDMP != null ? response.masterDiseaseConditionMappedWithDMP : [];
        let defaultEnrollTypeObj = this.masterEnrollmentTypeFilter.find(x => x.value == 'All');
        this.defaultEnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
        if (!this.clientAlerts.EnrollmentId) {
          this.clientAlerts.EnrollmentId = this.defaultEnrollmentId;
        }
      }
      this.getDataLoadAlerts();
    });
  }

  getStaffsByLocation(): void {
    const locId = this.currentLocationId.toString();
    this.clientAlertsService.getStaffAndPatientByLocation(locId)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.masterStaffs = [];
        } else {
          this.masterStaffs = response.data.staff || [];
        }
      })
  }

  onCMSelectDeselectAll(key: string = '') {
    if ((key || '').toUpperCase() == 'SELECTALL') {
      if ((this.clientAlerts.CareManagerIds || []).length == this.masterStaffs.length) {
        return;
      }
      this.clientAlerts.CareManagerIds = this.masterStaffs.map(x => x.id);
    } else {
      if ((this.clientAlerts.CareManagerIds || []).length == 0) {
        return;
      }
      this.clientAlerts.CareManagerIds = [];
    }
  }
  onAlertSelectDeselectAll(key: string = '') {
    if ((key || '').toUpperCase() == 'SELECTALL') {
      if ((this.clientAlerts.AlertTypeIds || []).length == this.masterAlertTypes.length) {
        return;
      }
      this.clientAlerts.AlertTypeIds = this.masterAlertTypes.map(x => x.id);
    } else {
      if ((this.clientAlerts.AlertTypeIds || []).length == 0) {
        return;
      }
      this.clientAlerts.AlertTypeIds = [];
    }
  }
  onComorbidSelectOrDeselectChange(key: string = '') {
    if (key.toUpperCase() == 'SELECTALL') {
      if (this.clientAlerts.ComorbidConditionIds.length == this.masterChronicCondition.length) {
        return;
      }
      this.clientAlerts.ComorbidConditionIds = this.masterChronicCondition.map(x => x.id);
    } else {
      if ((this.clientAlerts.ComorbidConditionIds || []).length == 0) {
        return;
      }
      this.clientAlerts.ComorbidConditionIds = [];
    }
  }
  onRelationshipSelectOrDeselectChange(key: string = '') {
    if (key.toUpperCase() == 'SELECTALL') {
      if (this.clientAlerts.RelationshipIds.length == this.masterRelationship.length) {
        return;
      }
      this.clientAlerts.RelationshipIds = this.masterRelationship.map(x => x.id);
    } else {
      if ((this.clientAlerts.RelationshipIds || []).length == 0) {
        return;
      }
      this.clientAlerts.RelationshipIds = [];
    }
  }
  onGenderSelectOrDeselectChange(key: string = '') {
    if (key.toUpperCase() == 'SELECTALL') {
      if (this.clientAlerts.GenderIds.length == this.masterGender.length) {
        return;
      }
      this.clientAlerts.GenderIds = this.masterGender.map(x => x.id);
    } else {
      if ((this.clientAlerts.GenderIds || []).length == 0) {
        return;
      }
      this.clientAlerts.GenderIds = [];
    }
  }
  onRiskSelectOrDeselectChange(key: string = '') {
    if (key.toUpperCase() == 'SELECTALL') {
      if (this.clientAlerts.riskIds.length == this.masterRiskData.length) {
        return;
      }
      this.clientAlerts.riskIds = this.masterRiskData.map(x => x.id);
    } else {
      if ((this.clientAlerts.riskIds || []).length == 0) {
        return;
      }
      this.clientAlerts.riskIds = [];
    }
  }
  onProgramSelectOrDeselectChange(key: string = '') {
    if (key.toUpperCase() == 'SELECTALL') {
      if (this.clientAlerts.ProgramIds.length == this.programsData.length) {
        return;
      }
      this.clientAlerts.ProgramIds = this.programsData.map(x => x.id);
    } else {
      if ((this.clientAlerts.ProgramIds || []).length == 0) {
        return;
      }
      this.clientAlerts.ProgramIds = [];
    }
  }
  applyFilter(event: any) {
    this.clientAlerts.AlertTypeIds = event.value;
    this.getDataLoadAlerts();
  }
  searchFilter() {
    this.getDataLoadAlerts();
  }
  clearFilters() {
    this.clientAlerts = {
      ...this.clientAlerts,
      AlertTypeIds: [],
      searchText: '',
      CareManagerIds: [],
      EnrollmentId: this.defaultEnrollmentId,
      StartDate: null,
      EndDate: null,
      medicalID: '',
      dob: '',
      eligibilityStatus: '',
      endAge: null,
      startAge: null,
      riskIds: [],
      ProgramIds: [],
      GenderIds: [],
      RelationshipIds: [],
      PrimaryConditionId: null,
      ComorbidConditionIds: [],
      nextAppointmentPresent: null,
    }
    this.getDataLoadAlerts();
  }

  get getalertsLength() {
    return (this.alertsList || []).length;
  }
  // onPageChanges() {
  //   merge(this.paginator.page)
  //     .subscribe(() => {
  //       const changeState = {
  //         pageNumber: (this.paginator.pageIndex + 1),
  //         pageSize: this.paginator.pageSize
  //       }
  //       this.setLoadAlertPaginatorModel(changeState.pageNumber, changeState.pageSize, '', '');
  //       this.getDataLoadAlerts();
  //     })
  // }
  // onPageOrSortChange(changeState?: any) {
  //   this.setLoadAlertPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getDataLoadAlerts();
  // } new one
  onPageOrSortChange(changeState?: any) {
    this.setLoadAlertPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getDataLoadAlerts();
  }

  setLoadAlertPaginatorModel(pageNumber, pageSize, sortColumn, sortOrder) {
    this.clientAlerts.pageNumber = pageNumber;
    this.clientAlerts.pageSize = pageSize;
    this.clientAlerts.sortOrder = sortOrder;
    this.clientAlerts.sortColumn = sortColumn;
  }

  openEmailPopup() {
    let customEmailModal;
    const filters = {
      ...this.clientAlerts,
      pageSize: this.alertsList[0] ? this.alertsList[0].totalRecords : 0,
      AlertTypeIds: (this.clientAlerts.AlertTypeIds || []).join(','),
      CareManagerIds: (this.clientAlerts.CareManagerIds || []).join(','),
      StartDate: this.clientAlerts.StartDate && format(this.clientAlerts.StartDate, 'YYYY-MM-DD'),
      EndDate: this.clientAlerts.EndDate && format(this.clientAlerts.EndDate, 'YYYY-MM-DD'),
      dob: this.clientAlerts.dob && format(this.clientAlerts.dob, 'YYYY-MM-DD'),
      riskIds: (this.clientAlerts.riskIds || []).join(','),
      GenderIds: (this.clientAlerts.GenderIds || []).join(','),
      RelationshipIds: (this.clientAlerts.RelationshipIds || []).join(','),
      ProgramIds: (this.clientAlerts.ProgramIds || []).join(','),
      ComorbidConditionIds: (this.clientAlerts.ComorbidConditionIds || []).join(','),
      nextAppointmentPresent: this.clientAlerts.nextAppointmentPresent,
    }

    customEmailModal = this.dialogModal.open(EmailModalComponent, {
      data: filters
    });
    customEmailModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }
    });
  }

  openMessagePopup() {
    let customEmailModal;
    const filters = {
      ...this.clientAlerts,
      pageSize: this.alertsList[0] ? this.alertsList[0].totalRecords : 0,
      AlertTypeIds: (this.clientAlerts.AlertTypeIds || []).join(','),
      CareManagerIds: (this.clientAlerts.CareManagerIds || []).join(','),
      StartDate: this.clientAlerts.StartDate && format(this.clientAlerts.StartDate, 'YYYY-MM-DD'),
      EndDate: this.clientAlerts.EndDate && format(this.clientAlerts.EndDate, 'YYYY-MM-DD'),
      dob: this.clientAlerts.dob && format(this.clientAlerts.dob, 'YYYY-MM-DD'),
      riskIds: (this.clientAlerts.riskIds || []).join(','),
      GenderIds: (this.clientAlerts.GenderIds || []).join(','),
      RelationshipIds: (this.clientAlerts.RelationshipIds || []).join(','),
      ProgramIds: (this.clientAlerts.ProgramIds || []).join(','),
      ComorbidConditionIds: (this.clientAlerts.ComorbidConditionIds || []).join(','),
      nextAppointmentPresent: this.clientAlerts.nextAppointmentPresent,
    }

    customEmailModal = this.dialogModal.open(MessageModalComponent, {
      data: filters
    });
    customEmailModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }
    });
  }

  exportToExcel() {
    this.isLoadingExportPrint = true;
    const filters = {
      ...this.clientAlerts,
      pageSize: this.alertsList[0] ? this.alertsList[0].totalRecords : 0,
      StartDate: this.clientAlerts.StartDate && format(this.clientAlerts.StartDate, 'YYYY-MM-DD'),
      EndDate: this.clientAlerts.EndDate && format(this.clientAlerts.EndDate, 'YYYY-MM-DD'),
      dob: this.clientAlerts.dob && format(this.clientAlerts.dob, 'YYYY-MM-DD'),
    }
    this.clientAlertsService.getExportPatientAlerts(filters).subscribe((response: any) => {

      if (response) {
        this.isLoadingExportPrint = false;
        this.notifier.notify('success', "Please check the downloaded report for exported results")
        this.downLoadFile(response, response.type, "Report.xls");
      }
    });
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
  printAlertsData(event: any) {
    this.isLoadingExportPrint = true;
    const filters = {
      ...this.clientAlerts,
      pageSize: this.alertsList[0] ? this.alertsList[0].totalRecords : 0,
      StartDate: this.clientAlerts.StartDate && format(this.clientAlerts.StartDate, 'YYYY-MM-DD'),
      EndDate: this.clientAlerts.EndDate && format(this.clientAlerts.EndDate, 'YYYY-MM-DD'),
      dob: this.clientAlerts.dob && format(this.clientAlerts.dob, 'YYYY-MM-DD'),
    }
    this.clientAlertsService.generateAlertDataPDF(filters).subscribe((response: any) => {
      this.isLoadingExportPrint = false;
      this.clientAlertsService.downLoadFile(response, 'application/pdf', `Alerts List.pdf`)
    });
  }
  openReminderDialog(){
    let reminderModal;
    // this.filterModel.pageSize = this.patientList.find(x => x.totalRecords > 0).totalRecords;
    const filterParams = this.filterModel.pageSize
    reminderModal = this.dialogModal.open(ReminderModalComponent,{
      data: {
        locationId: this.currentLocationId,
        alertTypeIds: (this.clientAlerts.AlertTypeIds || []).join(','),
        careManagerIds: (this.clientAlerts.CareManagerIds || []).join(','),
        comorbidConditionIds: (this.clientAlerts.ComorbidConditionIds || []).join(','),
        filterEndDate: this.clientAlerts.EndDate && format(this.clientAlerts.EndDate, 'YYYY-MM-DD'),
        enrollmentId: this.clientAlerts.EnrollmentId,
        genderIds: (this.clientAlerts.GenderIds || []).join(','),
        primaryConditionId: this.clientAlerts.PrimaryConditionId,
        programIds: (this.clientAlerts.ProgramIds || []).join(','),
        relationshipIds: (this.clientAlerts.RelationshipIds || []).join(','),
        filterStartDate: this.clientAlerts.StartDate && format(this.clientAlerts.StartDate, 'YYYY-MM-DD'),
        dob: this.clientAlerts.dob && format(this.clientAlerts.dob, 'YYYY-MM-DD'),
        eligibilityStatus: this.clientAlerts.eligibilityStatus,
        endAge: this.clientAlerts.endAge,
        medicalID: this.clientAlerts.medicalID,
        riskIds: (this.clientAlerts.riskIds || []).join(','),
        search: this.clientAlerts.searchText,
        startAge: this.clientAlerts.startAge
      }
    })

    reminderModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }

     });
  }
}
