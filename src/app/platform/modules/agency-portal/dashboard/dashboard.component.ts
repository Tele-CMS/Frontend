import { SchedulingRoutingModule } from './../../scheduling/scheduling-routing.module';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { FilterModel, ResponseModel } from '../../../../super-admin-portal/core/modals/common-model';
import { EncounterModel, AuthorizationModel, DashboardModel, ClientStatusChartModel } from './dashboard.model';
import { Metadata } from '../../core/modals/common-model';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services';
import { merge, Subscription, Subject } from 'rxjs';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { addDays, format, isSameMonth } from 'date-fns';
import { AuthenticationService } from '../../../../super-admin-portal/auth/auth.service';
import { LoginUser } from '../../core/modals/loginUser.modal';
import { SchedulerService } from '../../scheduling/scheduler/scheduler.service';
import { UsersService } from '../users/users.service';
import { StaffProfileModel } from '../users/users.model';
import { UrgentCareListingdialogComponent } from 'src/app/shared/urgentcarelisting-dialog/urgentcarelisting-dialog.component';
import { AppointmentGraphService } from 'src/app/shared/appointment-graph/appointment-graph.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  encFilterModel: FilterModel;
  encounterList: Array<EncounterModel> = [];
  dashboardData: DashboardModel;
  clientStatusChartData: Array<ClientStatusChartModel> = [];
  encMeta: Metadata;
  subscription: Subscription;
  isAuth: boolean = true;
  status: boolean = false;
  passwordExpiryColorCode: string = '';
  passwordExpiryMessage: string = '';
  showMessage: boolean = true;
  accessToken = 'YOUR_ACCESS_TOKEN';
  message: Subject<any> = new Subject();
  pendingAppointmentMeta: Metadata;
  cancelledAppointmentMeta: Metadata;
  tentativeAppointmentMeta: Metadata;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  aprovedAppointmentsDisplayedColumns: Array<any>;
  aprovedAppointmentsActionButtons: Array<any>;
  pendingDisplayedColumns: Array<any>;
  pendingActionButtons: Array<any>;
  cancelledDisplayedColumns: Array<any>;
  cancelledActionButtons: Array<any>;
  pendingAptfilterModel: FilterModel;
  cancelledAptfilterModel: FilterModel;
  pendingPatientAppointment: Array<any> = [];
  cancelledPatientAppointment: Array<any> = [];
  selectedIndex: number = 0
  //Charts
  lineChartData: Array<any> = [
    { data: [], label: '' },
    { data: [], label: '' }
  ];
  lineChartLabels: Array<any> = [];
  lineChartType: string = 'line';
  headerText: string = 'Authorization';
  userId:string;
  staffId:number;
  urgentcareapptid:number;
