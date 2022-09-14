import { AcceptRejectAppointmentInvitationComponent } from "./../accept-reject-appointment-invitation/accept-reject-appointment-invitation.component";
import { InvitedRejectedComponent } from "./invited-rejected/invited-rejected.component";
import { InvitedAcceptedComponent } from "./invited-accepted/invited-accepted.component";
import { InvitedPendingComponent } from "./invited-pending/invited-pending.component";
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "./../../super-admin-portal/core/modals/common-model";
import { MatPaginator, MatDialog } from "@angular/material";
import { ContextMenuService } from 'ngx-contextmenu';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { AppointmentViewComponent } from "./../../platform/modules/scheduling/appointment-view/appointment-view.component";
import { StaffAppointmentComponent } from "./../../shared/staff-appointment/staff-appointment.component";
import { AddNewCallerService } from "./../../shared/add-new-caller/add-new-caller.service";
import { AddNewCallerComponent } from "./../../shared/add-new-caller/add-new-caller.component";
import {SetReminderComponent} from './../../shared/set-reminder/set-reminder.component'
import { Router, ActivatedRoute } from "@angular/router";

import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef
} from "@angular/core";
import {
  Metadata,
  FilterModel
} from "src/app/platform/modules/core/modals/common-model";
import { AppointmentGraphService } from "src/app/shared/appointment-graph/appointment-graph.service";
import { Color } from "ng2-charts";
import { format, addDays } from "date-fns";
import { merge, Subscription, Subject } from "rxjs";
import { ApproveAppointmentDialogComponent } from "src/app/shared/approve-appointment-dialog/approve-appointment-dialog.component";
import { CancelAppointmentDialogComponent } from "src/app/shared/cancel-appointment-dialog/cancel-appointment-dialog.component";
import { AppointmentReschedulingDialogComponent } from "../appointment-rescheduling-dialog/appointment-rescheduling-dialog.component";

@Component({
  selector: "app-appointment-graph",
  templateUrl: "./appointment-graph.component.html",
  styleUrls: ["./appointment-graph.component.css"]
})
export class AppointmentGraphComponent implements OnInit {
  contextMenu: ContextMenuComponent;
  currentPatientId:number=0;
  currentAppointmentId:number=0;
  showTooltip:boolean=false;
  appointId:number=0;
  allAppointmentsFilterModel: FilterModel;
  allAppointmentsMeta: Metadata;
  allAppointmentsList: Array<any> = [];
  allAppointmentsDisplayedColumns: Array<any>;
  allAppointmentsActionButtons: Array<any>;
  filterModel: FilterModel;
  pendingAptfilterModel: FilterModel;
  cancelledAptfilterModel: FilterModel;
  upcomingAptfilterModel: FilterModel;
  tentativeAptFilterModel: FilterModel;
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
  selectedIndex: number = 0;
  lineChartDataForAppointment: Array<any>;
  showGraphAppointment: boolean = false;
  lineChartLabels_appointments: Array<any> = [];
  lineChartOptions_appointments: any;
  barChartColors_appointments: Array<Color>;
  lineChartData_appointments: Array<any>;
  filterParamsForAppointent: {
    statusIds: Array<string>;
    appointmentTimeIntervalId: number;
    //isCheckTotalEnrollments: boolean
    CareManagerIds: Array<number>;
  };

  masterStaffs: Array<any>;
  pendingPatientAppointment: Array<any> = [];
  cancelledPatientAppointment: Array<any> = [];
  tentativePatientAppointment: Array<any> = [];
  subscription: Subscription;
  currentLoginUserId: number;
  currentLocationId: number;
  userRoleName: string;
  masterTimeIntervalData: Array<any> = [];
  masterAppointmenttimeIntervalData: Array<any> = [];
  masterAppointmentStatus: Array<any> = [];
  masterTaskTimeIntervalData: Array<any> = [];
  filterTaskParams: {
    taskTypeIds: Array<string>;
    timeIntervalFilterId: number;
    careManagerIds: Array<number>;
  };
  // @ViewChild("tabContentPendingInvitation", { read: ViewContainerRef })
  // tabContentPendingInvitation: ViewContainerRef;
  // @ViewChild("tabContentAcceptedInvitation", { read: ViewContainerRef })
  // tabContentAcceptedInvitation: ViewContainerRef;
  // @ViewChild("tabContentRejectedInvitation", { read: ViewContainerRef })
  // tabContentRejectedInvitation: ViewContainerRef;

  invitedDisplayedColumns: Array<any>;
  invitedActionButtons: Array<any>;
  invitedAptfilterModel: FilterModel;
  invitedAppointmentMeta: Metadata;
  invitedPatientAppointment: Array<any> = [];

  invitedAcceptedDisplayedColumns: Array<any>;
  invitedAcceptedActionButtons: Array<any>;
  invitedAcceptedAptfilterModel: FilterModel;
  invitedAcceptedAppointmentMeta: Metadata;
  invitedAcceptedPatientAppointment: Array<any> = [];

