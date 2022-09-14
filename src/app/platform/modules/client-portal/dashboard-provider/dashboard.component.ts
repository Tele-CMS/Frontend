import { Component, OnInit, ViewChild, ViewEncapsulation, EventEmitter, Output, OnDestroy } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { FilterModel, ResponseModel } from '../../../../super-admin-portal/core/modals/common-model';
import { ClientStatusChartModel, PatientDocumentModel } from './dashboard.model';
import { Metadata } from '../../core/modals/common-model';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services';
import { merge, Subscription, Subject } from 'rxjs';
import { MatPaginator, MatDialog, MatSelectChange } from '@angular/material';
import { format, addDays, startOfMonth, setMonth, endOfMonth, setYear, startOfYear, endOfYear, isValid } from 'date-fns';
import { LoginUser } from '../../core/modals/loginUser.modal';
import { NotifierService } from 'angular-notifier';
import { CancelAppointmentDialogComponent } from './cancel-appointment-dialog/cancel-appointment-dialog.component';
import { TasksDialogComponent } from '../tasks-dialog/tasks-dialog/tasks-dialog.component';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { ApproveAppointmentDialogComponent } from './approve-appointment-dialog/approve-appointment-dialog.component';
import { Color } from 'ng2-charts';
import { filter } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  encFilterModel: FilterModel;
  appointmentList: Array<any> = [];
  clientStatusChartData: Array<ClientStatusChartModel> = [];
  tasksFilterModel: FilterModel;
  taskMeta: Metadata;
  tasksList: Array<any> = [];
  programsData: Array<any> = []
  masterTimeIntervalData: Array<any> = []
  masterAppointmenttimeIntervalData: Array<any> = []
  masterhugsMessagetimeIntervalData: Array<any> = []
  masterPOCHugsType: Array<any> = []
  masterAppointmentStatus: Array<any> = []
  masterHugsMessageStatus: Array<any> = []
  masterEncounterTypes: Array<any> = []
  masterEncountertimeIntervalData: Array<any> = []
  masterAlertTypes: Array<any> = [];
  // all appointments
  allAppointmentsFilterModel: FilterModel;
  allAppointmentsMeta: Metadata;
  allAppointmentsList: Array<any> = [];
  allAppointmentsDisplayedColumns: Array<any>;
  allAppointmentsActionButtons: Array<any>;
  addPermission: boolean;
  closePermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  filterModel: FilterModel;
  pendingAptfilterModel: FilterModel;
  cancelledAptfilterModel: FilterModel;
  upcomingAptfilterModel: FilterModel;
  tentativeAptFilterModel: FilterModel;
  subscription: Subscription;
  isAuth: boolean = true;
  status: boolean = false;
  passwordExpiryColorCode: string = '';
  passwordExpiryMessage: string = '';
  showMessage: boolean = true;
  accessToken = 'YOUR_ACCESS_TOKEN';
  message: Subject<any> = new Subject();
  currentLoginUserId: number;
  currentLocationId: number;
  userRoleName: string;
  isAdmin: boolean;
  pendingAppointmentMeta: Metadata;
  cancelledAppointmentMeta: Metadata;
  tentativeAppointmentMeta: Metadata;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pendingDisplayedColumns: Array<any>;
  pendingActionButtons: Array<any>;
  cancelledDisplayedColumns: Array<any>;
  cancelledActionButtons: Array<any>;
  tentativeDisplayedColumns: Array<any>;
  tentativeActionButtons: Array<any>;
  pieChartDataList: Array<any>;
  careGapDataList: Array<any>
  lineChartDataForTasks: Array<any>;
  lineChartDataForDMP: Array<any>;
  lineChartDataForAppointment: Array<any>;
  lineChartDataForHugsMessage: Array<any>;
  barChartDataForHra: Array<any>;
  lineChartDataForEncounters: Array<any>;
  showTaskGraph: boolean = false
  showGraphDMP: boolean = false
  showHugsMessageGraph: boolean = false
  showGraphAppointment: boolean = false
  showPieChartCarePlan: boolean = false
  showEncounterGraph: boolean = false
  showPieChartDemographicInfo: boolean = false
  lineChartData_tsk: Array<any>;
  lineChartOptions_tsk: any
  lineChartLabels_tsk: Array<any> = [];
  lineChartData_dmp: Array<any>;
  lineChartData_appointments: Array<any>;
  lineChartData_hugsMessage: Array<any>;
  lineChartOptions_dmp: any
  lineChartColors_dmp: Array<Color>
  lineChartOptions_appointments: any
  lineChartOptions_hugsMessage: any
  showGraphForHRA: boolean = false
  barChartOptions_hra: any
  barChartData_hra: Array<any>;
  barChartColors_hra: Array<Color>;
  barChartLabels_hra: Array<any> = [];
  lineChartColors_tsk: Array<Color>
  barChartColors_appointments: Array<Color>;
  barChartColors_hugsMessage: Array<Color>;
  barChartColors_risk: Array<Color>;
  lineChartLabels_dmp: Array<any> = [];
  lineChartLabels_appointments: Array<any> = [];
  lineChartLabels_hugsMessage: Array<any> = [];
  lineChartLabels_encounters: Array<any> = [];
  lineChartColors_encounter: Array<Color>
  lineChartOptions_encounters: any
  lineChartData_encounters: Array<any>;
  pieChartLabels_demographic: Array<any>;
  pieChartData_demographic: Array<any> = [];
  pieChartOptions_demographic: any;
  pieChartType = 'pie';
  pieColors_demographic: Array<any>;
  pieChartLabels_carePlan: Array<any>;
  pieChartData_carePlan: Array<any> = [];
  pieChartOptions_carePlan: any;
  pieColors_carePlan: Array<Color>;
  patientDocumentData: PatientDocumentModel[];
  pendingPatientAppointment: Array<any> = [];
  cancelledPatientAppointment: Array<any> = [];
  tentativePatientAppointment: Array<any> = [];
  masterCareGapsList: Array<any> = [];
  masterTaskTypesList: Array<any> = [];
  masterTaskViewOptions: Array<any> = [];
  masterTaskTimeIntervalData: Array<any> = [];
  masterCareGapsStatus: Array<any> = [];
  barChartLabels_Alert: Array<any> = [];
  barChartData_Alert: Array<any> = [];
  barChartOptions_Alert: any;
  showAlertChart: boolean = false;
  barChartColors_Alert: Array<Color>
  AlertData: Array<any> = [];
  barChartLabels_Risk: Array<any> = [];
  barChartData_Risk: Array<any> = [];
  barChartOptions_Risk: any;
  showRiskChart: boolean = false;
  showGraphForComorbidCondition: boolean = false;
  data_ComorbidCondition: Array<any>;
  barChartOptions_ComorbidCondition: any
  barChartData_ComorbidCondition: Array<any>;
  barChartLabels_ComorbidCondition: Array<any> = [];
  barChartColors_ComorbidCondition: Array<Color>;
  // TherClass Drug Breakdown Graph
  showPieChartForDrugBreakdownTheraClass: boolean = false
  pieChartData_theraClass: Array<any> = []
  pieChartLabels_theraClass: Array<any>;
  pieChartOptions_theraClass: any;
  //  pieChartType = 'pie';
  pieColors_theraClass: Array<any>;
  pageNumberForAPPTList: number;
  // -----------------------------------------------------------------
  metaData: any;
  headerText: string;
  selectedIndex: number = 0
  masterChartViewType: Array<any> = []
  nextAppointmentList: Array<any> = [
    { id: true, value: 'Upcoming Appointment' },
    { id: false, value: 'No Upcoming Appointment' }
  ];
  HRADisplayedColumns: Array<any> = [
    { displayName: 'Assessment', key: 'documentName', class: '', width: '110px' },
    { displayName: 'STATUS', key: 'status', class: '', width: '80px' },
    { displayName: 'Patient Name', key: 'patientName', class: '', width: '120px', type: 'link', url: '/web/client/profile', queryParamsColumn: 'queryParamsPatientObj' },
    { displayName: 'COMPLETION DATE', key: 'completionDate', class: '', width: '120px', type: "date" },
    { displayName: 'Due Date', key: 'expirationDate', class: '', width: '120px', type: "date" }, { displayName: 'Actions', key: 'Actions', class: '', width: '80px' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Create Plan', key: 'view', class: 'fa fa-pencil-square-o' }];
  filterParams: {
    programIds: Array<string>,
    conditionIds: Array<string>,
    timeIntervalFilterId: number,
    isCheckTotalEnrollments: boolean,
    isCheckEnrolled: boolean,
    isCheckNotEnrolled: boolean,
    CareManagerIds: Array<number>;
    EnrollmentId: number,
    nextAppointmentPresent: boolean
  }
  filterParamsForTheraClass: {
    StartDate: any,
    EndDate: any,
    MinAmount?: number,
    MaxAmount?: number,
    ChartView?: number,
    nextAppointmentPresent: boolean
  }
  filterParamsForAppointent: {
    statusIds: Array<string>,
    appointmentTimeIntervalId: number,
    //isCheckTotalEnrollments: boolean
    CareManagerIds: Array<number>,
    nextAppointmentPresent: boolean
  }
  filterParamsForHugsMessage: {
    statusIds: Array<string>,
    hugsMessageTimeIntervalId: number,
    CareManagerIds: Array<number>,
    pocHugsTypeId: number;
  }
  filterParamsForEncounter: {
    encounterTypeIds: Array<string>,
    encounterTimeIntervalId: number,
    CareManagerIds: Array<number>,
    EnrollmentId: number,
    nextAppointmentPresent: boolean,
    //isCheckTotalEnrollments: boolean
  }
  filterParamsForHRA: {
    careManagerIds: Array<string>
    EnrollmentId: number,
    nextAppointmentPresent: boolean,
  }
  filterParamsFoRisk: {
    careManagerIds: Array<string>,
    EnrollmentId: number,
    nextAppointmentPresent: boolean,
  }
  filterCareGapGraph: {
    CareGapIds: Array<string>,
    StatusIds: number,
    CareManagerIds: Array<number>,
    EnrollmentId: number,
    TimeIntervalId: number,
    AllPatients: boolean,
    CareGapsViewId: number,
    nextAppointmentPresent: boolean,
  }
  filterAlerts: {
    AlertTypeIds: Array<number>,
    CareManagerIds: Array<number>,
    EnrollmentId: number,
    nextAppointmentPresent: boolean,
  }
  filterTaskParams: {
    taskTypeIds: Array<string>,
    timeIntervalFilterId: number,
    careManagerIds: Array<number>,
    AllTasks: boolean,
  }
  filterAgeGroupGraph: {
    CareManagerIds: Array<number>,
    EnrollmentId: number,
    nextAppointmentPresent: boolean,
  }
  filtersForComorbidCondition: {
    PrimaryConditionId: number,
    ComorbidConditionIds: Array<number>,
    EnrollmentId: number,
    nextAppointmentPresent: boolean,
  }
  diseaseConditionsData: Array<any> = [];
  chartViewName: string = ''
  masterStaffs: Array<any>;
  masterStaffsForEncounter: Array<any>;
  masterCareGapsTimeIntervalData: any;
  RiskData: Array<any> = [];
  masterEnrollmentTypeFilter: Array<any> = [];
  masterCareGapsGraphViewFilter: Array<any> = [];
  areRetainedFilters: boolean;
  masterChronicCondition: Array<any>;
  theraClassDataList: Array<any>
  constructor(
    private dashoboardService: DashboardService,
    public dialogModal: MatDialog,
    private commonService: CommonService,
    private dialogService: DialogService,
    private router: Router,
    private notifierService: NotifierService,
    private dailog: MatDialog
  ) {
    this.encFilterModel = new FilterModel();
    this.tasksFilterModel = new FilterModel();
    this.pendingAptfilterModel = new FilterModel();
    this.cancelledAptfilterModel = new FilterModel();
    this.upcomingAptfilterModel = new FilterModel();
    this.tentativeAptFilterModel = new FilterModel();
    this.taskMeta = new Metadata();
    this.allAppointmentsFilterModel = new FilterModel();
    this.allAppointmentsMeta = null;
    this.filterParams = {
      programIds: [],
      conditionIds: [],
      timeIntervalFilterId: null,
      isCheckTotalEnrollments: false,
      isCheckEnrolled: true,
      isCheckNotEnrolled: false,
      CareManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
    this.filterParamsForAppointent = {
      statusIds: [],
      appointmentTimeIntervalId: null,
      CareManagerIds: [],
      nextAppointmentPresent: null
    }
    this.filterParamsForHugsMessage = {
      statusIds: [],
      hugsMessageTimeIntervalId: null,
      CareManagerIds: [],
      pocHugsTypeId: null
    }
    this.filterParamsForHRA = {
      careManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
    this.filterParamsFoRisk = {
      careManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
    this.filterParamsForEncounter = {
      encounterTypeIds: [],
      encounterTimeIntervalId: null,
      CareManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
    this.filterParamsForTheraClass = {
      StartDate: new Date(new Date().setDate(new Date().getDate() - 365)),
      EndDate: new Date(),
      MinAmount: null,
      MaxAmount: null,
      ChartView: null,
      nextAppointmentPresent: null
    }
    this.filterCareGapGraph = {
      CareGapIds: [],
      StatusIds: null,
      CareManagerIds: [],
      EnrollmentId: null,
      TimeIntervalId: null,
      AllPatients: false,
      CareGapsViewId: null,
      nextAppointmentPresent: null
    }
    this.filterAlerts = {
      AlertTypeIds: [],
      CareManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null,
    }
    this.filterTaskParams = {
      taskTypeIds: [],
      timeIntervalFilterId: null,
      careManagerIds: [],
      AllTasks: true
    }
    this.filterAgeGroupGraph = {
      CareManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
    this.filtersForComorbidCondition = {
      PrimaryConditionId: null,
      ComorbidConditionIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
    this.pendingDisplayedColumns = [
      { displayName: 'Provider', key: 'staffName', width: '110px', sticky: true },
      { displayName: 'Patient Name', key: 'fullName', width: '120px', type: 'link', url: '/web/client/profile', queryParamsColumn: 'queryParamsPatientObj', sticky: true },
      { displayName: 'Appointment Type', key: 'appointmentType', width: '130px' },
      { displayName: 'Date Time', key: 'dateTimeOfService', width: '250px', type: 'link', url: '/web/client/scheduling', queryParamsColumn: 'queryParamsObj' },
      { displayName: 'Actions', key: 'Actions', width: '80px', sticky: true }
    ]
    this.pendingActionButtons = [
      { displayName: 'Approve', key: 'approve', class: 'fa fa-check' },
      { displayName: 'Cancel', key: 'cancel', class: 'fa fa-ban' },
    ];

    this.cancelledDisplayedColumns = [
      { displayName: 'Provider', key: 'staffName', width: '100px', sticky: true },
      { displayName: 'Patient Name', key: 'fullName', width: '120px', type: 'link', url: '/web/client/profile', queryParamsColumn: 'queryParamsPatientObj', sticky: true },
      { displayName: 'Appointment Type', key: 'appointmentType', width: '130px' },
      { displayName: 'Date Time', key: 'dateTimeOfService', isSort: true, width: '200px', type: 'link', url: '/web/client/scheduling', queryParamsColumn: 'queryParamsObj' },
      { displayName: 'Cancel Type', key: 'cancelType', width: '120px' },
      { displayName: 'Cancel Reason', key: 'cancelReason', width: '120px' },
      { displayName: 'Actions', key: 'Actions', width: '60px', sticky: true }
    ]
    this.cancelledActionButtons = [];

    this.tentativeDisplayedColumns = [
      { displayName: 'Provider', key: 'staffName', width: '110px', sticky: true },
      { displayName: 'Patient Name', key: 'fullName', width: '120px', type: 'link', url: '/web/client/profile', queryParamsColumn: 'queryParamsPatientObj', sticky: true },
      { displayName: 'Appointment Type', key: 'appointmentType', width: '130px' },
      { displayName: 'Date Time', key: 'dateTimeOfService', width: '250px', type: 'link', url: '/web/client/scheduling', queryParamsColumn: 'queryParamsObj' },
      { displayName: 'Actions', key: 'Actions', width: '80px', sticky: true }
    ]
    this.tentativeActionButtons = [];

    this.allAppointmentsDisplayedColumns = [
      { displayName: 'Provider', key: 'staffName', class: '', width: '110px', sticky: true },
      { displayName: 'Patient Name', key: 'fullName', class: '', width: '120px', type: 'link', url: '/web/client/profile', queryParamsColumn: 'queryParamsPatientObj', sticky: true },
      { displayName: 'Appointment Type', key: 'appointmentType', width: '130px' },
      { displayName: 'Date Time', key: 'dateTimeOfService', width: '200px', type: 'link', url: '/web/client/scheduling', queryParamsColumn: 'queryParamsObj' },
      { displayName: 'Status', key: 'statusName', width: '80px' },
      { displayName: 'Encounter Status', key: 'encounterStatus', width: '80px' },
      { displayName: 'Actions', key: 'Actions', width: '50px' }
    ]
    this.allAppointmentsActionButtons = [];
    this.lineChartData_tsk = []
    this.lineChartData_dmp = []
    this.lineChartData_appointments = [];
    this.lineChartData_hugsMessage = [];
    this.barChartData_hra = [];
    this.barChartDataForHra = [];
    this.pieChartLabels_demographic = []
    this.pieChartLabels_carePlan = []
    this.pieColors_demographic = [];
    this.pieColors_carePlan = [];
    this.careGapDataList = [];
    this.barChartColors_appointments = [];
    this.barChartColors_hugsMessage = [];
    this.barChartColors_risk = [];
    this.data_ComorbidCondition = [];
    this.barChartColors_ComorbidCondition = [];
    this.barChartData_ComorbidCondition = [];
    this.barChartLabels_ComorbidCondition = [];
    this.masterStaffs = [];
    this.masterStaffsForEncounter = [];
    this.masterCareGapsTimeIntervalData = [];
    this.masterChronicCondition = [];
    this.masterTaskViewOptions = [{ 'id': false, 'value': 'Tasks by Appointment Date' }, { 'id': true, 'value': 'Tasks by Due Date' }]
  }
  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLoginUserId = user.id;
        this.currentLocationId = user.currentLocationId;
        this.userRoleName = user && user.users3 && user.users3.userRoles.userType;
        this.isAdmin = true;

        if (this.currentLoginUserId > 0) {
          this.filterTaskParams.careManagerIds = [this.currentLoginUserId];
          this.filterCareGapGraph.CareManagerIds = [this.currentLoginUserId];
          this.filterParamsForAppointent.CareManagerIds = [this.currentLoginUserId];
          this.filterParamsForHugsMessage.CareManagerIds = [this.currentLoginUserId];
          this.filterAlerts.CareManagerIds = [this.currentLoginUserId];
          this.filterParamsForEncounter.CareManagerIds = [this.currentLoginUserId];
          let CMIdArray = [];
          CMIdArray.push(this.currentLoginUserId);
          this.filterParamsForHRA.careManagerIds = CMIdArray;
          this.filterParamsFoRisk.careManagerIds = CMIdArray
        }
        this.filterParamsForAppointent.CareManagerIds = [this.currentLoginUserId];
        this.filterParamsForHugsMessage.CareManagerIds = [this.currentLoginUserId];
        this.filterAlerts.CareManagerIds = [this.currentLoginUserId];
        this.filterAgeGroupGraph.CareManagerIds = [this.currentLoginUserId];
        this.filterParams.CareManagerIds = [this.currentLoginUserId];
      }

    });
    this.headerText = 'Assessments'
    this.filterModel = new FilterModel();

    // if session storage has filters retained
    if (sessionStorage.getItem("dashboardFilters")) {
      try {
        const dashboardFiltersString = this.commonService.encryptValue(sessionStorage.getItem("dashboardFilters"), false);
        const { filterParamsForAppointent, filterParamsForHugsMessage, filterTaskParams, filterAlerts, filterCareGapGraph, filterParamsForEncounter, filterParamsForTheraClass,
          filterAgeGroupGraph, filterParamsFoRisk, filterParams, filterParamsForHRA, chartViewName, filtersForComorbidCondition } = JSON.parse(dashboardFiltersString);
        this.chartViewName = chartViewName
        this.filterParamsForAppointent = filterParamsForAppointent;
        this.filterParamsForHugsMessage = filterParamsForHugsMessage;
        this.filterTaskParams = filterTaskParams;
        this.filterAlerts = filterAlerts;
        this.filterCareGapGraph = filterCareGapGraph;
        this.filterParamsForEncounter = filterParamsForEncounter;
        this.filterAgeGroupGraph = filterAgeGroupGraph;
        this.filterParamsFoRisk = filterParamsFoRisk;
        this.filterParams = filterParams;
        this.filterParamsForHRA = filterParamsForHRA;
        this.filtersForComorbidCondition = filtersForComorbidCondition;
        this.filterParamsForTheraClass = filterParamsForTheraClass
        this.areRetainedFilters = true;
      } catch (err) {
        console.error(err);
      }
    }

    this.getMasterData();
    //this.getProgramList();   --moved after master data call
    this.getDataForHRABarChart(this.filterParamsForHRA);
    this.getDataForRiskGraph(this.filterParamsFoRisk);
    // this.getDataForTheraClassPieChart(this.filterParamsForTheraClass)
    // this.getPatientDocumentList();
    this.getCareGapNames();
    this.getMasterTaskTypeNames();
    //this.getDiseaseConditionsFromProgramIds();  --moved after programs data call
    this.getStaffsByLocation();
    this.getUserPermissions();
    this.getPasswordExpiryMessage();
  }
  ngOnDestroy(): void {
    const dashboardFilters = {
      filterParamsForAppointent: this.filterParamsForAppointent,
      filterParamsForHugsMessage: this.filterParamsForHugsMessage,
      filterTaskParams: this.filterTaskParams,
      filterAlerts: this.filterAlerts,
      filterCareGapGraph: this.filterCareGapGraph,
      filterParamsForEncounter: this.filterParamsForEncounter,
      filterAgeGroupGraph: this.filterAgeGroupGraph,
      filterParamsFoRisk: this.filterParamsFoRisk,
      filterParams: this.filterParams,
      filterParamsForHRA: this.filterParamsForHRA,
      filtersForComorbidCondition: this.filtersForComorbidCondition,
      filterParamsForTheraClass: this.filterParamsForTheraClass,
      chartViewName: this.chartViewName
    };
    sessionStorage.setItem("dashboardFilters", this.commonService.encryptValue(JSON.stringify(dashboardFilters), true));
  }

  getMasterData() {
    const masterData = { masterdata: "CAREPLANSTATUSFILTER,APPOINTMENTIMEGRAPHFILTER,APPOINTMENTSTATUS,ENCOUNTERTYPES,ENCOUNTERGRAPHFILTER,MASTERTASKSTIMEINTERVAL,PATIENTCAREGAPSTATUS,ALERTSINDICATORFILTER,MASTERCAREGAPSTIMEINTERVAL,MASTERENROLLMENTTYPEFILTER,MASTERCAREGAPSGRAPHVIEWFILTER,MASTERDISEASECONDITIONMAPPEDWITHDMP,MASTERTHERACLASSGRAPHVIEWTYPE,POCHUGSSTATUS,HUGSCHARTTYPE,POCHUGSTYPE" };
    this.dashoboardService.getMasterData(masterData)
      .subscribe((response: any) => {
        const staticEncTypes = ['Acute Care', 'Wellness Visit', 'Administrative', 'Disease Management'];
        this.masterTimeIntervalData = response.carePlanStatusFilter || [];
        this.masterAppointmenttimeIntervalData = response.appointmentTimeGraphFilter || [];
        this.masterhugsMessagetimeIntervalData = response.hugsChartType || [];
        this.masterPOCHugsType = response.pocHugsType || [];
        this.masterAppointmentStatus = response.appointmentStatus || [];
        this.masterHugsMessageStatus = response.pocHugsStatus || []
        this.masterEncounterTypes = response.encounterTypes || [];
        this.masterEncountertimeIntervalData = response.encounterGraphfilter || [];
        this.masterTaskTimeIntervalData = response.masterTasksTimeInterval || [];
        this.masterCareGapsStatus = response.patientCareGapStatus || [];
        this.masterAlertTypes = response.masterLoadAlerts || [];
        this.masterCareGapsTimeIntervalData = response.masterCareGapsTimeInterval || [];
        this.masterEnrollmentTypeFilter = response.masterEnrollmentTypeFilter || [];
        this.masterCareGapsGraphViewFilter = response.masterCareGapsGraphViewFilter || [];
        this.masterChronicCondition = response.masterDiseaseConditionMappedWithDMP != null ? response.masterDiseaseConditionMappedWithDMP : [];
        this.masterChartViewType = response.masterTheraClassGraphViewType != null ? response.masterTheraClassGraphViewType : [];
        // default selected filter values
        if (!this.areRetainedFilters) {
          this.chartViewName = this.masterChartViewType[0].value
          if (this.masterEnrollmentTypeFilter.length > 0) {
            this.filterParamsForHRA.EnrollmentId = this.masterEnrollmentTypeFilter.find(x => x.id > 0 && x.value.toLowerCase() == 'all').id;
            this.filterParams.EnrollmentId = this.masterEnrollmentTypeFilter.find(x => x.id > 0 && x.value.toLowerCase() == 'all').id;
            this.filterParamsFoRisk.EnrollmentId = this.masterEnrollmentTypeFilter.find(x => x.id > 0 && x.value.toLowerCase() == 'all').id;
          }
          let defaultTimeIntervalObj = this.masterTimeIntervalData.find(x => x.value == 'Monthly');
          let defautlEncTimeIntervalObj = this.masterEncountertimeIntervalData.find(x => x.value == 'Weekly');
          let defaultAptTimeIntervalObj = this.masterAppointmenttimeIntervalData.find(x => x.value == 'Monthly');
          let defaulthugMessageTimeIntervalObj = this.masterhugsMessagetimeIntervalData.find(x => x.value == 'Day');
          let defaultTaskTimeIntervalObj = this.masterTaskTimeIntervalData.find(x => (x.value || '').split('(')[0].trim() == 'Weekly');
          let defaultCareGapStatusObj = this.masterCareGapsStatus.find(x => x.value.toLowerCase() == 'open');
          let defaultCareGapIntervalObj = this.masterCareGapsTimeIntervalData.find(x => (x.value || '').split('(')[0].trim() == 'Weekly');
          let defaultEnrollTypeObj = this.masterEnrollmentTypeFilter.find(x => x.value == 'All');
          let defaultCareGapsViewObj = this.masterCareGapsGraphViewFilter.find(x => (x.key || '').toUpperCase() == 'CARE_GAPS_BY_APPOINTMENT_DATE');

          this.filterParams.timeIntervalFilterId = defaultTimeIntervalObj && defaultTimeIntervalObj.id;

          this.filterParamsForTheraClass.ChartView = this.masterChartViewType[0].id
          this.filterAlerts.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
          this.filterAgeGroupGraph.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
          let idArray = this.masterAppointmentStatus.map(function (a) { return a.id; });
          this.filterParamsForAppointent.statusIds = idArray || [];
          let idArrayHugs = this.masterHugsMessageStatus.map(function (a) { return a.id; });
          this.filterParamsForHugsMessage.statusIds = idArrayHugs || [];
          this.filterParamsForEncounter.encounterTimeIntervalId = defautlEncTimeIntervalObj && defautlEncTimeIntervalObj.id;
          this.filterParamsForAppointent.appointmentTimeIntervalId = defaultAptTimeIntervalObj && defaultAptTimeIntervalObj.id;
          this.filterParamsForHugsMessage.hugsMessageTimeIntervalId = defaulthugMessageTimeIntervalObj && defaulthugMessageTimeIntervalObj.id;
          this.filterParamsForHugsMessage.pocHugsTypeId = -1;
          this.filterTaskParams.timeIntervalFilterId = defaultTaskTimeIntervalObj && defaultTaskTimeIntervalObj.id;
          this.filterCareGapGraph.StatusIds = defaultCareGapStatusObj && defaultCareGapStatusObj.id;
          this.filterCareGapGraph.TimeIntervalId = defaultCareGapIntervalObj && defaultCareGapIntervalObj.id;
          this.filterCareGapGraph.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
          this.filterCareGapGraph.CareGapsViewId = defaultCareGapsViewObj && defaultCareGapsViewObj.id;
          this.filterParamsForEncounter.encounterTypeIds = (response.encounterTypes || []).filter(x => staticEncTypes.includes(x.value)).map(x => x.id);
          this.filterParamsForEncounter.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
          this.filtersForComorbidCondition.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
        }
        if (this.filterParamsForTheraClass.ChartView > 0)
          this.getDataForTheraClassPieChart(this.filterParamsForTheraClass, this.chartViewName)
        if (this.filterParamsFoRisk.EnrollmentId > 0)
          this.getDataForRiskGraph(this.filterParamsFoRisk)
        if (this.filterParamsForHRA.EnrollmentId > 0)
          this.getDataForHRABarChart(this.filterParamsForHRA)
        // if (this.filterParams.EnrollmentId > 0)
        //   this.getDataForProgramEnrollesLineChart(this.filterParams)
        // if (this.filterParams.timeIntervalFilterId > 0) {
        //   this.getDataForProgramEnrollesLineChart(this.filterParams)
        // }
        if (this.filterParamsForAppointent.appointmentTimeIntervalId > 0) {
          this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
        }
        if (this.filterParamsForHugsMessage.hugsMessageTimeIntervalId > 0) {
          this.getDataForHugsMessageLineChart(this.filterParamsForHugsMessage);
        }
        if (this.filterTaskParams.timeIntervalFilterId > 0) {
          this.getDashboardTasksChartData();
        }
        if (this.filterCareGapGraph.StatusIds > 0 && this.filterCareGapGraph.TimeIntervalId > 0) {
          this.getDataForCareGapStatusPieChart();
        }
        if (this.filterParamsForEncounter.encounterTimeIntervalId > 0) {
          this.getDataForEncounterLineChart(this.filterParamsForEncounter)
        }
        if (this.filterAlerts.EnrollmentId > 0) {
          this.getDataForAlertGraph();
        }
        if (this.filterAgeGroupGraph.EnrollmentId > 0) {
          this.getDataForGraphsInDashboard();
        }
        if (this.filtersForComorbidCondition.EnrollmentId > 0) {
          this.getDataForComorbidConditionGraph();
        }
        // this.viewEmptyEncounterGraph();
        // this.viewEmptyAppointmentGraph();
        this.getProgramList();
      });
  }

  getCareGapNames() {
    let filters = new FilterModel();
    filters.pageNumber = 1;
    filters.pageSize = 100;
    this.dashoboardService.getCareGapsList(filters).subscribe(
      res => {
        if (res.statusCode == 200) {
          this.masterCareGapsList = res.data || [];
          // this.filterCareGapGraph.CareGapIds = this.masterCareGapsList.map(obj => obj.id);
          // this.getDataForCareGapStatusPieChart();
        }
        else
          this.masterCareGapsList = [];
      }
    )
  }

  getMasterTaskTypeNames() {
    const taskKeys: string = "Administrative,CM-specific";
    this.dashoboardService.getTaskDD(taskKeys).subscribe(
      res => {
        if (res.statusCode == 200)
          this.masterTaskTypesList = res.data || [];
        else
          this.masterTaskTypesList = [];
      }
    )
  }

  onPageChanges() {
    merge(this.paginator.page)
      .subscribe(() => {

        const changeState = {
          pageNumber: (this.paginator.pageIndex + 1),
          pageSize: this.paginator.pageSize
        }
        this.setTasksPaginatorModel(changeState.pageNumber, changeState.pageSize);
        this.getTasksList();
      })
  }
  getStaffsByLocation(): void {
    const locId = this.currentLocationId.toString();
    this.dashoboardService.getStaffAndPatientByLocation(locId)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.masterStaffs = [];
          this.masterStaffsForEncounter = [];
        } else {
          this.masterStaffs = response.data.staff || [];
          let updatedStaffs = [
            { 'id': -1, 'value': 'Provider Not Assigned' },
            ...this.masterStaffs,
          ]
          this.masterStaffsForEncounter = updatedStaffs;
        }
      })
  }

  getProgramList() {
    // this.getDiseaseConditionsFromProgramIds()
    this.dashoboardService.getDiseaseProgramsWithEnrollmentsList().subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.programsData = response.data || [];
        if (!this.areRetainedFilters) {
          this.filterParams.programIds = this.programsData.filter(x => x.isEnrolled).map(x => x.id);
          if (this.filterParams.programIds.length > 0 && this.filterParams.timeIntervalFilterId > 0) {
            this.filterParams.conditionIds = (this.diseaseConditionsData || []).filter(x => this.filterParams.programIds.includes(x.programId)).map(x => x.id);

          }
        }
      } else {
        this.programsData = [];
      }
      this.getDiseaseConditionsFromProgramIds();
    }
    );
  }

  getDiseaseConditionsFromProgramIds() {
    const programIds = (this.filterParams.programIds || []).join();
    this.dashoboardService.getDiseaseConditionsFromProgramIds(programIds).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.diseaseConditionsData = response.data || [];
        this.filterParams.conditionIds = (this.diseaseConditionsData || []).filter(x => this.filterParams.programIds.includes(x.programId)).map(x => x.id);
        if (this.filterParams.programIds.length > 0 && this.filterParams.conditionIds.length > 0 && this.filterParams.conditionIds.length > 0)
          this.getDataForProgramEnrollesLineChart(this.filterParams);
      } else {
        this.diseaseConditionsData = [];
      }
    }
    );
  }

  setTasksPaginatorModel(pageNumber: number, pageSize: number) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
  }
  hideMessageClick() {
    this.showMessage = false;
  }
  changeWidget(value: string = '') {
    if (value == 'memberToDoItems') {
      this.isAuth = true;
      this.headerText = 'Authorization';
    }
  }
  onClickComplianceGaps() {
    if (!this.isAdmin) {
      this.router.navigate(["web/manage-gaps/gap-intervention"], { queryParams: { gap: 'compliancegap' } });

    }
  }
  onClickCareGaps() {
    if (!this.isAdmin) {
      this.router.navigate(["web/manage-gaps/gap-intervention"], { queryParams: { gap: 'caregap' } });
    }
  }
  onClickHRA() {
    if (!this.isAdmin) {
      this.router.navigate(["web/manage-gaps/gap-intervention"], { queryParams: { gap: 'assessments' } });
    }
  }

  onTasksTableActionClick(actionObj: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'CLOSED':
        this.dashoboardService.updateTaskStatus(id, 'closed')
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifierService.notify('success', response.message)
              this.getTasksList();
            } else {
              this.notifierService.notify('error', response.message)
            }
          })
        break;
      default:
        break;
    }
  }
  updateTask(id: number) {
    this.dashoboardService.updateTask(id, 'caremanager')
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.notifierService.notify('success', response.message)
          this.getTasksList();
        } else if (response.statusCode === 401) {
          this.notifierService.notify('warning', response.message)
        } else {
          this.notifierService.notify('error', response.message)
        }
      })
  }
  getTasksList() {
    this.tasksFilterModel.sortColumn = 'Status';
    this.tasksFilterModel.sortOrder = 'desc';
    this.dashoboardService.GetTasksList(this.tasksFilterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.tasksList = (response.data || []).map(x => {
          x['disableActionButtons'] = (x.status || '').toUpperCase() == 'CLOSED' && ['closed'];
          return x;
        })
        this.taskMeta = response.meta;
      }
      else {
        this.tasksList = [];
        this.taskMeta = null;
      }
    })
  }
  deleteDetails(id: number) {
    this.dialogService.confirm(`Are you sure you want to delete this task?`).subscribe((result: any) => {
      if (result == true) {
        this.dashoboardService.deleteTaskDetails(id)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifierService.notify('success', response.message)
              this.getTasksList();
            } else if (response.statusCode === 401) {
              this.notifierService.notify('warning', response.message)
            } else {
              this.notifierService.notify('error', response.message)
            }
          })
      }
    })
  }

  showPastAppointment(changeState?: any) {
    this.getAllPatientAppointmentList(this.pageNumberForAPPTList, changeState.pageSize, changeState.checked);

  }
  getAllPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5, showPastAppt = null) {
    this.pageNumberForAPPTList = pageNumber;
    const filters = {
      // locationIds: this.currentLocationId,
      // staffIds: (this.userRoleName || '').toUpperCase() == 'ADMIN' ? "" : this.currentLoginUserId,
      fromDate: format(new Date(), 'YYYY-MM-DD'),
      toDate: format(addDays(new Date(), 720), 'YYYY-MM-DD'),
      // status: 'Approved',
      pageNumber,
      pageSize,
      showPastAppointments: showPastAppt
    }

    this.dashoboardService.getAcceptedOrApprovedAppointmentList(filters).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.allAppointmentsList = response.data != null && response.data.length > 0 ? response.data : [];
        this.allAppointmentsList = (this.allAppointmentsList || []).map(x => {
          const staffsArray = (x.pendingAppointmentStaffs || []).map(y => y.staffName);
          const staffIds = (x.pendingAppointmentStaffs || []).map(y => y.staffId);
          x.staffName = staffsArray.join(', ');
          x['queryParamsPatientObj'] = { id: x.patientID > 0 ? this.commonService.encryptValue(x.patientID, true) : null },
            x['queryParamsObj'] =
            {
              id: x.patientID > 0 ? this.commonService.encryptValue(x.patientID, true) : null,
              staffId: staffIds.join(','),
              date: format(x.startDateTime, 'MM/DD/YYYY')
            };
          x.dateTimeOfService = format(x.startDateTime, 'MM/DD/YYYY') + " (" + format(x.startDateTime, 'h:mm A') + " - " + format(x.endDateTime, 'h:mm A') + ")";
          return x;
        })
        this.allAppointmentsMeta = response.meta;
      }
    });
  }
  getPendignPatientAppointmentList() {
    this.dashoboardService.getPendingPatientAppointment(this.pendingAptfilterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.pendingPatientAppointment = response.data != null && response.data.length > 0 ? response.data : [];
        this.pendingPatientAppointment = (this.pendingPatientAppointment || []).map(x => {
          const staffsArray = (x.pendingAppointmentStaffs || []).map(y => y.staffName);
          const staffIds = (x.pendingAppointmentStaffs || []).map(y => y.staffId);
          x.staffName = staffsArray.join(', ');
          x.dateTimeOfService = format(x.startDateTime, 'MM/DD/YYYY') + " (" + format(x.startDateTime, 'h:mm A') + " - " + format(x.endDateTime, 'h:mm A') + ")";
          x['queryParamsPatientObj'] = { id: x.patientID > 0 ? this.commonService.encryptValue(x.patientID, true) : null },
            x['queryParamsObj'] =
            {
              id: x.patientID > 0 ? this.commonService.encryptValue(x.patientID, true) : null,
              staffId: staffIds.join(','),
              date: format(x.startDateTime, 'MM/DD/YYYY')
            };
          return x;
        });
        this.pendingAppointmentMeta = response.meta;
      }
      else {
        this.pendingPatientAppointment = [];
        this.pendingAppointmentMeta = null;
      }
    })
  }

  getCancelledPatientAppointmentList() {
    this.dashoboardService.getCancelledPatientAppointment(this.cancelledAptfilterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.cancelledPatientAppointment = response.data != null && response.data.length > 0 ? response.data : [];
        this.cancelledPatientAppointment = (this.cancelledPatientAppointment || []).map(x => {
          const staffsArray = (x.pendingAppointmentStaffs || []).map(y => y.staffName);
          const staffIds = (x.pendingAppointmentStaffs || []).map(y => y.staffId);
          x.staffName = staffsArray.join(', ');
          x.dateTimeOfService = format(x.startDateTime, 'MM/DD/YYYY') + " (" + format(x.startDateTime, 'h:mm A') + " - " + format(x.endDateTime, 'h:mm A') + ")";
          x['queryParamsPatientObj'] = { id: x.patientID > 0 ? this.commonService.encryptValue(x.patientID, true) : null },
            x['queryParamsObj'] =
            {
              id: x.patientID > 0 ? this.commonService.encryptValue(x.patientID, true) : null,
              staffId: staffIds.join(','),
              date: format(x.startDateTime, 'MM/DD/YYYY')
            };
          return x;
        });
        this.cancelledAppointmentMeta = response.meta;
      }
      else {
        this.cancelledPatientAppointment = [];
        this.cancelledAppointmentMeta = null;
      }
    })
  }

  getTentativePatientAppointmentList() {
    this.dashoboardService.getTentativePatientAppointmentList(this.tentativeAptFilterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.tentativePatientAppointment = response.data != null && response.data.length > 0 ? response.data : [];
        this.tentativePatientAppointment = (this.tentativePatientAppointment || []).map(x => {
          const staffsArray = (x.pendingAppointmentStaffs || []).map(y => y.staffName);
          const staffIds = (x.pendingAppointmentStaffs || []).map(y => y.staffId);
          x.staffName = staffsArray.join(', ');
          x.dateTimeOfService = format(x.startDateTime, 'MM/DD/YYYY') + " (" + format(x.startDateTime, 'h:mm A') + " - " + format(x.endDateTime, 'h:mm A') + ")";
          x['queryParamsPatientObj'] = { id: x.patientID > 0 ? this.commonService.encryptValue(x.patientID, true) : null },
            x['queryParamsObj'] =
            {
              id: x.patientID > 0 ? this.commonService.encryptValue(x.patientID, true) : null,
              staffId: staffIds.join(','),
              date: format(x.startDateTime, 'MM/DD/YYYY')
            };
          return x;
        });
        this.tentativeAppointmentMeta = response.meta;
      }
      else {
        this.tentativePatientAppointment = [];
        this.tentativeAppointmentMeta = null;
      }
    })
  }

  // getPatientDocumentList() {
  //   this.dashoboardService.getAllPatientDocuments(this.filterModel).subscribe((response: ResponseModel) => {
  //     if (response.statusCode == 200) {
  //       this.patientDocumentData = (response.data || []).map(x => {
  //         x['queryParamsPatientObj'] =
  //           {
  //             id: x.patientId > 0 ? this.commonService.encryptValue(x.patientId, true) : null
  //           };
  //         return x;
  //       });
  //       this.metaData = response.meta;
  //     } else {
  //       this.patientDocumentData = [];
  //       this.metaData = null;
  //     }
  //   }
  //   );
  // }
  openDialog(id?: number): void {
    if (id > 0) {
      this.dashoboardService.getTaskDetails(id).subscribe((response: any) => {
        if (response.statusCode == 200)
          this.createModel(response.data);
      })
    } else {
      this.createModel({});
    }
  }
  createModel(taskModal: any) {
    const modalPopup = this.dialogModal.open(TasksDialogComponent, {
      hasBackdrop: true,
      data: { taskModal: taskModal, key: 'fromHeader' },
    });
    modalPopup.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.getTasksList();
      }
    });
  }
  getPasswordExpiryMessage() {
    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.passwordExpiryStatus) {
        this.passwordExpiryColorCode = user.passwordExpiryStatus.colorCode;
        this.passwordExpiryMessage = user.passwordExpiryStatus.message;
        this.status = user.passwordExpiryStatus.status;
      }
    });
  }
  onTimeIntervalSelect(event: any) {
    this.filterParams.timeIntervalFilterId = event.value,
      this.getDataForProgramEnrollesLineChart(this.filterParams);
  }

  onAppointmenttimeInterval(event: any) {
    this.filterParamsForAppointent.appointmentTimeIntervalId = event.value
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }

  onHugsMessagetimeInterval(event: any) {
    this.filterParamsForHugsMessage.hugsMessageTimeIntervalId = event.value
    this.getDataForHugsMessageLineChart(this.filterParamsForHugsMessage);
  }

  onPOCHugsTypeSelected(event: any) {
    this.filterParamsForHugsMessage.pocHugsTypeId = event.value;
    this.getDataForHugsMessageLineChart(this.filterParamsForHugsMessage);
  }

  onEncounterTimeInterval(event: any) {
    this.filterParamsForEncounter.encounterTimeIntervalId = event.value
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }

  get isCareGapFilterDisabled(): boolean {
    let obj = (this.masterCareGapsGraphViewFilter || []).find(x => x.id == this.filterCareGapGraph.CareGapsViewId && (x.key || '').toUpperCase() == 'ALL_CARE_GAPS_FOR_ALL_PATIENTS');
    if (obj && obj.id > 0)
      return true;
    return false;
  }

  onCareGapSelect(event: any) {
    if ((this.filterCareGapGraph.CareGapIds || []).length > 5) {
      this.filterCareGapGraph.CareGapIds.splice(0, 1);
      event.source.writeValue(event.value);
    }
    this.getDataForCareGapStatusPieChart();
  }

  onCareGapStatusSelect(event: any) {
    this.getDataForCareGapStatusPieChart();
  }
  onCareGapNextAppReferesh() {
    this.filterCareGapGraph.nextAppointmentPresent = null;
    this.getDataForCareGapStatusPieChart();
  }

  onAlertTypeSelect() {
    this.getDataForAlertGraph();
  }
  onAlertCMSelect() {
    this.getDataForAlertGraph();
  }
  onAlertNextAppRefersh() {
    this.filterAlerts.nextAppointmentPresent = null;
    this.getDataForAlertGraph();
  }
  onAlertCMSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterAlerts.CareManagerIds.length == this.masterStaffs.length) {
        return;
      }
      this.filterAlerts.CareManagerIds = this.masterStaffs.map(x => x.id);
    } else {
      if (this.filterAlerts && (this.filterAlerts.CareManagerIds || []).length == 0) {
        return;
      }
      this.filterAlerts.CareManagerIds = [];
    }
    this.getDataForAlertGraph();
  }
  onTasksPageOrSortChange(changeState) {
    this.setTasksPaginatorModel1(changeState.pageIndex + 1, changeState.pageSize, changeState.sort, changeState.order);
    this.getTasksList();
  }
  setTasksPaginatorModel1(pageNumber, pageSize, sortColumn, sortOrder) {
    this.tasksFilterModel.pageNumber = pageNumber;
    this.tasksFilterModel.pageSize = pageSize;
    this.tasksFilterModel.sortOrder = sortOrder;
    this.tasksFilterModel.sortColumn = sortColumn;
  }


  onPendingPageOrSortChange(changeState?: any) {
    this.setPendingPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getPendignPatientAppointmentList();
  }
  onCancelledPageOrSortChange(changeState?: any) {
    this.setCancelledPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getCancelledPatientAppointmentList();
  }
  onUpcomingAptPageOrSortChange(changeState?: any) {
    this.setUpcomingPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getAllPatientAppointmentList(changeState.pageNumber, changeState.pageSize);
  }
  onTentativeAptPageOrSortChange(changeState?: any) {
    this.setTentativeAptPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getTentativePatientAppointmentList();
  }
  setPendingPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.pendingAptfilterModel.pageNumber = pageNumber;
    this.pendingAptfilterModel.pageSize = pageSize;
    this.pendingAptfilterModel.sortOrder = sortOrder;
    this.pendingAptfilterModel.sortColumn = sortColumn;
  }
  setCancelledPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.cancelledAptfilterModel.pageNumber = pageNumber;
    this.cancelledAptfilterModel.pageSize = pageSize;
    this.cancelledAptfilterModel.sortOrder = sortOrder;
    this.cancelledAptfilterModel.sortColumn = sortColumn;
  }
  setUpcomingPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.upcomingAptfilterModel.pageNumber = pageNumber;
    this.upcomingAptfilterModel.pageSize = pageSize;
    this.upcomingAptfilterModel.sortOrder = sortOrder;
    this.upcomingAptfilterModel.sortColumn = sortColumn;
  }
  setTentativeAptPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.tentativeAptFilterModel.pageNumber = pageNumber;
    this.tentativeAptFilterModel.pageSize = pageSize;
    this.tentativeAptFilterModel.sortOrder = sortOrder;
    this.tentativeAptFilterModel.sortColumn = sortColumn;
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    // this.getPatientDocumentList();
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  onDocumentTableActionClick(actionObj?: any) {
    const programActivityObj = actionObj.data;
    this.router.navigate(["web/client/programs/program-activity"],
      {
        queryParams: { id: this.commonService.encryptValue(programActivityObj.patientId, true), questionaireId: programActivityObj.id, documentTypeId: programActivityObj.documenttypeId }
      });
  }
  onEncTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.name,
      appointmentId = actionObj.data && actionObj.data.patientAppointmentId,
      patientEncounterId = actionObj.data && actionObj.data.id,
      isBillableEncounter = actionObj.data && actionObj.data.isBillableEncounter;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'VIEW':
        const redirectUrl = isBillableEncounter ? "/web/encounter/soap" : "/web/encounter/non-billable-soap";
        this.router.navigate([redirectUrl], {
          queryParams: {
            apptId: appointmentId,
            encId: patientEncounterId
          }
        });
        break;
      default:
        break;
    }
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.patientAppointmentId;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'APPROVE':
        const appointmentData = {
          "id": id,
          "status": "APPROVED"
        }
        this.createApproveAppointmentModel(appointmentData);
        break;
      case 'CANCEL':
        this.cancelAppointmentDialog(id);
        break;
      default:
        break;
    }
  }

  cancelAppointmentDialog(id: number) {
    const modalPopup = this.dailog.open(CancelAppointmentDialogComponent, {
      hasBackdrop: true,
      data: id
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result === 'SAVE')
        this.getPendignPatientAppointmentList();
    });
  }

  createApproveAppointmentModel(appointmentData: any) {
    const modalPopup = this.dailog.open(ApproveAppointmentDialogComponent, {
      hasBackdrop: true,
      data: appointmentData
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result === 'SAVE') {
        this.getPendignPatientAppointmentList();
        this.getAllPatientAppointmentList();
      }
    });
  }
  getUserPermissions() {
    const actionPermissions = this.dashoboardService.getUserScreenActionPermissions('TASKS', 'TASKS_LIST');
    const { TASKS_LIST_UPDATE, TASKS_LIST_DELETE, TASKS_LIST_CLOSE } = actionPermissions;
    this.updatePermission = TASKS_LIST_UPDATE || false;
    this.deletePermission = TASKS_LIST_DELETE || false;
    this.closePermission = TASKS_LIST_CLOSE || false;

    const schedulerActionPermissions = this.dashoboardService.getUserScreenActionPermissions('SCHEDULING', 'SCHEDULING_LIST');
    const { SCHEDULING_LIST_CANCEL_APPOINTMENT, SCHEDULING_LIST_APPROVE_APPOINTMENT } = schedulerActionPermissions;

    if (!SCHEDULING_LIST_APPROVE_APPOINTMENT) {
      let spliceIndex = this.pendingActionButtons.findIndex(obj => obj.key == 'approve');
      this.pendingActionButtons.splice(spliceIndex, 1)
    }
    if (!SCHEDULING_LIST_CANCEL_APPOINTMENT) {
      let spliceIndex = this.pendingActionButtons.findIndex(obj => obj.key == 'cancel');
      this.pendingActionButtons.splice(spliceIndex, 1)
    }
  }
  onAgeGroupDropdownSelect() {
    this.getDataForGraphsInDashboard();
  }

  onAgeGroupDropdownRefersh() {
    this.filterAgeGroupGraph.nextAppointmentPresent = null;
    this.getDataForGraphsInDashboard();
  }

  onAgeGroupCMSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterAgeGroupGraph.CareManagerIds.length == this.masterStaffs.length) {
        return;
      }
      this.filterAgeGroupGraph.CareManagerIds = this.masterStaffs.map(x => x.id);
    } else {
      if (this.filterAgeGroupGraph && (this.filterAgeGroupGraph.CareManagerIds || []).length == 0) {
        return;
      }
      this.filterAgeGroupGraph.CareManagerIds = [];
    }
    this.getDataForGraphsInDashboard();
  }
  getDataForGraphsInDashboard() {
    this.dashoboardService.getPieChartData(this.filterAgeGroupGraph).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.pieChartDataList = response.data.PatientLoadAndDemographicData || []
        if (this.pieChartDataList && this.pieChartDataList.length > 0) {
          this.showPieChart_demographic(this.pieChartDataList[0]);
        } else {
          this.showPieChartDemographicInfo = false
        }
      }
      else {
        this.pieChartData_demographic = [];
        this.lineChartDataForDMP = [];
        this.lineChartDataForTasks = [];
        this.showPieChartDemographicInfo = false
        // this.viewEmptyTasksGraph();
      }
    })
  }
  onProgramSelect(event: any) {
    let programIdArray = event.value
    this.filterParams.programIds = programIdArray || [];

    this.filterParams.conditionIds = (this.diseaseConditionsData || []).filter(x => this.filterParams.programIds.includes(x.programId)).map(x => x.id);
    this.getDataForProgramEnrollesLineChart(this.filterParams);
    // this.getDiseaseConditionsFromProgramIds();

  }

  // onResetProgramsDropdown() {
  //   if (this.filterParams && this.filterParams.programIds.length > 0) {
  //     this.filterParams.programIds = [];
  //     this.getDataForProgramEnrollesLineChart(this.filterParams);
  //   }
  // }

  onCareGapCMSelectOrDeselect(key: string = '') {
    if (this.isCareGapFilterDisabled) {
      return;
    }
    if (key.toLowerCase() == 'selectall') {
      if (this.filterCareGapGraph.CareManagerIds.length == this.masterStaffs.length) {
        return;
      }
      this.filterCareGapGraph.CareManagerIds = this.masterStaffs.map(x => x.id);
    } else {
      if (this.filterCareGapGraph && (this.filterCareGapGraph.CareManagerIds || []).length == 0) {
        return;
      }
      this.filterCareGapGraph.CareManagerIds = [];
    }
    this.getDataForCareGapStatusPieChart();
  }
  onProgramsConditionSelect(event: any) {
    this.getDataForProgramEnrollesLineChart(this.filterParams);
  }

  onEncounterSelect(event: any) {
    let encounterIdArray = event.value
    this.filterParamsForEncounter.encounterTypeIds = encounterIdArray || [];
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterNextAppSelect(event: any) {
    this.filterParamsForEncounter.nextAppointmentPresent = event.value
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterNextAppRefersh() {
    this.filterParamsForEncounter.nextAppointmentPresent = null;
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterCMSelect() {
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterCMSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterParamsForEncounter.CareManagerIds.length == this.masterStaffsForEncounter.length) {
        return;
      }
      this.filterParamsForEncounter.CareManagerIds = this.masterStaffsForEncounter.map(x => x.id);
    } else {
      if (this.filterParamsForEncounter && (this.filterParamsForEncounter.CareManagerIds || []).length == 0) {
        return;
      }
      this.filterParamsForEncounter.CareManagerIds = [];
    }
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterTypeSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterParamsForEncounter.encounterTypeIds.length == this.masterEncounterTypes.length) {
        return;
      }
      this.filterParamsForEncounter.encounterTypeIds = this.masterEncounterTypes.map(x => x.id);
    } else {
      if (this.filterParamsForEncounter && (this.filterParamsForEncounter.encounterTypeIds || []).length == 0) {
        return;
      }
      this.filterParamsForEncounter.encounterTypeIds = [];
    }
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onApptGraphCMSelect() {
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }

  onHugsMessageGraphCMSelect() {
    this.getDataForHugsMessageLineChart(this.filterParamsForHugsMessage);
  }

  onStatusSelect(event: any) {

    let statusIdArray = event.value
    this.filterParamsForAppointent.statusIds = statusIdArray || [];
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }

  onNextAppSelect(event: any) {
    this.filterParamsForAppointent.nextAppointmentPresent = event.value;
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }

  onNextAppRefersh() {
    this.filterParamsForAppointent.nextAppointmentPresent = null;
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }

  onHugsMessageStatusSelect(event: any) {

    let statusIdArray = event.value
    this.filterParamsForHugsMessage.statusIds = statusIdArray || [];
    this.getDataForHugsMessageLineChart(this.filterParamsForHugsMessage);
  }

  onAppointmentCMSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterParamsForAppointent.CareManagerIds.length == this.masterStaffs.length) {
        return;
      }
      this.filterParamsForAppointent.CareManagerIds = this.masterStaffs.map(x => x.id);
    } else {
      if (this.filterParamsForAppointent && (this.filterParamsForAppointent.CareManagerIds || []).length == 0) {
        return;
      }
      this.filterParamsForAppointent.CareManagerIds = [];
    }
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }

  onHugsMessageCMSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterParamsForHugsMessage.CareManagerIds.length == this.masterStaffs.length) {
        return;
      }
      this.filterParamsForHugsMessage.CareManagerIds = this.masterStaffs.map(x => x.id);
    } else {
      if (this.filterParamsForHugsMessage && (this.filterParamsForHugsMessage.CareManagerIds || []).length == 0) {
        return;
      }
      this.filterParamsForHugsMessage.CareManagerIds = [];
    }
    this.getDataForHugsMessageLineChart(this.filterParamsForHugsMessage);
  }

  getDataForProgramEnrollesLineChart(filterParams: any) {
    this.dashoboardService.getLineChartDataForProgramEnrollees(filterParams).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.lineChartDataForDMP = response.data || []
        if (this.lineChartDataForDMP && this.lineChartDataForDMP.length > 0) {
          this.viewDMPEnrollesLineGraph();
        } else {
          this.showGraphDMP = false
        }
      }
      else {
        this.lineChartDataForDMP = [];
      }
    })
  }
  onEnrollmentDMPSelect(event: any) {
    this.filterParams.EnrollmentId = event.value
    this.getDataForProgramEnrollesLineChart(this.filterParams)
  }
  onEnrollmentNextAppSelect(event: any) {
    this.filterParams.nextAppointmentPresent = event.value
    this.getDataForProgramEnrollesLineChart(this.filterParams)
  }
  onEnrollmentNextAppRefersh() {
    this.filterParams.nextAppointmentPresent = null;
    this.getDataForProgramEnrollesLineChart(this.filterParams)
  }
  onEnrollmentRiskSelect(event: any) {
    this.filterParamsFoRisk.EnrollmentId = event.value
    this.getDataForRiskGraph(this.filterParamsFoRisk)
  }

  onEnrollmentNextAppRiskSelect(event: any) {
    this.filterParamsFoRisk.nextAppointmentPresent = event.value
    this.getDataForRiskGraph(this.filterParamsFoRisk)
  }
  onEnrollmentNextAppRiskRefersh() {
    this.filterParamsFoRisk.nextAppointmentPresent = null;
    this.getDataForRiskGraph(this.filterParamsFoRisk)
  }
  getDataForAppointmentLineChart(filterParamsForAppointent: any) {
    this.dashoboardService.getLineChartDataForAppointments(filterParamsForAppointent).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.lineChartDataForAppointment = response.data || []
        // this.viewAppointmentLineGraph();
        if (this.lineChartDataForAppointment && this.lineChartDataForAppointment.length > 0) {
          this.viewAppointmentLineGraph();
        } else {
          this.showGraphAppointment = false
        }
      }
      else {
        this.lineChartDataForAppointment = [];
      }
    })
  }
  getDataForHugsMessageLineChart(filterParamsForHugsMessage: any) {
    this.dashoboardService.getLineChartDataForHugsMessage(filterParamsForHugsMessage).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.lineChartDataForHugsMessage = response.data || []
        // this.viewAppointmentLineGraph();
        if (this.lineChartDataForHugsMessage && this.lineChartDataForHugsMessage.length > 0) {
          this.viewHugsMessageLineGraph();
        } else {
          // this.showGraphAppointment = false
        }
      }
      else {
        this.lineChartDataForHugsMessage = [];
      }
    })
  }
  onCMSelect(event: any) {

    let CMIdArray = event.value
    this.filterParamsForHRA.careManagerIds = CMIdArray || [];
    this.getDataForHRABarChart(this.filterParamsForHRA);
  }
  onEnrollmentSelect(value: any) {
    this.filterParamsForHRA.EnrollmentId = value
    this.getDataForHRABarChart(this.filterParamsForHRA);
  }
  onHRANextAppSelect(value: any) {
    this.filterParamsForHRA.nextAppointmentPresent = value
    this.getDataForHRABarChart(this.filterParamsForHRA);
  }
  onHRANextAppRefersh() {
    this.filterParamsForHRA.nextAppointmentPresent = null
    this.getDataForHRABarChart(this.filterParamsForHRA);
  }
  onChartViewSelect(e: any) {
    this.filterParamsForTheraClass.ChartView = e.value
    this.chartViewName = e.source.triggerValue,
      this.getDataForTheraClassPieChart(this.filterParamsForTheraClass, this.chartViewName);
  }
  minMaxValue(e: any, key: string) {
    if (key == 'max') {
      // this.filterParamsForTheraClass.MaxAmount = value
      this.getDataForTheraClassPieChart(this.filterParamsForTheraClass, this.chartViewName)
    } if (key == 'min') {
      // this.filterParamsForTheraClass.MinAmount = value
      this.getDataForTheraClassPieChart(this.filterParamsForTheraClass, this.chartViewName)
    }
  }
  onDateChange(value: any, key: string) {
    if (key == 'startdate') {
      this.filterParamsForTheraClass.StartDate = value;//format(value, 'YYYY-MM-DD');
    } if (key == 'enddate') {
      this.filterParamsForTheraClass.EndDate = value;//format(value, 'YYYY-MM-DD');
    }
    this.getDataForTheraClassPieChart(this.filterParamsForTheraClass, this.chartViewName)
  }
  onNextAppDateChange() {
       this.getDataForTheraClassPieChart(this.filterParamsForTheraClass, this.chartViewName)
  }
  onNextAppGraphReferash() {
    this.filterParamsForTheraClass.nextAppointmentPresent = null;
    this.getDataForTheraClassPieChart(this.filterParamsForTheraClass, this.chartViewName)
  }
  getDataForHRABarChart(filterParamsForHRA: any) {
    this.dashoboardService.getBarChartDataForHRA(filterParamsForHRA).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.barChartDataForHra = response.data || []
        if (this.barChartDataForHra && this.barChartDataForHra.length > 0) {
          this.viewHRABarGraph();
        } else {
          this.showGraphForHRA = false
        }
      } else if (response != null && response.statusCode == 204) {
        this.showGraphForHRA = false
      }
      else {
        this.barChartDataForHra = [];
        //this.showGraphForHRA = false
      }
    })
  }
  onResetEncounterTypeDropdown() {
    if (this.filterParamsForEncounter && this.filterParamsForEncounter.encounterTypeIds.length > 0) {
      this.filterParamsForEncounter.encounterTypeIds = [];
      this.getDataForEncounterLineChart(this.filterParamsForEncounter);
    }
  }

  getDataForEncounterLineChart(filterParamsForEncounter: any) {
    this.dashoboardService.getLineChartDataForEncounters(filterParamsForEncounter).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.lineChartDataForEncounters = response.data || []
        // this.viewAppointmentLineGraph();
        if (this.lineChartDataForEncounters && this.lineChartDataForEncounters.length > 0) {
          this.viewEncounterLineGraph();
        } else {
          this.showEncounterGraph = false
        }
      }
      else {
        this.lineChartDataForEncounters = [];
      }
    })
  }

  onTaskTypeOrTimeIntervalSelect() {
    this.getDashboardTasksChartData();
  }
  onTaskCMSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterTaskParams.careManagerIds.length == this.masterStaffs.length) {
        return;
      }
      this.filterTaskParams.careManagerIds = this.masterStaffs.map(x => x.id);
    } else {
      if (this.filterTaskParams && (this.filterTaskParams.careManagerIds || []).length == 0) {
        return;
      }
      this.filterTaskParams.careManagerIds = [];
    }
    this.getDashboardTasksChartData();
  }
  getDashboardTasksChartData() {
    const filters = { ...this.filterTaskParams };
    this.dashoboardService.getDashboardTasksChartData(filters).subscribe(
      res => {
        if (res.statusCode == 200) {
          this.lineChartDataForTasks = res.data || [];
          this.viewTasksGraph();
        } else {

        }
      }
    )
  }

  viewTasksGraph() {
    this.showTaskGraph = true
    this.lineChartLabels_tsk = [];
    // this.lineChartColors_tsk = [
    //   {
    //     backgroundColor: [
    //       'rgb(88, 166, 219)',
    //       'rgb(66, 163, 76)',
    //       'rgb(227, 194, 110)',
    //       'rgb(227, 111, 136)',
    //     ]
    //   }
    // ];

    this.lineChartOptions_tsk = {
      responsive: true,
      elements:
      {
        point:
        {
          radius: 5,
          hitRadius: 5,
          hoverRadius: 7,
          hoverBorderWidth: 2
        }
      },

      scales: {
        xAxes: [
          {
            ticks: {
              fontSize: 10,
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              precision: 0,
              //fixedStepSize: 1
            }
          }
        ]
      }
    }
    // backgroundColor: [
    //       'rgb(88, 166, 219)',
    //       'rgb(66, 163, 76)',
    //       'rgb(227, 194, 110)',
    //       'rgb(227, 111, 136)',
    //     ]
    // this.lineChartColors_tsk = [
    //   {
    //     backgroundColor: [this.lineChartDataForTasks[0].totalTaskColor, this.lineChartDataForTasks[0].completedTaskColor, this.lineChartDataForTasks[0].nonCompletedColor]
    //   }
    // ];
    this.lineChartColors_tsk = [
      {
        backgroundColor: this.lineChartDataForTasks[0].totalTaskColor
      },
      {
        backgroundColor: this.lineChartDataForTasks[0].completedTaskColor
      },
      {
        backgroundColor: this.lineChartDataForTasks[0].nonCompletedColor
      }
    ];

    if (this.lineChartDataForTasks.length > 0) {
      let sortedDate = this.lineChartDataForTasks.sort((a, b) => { return new Date(a.startDate).getTime() - new Date(b.startDate).getTime() })
      this.lineChartLabels_tsk = sortedDate.filter(x => (parseFloat(x.startDate) != null)).map(({ xAxis }) => xAxis);
    }
    this.lineChartData_tsk = [{
      label: 'Total Tasks',
      data: this.lineChartDataForTasks.sort((a, b) => { return new Date(a.startDate).getTime() - new Date(b.startDate).getTime() }).map(({ totalTasksCreated }) => parseFloat(totalTasksCreated)),
      fill: false,
    }, {
      label: 'Completed Tasks',
      data: this.lineChartDataForTasks.sort((a, b) => { return new Date(a.startDate).getTime() - new Date(b.startDate).getTime() }).map(({ totalTasksCompleted }) => parseFloat(totalTasksCompleted)),
      fill: false,
    }, {
      label: 'Non-Completed Tasks',
      data: this.lineChartDataForTasks.sort((a, b) => { return new Date(a.startDate).getTime() - new Date(b.startDate).getTime() }).map(({ totalTasksNonCompleted }) => parseFloat(totalTasksNonCompleted)),
      fill: false,
    }];
  }

  // viewEmptyTasksGraph() {
  //   this.lineChartOptions_tsk = {
  //     scales: { yAxes: [{ ticks: { min: 0 } }] }
  //   }
  //   this.lineChartLabels_tsk = [];
  //   this.lineChartData_tsk = [{
  //     label: 'Total tasks',
  //     data: [],
  //     fill: false,
  //   }, {
  //     label: 'Completed Tasks',
  //     data: [],
  //     fill: false,
  //   }, {
  //     label: 'Non Completed Tasks',
  //     data: [],
  //     fill: false,
  //   }];
  // }





  showPieChart_demographic(piChartDataObj: any) {
    this.showPieChartDemographicInfo = true;
    this.pieChartOptions_demographic = {
      responsive: true,
      legend: { position: 'right' },
      // scales: {
      //   yAxes: [{
      //     ticks: {
      //       min: 0,
      //       precision: 0
      //     }
      //   }],
      // }
    }
    this.pieColors_demographic = [
      {
        backgroundColor: [piChartDataObj.zeroToTwentyAgeGroupColor, piChartDataObj.twentyToFortyAgeGroupColor, piChartDataObj.fortyToSixtyAgeGroupColor, piChartDataObj.overSixtyAgeGroupColor]
      }
    ];
    this.pieChartLabels_demographic = ["0-20", "21-40", "41-60", "60+"]
    this.pieChartData_demographic = [piChartDataObj.zeroToTwentyAgeGroup, piChartDataObj.twentyToFortyAgeGroup, piChartDataObj.fortyToSixtyAgeGroup, piChartDataObj.overSixtyAgeGroup]
  }
  getDataForTheraClassPieChart(filterParamsForTheraClass: any, chartViewName: any) {
    // const CareGapIds = (this.filterCareGapGraph.CareGapIds || []).join(',');
    // const StatusIds = (this.filterCareGapGraph.StatusIds || '').toString(),
    //   AllPatients = this.filterCareGapGraph.AllPatients || false;
    // const CareManagerIds = (this.filterCareGapGraph.CareManagerIds || []).join(','), TimeIntervalId = this.filterCareGapGraph.TimeIntervalId || null, EnrollmentId = this.filterCareGapGraph.EnrollmentId || null;
    let postFilterParams = {
      ...this.filterParamsForTheraClass,
      StartDate: this.filterParamsForTheraClass.StartDate && format(this.filterParamsForTheraClass.StartDate, 'YYYY-MM-DD'),
      EndDate: this.filterParamsForTheraClass.EndDate && format(this.filterParamsForTheraClass.EndDate, 'YYYY-MM-DD'),
    }
    this.dashoboardService.getPieChartDataForTheraClass(postFilterParams).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.theraClassDataList = response.data || []
        if (this.theraClassDataList && this.theraClassDataList.length > 0) {
          this.showPieChart_theraClass(this.theraClassDataList, chartViewName);
        } else {
          this.showPieChartForDrugBreakdownTheraClass = false
        }
      }
      else if (response != null && response.statusCode == 204) {
        this.theraClassDataList = [];
        this.showPieChartForDrugBreakdownTheraClass = false
      } else {
        this.theraClassDataList = [];

      }
    })
  }
  showPieChart_theraClass(theraClassDrugDataList?: any, chartViewName?: any) {
    this.showPieChartForDrugBreakdownTheraClass = true;

    this.pieChartOptions_theraClass = {

      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let amountArray = data.datasets[tooltipItem.datasetIndex].data || [];
            let labelArray = data && data.labels

            let index = tooltipItem && tooltipItem.index

            let labelAmt = amountArray[index],
              labelText = labelArray[index],
              reqDbDataObj = theraClassDrugDataList.find(x => x.theraDrugClass == labelText),
              reqLabelName = reqDbDataObj.theraDrugClassFullName;

            var parts = labelAmt.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            let formattedAmt = parts.join(".")
            let finalLabelText = ''
            if (chartViewName == 'View By Paid Dollars') {
              finalLabelText = `${reqLabelName} : $${formattedAmt}`;
            } else if (chartViewName == "View by Claim Count") {
              finalLabelText = `${reqLabelName} : ${labelAmt}`;
            }
            return finalLabelText;
          }
        }
      },

      // events: ['click', 'mousemove', 'mouseout'],
      responsive: true,
      // mouseout: function (e) {
      //   debugger
      //   alert("Mouse moved outside the legend item");
      // },
      legend: {
        position: 'right',
        // labels:{
        onHover: function (e, data) {
          // if(e.type="mousemove"){
          let reqDbDataObj = theraClassDrugDataList.find(x => x.theraDrugClass == data.text),
            reqLabelName = reqDbDataObj.theraDrugClassFullName,
            distinctClaimCount = reqDbDataObj.distinctClaimCount,
            labelAmt = reqDbDataObj.amount

          var parts = labelAmt.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          let formattedAmt = parts.join(".")


          if (chartViewName == 'View By Paid Dollars') {
            e.target.title = `${reqLabelName} : $${formattedAmt}`;
          } else if (chartViewName == "View by Claim Count") {
            e.target.title = `${reqLabelName} : ${distinctClaimCount}`
          }
          e.target.onmouseleave = function () {
            e.target.title = '';
          };
          // e.target.outerText = "abc"
          // e.target.textContent = "textContent"
          // e.target.style.cursor = 'pointer';
          // }
        },
        // itemmouseover: function(e){
        //   e.target.title="test"
        //   alert( "Mouse moved over the legend item");
        // },

        // }
        // labels: {
        //   fontSize: 10,
        //   usePointStyle: true,
        // }
      },

      // scales: {
      //   yAxes: [{
      //     ticks: {
      //       min: 0,
      //       precision: 0
      //     }
      //   }],
      // }
    }
    this.pieColors_theraClass = [];
    let pieChartLabels = Array.from(new Set(theraClassDrugDataList.map(x => x.theraDrugClass))).map(theraDrugClass => {
      return theraClassDrugDataList.find(x => x.theraDrugClass == theraDrugClass).theraDrugClass
    });
    // let updateTheraClassLabels = pieChartLabels.map(x => {
    //   return `${x}$`
    // })
    // console.log(updateTheraClassLabels)
    let bgColors = pieChartLabels.map(theraDrugClass => {
      return theraClassDrugDataList.find(x => x.theraDrugClass == theraDrugClass).color
    })
    if ((bgColors || []).filter(x => x != null).length > 0) {

      this.pieColors_theraClass = [{
        backgroundColor: bgColors
      }]
    }
    // let newPieChartDataArray = Array.from(new Set(theraClassDrugDataList.map(x => x.theraDrugClass))).map(theraDrugClass => {
    // return theraClassDrugDataList.find(x => x.theraDrugClass == theraDrugClass).amount
    // });
    let newPieChartDataArray = []
    if (chartViewName == 'View By Paid Dollars') {
      newPieChartDataArray = Array.from(new Set(theraClassDrugDataList.map(x => x.theraDrugClass))).map(theraDrugClass => {
        return theraClassDrugDataList.find(x => x.theraDrugClass == theraDrugClass).amount
      });
    } else if (chartViewName == "View by Claim Count") {
      newPieChartDataArray = Array.from(new Set(theraClassDrugDataList.map(x => x.theraDrugClass))).map(theraDrugClass => {
        return theraClassDrugDataList.find(x => x.theraDrugClass == theraDrugClass).distinctClaimCount
      });
    }

    this.pieChartLabels_theraClass = pieChartLabels
    this.pieChartData_theraClass = newPieChartDataArray
  }
  viewDMPEnrollesLineGraph() {
    this.showGraphDMP = true;
    let resultArrayMonth = Array.from(new Set(this.lineChartDataForDMP.map(x => x.xAxis))).map(xAxis => {
      let x = this.lineChartDataForDMP.find(x => x.xAxis == xAxis)
      return {
        ...x
      }
    })
    let resultArrayDMP = Array.from(new Set(this.lineChartDataForDMP.map(x => x.diseaseManagementProgram))).map(diseaseManagementProgram => {
      return this.lineChartDataForDMP.find(x => x.diseaseManagementProgram == diseaseManagementProgram).diseaseManagementProgram
    });
    let bgColors = resultArrayDMP.map(diseaseManagementProgram => {
      return this.lineChartDataForDMP.find(x => x.diseaseManagementProgram == diseaseManagementProgram).color
    })

    if ((bgColors || []).filter(x => x != null).length > 0) {
      this.lineChartColors_dmp = (bgColors || []).map(c => { return { backgroundColor: c, borderColor: c } });
    }
    this.lineChartLabels_dmp = []
    this.lineChartOptions_dmp = {
      responsive: true,
      elements:
      {
        point:
        {
          radius: 5,
          hitRadius: 5,
          hoverRadius: 7,
          hoverBorderWidth: 2
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            precision: 0
          }
        }],
        xAxes: [
          {
            ticks: {
              fontSize: 10,
            }
          }
        ]
      }
    }
    if (resultArrayMonth.length > 0) {
      let sortedMonth = resultArrayMonth.sort((a, b) => { return new Date(a.yearNumber).getTime() - new Date(b.yearNumber).getTime() })
      this.lineChartLabels_dmp = sortedMonth.filter(x => (x.xAxis != null)).map(({ xAxis, yearNumber }) => xAxis);
    }
    if (resultArrayDMP && resultArrayDMP.length > 0) {
      let newChartDataArray = []
      for (let i = 0; i < resultArrayDMP.length; i++) {
        newChartDataArray.push({
          label: resultArrayDMP[i],
          data: this.lineChartDataForDMP.filter(x => x.diseaseManagementProgram == resultArrayDMP[i]).sort((a, b) => { return (a.monthNumber - b.monthNumber) }).map(({ requiredCount }) => parseInt(requiredCount)),
          fill: false,
        })
      }
      this.lineChartData_dmp = [...newChartDataArray]
    };
  }

  viewAppointmentLineGraph() {
    this.showGraphAppointment = true;
    let appointmentArrayMonth = Array.from(new Set(this.lineChartDataForAppointment.map(x => x.xAxis))).map(xAxis => {
      let x = this.lineChartDataForAppointment.find(x => x.xAxis == xAxis)
      return {
        ...x
      }
    })
    let resultArrayAppointment = Array.from(new Set(this.lineChartDataForAppointment.map(x => x.appointmentStatus))).sort().map(appointmentStatus => {
      return this.lineChartDataForAppointment.find(x => x.appointmentStatus == appointmentStatus).appointmentStatus
    })

    if (resultArrayAppointment.includes('Accepted')) {
      resultArrayAppointment.push(resultArrayAppointment.shift());
    }



    this.lineChartLabels_appointments = []
    this.lineChartOptions_appointments = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            precision: 0
          }
        }],
      }
    }
    this.barChartColors_appointments = [
      { backgroundColor: 'rgb(147, 238, 147)' },
      { backgroundColor: 'rgb(122, 219, 131)' },
      { backgroundColor: 'rgb(255, 132, 132)' },
      { backgroundColor: 'rgb(116, 217, 255)' },
      { backgroundColor: 'rgb(253, 209, 100)' },
    ];
    let bgColors = resultArrayAppointment.map(appointmentStatus => {
      return this.lineChartDataForAppointment.find(x => x.appointmentStatus == appointmentStatus).color
    })

    if ((bgColors || []).filter(x => x != null).length > 0) {
      this.barChartColors_appointments = (bgColors || []).map(c => { return { backgroundColor: c, borderColor: c } });
    }
    if (appointmentArrayMonth.length > 0) {
      let sortedMonth = appointmentArrayMonth.sort((a, b) => { return new Date(a.yearNumber).getTime() - new Date(b.yearNumber).getTime() })
      this.lineChartLabels_appointments = sortedMonth.filter(x => (x.xAxis != null)).map(({ xAxis, yearNumber }) => xAxis);
    }
    if (resultArrayAppointment && resultArrayAppointment.length > 0) {
      let newChartDataArray = []
      for (let i = 0; i < resultArrayAppointment.length; i++) {
        newChartDataArray.push({
          label: resultArrayAppointment[i],
          data: this.lineChartDataForAppointment.filter(x => x.appointmentStatus == resultArrayAppointment[i]).sort((a, b) => { return (a.monthNumber - b.monthNumber) }).map(({ appointmentCount }) => parseInt(appointmentCount)),
          fill: false,
          stack: 'a'
        })
      }
      this.lineChartData_appointments = [...newChartDataArray]
    };
  }

  viewHugsMessageLineGraph() {
    this.showHugsMessageGraph = true;
    let hugsMessageArrayMonth = Array.from(new Set(this.lineChartDataForHugsMessage.map(x => x.xAxis))).map(xAxis => {
      let x = this.lineChartDataForHugsMessage.find(x => x.xAxis == xAxis)
      return {
        ...x
      }
    })
    let resultArrayHugsMessage = Array.from(new Set(this.lineChartDataForHugsMessage.map(x => x.hugsStatus))).sort().map(hugsStatus => {
      return this.lineChartDataForHugsMessage.find(x => x.hugsStatus == hugsStatus).hugsStatus
    })

    if (resultArrayHugsMessage.includes('Resolved')) {
      resultArrayHugsMessage.push(resultArrayHugsMessage.shift());
    }



    this.lineChartLabels_hugsMessage = []
    this.lineChartOptions_hugsMessage = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            precision: 0
          }
        }],
      }
    }
    this.barChartColors_hugsMessage = [
      { backgroundColor: 'rgb(147, 238, 147)' },
      { backgroundColor: 'rgb(122, 219, 131)' },
      { backgroundColor: 'rgb(255, 132, 132)' },
      { backgroundColor: 'rgb(116, 217, 255)' },
      { backgroundColor: 'rgb(253, 209, 100)' },
    ];
    let bgColors = resultArrayHugsMessage.map(hugsStatus => {
      return this.lineChartDataForHugsMessage.find(x => x.hugsStatus == hugsStatus).color
    })

    if ((bgColors || []).filter(x => x != null).length > 0) {
      this.barChartColors_hugsMessage = (bgColors || []).map(c => { return { backgroundColor: c, borderColor: c } });
    }
    if (hugsMessageArrayMonth.length > 0) {
      let sortedMonth = hugsMessageArrayMonth.sort((a, b) => { return new Date(a.yearNumber).getTime() - new Date(b.yearNumber).getTime() })
      this.lineChartLabels_hugsMessage = sortedMonth.filter(x => (x.xAxis != null)).map(({ xAxis, yearNumber }) => xAxis);
    }
    if (resultArrayHugsMessage && resultArrayHugsMessage.length > 0) {
      let newChartDataArray = []
      for (let i = 0; i < resultArrayHugsMessage.length; i++) {
        newChartDataArray.push({
          label: resultArrayHugsMessage[i],
          data: this.lineChartDataForHugsMessage.filter(x => x.hugsStatus == resultArrayHugsMessage[i]).sort((a, b) => { return (a.monthNumber - b.monthNumber) }).map(({ hugsCount }) => parseInt(hugsCount)),
          fill: false,
          stack: 'a'
        })
      }
      this.lineChartData_hugsMessage = [...newChartDataArray]
    };
  }

  viewEncounterLineGraph() {
    this.showEncounterGraph = true;
    let EncounterArrayMonth = Array.from(new Set(this.lineChartDataForEncounters.map(x => x.xAxis))).map(xAxis => {
      let x = this.lineChartDataForEncounters.find(x => x.xAxis == xAxis)
      return {
        ...x
      }
    })
    let resultArrayEncounter = Array.from(new Set(this.lineChartDataForEncounters.map(x => x.encounterType))).map(encounterType => {
      return this.lineChartDataForEncounters.find(x => x.encounterType == encounterType).encounterType
    })
    let bgColors = resultArrayEncounter.map(encounterType => {
      return this.lineChartDataForEncounters.find(x => x.encounterType == encounterType).color
    })

    if ((bgColors || []).filter(x => x != null).length > 0) {
      this.lineChartColors_encounter = (bgColors || []).map(c => { return { backgroundColor: c, borderColor: c } });
    }
    this.lineChartLabels_encounters = []
    this.lineChartOptions_encounters = {
      elements:
      {
        point:
        {
          radius: 5,
          hitRadius: 5,
          hoverRadius: 7,
          hoverBorderWidth: 2
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            precision: 0,
          }
        }],
        xAxes: [
          {
            ticks: {
              fontSize: 10,
            }
          }
        ]
      }

    }
    if (EncounterArrayMonth.length > 0) {
      let sortedMonth = EncounterArrayMonth.sort((a, b) => { return new Date(a.yearNumber).getTime() - new Date(b.yearNumber).getTime() })
      this.lineChartLabels_encounters = sortedMonth.filter(x => (x.xAxis != null)).map(({ xAxis, yearNumber }) => xAxis);
    }
    if (resultArrayEncounter && resultArrayEncounter.length > 0) {
      let newChartEncounterArray = []
      for (let i = 0; i < resultArrayEncounter.length; i++) {
        newChartEncounterArray.push({
          label: resultArrayEncounter[i],
          data: this.lineChartDataForEncounters.filter(x => x.encounterType == resultArrayEncounter[i]).sort((a, b) => { return (a.monthNumber - b.monthNumber) }).map(({ encounterCount }) => parseInt(encounterCount)),
          fill: false,
        })
      }
      this.lineChartData_encounters = [...newChartEncounterArray]
    };
  }

  getDataForAlertGraph() {
    // const AlertTypeIds = (this.filterAlerts.AlertTypeIds || []).join();
    const CareManagerIds = (this.filterAlerts.CareManagerIds || []).join();
    this.dashoboardService.GetAlertsDataForGraph(CareManagerIds, this.filterAlerts.EnrollmentId, this.filterAlerts.nextAppointmentPresent).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        let alertData = response.data || [];
        this.AlertData = alertData;
        if (alertData && alertData.length > 0) {
          this.showAlertGraph(alertData);
        } else {
          this.showAlertChart = false;
        }
      }
    })
  }

  showAlertGraph(alertData: Array<any>) {
    this.showAlertChart = true;
    this.barChartOptions_Alert = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{ ticks: { min: 0, precision: 0 } }],
        xAxes: [
          {
            ticks: {
              fontSize: 10,
            }
          }
        ]
      }
    }

    this.barChartLabels_Alert = Array.from(new Set(alertData.map(x => x.alertType))).map(alertType => {
      return alertData.find(x => x.alertType == alertType).alertType
    })
    let bgColors = this.barChartLabels_Alert.map(alertType => {
      return alertData.find(x => x.alertType == alertType).color
    })

    if ((bgColors || []).filter(x => x != null).length > 0) {
      this.barChartColors_Alert = [{ backgroundColor: bgColors }];
      //this.barChartColors_risk = bgColors ;
    }
    let newChartArray = [];
    newChartArray.push({
      label: 'Alert',
      data: alertData.map(({ totalCount }) => parseInt(totalCount)),
      fill: false,
    });
    this.barChartData_Alert = [...newChartArray]
  }


  getDataForRiskGraph(filterParams: any) {
    let filters = {
      ...filterParams
    }
    // const AlertTypeIds = (this.filterAlerts.AlertTypeIds || []).join();
    this.dashoboardService.GetRiskDataForGraph(filters).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        let riskData = response.data || [];
        this.RiskData = riskData;
        if (riskData && riskData.length > 0) {
          this.showRiskGraph(riskData);
        } else {
          this.showRiskChart = false;
        }
      }
    })
  }
  onCMDeselectDropdown(event: any) {

    let CMIdArray = event.value
    this.filterParamsFoRisk.careManagerIds = CMIdArray || [];
    this.getDataForRiskGraph(this.filterParamsFoRisk);
  }
  onSelectOrDeselectChange(key: string, graphName: string) {
    switch ((graphName || '').toUpperCase()) {
      case 'RISK':
        if (key.toUpperCase() == 'SELECTALL') {
          if (this.filterParamsFoRisk.careManagerIds.length == this.masterStaffs.length) {
            return;
          }
          this.filterParamsFoRisk.careManagerIds = this.masterStaffs.map(x => x.id);
        } else {
          if (this.filterParamsFoRisk && (this.filterParamsFoRisk.careManagerIds || []).length == 0) {
            return;
          }
          this.filterParamsFoRisk.careManagerIds = [];
        }
        this.getDataForRiskGraph(this.filterParamsFoRisk)
        break;
      case 'HRA':
        if (key.toUpperCase() == 'SELECTALL') {
          if (this.filterParamsForHRA.careManagerIds.length == this.masterStaffs.length) {
            return;
          }
          this.filterParamsForHRA.careManagerIds = this.masterStaffs.map(x => x.id);
        } else {
          if (this.filterParamsForHRA && (this.filterParamsForHRA.careManagerIds || []).length == 0) {
            return;
          }
          this.filterParamsForHRA.careManagerIds = [];
        }
        this.getDataForHRABarChart(this.filterParamsForHRA)
        break;
      default:
        break;
    }
  }
  showRiskGraph(riskData: Array<any>) {
    this.showRiskChart = true;
    this.barChartOptions_Risk = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            precision: 0
          }
        }],
        xAxes: [
          {
            ticks: {
              fontSize: 10,
            }
          }
        ]
      }
    }
    let resultArrayRisk = Array.from(new Set(this.RiskData.map(x => x.risk))).map(risk => {
      return this.RiskData.find(x => x.risk == risk).risk
    })

    // if(resultArrayAppointment.includes('Low Risk')) {
    //   resultArrayAppointment.push(resultArrayAppointment.shift());
    // }

    let bgColors = resultArrayRisk.map(risk => {
      return this.RiskData.find(x => x.risk == risk).color
    })

    if ((bgColors || []).filter(x => x != null).length > 0) {
      this.barChartColors_risk = [{ backgroundColor: bgColors }];
      //this.barChartColors_risk = bgColors ;
    }

    this.barChartLabels_Risk = Array.from(new Set(riskData.map(x => x.risk))).map(risk => {
      return riskData.find(x => x.risk == risk).risk
    })
    let newChartArray = [];
    // for(let i = 0; i < this.barChartLabels_Risk.length; i++) {
    newChartArray.push({
      label: 'Risk',
      data: riskData.map(({ totalCount }) => parseInt(totalCount)),
      fill: false,

    })
    // }
    this.barChartData_Risk = [...newChartArray]
  }


  getDataForCareGapStatusPieChart() {
    const CareGapIds = (this.filterCareGapGraph.CareGapIds || []).join(',');
    const StatusIds = (this.filterCareGapGraph.StatusIds || '').toString(),
      AllPatients = this.filterCareGapGraph.AllPatients || false;
    const CareManagerIds = (this.filterCareGapGraph.CareManagerIds || []).join(','), TimeIntervalId = this.filterCareGapGraph.TimeIntervalId || null, EnrollmentId = this.filterCareGapGraph.EnrollmentId || null;
    this.dashoboardService.getPieChartDataForCarePlan(CareGapIds, StatusIds, CareManagerIds, EnrollmentId, TimeIntervalId, this.filterCareGapGraph.CareGapsViewId, this.filterCareGapGraph.nextAppointmentPresent).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.careGapDataList = response.data || []
        if (this.careGapDataList && this.careGapDataList.length > 0) {
          this.showPieChart_carePlan(this.careGapDataList);
        } else {
          this.showPieChartCarePlan = false
        }
      }
      else {
        this.careGapDataList = [];
      }
    })
  }
  showPieChart_carePlan(careGapDataList?: any) {
    this.showPieChartCarePlan = true;

    this.pieChartOptions_carePlan = {
      responsive: true,
      legend: { position: 'right' },
      // scales: {
      //   yAxes: [{
      //     ticks: {
      //       min: 0,
      //       precision: 0
      //     }
      //   }],
      // }
    }

    this.pieColors_carePlan = [];
    let pieChartLabels = Array.from(new Set(careGapDataList.map(x => x.gapName))).map(gapName => {
      return careGapDataList.find(x => x.gapName == gapName).gapName
    });
    let bgColors = pieChartLabels.map(gapName => {
      return careGapDataList.find(x => x.gapName == gapName).color
    })
    if ((bgColors || []).filter(x => x != null).length > 0) {

      this.pieColors_carePlan = [{
        backgroundColor: bgColors
      }]
      //this.barChartColors_risk = bgColors ;
    }
    let newPieChartDataArray = Array.from(new Set(careGapDataList.map(x => x.gapName))).map(gapName => {
      return careGapDataList.find(x => x.gapName == gapName).careGapCount
    });
    // for (let i = 0; i < statusArray.length; i++) {
    //   newPieChartDataArray.push({
    //     label: statusArray[i],
    //     data: pieChartLabels.map(gapName => {
    //       if ((careGapDataList || []).find(x => x.gapName == gapName && (x.status || '').toUpperCase() == (statusArray[i] || '').toUpperCase())) {
    //         return (careGapDataList || []).find(x => x.gapName == gapName && (x.status || '').toUpperCase() == (statusArray[i] || '').toUpperCase()).careGapCount;
    //       } else {
    //         return 0
    //       }
    //     }),
    //     fill: false,
    //     stack: 'a'
    //   });
    // }
    this.pieChartLabels_carePlan = pieChartLabels
    this.pieChartData_carePlan = newPieChartDataArray
  }

  onCareGapChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];

        const obj = (this.careGapDataList || []).find(x => x.gapName == label);

        const encCareGapId = obj && this.commonService.encryptValue(obj.careGapId, true);
        const status = obj && obj.status;

        let startDate, endDate;
        if (this.filterCareGapGraph.TimeIntervalId > 0) {
          let intervalObj = (this.masterCareGapsTimeIntervalData || []).find(x => x.id == this.filterCareGapGraph.TimeIntervalId);
          const dateRanges = intervalObj ? (intervalObj.key || []).split('-') : [];
          if (dateRanges.length > 1) {
            startDate = format(dateRanges[0], 'YYYY-MM-DD');
            endDate = format(dateRanges[1], 'YYYY-MM-DD');
          }
          // if (intervalObj && intervalObj.value.includes('Weekly')) {
          //   startDate = format('03-16-2020', 'YYYY-MM-DD');
          //   endDate = format('05-03-2020', 'YYYY-MM-DD');
          // }
          // if (intervalObj && intervalObj.value.includes('Monthly')) {
          //   startDate = format('09-01-2019', 'YYYY-MM-DD');
          //   endDate = format('10-01-2020', 'YYYY-MM-DD');
          // }
          // if (intervalObj && intervalObj.value.includes('Yearly')) {
          //   startDate = format('01-01-2015', 'YYYY-MM-DD');
          //   endDate = format('01-01-2019', 'YYYY-MM-DD');
          // }
        }

        let cmId, enrollId, viewId;
        if ((this.filterCareGapGraph.CareManagerIds || []).length > 0) {
          cmId = this.filterCareGapGraph.CareManagerIds.join(',');
          cmId = this.commonService.encryptValue(cmId, true);
        }
        if (this.filterCareGapGraph.EnrollmentId > 0) {
          enrollId = this.commonService.encryptValue(this.filterCareGapGraph.EnrollmentId, true);
        }
        if (this.filterCareGapGraph.CareGapsViewId > 0) {
          viewId = this.commonService.encryptValue(this.filterCareGapGraph.CareGapsViewId, true);
        }
        this.router.navigate(['/web/caregaps'], { queryParams: { id: encCareGapId, cmId, enrollId, startDate, endDate, status, viewId, nextApp: this.filterCareGapGraph.nextAppointmentPresent, eligible: 'Yes' } });
      }
    }
  }


  onTabChanged(event: any) {
    this.selectedIndex = event.value
    if (event.index == 0) {
      this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
    } else if (event.index == 1) {
      this.getAllPatientAppointmentList();
    } else if (event.index == 2) {
      this.getPendignPatientAppointmentList();
    }
    else if (event.index == 3) {
      this.getCancelledPatientAppointmentList();
    } else if (event.index == 4) {
      this.getTentativePatientAppointmentList();
    }
  }

  onCheckEnrollments() {
    this.getDataForProgramEnrollesLineChart(this.filterParams)
  }
  // onProgramsCMSelectOrDeselect(key: string = '') {
  //   if (key.toLowerCase() == 'selectall') {
  //     if (this.filterParams.CareManagerIds.length == this.masterStaffs.length) {
  //       return;
  //     }
  //     this.filterParams.CareManagerIds = this.masterStaffs.map(x => x.id);
  //   } else {
  //     if (this.filterParams && (this.filterParams.CareManagerIds || []).length == 0) {
  //       return;
  //     }
  //     this.filterParams.CareManagerIds = [];
  //   }
  //   this.getDataForProgramEnrollesLineChart(this.filterParams);
  // }
  onResetProgramsDropdown(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterParams.programIds.length == this.programsData.length) {
        return;
      }
      this.filterParams.programIds = this.programsData.map(x => x.id);
      this.filterParams.conditionIds = (this.diseaseConditionsData || []).filter(x => this.filterParams.programIds.includes(x.programId)).map(x => x.id)
    } else {
      if (this.filterParams && (this.filterParams.programIds || []).length == 0) {
        return;
      }
      this.filterParams.programIds = [];
      this.filterParams.conditionIds = [];
    }
    this.getDataForProgramEnrollesLineChart(this.filterParams);
  }
  theraClassChartClicked(e: any) {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        let theraClassObjReq = this.theraClassDataList.find(x => x.theraDrugClass == label)
        let maxAmount, minAmount, startDate, endDate, theraClassName;
        if (this.filterParamsForTheraClass.MaxAmount != null || this.filterParamsForTheraClass.MinAmount != null || this.filterParamsForTheraClass.StartDate || this.filterParamsForTheraClass.EndDate) {
          maxAmount = this.commonService.encryptValue(this.filterParamsForTheraClass.MaxAmount, true);
          minAmount = this.commonService.encryptValue(this.filterParamsForTheraClass.MinAmount, true);
          startDate = format(this.filterParamsForTheraClass.StartDate, 'YYYY-MM-DD') || null;
          endDate = format(this.filterParamsForTheraClass.EndDate, 'YYYY-MM-DD') || null;
          theraClassName = theraClassObjReq != null ? this.commonService.encryptValue(theraClassObjReq.theraDrugClassFullName, true) : '';
        }

        this.router.navigate(['/web/drug-breakdown-list'], { queryParams: { maxAmount, minAmount, startDate, endDate, theraClassName, nextApp: this.filterParamsForTheraClass.nextAppointmentPresent } });

        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
      }
    }
  }
  chartClicked(e: any) {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];

        const age = (label && label.split('-')) || [];
        // const startAge =age[0].replace('+','');
        // const endAge =age.length > 1 ? age[1]:' '

        if (age[0].includes('+')) {
          age[0] = parseInt(age[0].replace('+', '')) + 1;
        }

        const startAge = this.commonService.encryptValue(age[0], true)
        const endAge = age.length > 1 ? this.commonService.encryptValue(age[1], true) : null;

        let cmId, enrollId;
        if ((this.filterAgeGroupGraph.CareManagerIds || []).length > 0) {
          cmId = this.filterAgeGroupGraph.CareManagerIds.join(',');
          cmId = this.commonService.encryptValue(cmId, true);
        }
        if (this.filterAgeGroupGraph.EnrollmentId > 0) {
          enrollId = this.commonService.encryptValue(this.filterAgeGroupGraph.EnrollmentId, true);
        }

        this.router.navigate(['/web/client/listing'], { queryParams: { cmId, enrollId, startAge: startAge, endAge: endAge, nextApp: this.filterAgeGroupGraph.nextAppointmentPresent } });

        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
      }
    }
  }

  onAppointmentChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const datasetLabel = activePoints[0]._view.datasetLabel;
        const label = activePoints[0]._view.label;
        const obj = (this.masterAppointmentStatus || []).find(x => x.value.toUpperCase() == (datasetLabel || '').toUpperCase());
        const encId = obj && this.commonService.encryptValue(obj.id, true);

        const intervalObj = this.masterAppointmenttimeIntervalData.find(x => x.id == this.filterParamsForAppointent.appointmentTimeIntervalId),
          datesArray = label.split("-");
        let startDate = null, endDate = null;
        // const MonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const MonthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

        switch (intervalObj && intervalObj.value.toUpperCase()) {
          case 'MONTHLY':
            startDate = startOfMonth(setMonth(new Date, MonthNames.indexOf((datesArray[0].toUpperCase() || '').trim())));
            if (datesArray.length > 1)
              startDate = setYear(startDate, (datesArray[1] || '').trim());
            endDate = endOfMonth(startDate);
            break;
          case 'WEEKLY':
            startDate = new Date(datesArray[0]);
            endDate = datesArray.length > 1 ? new Date(datesArray[1]) : null;
            break;
          case 'YEARLY':
            startDate = startOfYear(setYear(new Date, (datesArray[0] || '').trim()));
            endDate = endOfYear(startDate);
            break;
        }
        let cmId;
        if ((this.filterParamsForAppointent.CareManagerIds || []).length > 0)
          cmId = this.filterParamsForAppointent.CareManagerIds.join(',');

        startDate = isValid(startDate) ? format(startDate, 'YYYY-MM-DD') : null;
        endDate = isValid(endDate) ? format(endDate, 'YYYY-MM-DD') : null; 
        // this.router.navigate(['/web/reports/appointment'], { queryParams: { id: encId, cmId, startDate, endDate } });
      }
    }
  }

  onhugsMessageChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const datasetLabel = activePoints[0]._view.datasetLabel;
        const label = activePoints[0]._view.label;
        const obj = (this.masterHugsMessageStatus || []).find(x => x.value.toUpperCase() == (datasetLabel || '').toUpperCase());
        const encId = obj && this.commonService.encryptValue(obj.id, true);
        const pocHugsTypeId = this.filterParamsForHugsMessage.pocHugsTypeId;

        const intervalObj = this.masterhugsMessagetimeIntervalData.find(x => x.id == this.filterParamsForHugsMessage.hugsMessageTimeIntervalId),
          datesArray = label.split("-");
        let startDate = null, endDate = null;
        // const MonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const MonthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

        switch (intervalObj && intervalObj.value.toUpperCase()) {
          case 'MONTH':
            startDate = startOfMonth(setMonth(new Date, MonthNames.indexOf((datesArray[0].toUpperCase() || '').trim())));
            if (datesArray.length > 1)
              startDate = setYear(startDate, (datesArray[1] || '').trim());
            endDate = endOfMonth(startDate);
            break;
          case 'WEEK':
            startDate = new Date(datesArray[0]);
            endDate = datesArray.length > 1 ? new Date(datesArray[1]) : null;
            break;
          case 'DAY':
            startDate = new Date(datesArray[0] || '');
            endDate = new Date(datesArray[0] || '');
            break;
        }
        let cmId1;
        if ((this.filterParamsForHugsMessage.CareManagerIds || []).length > 0)
          cmId1 = this.filterParamsForHugsMessage.CareManagerIds.join(',');

        startDate = isValid(startDate) ? format(startDate, 'YYYY-MM-DD') : null;
        endDate = isValid(endDate) ? format(endDate, 'YYYY-MM-DD') : null;
        let cmId = cmId1 && this.commonService.encryptValue(cmId1, true);
        this.router.navigate(['/web/hug-message'], { queryParams: { id: encId, cmId, startDate, endDate, pocHugsTypeId } });
      }
    }
  }

  onHRAChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const datasetLabel = activePoints[0]._view.datasetLabel;
        const label = activePoints[0]._view.label,
          hraObj = this.barChartDataForHra.find(x => x.status == datasetLabel && x.assessmentName == label);
        let careManagerIds;
        if ((this.filterParamsForHRA.careManagerIds || []).length > 0)
          // careManagerIds = this.filterParamsForHRA.careManagerIds.join(',')
          careManagerIds = this.commonService.encryptValue(this.filterParamsForHRA.careManagerIds.join(','), true)
        let EnrollmentId = this.commonService.encryptValue(this.filterParamsForHRA.EnrollmentId, true)

        // docId = hraObj && this.commonService.encryptValue(hraObj.documentId, true),
        // statusId = hraObj && this.commonService.encryptValue(hraObj.statusId, true);

        this.router.navigate(['/web/member-hra'], { queryParams: { docId: hraObj.documentId, statusId: hraObj.statusId, careManagerIds: careManagerIds, EnrollmentId: EnrollmentId, nextApp: this.filterParamsForHRA.nextAppointmentPresent } });
      }
    }
  }
  onAlertChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const label = activePoints[0]._view.label;
        const intervalObj = this.AlertData.find(x => x.alertType == label),
          encId = intervalObj && this.commonService.encryptValue(intervalObj.alertTypeId, true);

        let cmId, enrollId;
        if ((this.filterAlerts.CareManagerIds || []).length > 0) {
          cmId = this.filterAlerts.CareManagerIds.join(',');
          cmId = this.commonService.encryptValue(cmId, true);
        }
        if (this.filterAlerts.EnrollmentId > 0) {
          enrollId = this.commonService.encryptValue(this.filterAlerts.EnrollmentId, true);
        }

        //let nextApp = this.filterAlerts.nextAppointmentPresent;
        
        // this.router.navigate(['/web/reports/appointment'], { queryParams: { id: encId, startDate, endDate } });
        this.router.navigate(['/web/alerts'], { queryParams: { id: encId, cmId, enrollId, nextApp: this.filterAlerts.nextAppointmentPresent } });
      }
    }
  }
  onProgramsChartClick({ event, active }) {
    if (active.length > 0) {
      let enrollmentId = null;
      let conditionIds: any,
        programId = null
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const label = chart.data.labels[activePoints[0]._index];
        let datasetLabel = chart.data.datasets[activePoints[0]._datasetIndex] && chart.data.datasets[activePoints[0]._datasetIndex].label;
        let testvar = (datasetLabel || '').split(':')
        if (testvar.length > 1 && testvar[1] == ' Not-Enrolled') {
          enrollmentId = this.masterEnrollmentTypeFilter.find(x => x.value == "Non-Enrolled").id;
        } else {
          enrollmentId = this.masterEnrollmentTypeFilter.find(x => x.value == "Enrolled").id;
        }
        enrollmentId = this.commonService.encryptValue(enrollmentId, true)
        datasetLabel = (datasetLabel || '').split(':')[0].trim();

        programId = (this.programsData || []).find(x => x.value == datasetLabel) && (this.programsData || []).find(x => x.value == datasetLabel).id;
        // console.log(this.lineChartDataForDMP)
        // let enrollmentId = this.filterParams.EnrollmentId > 0 ? this.commonService.encryptValue(this.filterParams.EnrollmentId, true) : null;

        if (programId > 0) {
          conditionIds = testvar.length > 1 ? (this.diseaseConditionsData || []).filter(x => x.programId == programId).map(x => x.id) : null;
          programId = programId > 0 ? this.commonService.encryptValue(programId, true) : null
        } else {
          if ((this.filterParams.programIds || []).length > 0) {
            programId = this.filterParams.programIds.join(',');
            conditionIds = (this.diseaseConditionsData || []).filter(x => this.filterParams.programIds.includes(x.programId)).map(x => x.id);
            programId = this.commonService.encryptValue(programId, true);
          }
        }
        const programObj = (this.lineChartDataForDMP || []).find(x => x.xAxis == label);
        // const startDate = programObj &&  format(programObj.startDate, 'YYYY-MM-DD'),
        const startDate = null, endDate = programObj && format(programObj.endDate, 'YYYY-MM-DD');

        // let programId;
        // if ((this.filterParams.programIds || []).length > 0) {
        //   programId = this.filterParams.programIds.join(',');
        //   programId = this.commonService.encryptValue(programId, true);
        // }
        let conditionId;
        if ((conditionIds || []).length > 0) {
          conditionId = conditionIds.join(',');
          conditionId = this.commonService.encryptValue(conditionId, true);
        }
        // console.log(this.filterParams)
        this.router.navigate(['/web/programs-enrollment'], { queryParams: { id: programId, enrollmentId: enrollmentId, startDate, endDate, conditionId: conditionId, nextApp: this.filterParams.nextAppointmentPresent } });
      }
    }
  }
  onRiskChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        // const datasetLabel = activePoints[0]._view.datasetLabel;
        const label = activePoints[0]._view.label;

        let id = this.RiskData.find(x => x.risk == label).riskId
        const riskIds = id > 0 ? this.commonService.encryptValue(id, true) : null;
        let careManagerIds, enrollmentId;
        if ((this.filterParamsFoRisk.careManagerIds || []).length > 0)
          careManagerIds = this.commonService.encryptValue(this.filterParamsFoRisk.careManagerIds.join(','), true)
        if (this.filterParamsFoRisk.EnrollmentId > 0)
          enrollmentId = this.commonService.encryptValue(this.filterParamsFoRisk.EnrollmentId, true)
        // careManagerIds = this.filterParamsForHRA.careManagerIds.join(',')
        // encId = intervalObj && this.commonService.encryptValue(2543, true);

        // console.log(startDate, endDate);
        this.router.navigate(['/web/client/listing'], { queryParams: { id: riskIds, cmId: careManagerIds, enrollId: enrollmentId, nextApp: this.filterParamsFoRisk.nextAppointmentPresent } });
      }
    }
  }

  onCMTasksChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const label = chart.data.labels[activePoints[0]._index];
        let datasetLabel = chart.data.datasets[activePoints[0]._datasetIndex] && chart.data.datasets[activePoints[0]._datasetIndex].label;

        const programObj = (this.lineChartDataForTasks || []).find(x => x.xAxis == label);
        const startDate = programObj && format(programObj.startDate, 'YYYY-MM-DD'),
          endDate = programObj && format(programObj.endDate, 'YYYY-MM-DD');

        let isCompleted;
        if ((datasetLabel || '').toUpperCase() == 'COMPLETED TASKS')
          isCompleted = 1;
        else if ((datasetLabel || '').toUpperCase() == 'NON-COMPLETED TASKS')
          isCompleted = 0;

        let cmId, allTsk;
        if ((this.filterTaskParams.careManagerIds || []).length > 0) {
          cmId = this.filterTaskParams.careManagerIds.join(',');
          cmId = this.commonService.encryptValue(cmId, true);
        }
        if (this.filterTaskParams.AllTasks) {
          allTsk = 1
        }

        // let intervalId;
        // if(this.filterTaskParams.timeIntervalFilterId > 0)
        //   intervalId = this.commonService.encryptValue(this.filterTaskParams.timeIntervalFilterId, true);

        this.router.navigate(['/web/tasks/listing'], { queryParams: { cmId, startDate, endDate, isCompleted, allTsk } });
      }
    }
  }
  onEncounterChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const label = chart.data.labels[activePoints[0]._index];
        let datasetLabel = chart.data.datasets[activePoints[0]._datasetIndex] && chart.data.datasets[activePoints[0]._datasetIndex].label;

        datasetLabel = (datasetLabel || '').split(':')[0].trim();

        let encounterId = (this.masterEncounterTypes || []).find(x => x.value == datasetLabel) && (this.masterEncounterTypes || []).find(x => x.value == datasetLabel).id;
        encounterId = encounterId > 0 ? this.commonService.encryptValue(encounterId, true) : null

        const programObj = (this.lineChartDataForEncounters || []).find(x => x.xAxis == label);
        const startDate = programObj && format(programObj.startDate, 'YYYY-MM-DD'),
          endDate = programObj && format(programObj.endDate, 'YYYY-MM-DD');
        //const startDate = null, endDate = null;

        let cmId, enrollId;
        if ((this.filterParamsForEncounter.CareManagerIds || []).length > 0) {
          cmId = this.filterParamsForEncounter.CareManagerIds.join(',');
          cmId = this.commonService.encryptValue(cmId, true);
        }
        if (this.filterParamsForEncounter.EnrollmentId > 0) {
          enrollId = this.commonService.encryptValue(this.filterParamsForEncounter.EnrollmentId, true);
        }

        this.router.navigate(['/web/encounter'], { queryParams: { id: encounterId, cmId, enrollId, startDate, endDate, nextApp: this.filterParamsForEncounter.nextAppointmentPresent } });
      }
    }
  }
  viewHRABarGraph() {
    this.showGraphForHRA = true;
    let hraAssessmentArray = Array.from(new Set(this.barChartDataForHra.map(x => x.assessmentName))).map(assessmentName => {
      let x = this.barChartDataForHra.find(x => x.assessmentName == assessmentName)
      return {
        ...x
      }
    })

    let resultArrayAssessmentStatus = Array.from(new Set(this.barChartDataForHra.map(x => x.status))).sort().map(status => {
      return this.barChartDataForHra.find(x => x.status == status).status
    })

    let bgColors = resultArrayAssessmentStatus.map(status => {
      return this.barChartDataForHra.find(x => x.status == status).color
    })
    this.barChartLabels_hra = []
    this.barChartOptions_hra = {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            precision: 0
          }
        }],
        xAxes: [
          {
            ticks: {
              fontSize: 10,
            }
          }
        ]
      }
    }
    if ((bgColors || []).filter(x => x != null).length > 0) {
      this.barChartColors_hra = (bgColors || []).map(c => { return { backgroundColor: c } });
    }
    if (hraAssessmentArray.length > 0) {
      // let sortedArray = hraAssessmentArray.sort((a, b) => { return b.documentId - a.documentId })
      this.barChartLabels_hra = hraAssessmentArray.filter(x => x.status).map(({ assessmentName, documentId }) => assessmentName);
    }

    if (resultArrayAssessmentStatus && resultArrayAssessmentStatus.length > 0) {
      let newChartDataArray = []
      // for (let j = 0; j <= distinctaAssessmentArray.length; j++){
      for (let i = 0; i < resultArrayAssessmentStatus.length; i++) {
        newChartDataArray.push({
          label: resultArrayAssessmentStatus[i],
          data: this.barChartDataForHra.filter(x => x.status == resultArrayAssessmentStatus[i]).map(({ totalCount }) => parseInt(totalCount)),
          fill: false,
          stack: 'a'
        })
      }
      // }
      this.barChartData_hra = [...newChartDataArray]
    };
  }
  isSamePrimaryConditionSeleted(comorbidId) {
    return this.filtersForComorbidCondition.PrimaryConditionId == comorbidId;
  }
  isSameComorbidConditionSeleted(primaryId) {
    return (this.filtersForComorbidCondition.ComorbidConditionIds || []).findIndex(x => x == primaryId) > -1;
  }
  onComorbidGraphSelect() {
    this.getDataForComorbidConditionGraph();
  }

  onComorbidGraphRefersh() {
    this.filtersForComorbidCondition.nextAppointmentPresent = null;
    this.getDataForComorbidConditionGraph();
  }
  onComorbidSelectOrDeselectChange(key: string = '') {
    if (key.toUpperCase() == 'SELECTALL') {
      if (this.filtersForComorbidCondition.ComorbidConditionIds.length == this.masterChronicCondition.length) {
        return;
      }
      this.filtersForComorbidCondition.ComorbidConditionIds = this.masterChronicCondition.filter(x => x.id != this.filtersForComorbidCondition.PrimaryConditionId).map(x => x.id);
    } else {
      if ((this.filtersForComorbidCondition.ComorbidConditionIds || []).length == 0) {
        return;
      }
      this.filtersForComorbidCondition.ComorbidConditionIds = [];
    }
    this.getDataForComorbidConditionGraph();
  }
  getDataForComorbidConditionGraph() {
    const filters = {
      ...this.filtersForComorbidCondition,
      ComorbidConditionIds: (this.filtersForComorbidCondition.ComorbidConditionIds || []).join(',')
    }
    this.dashoboardService.getComorbiditiesConditionData(filters).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.data_ComorbidCondition = response.data || [];
        if (this.data_ComorbidCondition && this.data_ComorbidCondition.length > 0) {
          this.viewComorbidConditionGraph();
        } else {
          this.showGraphForComorbidCondition = false;
        }
      }
      else {
        this.showGraphForComorbidCondition = false;
        this.data_ComorbidCondition = [];
      }
    })
  }
  viewComorbidConditionGraph() {
    this.showGraphForComorbidCondition = true;
    let labelsArray = Array.from(new Set(this.data_ComorbidCondition.map(x => x.condition))).map(condition => {
      return this.data_ComorbidCondition.find(x => x.condition == condition).condition;
    });
    // let bgColors = labelsArray.map(condition => {
    //   return this.data_ComorbidCondition.find(x => x.condition == condition).color
    // })
    this.barChartOptions_ComorbidCondition = {
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            precision: 0
          }
        }],

      }
    }
    this.barChartColors_ComorbidCondition = [
      // { backgroundColor: 'rgb(0,176,80)' },
      // { backgroundColor: 'rgb(18,148,174)' },
      // { backgroundColor: 'rgb(146,208,80)' },
      //       { backgroundColor: 'rgb(94,214,238)' },

    ];
    let bgColors1 = ['rgb(0,176,80)', 'rgb(18,148,174)'],
      bgColors2 = ['rgb(146,208,80)', 'rgb(94,214,238)'];
    // if ((bgColors || []).filter(x => x != null).length > 0) {
    //   this.barChartColors_ComorbidCondition = (bgColors || []).map(c => { return { backgroundColor: c } });
    // }
    if (labelsArray.length > 0) {
      this.barChartLabels_ComorbidCondition = labelsArray;
    }
    let newChartDataArray = [],
      statusArray = [{ key: 'enrolled', value: 'Enrolled' }, { key: 'notEnrolled', value: 'Non-Enrolled' }];
    for (let i = 0; i < statusArray.length; i++) {
      newChartDataArray.push({
        label: statusArray[i]['value'],
        data: this.data_ComorbidCondition.map((x) => {
          return x[statusArray[i]['key']] ? parseInt(x[statusArray[i]['key']], 10) : 0;
        }),
        stack: 'a',
        backgroundColor: i > 0 ? bgColors2 : bgColors1,
        hoverBackgroundColor: i > 0 ? bgColors2 : bgColors1,
        hoverBorderColor: i > 0 ? bgColors2 : bgColors1,
      })
    }
    this.barChartData_ComorbidCondition = [...newChartDataArray];
  }
  onComorbidGraphChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const datasetLabel = activePoints[0]._view.datasetLabel;
        const label = activePoints[0]._view.label,
          enrollObj = this.masterEnrollmentTypeFilter.find(x => x.value.toLowerCase() == (datasetLabel || '').toLowerCase()),
          prgObj = (this.diseaseConditionsData || []).find(x => x.id == this.filtersForComorbidCondition.PrimaryConditionId);

        let pId, sIds, enrollId, prgId, isEligibile = 'Yes';
        if (this.filtersForComorbidCondition.PrimaryConditionId > 0) {
          pId = this.commonService.encryptValue(this.filtersForComorbidCondition.PrimaryConditionId, true);
        }
        if ((this.filtersForComorbidCondition.ComorbidConditionIds || []).length > 0 && activePoints[0]._index > 0) {
          sIds = this.commonService.encryptValue(this.filtersForComorbidCondition.ComorbidConditionIds.join(','), true);
        }
        if (enrollObj) {
          enrollId = this.commonService.encryptValue(enrollObj.id, true);
        }
        if (prgObj) {
          prgId = this.commonService.encryptValue(prgObj.programId, true);
        }

        // this.router.navigate(['/web/reports/appointment'], { queryParams: { id: encId, startDate, endDate } });
        this.router.navigate(['/web/client/listing'], { queryParams: { pId, sIds, prgId, enrollId, isEligibile, nextApp: this.filtersForComorbidCondition.nextAppointmentPresent } });
      }
    }
  }
}
