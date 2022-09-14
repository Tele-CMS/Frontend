import { TextChatModel } from "src/app/shared/text-chat/textChatModel";
import { TextChatService } from "./../../../../shared/text-chat/text-chat.service";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { AppService } from "./../../../../app-service.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ClientsService } from "../clients.service";
import { DatePipe } from '@angular/common';
import { AppointmentViewComponent } from "./../../scheduling/appointment-view/appointment-view.component";
import {
  ClientProfileModel
} from "../client-profile.model";
import {
  ResponseModel,
  FilterModel,
  Metadata,
  ReportModel
} from "../../core/modals/common-model";
import {ViewReportComponent} from './../../../../shared/view-report/view-report.component'
import { merge, Subscription, Subject } from "rxjs";
import { ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator, MatDialog } from "@angular/material";
import { ClientDashboardService } from "./dashboard.service";
import { CommonService } from "../../core/services";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { format, addDays, addYears,startOfMonth, setMonth, endOfMonth, setYear, startOfYear, endOfYear, isValid } from "date-fns";
import * as moment from "moment";
import { ReviewRatingComponent } from "../review-rating/review-rating.component";
import { ReviewRatingModel } from "../review-rating/review-rating.model";
import { SchedulerService } from "src/app/platform/modules/scheduling/scheduler/scheduler.service";
import { CancelAppointmentDialogComponent } from "src/app/shared/cancel-appointment-dialog/cancel-appointment-dialog.component";
import { StaffAppointmentComponent } from "src/app/shared/staff-appointment/staff-appointment.component";
import { map } from "rxjs/operators";
import { PatientVital } from "../../agency-portal/clients/client-profile.model";
import { Color } from 'ng2-charts';
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class ClientDashboardComponent implements OnInit {
  lineChartData: Array<any> = [
    { data: [10, 15, 25, 30], label: "Jan" },
    { data: [25, 51, 52, 51], label: "Feb" },
    { data: [22, 88, 55, 22], label: "Mar" },
    { data: [33, 15, 25, 25], label: "Apr" }
  ];
  lineChartLabels: Array<any> = ["Jan", "Feb", "Mar", "Apr"];
  lineChartType: string = "line";
  encFilterModel: FilterModel;
  clientProfileModel: ClientProfileModel;
  // tasks
  tasksFilterModel: FilterModel;
  payment:any;
  taskMeta: Metadata;
  appointment:any;
  tasksList: Array<any> = [];
  // all appointments
  allAppointmentsFilterModel: FilterModel;
  allAppointmentsMeta: Metadata;
  todayAppointmentMeta: Metadata;

  allAppointmentsList: Array<any> = [];
  pastAppointmentsList: Array<any> = [];
  allTodayAppointmentsList: Array<any> = [];
  allAppointmentsDisplayedColumns: Array<any>;
  allAppointmentsActionButtons: Array<any>;
  filterModel: FilterModel;
  pendingAptfilterModel: FilterModel;
  CancelledAptfilterModel: FilterModel;
  ReportFilterModel: ReportModel;
  weightPercentage:any;
  TodayAptfilterModel: FilterModel;
  pastAptfilterModel: FilterModel;
  upcomingAptfilterModel: FilterModel;
  subscription: Subscription;
  status: boolean = false;
  passwordExpiryColorCode: string = "";
  passwordExpiryMessage: string = "";
  showMessage: boolean = true;
  message: Subject<any> = new Subject();
  currentLoginUserId: number;
  isClientLogin: boolean = false;
  userRole: string = "";
  currentLocationId: number;
  userRoleName: string;
  pendingAppointmentMeta: Metadata;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pendingDisplayedColumns: Array<any>;
  cancelledDisplayedColumns: Array<any>;
  patientReportColumns: Array<any>;
  todayDisplayedColumns: Array<any>;
  todayActionButtons: Array<any>;
  pastAppointmentsDisplayedColumns: Array<any>;
  pastAppointmentsActionButtons: Array<any>;
  pendingActionButtons: Array<any>;
  urlSafe: any;
  imageBlobUrl: string;
  userId:string;
  urgentcareapptid:number;
  showurgentcarebtn:boolean=false;
  patientDocumentData: any[];
  pendingPatientAppointment: Array<any> = [];
  CancelledPatientAppointment: Array<any> = [];
  CancelledAppointmentMeta: Metadata;
  PatientReport:Array<any>=[];
  PatientReportMeta: Metadata;
  pastAppointmentMeta: Metadata;
  metaData: any;
  headerText: string;
  MissedPatientAppointment: Array<any> = [];
  MissedAppointmentMeta: Metadata;
  MissedAptfilterModel: FilterModel;
  AttendedPatientAppointment: Array<any> = [];
  AttendedAppointmentMeta: Metadata;
  AttendedAptfilterModel: FilterModel;
  //for appointment graph
  masterStaffs: Array<any>;
  masterAppointmentStatus: Array<any> = []
  masterAppointmenttimeIntervalData: Array<any> = []
  lineChartDataForAppointment: Array<any>;
  lineChartLabels_appointments: Array<any> = [];
  lineChartOptions_appointments: any
  barChartColors_appointments: Array<Color>;
  showGraphAppointment: boolean = false
  areRetainedFilters: boolean;
  lineChartData_appointments: Array<any>;
  filterParamsForAppointent: {
    statusIds: Array<string>,
    appointmentTimeIntervalId: number,
    //isCheckTotalEnrollments: boolean
    CareManagerIds: Array<number>,
    nextAppointmentPresent: boolean,
    patientId: number
  }
//for encounter graph
masterStaffsForEncounter: Array<any>;
masterEncounterTypes: Array<any> = [];
lineChartDataForEncounters: Array<any>;
lineChartColors_encounter: Array<Color>;
lineChartLabels_encounters: Array<any> = [];
lineChartData_encounters: Array<any>;
lineChartOptions_encounters: any
showEncounterGraph: boolean = false
filterParamsForEncounter: {
  encounterTypeIds: Array<string>,
  encounterTimeIntervalId: number,
  CareManagerIds: Array<number>,
  EnrollmentId: number,
  nextAppointmentPresent: boolean,
  //isCheckTotalEnrollments: boolean
}
masterEncountertimeIntervalData: Array<any> = []
masterEnrollmentTypeFilter: Array<any> = [];
filterParamsForHRA: {
  careManagerIds: Array<string>
  EnrollmentId: number,
  nextAppointmentPresent: boolean,
}
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
filterParamsFoRisk: {
  careManagerIds: Array<string>,
  EnrollmentId: number,
  nextAppointmentPresent: boolean,
}

  HRADisplayedColumns: Array<any> = [
    {
      displayName: "Assigned By",
      key: "assignedBy",
      class: "",
      width: "140px"
    },
    {
      displayName: "STATUS",
      key: "status",
      class: "",
      width: "80px",
      type: ["Assigned", "Complete", "Past Due"]
    },
    {
      displayName: "COMPLETION DATE",
      key: "completionDate",
      class: "",
      width: "120px",
      type: "date"
    },
    {
      displayName: "Due Date",
      key: "expirationDate",
      class: "",
      width: "120px",
      type: "date"
    },
    {
      displayName: "Actions",
      key: "Actions",
      class: "",
      width: "100px",
      sticky: true,
      type: "memberportalhra"
    }
  ];

  HRAActionButtons: Array<any> = [
    {
      displayName: "Click to Start",
      key: "questionnaire",
      class: "font500",
      title: "Fill Assessment"
    },
    {
      displayName: "Download Individual Report",
      key: "viewreport",
      class: "bluefont",
      title: "Download Report"
    },
    {
      displayName: "Preview Individual Report",
      key: "previewreport",
      class: "bluefont",
      title: "Preview Report"
    }
  ];

  upcomingAppointmentsActionButtons = [
    {
      displayName: "Chat",
      key: "chat",
      class: "fa fa-comments"
    },
    {
      displayName: "Cancel",
      key: "cancel",
      class: "fa fa-window-close"
    }
  ]

  pendingAppointmentsActionButtons = [

    {
      displayName: "Cancel",
      key: "cancel",
      class: "fa fa-window-close"
    }
  ]
  selectedIndex: number = 0;
  textChatModel: TextChatModel;
  constructor(private datePipe: DatePipe,
    private dashoboardService: ClientDashboardService,
    private commonService: CommonService,
    private clientService: ClientsService,
    public dialogModal: MatDialog,
    public router: Router,
    private appService: AppService,
    private schedulerService: SchedulerService,
    private textChatService: TextChatService,
    private appointmentDailog: MatDialog,
  ) {
    this.encFilterModel = new FilterModel();
    this.tasksFilterModel = new FilterModel();
    this.pendingAptfilterModel = new FilterModel();
    this.CancelledAptfilterModel = new FilterModel();
    this.ReportFilterModel=new ReportModel();
    this.MissedAptfilterModel = new FilterModel();
    this.AttendedAptfilterModel = new FilterModel();
    this.upcomingAptfilterModel = new FilterModel();
    this.pastAptfilterModel = new FilterModel();
    this.TodayAptfilterModel = new FilterModel();
    this.taskMeta = new Metadata();
    this.allAppointmentsFilterModel = new FilterModel();
    this.allAppointmentsMeta = null;
    //for appointment graph
    this.filterParamsForAppointent = {
      statusIds: [],
      appointmentTimeIntervalId: null,
      CareManagerIds: [],
      nextAppointmentPresent: null,
      patientId: null
    }
    this.masterStaffs = [];
    this.masterStaffsForEncounter = [];
//for encounter graph
this.filterParamsForEncounter = {
  encounterTypeIds: [],
  encounterTimeIntervalId: null,
  CareManagerIds: [],
  EnrollmentId: null,
  nextAppointmentPresent: null
}
this.filterParamsForHRA = {
  careManagerIds: [],
  EnrollmentId: null,
  nextAppointmentPresent: null
}
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
this.filterParamsFoRisk = {
  careManagerIds: [],
  EnrollmentId: null,
  nextAppointmentPresent: null
}
    this.cancelledDisplayedColumns = [
      { displayName: "Provider", key: "staffName", width: "140px" },
      {
        displayName: "Appt Type",
        key: "appointmentType",
        width: "100px"
      },
      { displayName: "Date Time", key: "dateTimeOfService", width: "240px" },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        width: "220px",
        type: "50",
        isInfo: true
      },
      { displayName: "Cancel Type", key: "cancelType", width: "150px" },
      { displayName: "Cancel Reason", key: "cancelReason", width: "132px" },
      { displayName: "Actions", key: "Actions", width: "80px", sticky: true }
    ];
    this.patientReportColumns = [
      { displayName: "Report Name", key: "reportName", width: "300px" }
      ,
      { displayName: "Report Date", key: "createdDate", width: "300px" },

    ];
    this.pendingDisplayedColumns = [
      { displayName: "Provider", key: "staffName", width: "140px" },
      {
        displayName: "Appt Type",
        key: "appointmentType",
        width: "140px"
      },
      { displayName: "Date Time", key: "dateTimeOfService", width: "250px" },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        width: "250px",
        type: "50",
        isInfo: true
      },
      { displayName: "Actions", key: "Actions", width: "80px", sticky: true }
    ];
    this.pendingActionButtons = [];
    this.allAppointmentsDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        class: "",
        width: "160px",
        sticky: true
      },
      {
        displayName: "Appt Type",
        key: "appointmentTypeName",
        width: "140px"
      },
      { displayName: "Date Time", key: "dateTimeOfService", width: "250px" },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        width: "250px",
        type: "50",
        isInfo: true
      },
      { displayName: "Actions", key: "Actions", width: "80px" }
    ];



    this.allAppointmentsActionButtons = [
      {
        displayName: "Chat",
        key: "chat",
        class: "fa fa-comments"
      }
    ];
    this.pastAppointmentsDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        class: "",
        width: "140px",
        sticky: true
      },
      {
        displayName: "Appt Type",
        key: "appointmentTypeName",
        width: "140px"
      },
      { displayName: "Date Time", key: "dateTimeOfService", width: "290px" },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        width: "250px",
        type: "50",
        isInfo: true
      },
      {
        displayName: "Rating",
        key: "rating",
        type: "rating",
        width: "90px"
      },
      {
        displayName: "Review",
        key: "review",
        width: "150px",
        isInfo: true,
        type: "50"
      },
      { displayName: "Actions", key: "Actions", width: "80px" }
    ];

    this.pastAppointmentsActionButtons = [
      {
        displayName: "view soap note",
        key: "soap",
        class: "fa fa-eye",
        type: "encounter"
      },
      {
        displayName: "Review/Ratings",
        key: "review",
        class: "fa fa-star"
      }
    ];
    this.todayDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        class: "",
        width: "140px",
        sticky: true
      },
      {
        displayName: "Appt Type",
        key: "appointmentTypeName",
        width: "140px"
      },
      { displayName: "Date Time", key: "dateTimeOfService", width: "250px" },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        width: "250px",
        type: "50",
        isInfo: true
      },

      { displayName: "Actions", key: "Actions", width: "120px" }
    ];
    this.todayActionButtons = [
      {
        displayName: "go to waiting-room",
        key: "call",
        class: "fa fa-wpforms",
        type: "timeCheck"
      },
      {
        displayName: "Reschedule",
        key: "reschedule",
        class: "fa fa-calendar"
      },
      {
        displayName: "Chat",
        key: "chat",
        class: "fa fa-comments",
        type: "timeCheck"
      },
      {
        displayName: "Cancel",
        key: "cancel",
        class: "fa fa-window-close"
      }
    ];


  }







  ngOnInit() {
    this.filterModel = new FilterModel();
    this.textChatModel = new TextChatModel();
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.currentLoginUserId = user.id;
          this.userId=user.userID;
          this.currentLocationId = user.currentLocationId;
          if (user.users3 && user.users3.userRoles) {
            this.userRole = (user.users3.userRoles.userType || "").toUpperCase()
          }
          this.userRoleName =
            user && user.users3 && user.users3.userRoles.userType;
            this.isClientLogin = this.userRole == "CLIENT";
            // this.filterParamsForAppointent.CareManagerIds = [this.currentLoginUserId];
            // this.filterParamsForEncounter.CareManagerIds = [this.currentLoginUserId];
            let CMIdArray = [];
            CMIdArray.push(this.currentLoginUserId);
            this.filterParamsForHRA.careManagerIds = CMIdArray;
            this.filterParamsFoRisk.careManagerIds = CMIdArray
            this.headerText = "Assessments";
            this.getMasterData();
            this.getPasswordExpiryMessage();
            this.getLastUrgentCareCallStatus();
            this.getTodayPatientAppointmentList();
            this.getClientProfileInfo();
            this.getPaymentInfo();
            this.getPastUpcomingAppointment();
            this.getStaffsByLocation();
            this.getDataForHRABarChart(this.filterParamsForHRA);
            this.getDataForRiskGraph(this.filterParamsFoRisk);
        }
      }
    );

    if (sessionStorage.getItem("dashboardFilters")) {
      try {
        const dashboardFiltersString = this.commonService.encryptValue(sessionStorage.getItem("dashboardFilters"), false);
        const { filterParamsForAppointent,filterParamsForEncounter,filterParamsForHRA,filterParamsFoRisk,filterParams} = JSON.parse(dashboardFiltersString);
        this.filterParamsForAppointent = filterParamsForAppointent;
        this.filterParamsForEncounter = filterParamsForEncounter;
        this.filterParamsForHRA = filterParamsForHRA;
        this.filterParamsFoRisk = filterParamsFoRisk;
        this.filterParams = filterParams;
        this.areRetainedFilters = true;
      } catch (err) {
        console.error(err);
      }
    }
  }
  //for appointment graph
  getMasterData() {
    const masterData = { masterdata: "CAREPLANSTATUSFILTER,APPOINTMENTIMEGRAPHFILTER,APPOINTMENTSTATUS,ENCOUNTERTYPES,ENCOUNTERGRAPHFILTER,MASTERTASKSTIMEINTERVAL,PATIENTCAREGAPSTATUS,ALERTSINDICATORFILTER,MASTERCAREGAPSTIMEINTERVAL,MASTERENROLLMENTTYPEFILTER,MASTERCAREGAPSGRAPHVIEWFILTER,MASTERDISEASECONDITIONMAPPEDWITHDMP,MASTERTHERACLASSGRAPHVIEWTYPE,POCHUGSSTATUS,HUGSCHARTTYPE,POCHUGSTYPE" };
    this.dashoboardService.getMasterData(masterData)
      .subscribe((response: any) => {
        const staticEncTypes = ['Acute Care', 'Wellness Visit', 'Administrative', 'Disease Management'];
        this.masterAppointmenttimeIntervalData = response.appointmentTimeGraphFilter || [];
        this.masterAppointmentStatus = response.appointmentStatus || [];
        this.masterEnrollmentTypeFilter = response.masterEnrollmentTypeFilter || [];
        this.masterEncountertimeIntervalData = response.encounterGraphfilter || [];
        this.masterEncounterTypes = response.encounterTypes || [];
        // default selected filter values
        if (!this.areRetainedFilters) {
          if (this.masterEnrollmentTypeFilter.length > 0) {
            this.filterParamsForHRA.EnrollmentId = this.masterEnrollmentTypeFilter.find(x => x.id > 0 && x.value.toLowerCase() == 'all').id;
            this.filterParams.EnrollmentId = this.masterEnrollmentTypeFilter.find(x => x.id > 0 && x.value.toLowerCase() == 'all').id;
            this.filterParamsFoRisk.EnrollmentId = this.masterEnrollmentTypeFilter.find(x => x.id > 0 && x.value.toLowerCase() == 'all').id;
          }
          let defaultAptTimeIntervalObj = this.masterAppointmenttimeIntervalData.find(x => x.value == 'Monthly');
          let defautlEncTimeIntervalObj = this.masterEncountertimeIntervalData.find(x => x.value == 'Weekly');
          let defaultEnrollTypeObj = this.masterEnrollmentTypeFilter.find(x => x.value == 'All');
          let idArray = this.masterAppointmentStatus.map(function (a) { return a.id; });
          this.filterParamsForAppointent.statusIds = idArray || [];
          this.filterParamsForAppointent.appointmentTimeIntervalId = defaultAptTimeIntervalObj && defaultAptTimeIntervalObj.id;
          this.filterParamsForEncounter.encounterTimeIntervalId = defautlEncTimeIntervalObj && defautlEncTimeIntervalObj.id;
          this.filterParamsForEncounter.encounterTypeIds = (response.encounterTypes || []).filter(x => staticEncTypes.includes(x.value)).map(x => x.id);
          this.filterParamsForEncounter.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
        }

        // if (this.filterParams.EnrollmentId > 0)
        //   this.getDataForProgramEnrollesLineChart(this.filterParams)
        // if (this.filterParams.timeIntervalFilterId > 0) {
        //   this.getDataForProgramEnrollesLineChart(this.filterParams)
        // }
        if (this.filterParamsForAppointent.appointmentTimeIntervalId > 0) {
          this.filterParamsForAppointent.patientId = this.currentLoginUserId;
          this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
        }
        if (this.filterParamsForEncounter.encounterTimeIntervalId > 0) {
          this.getDataForEncounterLineChart(this.filterParamsForEncounter)
        }

        // this.viewEmptyEncounterGraph();
        // this.viewEmptyAppointmentGraph();

      });
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
  getDataForHRABarChart(filterParamsForHRA: any) {
    // this.dashoboardService.getBarChartDataForHRA(filterParamsForHRA).subscribe((response: ResponseModel) => {
    //   if (response != null && response.statusCode == 200) {
    //     this.barChartDataForHra = response.data || []
    //     if (this.barChartDataForHra && this.barChartDataForHra.length > 0) {
    //       this.viewHRABarGraph();
    //     } else {
    //       this.showGraphForHRA = false
    //     }
    //   } else if (response != null && response.statusCode == 204) {
    //     this.showGraphForHRA = false
    //   }
    //   else {
    //     this.barChartDataForHra = [];
    //     //this.showGraphForHRA = false
    //   }
    // })
  }
  getDataForRiskGraph(filterParams: any) {
    // let filters = {
    //   ...filterParams
    // }
    // // const AlertTypeIds = (this.filterAlerts.AlertTypeIds || []).join();
    // this.dashoboardService.GetRiskDataForGraph(filters).subscribe((response: ResponseModel) => {
    //   if (response != null && response.statusCode == 200) {
    //     let riskData = response.data || [];
    //     this.RiskData = riskData;
    //     if (riskData && riskData.length > 0) {
    //       this.showRiskGraph(riskData);
    //     } else {
    //       this.showRiskChart = false;
    //     }
    //   }
    // })
  }
  goToPayment(redirectType: any) {
    this.router.navigate(["/web/client/payment/payment-history"], {
      queryParams: {
        type: redirectType
      }
    });
  }
  getChangePercentage(type:any)
  {

    if (this.clientProfileModel && this.clientProfileModel.patientVitals) {
      let sumCurrent: any = 0;
      let sumPrev: any = 0;
      var changePercentage: any = -1;
      var date = new Date();

      var firstdayCurrentMonth: any = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth(), 1), "yyyy-MM-dd");
      var lastdayCurrentMonth: any = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth() + 1, 0), "yyyy-MM-dd");
      var firstdayPrevMonth: any = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth() - 1, 1), "yyyy-MM-dd");
      var lastdayPrevMonth: any = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth(), 0), "yyyy-MM-dd");
      var previousMonthRecords: any = this.clientProfileModel.patientVitals.filter(x => this.datePipe.transform(x.vitalDate, "yyyy-MM-dd") >= firstdayPrevMonth && this.datePipe.transform(x.vitalDate, "yyyy-MM-dd") <= lastdayPrevMonth);
      var currentMonthRecords: any = this.clientProfileModel.patientVitals.filter(x => this.datePipe.transform(x.vitalDate, "yyyy-MM-dd") >= firstdayCurrentMonth && this.datePipe.transform(x.vitalDate, "yyyy-MM-dd") <= lastdayCurrentMonth);

      if (currentMonthRecords == undefined || previousMonthRecords == undefined) {
        return '';
      }
      var currentMonthCount = currentMonthRecords == null ? 0 : currentMonthRecords.length;
      var previousMonthCount = previousMonthRecords == null ? 0 : previousMonthRecords.length;

      if (currentMonthCount == 0 || previousMonthCount == 0) {
        return '';
      }

      switch (type) {
        case 'weight':
          currentMonthRecords.forEach(a => sumCurrent += a.weightLbs);
          previousMonthRecords.forEach(a => sumPrev += a.weightLbs);
          break;
        case 'height':
          currentMonthRecords.forEach(a => sumCurrent += a.heightIn);
          previousMonthRecords.forEach(a => sumPrev += a.heightIn);
          break;
        case 'temperature':
          currentMonthRecords.forEach(a => sumCurrent += a.temperature);
          previousMonthRecords.forEach(a => sumPrev += a.temperature);
          break;
        case 'heartrate':
          currentMonthRecords.forEach(a => sumCurrent += a.heartRate);
          previousMonthRecords.forEach(a => sumPrev += a.heartRate);
          break;
        case 'bp':
          currentMonthRecords.forEach(a => sumCurrent += a.bpSystolic);
          previousMonthRecords.forEach(a => sumPrev += a.bpSystolic);
          break;
          case 'respiration':
            currentMonthRecords.forEach(a => sumCurrent += a.respiration);
            previousMonthRecords.forEach(a => sumPrev += a.respiration);
            break;
        default:
          break;
      }

      if (isNaN(sumCurrent) || isNaN(sumPrev)) {
        return '';
      }
      let finalValue: any = sumCurrent / currentMonthCount;
      let initialValue = sumPrev / previousMonthCount;
      changePercentage =  (((finalValue - initialValue) / initialValue) * 100).toFixed(0);

      if (changePercentage > 0) {
        return changePercentage + '% higher than last month'
      }
      else if (changePercentage < 0) {
        return -changePercentage + '% less than last month'
      }
      else if (changePercentage == 0) {
        return 'same as last month'
      }
      else {
        return '';
      }


  }
  }
  getPaymentInfo()
  {
      this.clientService
        .getClientNetAppointmentPayment(this.currentLoginUserId)
        .subscribe((response: ResponseModel) => {
          if (response != null ) {
            this.payment= response.data;
          }
        });
  }
  getClientProfileInfo() {
    this.clientService
      .getClientProfileDashboardInfo(this.currentLoginUserId)
      .subscribe((response: ResponseModel) => {
        if (response != null ) {

          this.clientProfileModel = response.data;
        }
      });
  }
  retValue(value: any, prefix: any, value2: any) {
    if (prefix.includes('IN') && value != undefined) {
      var feet = Math.floor(value / 12);
      var inches = Math.floor(value % 12);
      value = feet + "'" + inches + "''"
    }
    if (value2 != undefined && value2 != '') {
      return value == undefined ? 'N/A' : value + '/' + value2;
    }
    else {
      return value == undefined ? 'N/A' : value + prefix.replace('IN', '');
    }

  }
  editProfile(event: any) {
    this.router.navigate(["/web/client/client-profile"], {
      queryParams: {
        id:
          this.currentLoginUserId != null
            ? this.commonService.encryptValue(this.currentLoginUserId, true)
            : null
      }
    });
  }
  goToVitals() {
    this.router.navigate(["/web/client/my-vitals"])

  }
  onTabChanged(event: any) {
    this.selectedIndex = event.index;
    switch (event.index) {
      case 0:
        {
          this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
        }
        break;
      case 1:
        {
          this.getTodayPatientAppointmentList();
        }
        break;
      case 2:
        {
          this.getAllPatientAppointmentList();
        }
        break;
      case 3:
        {
          this.getPastPatientAppointmentList();
        }
        break;
      case 4:
        {
          // this.getPendignPatientAppointmentList();
          this.getCancelledPatientAppointmentList();
        }
        break;
      case 5:
        {
          this.getPatientReportList();

        }
        break;


    }
  }
  onPageChanges() {
    merge(this.paginator.page).subscribe(() => {
      const changeState = {
        pageNumber: this.paginator.pageIndex + 1,
        pageSize: this.paginator.pageSize
      };
      this.setTasksPaginatorModel(changeState.pageNumber, changeState.pageSize);
      this.getTasksList();
    });
  }
  setTasksPaginatorModel(pageNumber: number, pageSize: number) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
  }
  hideMessageClick() {
    this.showMessage = false;
  }
  getTasksList() {
    this.tasksFilterModel.sortColumn = "Status";
    this.tasksFilterModel.sortOrder = "desc";
    this.dashoboardService
      .GetTasksList(this.tasksFilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.tasksList = (response.data || []).map(x => {
            x["disableActionButtons"] = (x.status || "").toUpperCase() ==
              "CLOSED" && ["closed"];
            return x;
          });
          this.taskMeta = response.meta;
        } else {
          this.tasksList = [];
          this.taskMeta = null;
        }
      });
  }

  getPastUpcomingAppointment(pageNumber: number = 1, pageSize: number = 5) {
    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : ""
    }
    this.dashoboardService
      .GetPastUpcomingAppointment(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null) {
          this.appointment=response.data;

        }

      })
  }

  getAllPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    var today = new Date();
    var tomorrowDate = new Date(today.setDate(today.getDate() + 1));

    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
      fromDate: format(new Date(tomorrowDate), "YYYY-MM-DD"),
      toDate: format(addDays(new Date(), 720), "YYYY-MM-DD"),
      status: "Approved",
      pageNumber,
      pageSize
    };
    this.dashoboardService
      .GetOrganizationAppointments(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.allAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.allAppointmentsList = (this.allAppointmentsList || []).map(x => {
            const staffsArray = (x.appointmentStaffs || []).map(
              y => y.staffName
            );
            const staffIds = (x.appointmentStaffs || []).map(y => y.staffId);
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, "MM/DD/YYYY") +
              " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A") +
              ")";
            return x;
          });
          this.allAppointmentsMeta = response.meta;
        }else
        { this.allAppointmentsList = [];
          this.allAppointmentsMeta = null;
        }
        this.allAppointmentsMeta.pageSizeOptions = [5,10,25,50,100];
      });
  }
  getPendignPatientAppointmentList() {

    const fromDate = moment().format("YYYY-MM-DDTHH:mm:ss"),
      toDate = null;
    this.dashoboardService
      .getPendingPatientAppointment(
        this.pendingAptfilterModel,
        fromDate,
        toDate
      )
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.pendingPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.pendingPatientAppointment = (this.pendingPatientAppointment || []
          ).map(x => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              y => y.staffName
            );
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              y => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, "MM/DD/YYYY") +
              " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A") +
              ")";
            return x;
          });
          this.pendingAppointmentMeta = response.meta;
        } else {
          this.pendingPatientAppointment = [];
          this.pendingAppointmentMeta = null;
        }
      });
  }
  getPastPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    var today = new Date();
    var yesterday = new Date(today.setDate(today.getDate() - 1));

    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
      fromDate: format(addDays(new Date(today), -720), "YYYY-MM-DD"),
      toDate: format(new Date(yesterday), "YYYY-MM-DD"),
      status: "Approved",
      pageNumber,
      pageSize
    };
    this.dashoboardService
      .GetOrganizationAppointments(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {

          this.pastAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.pastAppointmentsList = (this.pastAppointmentsList || []
          ).map(x => {
            const staffsArray = (x.appointmentStaffs || []).map(
              y => y.staffName
            );
            const staffIds = (x.appointmentStaffs || []).map(y => y.staffId);
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, "MM/DD/YYYY") +
              " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A") +
              ")";
            return x;
          });
          this.pastAppointmentMeta = response.meta;
        }
        this.pastAppointmentMeta.pageSizeOptions = [5,10,25,50,100];
      });
  }
  onTableRowClick(actionObj?: any) {
    const modalPopup = this.dialogModal.open(
      ViewReportComponent,
      {
        hasBackdrop: true,
        data: actionObj.data.reportId,
      }
    );

    modalPopup.afterClosed().subscribe((result) => {

    });
  }
  getPatientReportList(pageNumber: number = 1, pageSize: number = 5)
  {

    const fromDate = null,
    patientId=this.currentLoginUserId,
      toDate = moment().format("YYYY-MM-DDTHH:mm:ss");

    this.dashoboardService
      .getReport(this.ReportFilterModel, fromDate, toDate,patientId).pipe(map(x => {
    return x;
  })).subscribe(resp => {
    this.PatientReport = (resp.data || []
    ).map(x => {

      x.createdDate =
        format(x.createdDate, "MM/DD/YYYY") +
        " (" +
        format(x.createdDate, "h:mm A") +
        " - " +
        format(x.createdDate, "h:mm A") +
        ")";
      return x;
    });

    this.PatientReportMeta=resp.meta;
    this.PatientReportMeta.pageSizeOptions = [5,10,25,50,100];
  });

  }

  getLastUrgentCareCallStatus() {
        this.schedulerService.getLastUrgentCareCallStatusForPatientPortal( this.userId).subscribe(response => {
          if (response.statusCode === 200) {
            if(response.data!=undefined){
              this.urgentcareapptid=response.data.id;
              //this.hasPreviousNewMeeting = response.data ? true : false;
              this.showurgentcarebtn=true;
            }
            else{
              this.showurgentcarebtn=false;
            }

          }
        });
      }

      Redirect(){
        // this.router.navigate(["/web/encounter/soap"], {
        //   queryParams: {
        //     apptId: this.urgentcareapptid,
        //     encId: 0
        //   },
        // });
        // this.router.navigate(["/web/waiting-room/check-in-video-call/"+this.urgentcareapptid]);
        this.router.navigate(["/web/waiting-room/check-in-video-call/"+this.commonService.encryptValue(this.urgentcareapptid,true)]);
      }


  getCancelledPatientAppointmentList() {
    const fromDate = null,
      toDate = null;
    this.dashoboardService
      .getCancelledPatientAppointment(
        this.CancelledAptfilterModel,
        fromDate,
        toDate
      )
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.CancelledPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.CancelledPatientAppointment = (this
            .CancelledPatientAppointment || []
          ).map(x => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              y => y.staffName
            );
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              y => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, "MM/DD/YYYY") +
              " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A") +
              ")";
            return x;
          });
          this.CancelledAppointmentMeta = response.meta;
        } else {
          this.CancelledPatientAppointment = [];
          this.CancelledAppointmentMeta = null;
        }
        this.CancelledAppointmentMeta.pageSizeOptions = [5,10,25,50,100];
      });
  }
  getMissedPatientAppointmentList() {
    const fromDate = null,
      toDate = moment().format("YYYY-MM-DDTHH:mm:ss");
    this.dashoboardService
      .getPendingPatientAppointment(this.MissedAptfilterModel, fromDate, toDate)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.MissedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.MissedPatientAppointment = (this.MissedPatientAppointment || []
          ).map(x => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              y => y.staffName
            );
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              y => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, "MM/DD/YYYY") +
              " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A") +
              ")";
            return x;
          });
          this.MissedAppointmentMeta = response.meta;
        } else {
          this.MissedPatientAppointment = [];
          this.MissedAppointmentMeta = null;
        }
      });
  }
  getAttendedPatientAppointmentList() {
    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
      fromDate: format(addYears(new Date(), -100), "YYYY-MM-DD"),
      toDate: format(new Date(), "YYYY-MM-DD"),
      status: "Approved",
      pageNumber: this.AttendedAptfilterModel.pageNumber,
      pageSize: this.AttendedAptfilterModel.pageSize
    };
    this.dashoboardService
      .GetOrganizationAppointments(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.AttendedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.AttendedPatientAppointment = (this.AttendedPatientAppointment ||
            []
          ).map(x => {
            const staffsArray = (x.appointmentStaffs || []).map(
              y => y.staffName
            );
            const staffIds = (x.appointmentStaffs || []).map(y => y.staffId);
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, "MM/DD/YYYY") +
              " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A") +
              ")";
            return x;
          });
          this.AttendedAppointmentMeta = response.meta;
        }
      });
  }
  getTodayPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
      fromDate: format(new Date(), "YYYY-MM-DD"),
      toDate: format(new Date(), "YYYY-MM-DD"),
      status: "Approved",
      pageNumber,
      pageSize
    };
    this.dashoboardService
      .GetOrganizationAppointments(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.allTodayAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.allTodayAppointmentsList = (this.allTodayAppointmentsList || []
          ).map(x => {
            const staffsArray = (x.appointmentStaffs || []).map(
              y => y.staffName
            );
            const staffIds = (x.appointmentStaffs || []).map(y => y.staffId);
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, "MM/DD/YYYY") +
              " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A") +
              ")";
            return x;
          });
          this.todayAppointmentMeta = response.meta;
        }
        this.todayAppointmentMeta.pageSizeOptions = [5,10,25,50,100];
      });
  }

  getPasswordExpiryMessage() {
    this.subscription = this.commonService.loginUser.subscribe(
      (user: LoginUser) => {
        if (user.passwordExpiryStatus) {
          this.passwordExpiryColorCode = user.passwordExpiryStatus.colorCode;
          this.passwordExpiryMessage = user.passwordExpiryStatus.message;
          this.status = user.passwordExpiryStatus.status;
        }
      }
    );
  }

  onPendingPageOrSortChange(changeState?: any) {
    this.setPendingPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getPendignPatientAppointmentList();
  }
  onCancelledPageOrSortChange(changeState?: any) {
    this.setCancelledPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getCancelledPatientAppointmentList();
  }
  onReportPageOrSortChange(changeState?: any) {
    this.setReportPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getPatientReportList(changeState.pageNumber,changeState.pageSize );
  }
  onTodayPageOrSortChange(changeState?: any) {
    this.setTodayPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getTodayPatientAppointmentList(changeState.pageNumber,changeState.pageSize );
  }
  onMissedPageOrSortChange(changeState?: any) {
    this.setMissedPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getMissedPatientAppointmentList();
  }
  onAttendedPageOrSortChange(changeState?: any) {
    this.setAttendedPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getAttendedPatientAppointmentList();
  }
  onUpcomingAptPageOrSortChange(changeState?: any) {
    this.setUpcomingPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getAllPatientAppointmentList(changeState.pageNumber, changeState.pageSize);
  }
  onPastPageOrSortChange(changeState?: any) {
    this.setPastPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getPastPatientAppointmentList(changeState.pageNumber, changeState.pageSize);
  }
  setPastPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.pastAptfilterModel.pageNumber = pageNumber;
    this.pastAptfilterModel.pageSize = pageSize;
    this.pastAptfilterModel.sortOrder = sortOrder;
    this.pastAptfilterModel.sortColumn = sortColumn;
  }
  setPendingPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.pendingAptfilterModel.pageNumber = pageNumber;
    this.pendingAptfilterModel.pageSize = pageSize;
    this.pendingAptfilterModel.sortOrder = sortOrder;
    this.pendingAptfilterModel.sortColumn = sortColumn;
  }
  setCancelledPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.CancelledAptfilterModel.pageNumber = pageNumber;
    this.CancelledAptfilterModel.pageSize = pageSize;
    this.CancelledAptfilterModel.sortOrder = sortOrder;
    this.CancelledAptfilterModel.sortColumn = sortColumn;
  }
  setReportPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.ReportFilterModel.pageNumber = pageNumber;
    this.ReportFilterModel.pageSize = pageSize;
    this.ReportFilterModel.sortOrder = sortOrder;
    this.ReportFilterModel.sortColumn = sortColumn;
  }
  setTodayPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.TodayAptfilterModel.pageNumber = pageNumber;
    this.TodayAptfilterModel.pageSize = pageSize;
    this.TodayAptfilterModel.sortOrder = sortOrder;
    this.TodayAptfilterModel.sortColumn = sortColumn;
  }
  setMissedPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.MissedAptfilterModel.pageNumber = pageNumber;
    this.MissedAptfilterModel.pageSize = pageSize;
    this.MissedAptfilterModel.sortOrder = sortOrder;
    this.MissedAptfilterModel.sortColumn = sortColumn;
  }
  setAttendedPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.AttendedAptfilterModel.pageNumber = pageNumber;
    this.AttendedAptfilterModel.pageSize = pageSize;
    this.AttendedAptfilterModel.sortOrder = sortOrder;
    this.AttendedAptfilterModel.sortColumn = sortColumn;
  }
  setUpcomingPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.upcomingAptfilterModel.pageNumber = pageNumber;
    this.upcomingAptfilterModel.pageSize = pageSize;
    this.upcomingAptfilterModel.sortOrder = sortOrder;
    this.upcomingAptfilterModel.sortColumn = sortColumn;
  }

  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.patientAppointmentId;
    localStorage.setItem('apptId', id);
    switch ((actionObj.action || "").toUpperCase()) {
      case "CALL": 

        // this.router.navigate(["/web/encounter/video-call"], {
        //   queryParams: { apptId: id }
        // });
          // this.router.navigate(["/web/waiting-room/"+ id]);
        this.router.navigate(["/web/waiting-room/"], {
          queryParams: { id: this.commonService.encryptValue(id,true) }
        });
        break;
      case "CHAT": 

        this.commonService.loginUser.subscribe((response: any) => {
          if (response.access_token) {
            var chatInitModel = new ChatInitModel();
            chatInitModel.isActive = true;
            chatInitModel.AppointmentId = id;
            chatInitModel.UserId = response.data.userID;
            if(this.isClientLogin){
              chatInitModel.UserRole = response.data.users3.userRoles.userType;
            }else{
              chatInitModel.UserRole = response.data.userRoles.userType;
            }
            // chatInitModel.UserRole = response.data.users1.userRoles.userType;
            this.appService.CheckChatActivated(chatInitModel);
            // this.getAppointmentInfo(
            //   chatInitModel.AppointmentId,
            //   chatInitModel.UserRole
            // );
            this.textChatService.setAppointmentDetail(
              chatInitModel.AppointmentId,
              chatInitModel.UserRole
            );
            this.textChatService.setRoomDetail(
              chatInitModel.UserId,
              chatInitModel.AppointmentId
            );
          }
        });
        break;
      case "CANCEL":

        this.createCancelAppointmentModel(id);
        break;
      case "RESCHEDULE":
        this.OpenrReschedule(actionObj.data);
        break;
      default:
        break;
    }
  }

    viewAppointment(appointmentId: number) {
      const modalPopup = this.appointmentDailog.open(
        AppointmentViewComponent,
        {
          hasBackdrop: true,
          data:  appointmentId,
          width:"80%"
        }
      );
      }
  OpenrReschedule(actionObj: any) {
        let dbModal;
        dbModal = this.appointmentDailog.open(StaffAppointmentComponent, {
          hasBackdrop: true, minWidth: '70%', maxWidth: '70%',
          data: {
            staffId: actionObj.appointmentStaffs.length >0?actionObj.appointmentStaffs[0].staffId:0,
            userInfo: null,
            providerId: actionObj.appointmentStaffs.length >0?actionObj.appointmentStaffs[0].staffId:0,
            locationId: actionObj.serviceLocationID || 0,
            isNewAppointment: false,
            appointmentId: actionObj.patientAppointmentId,
            patientId: actionObj.patientID
          }
        });
        dbModal.afterClosed().subscribe((result: string) => {
          this.getTodayPatientAppointmentList();
        });

  }
  onUpcomingTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.patientAppointmentId;
    localStorage.setItem('apptId', id);
    switch ((actionObj.action || "").toUpperCase()) {
      // case "CALL":
      //   this.router.navigate(["/web/encounter/video-call"], {
      //     queryParams: { apptId: id }
      //   });
      case "CHAT":
        this.commonService.loginUser.subscribe((response: any) => {
          if (response.access_token) {
            var chatInitModel = new ChatInitModel();
            chatInitModel.isActive = true;
            chatInitModel.AppointmentId = id;
            chatInitModel.UserId = response.data.userID;
            if(this.isClientLogin){
              chatInitModel.UserRole = response.data.users3.userRoles.userType;
            }else{
              chatInitModel.UserRole = response.data.userRoles.userType;
            }
            // chatInitModel.UserRole = response.data.users1.userRoles.userType;
            this.appService.CheckChatActivated(chatInitModel);
            // this.getAppointmentInfo(
            //   chatInitModel.AppointmentId,
            //   chatInitModel.UserRole
            // );
            this.textChatService.setAppointmentDetail(
              chatInitModel.AppointmentId,
              chatInitModel.UserRole
            );
            this.textChatService.setRoomDetail(
              chatInitModel.UserId,
              chatInitModel.AppointmentId
            );
          }
        });
        break;
      case "CANCEL":

        this.createCancelAppointmentModel(id);
        break;
      default:
        break;
    }
  }
  // getAppointmentInfo(appointmentId: number, userRole: string) {
  //   this.schedulerService
  //     .getAppointmentDetails(appointmentId)
  //     .subscribe(response => {
  //       var appointmentDetail = response.data;
  //       if (response.statusCode == 200) {
  //         var staff = appointmentDetail.appointmentStaffs[0];
  //         if (userRole.toUpperCase() == "CLIENT") {
  //           this.textChatModel.Callee = "Dr. " + staff.staffName;
  //           this.textChatModel.CalleeImage = staff.photoThumbnail;
  //           this.textChatModel.Caller = appointmentDetail.patientName;
  //           this.textChatModel.CallerImage =
  //             appointmentDetail.patientPhotoThumbnailPath;
  //         } else {
  //           this.textChatModel.Caller = "Dr. " + staff.staffName;
  //           this.textChatModel.CallerImage = staff.photoThumbnail;
  //           this.textChatModel.Callee = appointmentDetail.patientName;
  //           this.textChatModel.CalleeImage =
  //             appointmentDetail.patientPhotoThumbnailPath;
  //         }
  //       }
  //       this.appService.ChatUserInit(this.textChatModel);
  //     });
  // }

  onPendingTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.patientAppointmentId;


    switch ((actionObj.action || "").toUpperCase()) {
      case "CANCEL":

        this.createCancelAppointmentModel(id);
        break;
      default:
        break;
    }
  }

  onPastTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.patientAppointmentId;
    const encId = actionObj.data && actionObj.data.patientEncounterId;
    const revId = actionObj.data && actionObj.data.reviewRatingId;

    switch ((actionObj.action || "").toUpperCase()) {
      case "SOAP":
        this.router.navigate(["/web/client/soap-note"], {
          queryParams: { apptId: id, encId: encId }
        });
      case "REVIEW":
        this.createDialogReviewRating(actionObj.data);
      // this.router.navigate(["/web/client/review-rating"], {
      //     queryParams: { apptId: id, revId: revId }
      //  });
      default:
        break;
    }
  }

  createDialogReviewRating(data: any) {
    var reviewRatingModel = new ReviewRatingModel();
    reviewRatingModel.id = data.reviewRatingId;
    reviewRatingModel.patientAppointmentId = data.patientAppointmentId;
    reviewRatingModel.rating = data.rating;
    reviewRatingModel.review = data.review;
    reviewRatingModel.staffId = data.appointmentStaffs != null ? data.appointmentStaffs[0].staffId : 0;
    let dbModal;
    dbModal = this.dialogModal.open(ReviewRatingComponent, {
      data: { reviewRatingModel }
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save")
        this.getPastPatientAppointmentList(
          this.pastAptfilterModel.pageNumber,
          this.pastAptfilterModel.pageSize
        );
    });
  }

  createCancelAppointmentModel(appointmentId: number) {
    const modalPopup = this.dialogModal.open(
      CancelAppointmentDialogComponent,
      {
        hasBackdrop: true,
        data: appointmentId,
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") {
        this.onTabChanged({ index: this.selectedIndex })
      }
    });
  }

  //for appointment graph
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
  onAppointmenttimeInterval(event: any) {
    this.filterParamsForAppointent.appointmentTimeIntervalId = event.value
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }
  onApptGraphCMSelect(event: any) {
    let cmIdArray = event.value
    this.filterParamsForAppointent.CareManagerIds = cmIdArray || [];
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
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

  //for encounter graph
  onEncounterTimeInterval(event: any) {
    this.filterParamsForEncounter.encounterTimeIntervalId = event.value
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
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
}