  invitedRejectedDisplayedColumns: Array<any>;
  invitedRejectedActionButtons: Array<any>;
  invitedRejectedAptfilterModel: FilterModel;
  invitedRejectedAppointmentMeta: Metadata;
  invitedRejectedPatientAppointment: Array<any> = [];

  constructor(
    private appointmentGraphService: AppointmentGraphService,
    private commonService: CommonService,
    private dailog: MatDialog,
    private cfr: ComponentFactoryResolver,
    private contextMenuService :ContextMenuService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private addNewCallerService: AddNewCallerService,
  ) {
    this.invitedAppointmentMeta = null;
    this.invitedAptfilterModel = new FilterModel();
    this.invitedDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        sticky: true
      },
      {
        displayName: "Patient",
        key: "fullName",
        type: "link",
        url: "/web/client/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
      {
        displayName: "Appt. Type",
        key: "appointmentType",
      },
       {
        displayName: "Appt. Mode",
        key: "appointmentMode",
      },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        type: "link",
        url: "/web/client/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        type: "50",
        isInfo: true
      },
      { displayName: "Actions", key: "Actions", width: "80px", sticky: true }
    ];

    this.invitedActionButtons = [
      {
        displayName: "Accept Invitation",
        key: "accept",
        class: "fa fa-check"
      },
      { displayName: "Reject Invitation", key: "reject", class: "fa fa-ban" }
    ];

    this.invitedAcceptedAppointmentMeta = null;
    this.invitedAcceptedAptfilterModel = new FilterModel();
    this.invitedAcceptedDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        sticky: true
      },
      {
        displayName: "Patient",
        key: "fullName",
        type: "link",
        url: "/web/client/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
      {
        displayName: "Appt. Type",
        key: "appointmentType",
      },
      {
        displayName: "Appt. Mode",
        key: "appointmentMode",
      },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        type: "link",
        url: "/web/client/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        type: "50",
        isInfo: true
      },
      {
        displayName: "Accepted Remarks",
        key: "invitationAcceptRejectRemarks",
        type: "50",
        isInfo: true
      }
    ];

    this.invitedAcceptedActionButtons = [];

    this.invitedRejectedAppointmentMeta = null;
    this.invitedRejectedAptfilterModel = new FilterModel();
    this.invitedRejectedDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        sticky: true
      },
      {
        displayName: "Patient",
        key: "fullName",
        type: "link",
        url: "/web/client/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
      {
        displayName: "Appt. Type",
        key: "appointmentType",
      },
      {
        displayName: "Appt. Mode",
        key: "appointmentMode",
      },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        type: "link",
        url: "/web/client/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        type: "50",
        isInfo: true
      },
      {
        displayName: "Rejected Remarks",
        key: "invitationAcceptRejectRemarks",
        type: "50",
        isInfo: true
      }
    ];

    this.invitedRejectedActionButtons = [];

    this.pendingAptfilterModel = new FilterModel();
    this.cancelledAptfilterModel = new FilterModel();
    this.upcomingAptfilterModel = new FilterModel();
    this.tentativeAptFilterModel = new FilterModel();
    this.allAppointmentsFilterModel = new FilterModel();
    this.allAppointmentsMeta = null;

    this.filterParamsForAppointent = {
      statusIds: [],
      appointmentTimeIntervalId: null,
      CareManagerIds: []
    };

    this.pendingDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        sticky: true
      },
      {
        displayName: "Patient",
        key: "fullName",
        type: "link",
        url: "/web/client/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
      {
        displayName: "Appt. Type",
        key: "appointmentType",
      },
      {
        displayName: "Appt. Mode",
        key: "appointmentMode",
      },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        type: "link",
        url: "/web/client/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        type: "50",
        isInfo: true
      },
      { displayName: "Actions", key: "Actions", width: "80px", sticky: true }
    ];

    this.pendingActionButtons = [
      { displayName: "Approve", key: "approve", class: "fa fa-check" },
      { displayName: "Cancel", key: "cancel", class: "fa fa-ban" }
    ];

    this.cancelledDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        sticky: true
      },
      {
        displayName: "Patient",
        key: "fullName",
        type: "link",
        url: "/web/client/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
      {
        displayName: "Appt. Type",
        key: "appointmentType",
      },
      {
        displayName: "Appt. Mode",
        key: "appointmentMode",
      },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        type: "link",
        url: "/web/client/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        type: "50",
        isInfo: true
      },
      { displayName: "Cancel Type", key: "cancelType", width: "140px" },
      { displayName: "Cancel Reason", key: "cancelReason", width: "180px" },
      { displayName: "Actions", key: "Actions", width: "60px", sticky: true }
    ];
    this.cancelledActionButtons = [];

    this.tentativeDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        sticky: true
      },
      {
        displayName: "Patient",
        key: "fullName",
        type: "link",
        url: "/web/client/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
      {
        displayName: "Appt. Type",
        key: "appointmentType",
      },
      {
        displayName: "Appt. Mode",
        key: "appointmentMode",
      },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        type: "link",
        url: "/web/client/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      { displayName: "Actions", key: "Actions", width: "80px", sticky: true }
    ];
    this.tentativeActionButtons = [];

    this.allAppointmentsDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        class: "",
        sticky: true,

      },
      {
        displayName: "Patient",
        key: "fullName",
        class: "",
        type: "link",
        url: "/web/client/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
      {
        displayName: "Appt. Type",
        key: "appointmentType",
      },
      {
        displayName: "Appt. Mode",
        key: "appointmentMode",
      },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        type: "link",
        url: "/web/client/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        type: "50",
        isInfo: true
      },
      // {
      //   displayName: "Rating",
      //   key: "rating",
      //   width: "110px",
      //   type: "rating"
      // },
      // {
      //   displayName: "Review",
      //   key: "review",
      //   width: "150px",
      //   type: "50"
      // },
      // { displayName: "Status", key: "statusName", width: "80px" },
      // { displayName: "Actions", key: "Actions", width: "50px" }
    ];
    this.allAppointmentsActionButtons = [
{
      displayName: "Waiting-room info",
      key: "video",
      class: "fa fa-wpforms fa-custom"
      //class:" fa fa-video-camera"
}
    ];
    this.lineChartData_appointments = [];

    (this.lineChartData_appointments = []), (this.masterStaffs = []);
  }

  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.currentLoginUserId = user.id;
          this.currentLocationId = user.currentLocationId;
          this.userRoleName =
            user && user.users3 && user.users3.userRoles.userType;
          //this.isAdmin = true;

          if (this.currentLoginUserId > 0) {
            //this.filterTaskParams.careManagerIds = [this.currentLoginUserId];
            // this.filterCareGapGraph.CareManagerIds = [this.currentLoginUserId];
            this.filterParamsForAppointent.CareManagerIds = [
              this.currentLoginUserId
            ];
            //this.filterAlerts.CareManagerIds = [this.currentLoginUserId];
            //this.filterParamsForEncounter.CareManagerIds = [this.currentLoginUserId];
            let CMIdArray = [];
            CMIdArray.push(this.currentLoginUserId);
            // this.filterParamsForHRA.careManagerIds = CMIdArray;
          }
          this.filterParamsForAppointent.CareManagerIds = [
            this.currentLoginUserId
          ];
          // this.filterAlerts.CareManagerIds = [this.currentLoginUserId];
        }
      }
    );
    this.getMasterData();
    this.getStaffsByLocation();
    this.getUserPermissions();
  }
  getMasterData() {
    const masterData = {
      masterdata:
        "CAREPLANSTATUSFILTER,APPOINTMENTIMEGRAPHFILTER,APPOINTMENTSTATUS,ENCOUNTERTYPES,ENCOUNTERGRAPHFILTER,MASTERTASKSTIMEINTERVAL,PATIENTCAREGAPSTATUS,ALERTSINDICATORFILTER,MASTERCAREGAPSTIMEINTERVAL,MASTERENROLLMENTTYPEFILTER"
    };
    this.appointmentGraphService
      .getMasterData(masterData)
      .subscribe((response: any) => {
        const staticEncTypes = [
          "Acute Care",
          "Wellness Visit",
          "Administrative",
          "Disease Management"
        ];

        this.masterTimeIntervalData = response.carePlanStatusFilter || [];
        this.masterAppointmenttimeIntervalData =
          response.appointmentTimeGraphFilter || [];
        this.masterAppointmentStatus = response.appointmentStatus || [];

        // this.masterEncountertimeIntervalData = response.encounterGraphfilter || [];
        this.masterTaskTimeIntervalData =
          response.masterTasksTimeInterval || [];
        // this.masterCareGapsStatus = response.patientCareGapStatus || [];
        // this.masterAlertTypes = response.masterLoadAlerts || [];
        // this.masterCareGapsTimeIntervalData = response.masterCareGapsTimeInterval || [];
        // this.masterEnrollmentTypeFilter = response.masterEnrollmentTypeFilter || [];

        let defaultTimeIntervalObj = this.masterTimeIntervalData.find(
          x => x.value == "Monthly"
        );
        // let defautlEncTimeIntervalObj = this.masterEncountertimeIntervalData.find(x => x.value == 'Weekly');
        let defaultAptTimeIntervalObj = this.masterAppointmenttimeIntervalData.find(
          x => x.value == "Monthly"
        );
        //   let defaultTaskTimeIntervalObj = this.masterTaskTimeIntervalData.find(x => (x.value || '').split('(')[0].trim() == 'Weekly');
        // let defaultCareGapStatusObj = this.masterCareGapsStatus.find(x => x.value.toLowerCase() == 'open');
        // let defaultCareGapIntervalObj = this.masterCareGapsTimeIntervalData.find(x => (x.value || '').split('(')[0].trim() == 'Weekly');
        // let defaultEnrollTypeObj = this.masterEnrollmentTypeFilter.find(x => x.value == 'All');

        //this.filterParams.timeIntervalFilterId = defaultTimeIntervalObj && defaultTimeIntervalObj.id;
        // this.filterAlerts.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
        // let idArray = this.masterAppointmentStatus.Select(x=>x.id);
        let idArray = this.masterAppointmentStatus.map(function(a) {
          return a.id;
        });
        this.filterParamsForAppointent.statusIds = idArray || [];

        // this.filterParamsForEncounter.encounterTimeIntervalId = defautlEncTimeIntervalObj && defautlEncTimeIntervalObj.id;
        this.filterParamsForAppointent.appointmentTimeIntervalId =
          defaultAptTimeIntervalObj && defaultAptTimeIntervalObj.id;
        //this.filterTaskParams.timeIntervalFilterId = defaultTaskTimeIntervalObj && defaultTaskTimeIntervalObj.id;
        //this.filterCareGapGraph.StatusIds = defaultCareGapStatusObj && defaultCareGapStatusObj.id;
        //  this.filterCareGapGraph.TimeIntervalId = defaultCareGapIntervalObj && defaultCareGapIntervalObj.id;
        //this.filterCareGapGraph.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;

        // this.filterParamsForEncounter.encounterTypeIds = (response.encounterTypes || []).filter(x => staticEncTypes.includes(x.value)).map(x => x.id);
        // this.filterParamsForEncounter.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
        // if (this.filterParams.timeIntervalFilterId > 0) {
        //   this.getDataForProgramEnrollesLineChart(this.filterParams)
        // }
        if (this.filterParamsForAppointent.appointmentTimeIntervalId > 0) {
          this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
        }

        // if (this.filterCareGapGraph.StatusIds > 0 && this.filterCareGapGraph.TimeIntervalId > 0) {
        //   this.getDataForCareGapStatusPieChart();
        // }

        // if (this.filterParamsForEncounter.encounterTimeIntervalId > 0) {
        //   this.getDataForEncounterLineChart(this.filterParamsForEncounter)
        // }

        // if (this.filterAlerts.EnrollmentId > 0) {
        //   this.getDataForAlertGraph();
        // }
        // this.viewEmptyEncounterGraph();
        // this.viewEmptyAppointmentGraph();
      });
  }
  onApptGraphCMSelect(event: any) {
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }
  onStatusSelect(event: any) {
    let statusIdArray = event.value;
    this.filterParamsForAppointent.statusIds = statusIdArray || [];
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }
  onAppointmenttimeInterval(event: any) {
    this.filterParamsForAppointent.appointmentTimeIntervalId = event.value;
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }
  onResetApptCMDropdown() {
    this.filterParamsForAppointent.CareManagerIds = [];
    this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
  }
  onTabChanged(event: any) {

    this.selectedIndex = event.index;
    this.showTooltip=false;
   if (event.index == 0) {
      this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
    } else if (event.index == 1) {
      this.showTooltip=true;
      this.getAllPatientAppointmentList();
    } else if (event.index == 2) {
      // this.getPendignPatientAppointmentList();
      this.getCancelledPatientAppointmentList();
    } else if (event.index == 3) {
      //this.getCancelledPatientAppointmentList();
      this.getPendingInvitedPatientAppointmentList();
    } else if (event.index == 4) {
      this.getPendingInvitedPatientAppointmentList();
    } else if (event.index == 5) {
      this.getAcceptedInvitedPatientAppointmentList();
    } else if (event.index == 6) {
      this.getRejectedInvitedPatientAppointmentList();
    }
    // else if (event.index == 4) {
    //   this.loadChild(InvitedPendingComponent, this.tabContentPendingInvitation);
    // } else if (event.index == 5) {
    //   this.loadChild(
    //     InvitedAcceptedComponent,
    //     this.tabContentAcceptedInvitation
    //   );
    // } else if (event.index == 6) {
    //   this.loadChild(
    //     InvitedRejectedComponent,
    //     this.tabContentRejectedInvitation
    //   );
    // }
  }
  loadChild(component: any, tabContent: ViewContainerRef) {
    let factory: any;
    factory = this.cfr.resolveComponentFactory(component);
    tabContent.clear();
    let comp: ComponentRef<
      InvitedPendingComponent
    > = tabContent.createComponent(factory);
    //comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this));
  }

  getDataForAppointmentLineChart(filterParamsForAppointent: any) {
    this.appointmentGraphService
      .getLineChartDataForAppointments(filterParamsForAppointent)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.lineChartDataForAppointment = response.data || [];
          // this.viewAppointmentLineGraph();
          if (
            this.lineChartDataForAppointment &&
            this.lineChartDataForAppointment.length > 0
          ) {
            this.viewAppointmentLineGraph();
          } else {
            this.showGraphAppointment = false;
          }
        } else {
          this.lineChartDataForAppointment = [];
        }
      });
  }
  getAllPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    const filters = {
      // locationIds: this.currentLocationId,
      // staffIds: (this.userRoleName || '').toUpperCase() == 'ADMIN' ? "" : this.currentLoginUserId,
      //fromDate: format(new Date(), "YYYY-MM-DD"),
      //toDate: format(addDays(new Date(), 720), "YYYY-MM-DD"),
      // status: 'Approved',
      pageNumber,
      pageSize
    };
    this.appointmentGraphService
      .getAcceptedOrApprovedAppointmentList(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {

          this.allAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.allAppointmentsList = (this.allAppointmentsList || []).map(x => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              y => y.staffName
            );
            console.log(this.allAppointmentsList)
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              y => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            (x["queryParamsPatientObj"] = {
              id:
                x.patientID > 0
                  ? this.commonService.encryptValue(x.patientID, true)
                  : null
            }),
              (x["queryParamsObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
                staffId: staffIds.join(","),
                date: format(x.startDateTime, "MM/DD/YYYY")
              });
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
        }
        this.allAppointmentsMeta.pageSizeOptions = [5,10,25,50,100];
      });
  }
  getPendignPatientAppointmentList() {
    this.appointmentGraphService
      .getPendingPatientAppointment(this.pendingAptfilterModel)
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
            (x["queryParamsPatientObj"] = {
              id:
                x.patientID > 0
                  ? this.commonService.encryptValue(x.patientID, true)
                  : null
            }),
              (x["queryParamsObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
                staffId: staffIds.join(","),
                date: format(x.startDateTime, "MM/DD/YYYY")
              });
            return x;
          });
          this.pendingAppointmentMeta = response.meta;
        } else {
          this.pendingPatientAppointment = [];
          this.pendingAppointmentMeta = null;
        }
      });
  }

  getCancelledPatientAppointmentList() {
    this.appointmentGraphService
      .getCancelledPatientAppointment(this.cancelledAptfilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.cancelledPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.cancelledPatientAppointment = (this
            .cancelledPatientAppointment || []
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
            (x["queryParamsPatientObj"] = {
              id:
                x.patientID > 0
                  ? this.commonService.encryptValue(x.patientID, true)
                  : null
            }),
              (x["queryParamsObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
                staffId: staffIds.join(","),
                date: format(x.startDateTime, "MM/DD/YYYY")
              });
            return x;
          });
          this.cancelledAppointmentMeta = response.meta;
        } else {
          this.cancelledPatientAppointment = [];
          this.cancelledAppointmentMeta = null;
        }
        this.cancelledAppointmentMeta.pageSizeOptions = [5,10,25,50,100];
      });
  }

  getTentativePatientAppointmentList() {
    this.appointmentGraphService
      .getTentativePatientAppointmentList(this.tentativeAptFilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.tentativePatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.tentativePatientAppointment = (this
            .tentativePatientAppointment || []
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
            (x["queryParamsPatientObj"] = {
              id:
                x.patientID > 0
                  ? this.commonService.encryptValue(x.patientID, true)
                  : null
            }),
              (x["queryParamsObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
                staffId: staffIds.join(","),
                date: format(x.startDateTime, "MM/DD/YYYY")
              });
            return x;
          });
          this.tentativeAppointmentMeta = response.meta;
        } else {
          this.tentativePatientAppointment = [];
          this.tentativeAppointmentMeta = null;
        }
      });
  }
  viewAppointmentLineGraph() {
    this.showGraphAppointment = true;
    let appointmentArrayMonth = Array.from(
      new Set(this.lineChartDataForAppointment.map(x => x.xAxis))
    ).map(xAxis => {
      let x = this.lineChartDataForAppointment.find(x => x.xAxis == xAxis);
      return {
        ...x
      };
    });
    let resultArrayAppointment = Array.from(
      new Set(this.lineChartDataForAppointment.map(x => x.appointmentStatus))
    )
      .sort()
      .map(appointmentStatus => {
        return this.lineChartDataForAppointment.find(
          x => x.appointmentStatus == appointmentStatus
        ).appointmentStatus;
      });

    if (resultArrayAppointment.includes("Accepted")) {
      resultArrayAppointment.push(resultArrayAppointment.shift());
    }
    let bgColors = resultArrayAppointment.map(appointmentStatus => {
      return this.lineChartDataForAppointment.find(
        x => x.appointmentStatus == appointmentStatus
      ).color;
    });

    this.lineChartLabels_appointments = [];
    this.lineChartOptions_appointments = {
      responsive: true,
      maintainAspectRatio: false
    };
    this.barChartColors_appointments = [
      { backgroundColor: "rgb(147, 238, 147)" },
      { backgroundColor: "rgb(122, 219, 131)" },
      { backgroundColor: "rgb(255, 132, 132)" },
      { backgroundColor: "rgb(116, 217, 255)" },
      { backgroundColor: "rgb(253, 209, 100)" }
    ];
    if ((bgColors || []).filter(x => x != null).length > 0) {
      this.barChartColors_appointments = (bgColors || []).map(c => {
        return { backgroundColor: c };
      });
    }
    if (appointmentArrayMonth.length > 0) {
      let sortedMonth = appointmentArrayMonth.sort((a, b) => {
        return (
          new Date(a.yearNumber).getTime() - new Date(b.yearNumber).getTime()
        );
      });
      this.lineChartLabels_appointments = sortedMonth
        .filter(x => x.xAxis != null)
        .map(({ xAxis, yearNumber }) => xAxis);
    }
    if (resultArrayAppointment && resultArrayAppointment.length > 0) {
      let newChartDataArray = [];
      for (let i = 0; i < resultArrayAppointment.length; i++) {
        newChartDataArray.push({
          label: resultArrayAppointment[i],
          data: this.lineChartDataForAppointment
            .filter(x => x.appointmentStatus == resultArrayAppointment[i])
            .sort((a, b) => {
              return a.monthNumber - b.monthNumber;
            })
            .map(({ appointmentCount }) => parseInt(appointmentCount)),
          fill: false,
          stack: "a"
        });
      }
      this.lineChartData_appointments = [...newChartDataArray];
    }
  }
  getStaffsByLocation(): void {
    const locId = this.currentLocationId.toString();
    this.appointmentGraphService
      .getStaffAndPatientByLocation(locId)
      .subscribe((response: any) => {
        if (response.statusCode == 200) {
          if ((this.userRoleName || "").toUpperCase() == "ADMIN") {
            this.masterStaffs = response.data.staff || [];
          }
          else {
            this.masterStaffs.push(response.data.staff.find(x => x.id == this.currentLoginUserId));
          }

        } else {
          this.masterStaffs = [];
        }
      });
  }
  onPendingPageOrSortChange(changeState?: any) {
    this.setPendingPaginatorModel(
      changeState.pageNumber,
      5,
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
  onUpcomingAptPageOrSortChange(changeState?: any) {
    this.setUpcomingPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getAllPatientAppointmentList(changeState.pageNumber, changeState.pageSize);
  }
  onTentativeAptPageOrSortChange(changeState?: any) {
    this.setTentativeAptPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getTentativePatientAppointmentList();
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
    this.cancelledAptfilterModel.pageNumber = pageNumber;
    this.cancelledAptfilterModel.pageSize = pageSize;
    this.cancelledAptfilterModel.sortOrder = sortOrder;
    this.cancelledAptfilterModel.sortColumn = sortColumn;
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
  setTentativeAptPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.tentativeAptFilterModel.pageNumber = pageNumber;
    this.tentativeAptFilterModel.pageSize = pageSize;
    this.tentativeAptFilterModel.sortOrder = sortOrder;
    this.tentativeAptFilterModel.sortColumn = sortColumn;
  }
  getUserPermissions() {
    const schedulerActionPermissions = this.appointmentGraphService.getUserScreenActionPermissions(
      "SCHEDULING",
      "SCHEDULING_LIST"
    );
    const {
      SCHEDULING_LIST_CANCEL_APPOINTMENT,
      SCHEDULING_LIST_APPROVE_APPOINTMENT
    } = schedulerActionPermissions;
    let userRole: string = "";
    this.commonService.userRole.subscribe(res => {
      userRole = res;
    });

    if ((userRole || "").toUpperCase() != "PROVIDER") {
      let spliceIndex = this.pendingActionButtons.findIndex(
        obj => obj.key == "approve"
      );
      this.pendingActionButtons.splice(spliceIndex, 1);
    }

    // if (!SCHEDULING_LIST_APPROVE_APPOINTMENT) {
    //   let spliceIndex = this.pendingActionButtons.findIndex(obj => obj.key == 'approve');
    //   this.pendingActionButtons.splice(spliceIndex, 1)
    // }
    if (!SCHEDULING_LIST_CANCEL_APPOINTMENT) {
      let spliceIndex = this.pendingActionButtons.findIndex(
        obj => obj.key == "cancel"
      );
      this.pendingActionButtons.splice(spliceIndex, 1);
    }
  }
  onTableActionClick(actionObj?: any) {



    const id = actionObj.data && actionObj.data.patientAppointmentId;
    switch ((actionObj.action || "").toUpperCase()) {
      case "APPROVE":
        const appointmentData = {
          id: id,
          status: "APPROVED"
        };
        this.createApproveAppointmentModel(appointmentData);
        break;
      case "CANCEL":
        this.cancelAppointmentDialog(id);
        break;

      default:
        break;
    }
  }
  onTableRowClick(actionObj?: any) {
    this.currentAppointmentId = actionObj.data.patientAppointmentId;
    this.currentPatientId = actionObj.data.patientID;

    if (this.selectedIndex == 1 && actionObj.action != "video") {
      this.onContextMenu(actionObj.action);
    }
    switch ((actionObj.action || "").toUpperCase()) {
      case "VIDEO":
        // this.router.navigate(["/web/encounter/soap"], {
        //   queryParams: {
        //     apptId: this.currentAppointmentId,
        //     encId: actionObj.data.patientEncounterId
        //   },
        // });
        // this.router.navigate(["/web/waiting-room/"+this.currentAppointmentId]);
        this.router.navigate(["/web/waiting-room/"], {
          queryParams: {
            id: this.commonService.encryptValue(this.currentAppointmentId,true)
          },
        });
        break;
      default:
        break;
    }
  }

  createApproveAppointmentModel(appointmentData: any) {
    let dbModal;
    dbModal = this.dailog.open(ApproveAppointmentDialogComponent, {
      hasBackdrop: true,
      data: appointmentData
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") {
        this.getPendignPatientAppointmentList();
      }
    });
  }
  cancelAppointmentDialog(id: number) {
    let dbModal;
    dbModal = this.dailog.open(CancelAppointmentDialogComponent, {
      hasBackdrop: true,
      data: id
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") {
        this.getPendignPatientAppointmentList();
      }
    });
  }

  getPendingInvitedPatientAppointmentList() {
    this.appointmentGraphService
      .getPendingInvitedPatientAppointment(this.invitedAptfilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.invitedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.invitedPatientAppointment = (this.invitedPatientAppointment || []
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
            (x["queryParamsPatientObj"] = {
              id:
                x.patientID > 0
                  ? this.commonService.encryptValue(x.patientID, true)
                  : null
            }),
              (x["queryParamsObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
                staffId: staffIds.join(","),
                date: format(x.startDateTime, "MM/DD/YYYY")
              });
            return x;
          });
          this.invitedAppointmentMeta = response.meta;
        } else {
          this.invitedPatientAppointment = [];
          this.invitedAppointmentMeta = null;
        }
        this.invitedAppointmentMeta.pageSizeOptions = [5,10,25,50,100];
      });
  }
  onPendingInvitationTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.patientAppointmentId;
    switch ((actionObj.action || "").toUpperCase()) {
      case "ACCEPT":
        const appointmentAcceptData = {
          title: "Accept",
          appointmentId: id,
          status: "Invitation_Accepted"
        };
        this.createAcceptRejectInvitationAppointmentModel(
          appointmentAcceptData
        );
        break;
      case "REJECT":
        const appointmentRejectData = {
          title: "Reject",
          appointmentId: id,
          status: "Invitation_Rejected"
        };
        this.createAcceptRejectInvitationAppointmentModel(
          appointmentRejectData
        );
        break;
      default:
        break;
    }
  }
  createAcceptRejectInvitationAppointmentModel(appointmentData: any) {
    let dbModal;
    dbModal = this.dailog.open(AcceptRejectAppointmentInvitationComponent, {
      hasBackdrop: true,
      data: appointmentData
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") {
        this.getPendingInvitedPatientAppointmentList();
      }
    });
  }
  getAcceptedInvitedPatientAppointmentList() {
    this.appointmentGraphService
      .getAcceptedInvitedPatientAppointment(this.invitedAcceptedAptfilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.invitedAcceptedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.invitedAcceptedPatientAppointment = (this
            .invitedAcceptedPatientAppointment || []
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
            (x["queryParamsPatientObj"] = {
              id:
                x.patientID > 0
                  ? this.commonService.encryptValue(x.patientID, true)
                  : null
            }),
              (x["queryParamsObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
                staffId: staffIds.join(","),
                date: format(x.startDateTime, "MM/DD/YYYY")
              });
            return x;
          });
          this.invitedAcceptedAppointmentMeta = response.meta;
        } else {
          this.invitedAcceptedPatientAppointment = [];
          this.invitedAcceptedAppointmentMeta = null;
        }
      });
  }
  onContextMenu($event: MouseEvent) {

    this.contextMenuService.show.next({
      anchorElement: $event.target,
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.contextMenu,
      event: <any>$event,
      item: 5

    });

    $event.preventDefault();
    $event.stopPropagation();
  }
  openDialogBookAppointment(staffId: number, providerId: string, type: boolean) {

    let dbModal;
    dbModal = this.dailog.open(AppointmentReschedulingDialogComponent, {
      hasBackdrop: true, minWidth: '50%', maxWidth: '50%',
      data: {
        staffId: staffId,
        userInfo: null,
        providerId: providerId,
        locationId: this.currentLocationId || 0,
        isNewAppointment: type,
        appointmentId: type ? 0 : this.currentAppointmentId,
        patientId: type ? 0 : this.currentPatientId
      }
    });
    dbModal.afterClosed().subscribe((result: string) => {

      if (result != null && result != "close") {
        if (result == "booked") {
        }
      }
      else {
        this.getAllPatientAppointmentList();
      }
    });
  }
  createCancelAppointmentModel(appointmentId: number) {
    const modalPopup = this.dailog.open(
      CancelAppointmentDialogComponent,
      {
        hasBackdrop: true,
        data: appointmentId,
      }
    );

    modalPopup.afterClosed().subscribe((result) => {

    });
  }
  createViewAppointmentModel(appointmentId: number) {
    const modalPopup = this.dailog.open(
      AppointmentViewComponent,
      {
        hasBackdrop: true,minWidth: '80%', maxWidth: '80%',
        data: appointmentId,

      }
    );

    modalPopup.afterClosed().subscribe((result) => {

    });
  }
  createAddPersonModel(appointmentId: number, sessionId: number) {

    const modalPopup = this.dailog.open(AddNewCallerComponent, {
      hasBackdrop: true,
      data: { appointmentId: appointmentId, sessionId: sessionId },
    });
  }
  addEvent(event: any, type: any): void {


    switch (type) {
      case '1':
        this.openDialogBookAppointment(this.currentLoginUserId, this.currentLoginUserId.toString(), true)
        break;
      case '2':
        this.createViewAppointmentModel(this.currentAppointmentId);
        break;
      case '3':
        this.openDialogBookAppointment(this.currentLoginUserId, this.currentLoginUserId.toString(), false)
        break;
      case '4':
         this.createCancelAppointmentModel(this.currentAppointmentId);
        break;
      case '5':
        const modalPopup = this.dailog.open(SetReminderComponent, {
          hasBackdrop: true,
          data: { appointmentId: this.currentAppointmentId },
        });

        modalPopup.afterClosed().subscribe((result) => {
          if (result === "save") { }
        });
        break;

      case '6':
        if ((this.userRoleName || '').toUpperCase() == 'ADMIN') {
          this.router.navigate(["/web/manage-users/users"]);
        }
        else if ((this.userRoleName || '').toUpperCase() == 'PROVIDER' || (this.userRoleName || '').toUpperCase() == 'STAFF') {
          localStorage.setItem('tabToLoad', "Availability");
          this.router.navigate(["/web/manage-users/user"], {
            queryParams: {
              id: this.commonService.encryptValue(this.currentLoginUserId),
            },
          });
        }
        break;
      case '7':

        this.addNewCallerService
          .getOTSessionByAppointmentId(this.currentAppointmentId)
          .subscribe((response) => {
            if (response.statusCode == 200) {
              this.createAddPersonModel(
                this.currentAppointmentId,
                response.data.id
              );
            }
          });
        break;


    }

  }
  getRejectedInvitedPatientAppointmentList() {
    this.appointmentGraphService
      .getRejectedInvitedPatientAppointment(this.invitedRejectedAptfilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.invitedRejectedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.invitedRejectedPatientAppointment = (this
            .invitedRejectedPatientAppointment || []
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
            (x["queryParamsPatientObj"] = {
              id:
                x.patientID > 0
                  ? this.commonService.encryptValue(x.patientID, true)
                  : null
            }),
              (x["queryParamsObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
                staffId: staffIds.join(","),
                date: format(x.startDateTime, "MM/DD/YYYY")
              });
            return x;
          });
          this.invitedRejectedAppointmentMeta = response.meta;
        } else {
          this.invitedRejectedPatientAppointment = [];
          this.invitedRejectedAppointmentMeta = null;
        }
      });
  }
  onPendingInvitationPageOrSortChange(changeState?: any) {
    this.setInvitePendingPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getPendingInvitedPatientAppointmentList();
  }
  setInvitePendingPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.invitedAptfilterModel.pageNumber = pageNumber;
    this.invitedAptfilterModel.pageSize = pageSize;
    this.invitedAptfilterModel.sortOrder = sortOrder;
    this.invitedAptfilterModel.sortColumn = sortColumn;
  }
  onAcceptedInvitationPageOrSortChange(changeState?: any) {
    this.setInviteAcceptedPaginatorModel(
      changeState.pageNumber,
      5,
      changeState.sort,
      changeState.order
    );
    this.getAcceptedInvitedPatientAppointmentList();
  }
  setInviteAcceptedPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.invitedAcceptedAptfilterModel.pageNumber = pageNumber;
    this.invitedAcceptedAptfilterModel.pageSize = pageSize;
    this.invitedAcceptedAptfilterModel.sortOrder = sortOrder;
    this.invitedAcceptedAptfilterModel.sortColumn = sortColumn;
  }
  onRejectedInvitationPageOrSortChange(changeState?: any) {
    this.setInviteRejectedPaginatorModel(
      changeState.pageNumber,
      5,
      changeState.sort,
      changeState.order
    );
    this.getRejectedInvitedPatientAppointmentList();
  }
  setInviteRejectedPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.invitedRejectedAptfilterModel.pageNumber = pageNumber;
    this.invitedRejectedAptfilterModel.pageSize = pageSize;
    this.invitedRejectedAptfilterModel.sortOrder = sortOrder;
    this.invitedRejectedAptfilterModel.sortColumn = sortColumn;
  }
}