showurgentcarebtn:boolean=false;
staffProfile: StaffProfileModel;
userRoleName: any;
appointmentTime1: any;
chiefComplaint1: any;
duration1: any;
appointmentTime2: any;
chiefComplaint2: any;
duration2: any;
allAppointmentsList: any = [];

  constructor(private dashoboardService: DashboardService, private route: Router, private commonService: CommonService,
    private schedulerService: SchedulerService,private userService: UsersService, private dialogModal: MatDialog, private appointmentGraphService: AppointmentGraphService) {
    this.encFilterModel = new FilterModel();
    this.encMeta = new Metadata();
    this.dashboardData = new DashboardModel();
    this.staffProfile = new StaffProfileModel()
    // this.encDisplayedColumns = [
    //   { displayName: 'Practitioner', key: 'staffName', class: '', width: '20%' },
    //   { displayName: 'Patient Name', key: 'clientName', class: '', width: '20%' },
    //   { displayName: 'Day', key: 'day', width: '10%' },
    //   { displayName: 'DOS', key: 'dateOfService', width: '20%', type: 'date' },
    //   { displayName: 'Status', key: 'status', width: '20%' },
    //   { displayName: 'Actions', key: 'Actions', width: '10%' }
    // ];
    // this.encActionButtons = [
    //   { displayName: 'View', key: 'view', class: 'fa fa-eye' }
    // ];
    this.pendingAptfilterModel = new FilterModel();
    this.cancelledAptfilterModel = new FilterModel();
    this.pendingDisplayedColumns = [
      { displayName: 'Provider', key: 'staffName', width: '110px', sticky: true },
      { displayName: 'Patient Name', key: 'fullName', width: '120px', type: 'link', url: '/web/client/profile', queryParamsColumn: 'queryParamsPatientObj', sticky: true },
      { displayName: 'Appt. Type', key: 'appointmentType', width: '80px' },
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
      { displayName: 'Appt. Type', key: 'appointmentType', width: '80px' },
      { displayName: 'Date Time', key: 'dateTimeOfService', width: '200px', type: 'link', url: '/web/client/scheduling', queryParamsColumn: 'queryParamsObj' },
      { displayName: 'Cancel Type', kefy: 'cancelType', width: '140px' },
      { displayName: 'Cancel Reason', key: 'cancelReason', width: '150px' },
      { displayName: 'Actions', key: 'Actions', width: '60px', sticky: true }
    ]
    this.cancelledActionButtons = [];

    this.aprovedAppointmentsDisplayedColumns = [
        { displayName: 'Practitioner', key: 'staffName', class: '', width: '20%' },
      { displayName: 'Patient Name', key: 'clientName', class: '', width: '20%' },
      { displayName: 'Day', key: 'day', width: '10%' },
      { displayName: 'DOS', key: 'dateOfService', width: '20%', type: 'date' },
      { displayName: 'Status', key: 'status', width: '20%' },
      { displayName: 'Actions', key: 'Actions', width: '10%' }
    ]
    this.aprovedAppointmentsActionButtons = [];
  }

  ngOnInit() {
    this.commonService.loginUser.subscribe((user: LoginUser) => {

      if (user.data) {
          this.staffId = user.data.staffLocation[0].staffId;
          this.userId=user.data.userID
          this.userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        // if ((userRoleName || "").toUpperCase() === "PROVIDER") {
        //   this.getLastUrgentCareCallStatus();
        // }
      }
    });

    this.getEncounterListForDashboard();
    this.getDashboardBasicInfo();
    this.getPasswordExpiryMessage();
    this.getStaffProfileData();
    this.getAllPatientAppointmentList();
  }


  gotoscheduler(month:any,appttype:any,apptmode:any){

    this.route.navigate(["/web/scheduling"], { queryParams: { calendermonth: month,appttype:appttype,apptmode:apptmode } });
  }
  gotopayments(){
    this.route.navigate(["/web/payment/payment-history"]);
  }

  gotoschedulermonth(month:any){

    this.route.navigate(["/web/scheduling"], { queryParams: { calendermonth: month} });
  }
  gotoschedulertoday(currentdayview:any){

    this.route.navigate(["/web/scheduling"], { queryParams: { currentdayview: currentdayview} });
  }
  gotoschedulerTotal(){

    this.route.navigate(["/web/scheduling"]);
  }

  gotopaymentslastmonth(monthstatus:any){
    this.route.navigate(["/web/payment/payment-history"],{queryParams:{monthstatus:monthstatus}});
  }

  hideMessageClick() {
    this.showMessage = false;
  }
  changeWidget(value: string = '') {
    if (value == 'authorization') {
      this.isAuth = true;
      this.headerText = 'Authorization';
    }
    else if (value == 'clientstatus') {
      this.getClientStatusChart();
    }
  }


  onTabChanged(event: any) {
    this.selectedIndex = event.value
    if (event.index == 0) {
      // this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
      this.getEncounterListForDashboard();
    } else if (event.index == 1) {
      this.getPendignPatientAppointmentList();
    } else if (event.index == 2) {
      this.getCancelledPatientAppointmentList();
    }
    // else if (event.index == 3) {
    // } else if (event.index == 4) {
    //   this.getTentativePatientAppointmentList();
    // }
  }

  getEncounterListForDashboard() {
    this.dashoboardService.getEncounterListForDashboard(this.encFilterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.encounterList = response.data != null && response.data.length > 0 ? response.data : [];
        this.encMeta = response.meta;
      }
    });
  }
  getPendignPatientAppointmentList() {

    this.dashoboardService.getPendingPatientAppointment(this.pendingAptfilterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.pendingPatientAppointment = response.data != null && response.data.length > 0 ? response.data : [];
        this.pendingAppointmentMeta = response.meta;
      }
      else {
        this.pendingPatientAppointment = [];
        this.pendingAppointmentMeta = null;
      }
    })
  }

  getLastUrgentCareCallStatus() {

    this.schedulerService.getLastUrgentCareCallStatus( this.userId).subscribe(response => {
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
    this.route.navigate(["/web/encounter/soap"], {
      queryParams: {
        apptId: this.urgentcareapptid,
        encId: 0
      },
    });
  }


  onPendingPageOrSortChange(changeState?: any) {
    this.setPendingPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getPendignPatientAppointmentList();
  }
  onCancelledPageOrSortChange(changeState?: any) {
    this.setCancelledPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getCancelledPatientAppointmentList();
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
  getCancelledPatientAppointmentList() {
    this.dashoboardService.getCancelledPatientAppointment(this.cancelledAptfilterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.cancelledPatientAppointment = response.data != null && response.data.length > 0 ? response.data : [];
        this.cancelledAppointmentMeta = response.meta;
      }
      else {
        this.cancelledPatientAppointment = [];
        this.cancelledAppointmentMeta = null;
      }
    })
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

  getDashboardBasicInfo() {
    this.dashoboardService.getDashboardBasicInfo().subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {

        this.dashboardData = response.data != null ? response.data : new DashboardModel();
      }
    });
  }
  getClientStatusChart() {
    this.dashoboardService.getClientStatusChart().subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.isAuth = false;
        this.headerText = 'Patient Status';
        this.clientStatusChartData = response.data != null ? response.data : new ClientStatusChartModel();
        if (this.clientStatusChartData.length > 0) {
          this.lineChartLabels = this.clientStatusChartData.map(({ registeredDate }) => format(registeredDate, 'MM/DD/YYYY'));
          this.lineChartData = [
            { data: this.clientStatusChartData.map(({ active }) => active), label: 'Active' },
            { data: this.clientStatusChartData.map(({ inactive }) => inactive), label: 'Inactive' },
          ];
        }
      }
    });
  }
  onEncPageOrSortChange(changeState?: any) {
    this.setEncPaginatorModel(changeState.pageNumber, this.encFilterModel.pageSize, changeState.sort, changeState.order);
    this.getEncounterListForDashboard();
  }

  onEncTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.name,
    appointmentId = actionObj.data && actionObj.data.patientAppointmentId,
    patientEncounterId = actionObj.data && actionObj.data.id,
    isBillableEncounter = actionObj.data && actionObj.data.isBillableEncounter;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'VIEW':
      const redirectUrl = isBillableEncounter ? "/web/waiting-room/" : "/web/encounter/non-billable-soap";
      if(isBillableEncounter){
        this.route.navigate(["/web/waiting-room/"+appointmentId]);
      }else {
      this.route.navigate([redirectUrl], {
        queryParams: {
          apptId: appointmentId,
          encId: patientEncounterId
        }
      });
    }
        break;
      default:
        break;
    }
  }
  setEncPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.encFilterModel.pageNumber = pageNumber;
    this.encFilterModel.pageSize = pageSize;
    this.encFilterModel.sortOrder = sortOrder;
    this.encFilterModel.sortColumn = sortColumn;
  }

  getStaffProfileData() {

    this.userService.getStaffProfileData(this.staffId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {

        this.staffProfile = response.data;
      }
    });
  }

  opentermconditionmodal() {
    let dbModal;
    dbModal = this.dialogModal.open(UrgentCareListingdialogComponent, {
      hasBackdrop: true,
      width: '60%'
    });
    dbModal.afterClosed().subscribe((result: string) => {
      //
      if (result != null && result != "close") {

      }
      //this.show=true;
    });
  }

  getAllPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    const filters = {
      // locationIds: this.currentLocationId,
      staffIds: (this.userRoleName || '').toUpperCase() == 'ADMIN' ? "" : this.userId,
      fromDate: format(new Date(), "YYYY-MM-DD"),
      toDate: format(addDays(new Date(), 1), "YYYY-MM-DD"),
      status: 'Approved',
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

              if(this.allAppointmentsList.length > 0){
                const today = new Date();
                this.allAppointmentsList = this.allAppointmentsList.filter(obj => new Date(obj['startDateTime']) >= today);
if(this.allAppointmentsList.length > 0){
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
              // format(x.startDateTime, "MM/DD/YYYY") +
              // " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A");
              //+ ")";
            return x;
          });

          this.appointmentTime1 = this.allAppointmentsList[0].dateTimeOfService;
          if(this.allAppointmentsList.length > 1){
            this.appointmentTime2 = this.allAppointmentsList[1].dateTimeOfService;
          }
        }
      }
        }
      });
  }

}
