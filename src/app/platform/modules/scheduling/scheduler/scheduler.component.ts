import { TextChatService } from "./../../../../shared/text-chat/text-chat.service";
import { AppService } from "./../../../../app-service.service";
import { EncounterService } from "./../../agency-portal/encounter/encounter.service";
import { AddNewCallerService } from "./../../../../shared/add-new-caller/add-new-caller.service";
import { AddNewCallerComponent } from "./../../../../shared/add-new-caller/add-new-caller.component";
import { MatMenuTrigger } from '@angular/material';
import { ContextMenuService } from 'ngx-contextmenu';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { SetReminderComponent } from './../../../../shared/set-reminder/set-reminder.component'
import { SetReminderService } from './../../../../shared/set-reminder/set-reminder.service'
// import { BookAppointmentComponent } from "./../../../../front/book-appointment/book-appointment.component";
import { StaffAppointmentComponent } from "../../../../shared/staff-appointment/staff-appointment.component";





import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";

import { HttpClient, HttpParams } from "@angular/common/http";
import { count, map } from "rxjs/operators";
import {

  CalendarEvent,
  CalendarView,
  CalendarDateFormatter,
  CalendarEventAction,
  CalendarWeekViewBeforeRenderEvent,
  CalendarMonthViewDay,
  CalendarDayViewBeforeRenderEvent,
  CalendarEventTimesChangedEvent,
} from "angular-calendar";
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  getHours,
  getMinutes,
  addMinutes,
} from "date-fns";
import { Observable, Subscription, Subject } from "rxjs";
import { SchedulerService } from "./scheduler.service";
import { CommonService } from "../../core/services";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { MatSelect, MatDialog } from "@angular/material";
import { AppointmentModel, AppointmentStaff } from "./scheduler.model";
import { SchedulerDialogComponent } from "./scheduler-dialog/scheduler-dialog.component";
import { CustomDateFormatter } from "./custom-date-formatter.provider";
import { NotifierService } from "angular-notifier";
import { CancelAppointmentDialogComponent } from "./cancel-appointment-dialog/cancel-appointment-dialog.component";
import { DialogService } from "../../../../shared/layout/dialog/dialog.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { AppointmentViewComponent } from "../appointment-view/appointment-view.component";
import { DatePipe } from "@angular/common";
import { ResponseModel } from "../../core/modals/common-model";
import { ApproveAppointmentDialogComponent } from "src/app/shared/approve-appointment-dialog/approve-appointment-dialog.component";
import { AppointmentReschedulingDialogComponent } from "src/app/shared/appointment-rescheduling-dialog/appointment-rescheduling-dialog.component";
import { CallInitModel, CallStatus } from "src/app/shared/models/callModel";
import { HubService } from "../../main-container/hub.service";

interface Appointment {
  patientAppointmentId: number;
  patientName?: string;
  color?: string;
  fontColor?: string;
  startDateTime?: string;
  endDateTime?: string;
  cancelTypeId?: number;
  claimId?: number;
  canEdit?: boolean;
  patientEncounterId: number;
  statusName?: string;
  appointmentStaffs?: any;
  isBillable?: boolean;
  isTelehealthAppointment?: boolean;
  patientID: number;
  invitationAppointentId: number;
  invitedStaffs?: any;

  // patientAppointmentId: 4094,
  // "startDateTime":"2018-09-19T12:00:50",
  // "endDateTime":"2018-09-19T13:00:50",
  // "appointmentTypeName":"Appointment Type Test1",
  // "appointmentTypeID":122,
  // "color":"#3e89cf",
  // "fontColor":"#575757",
  // "defaultDuration":0.0,
  // "isBillable":true,
  // "patientName":"Rose Warren",
  // "patientID":733,
  // "patientEncounterId":899,
  // "claimId":555,
  // "canEdit":false,
  // "patientAddressID":764,
  // "serviceLocationID":1,
  // "appointmentStaffs":[{"staffId":170,"staffName":"Stephen Baker","isDeleted":false}],
  // "isClientRequired":true,
  // "isRecurrence":false,
  // "offSet":0,
  // "allowMultipleStaff":false,
  // "cancelTypeId":0,
  // "isExcludedFromMileage":false,
  // "isDirectService":true,
  // "patientPhotoThumbnailPath":"",
  // "statusId":358372,
  // "statusName":"Approved",
  // "address":"4468 Broadway  #55 New York NY US 10040",
  // "latitude":40.857074,
  // "longitude":-73.932058999999981,
  // "isTelehealthAppointment":false
}

interface OfficeTime {
  dayStartHour: string;
  dayStartMinute: string;
  dayEndHour: string;
  dayEndMinute: string;
}

function getTimezoneOffsetString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const hoursOffset = String(
    Math.floor(Math.abs(timezoneOffset / 60))
  ).padStart(2, "0");
  const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, "0");
  const direction = timezoneOffset > 0 ? "-" : "+";
  return `T00:00:00${direction}${hoursOffset}${minutesOffset}`;
}

@Component({
  selector: "app-scheduler",
  templateUrl: "./scheduler.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./scheduler.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class SchedulerComponent implements OnInit, OnDestroy {
  // @ViewChild(MatMenuTrigger)
  contextMenu: ContextMenuComponent;
  appointId: number = 0;
  currentAppointmentId: number = 0;
  currentPatientId: number = 0;
  currentStaff: number = 0
  currentNotes:'';
  userRole: any;
  contextMenuPosition = { x: '0', y: '0' };
  openContextMenu: boolean = true;
  apptObj: any;
  calendarObj: any;

  private subscription: Subscription;

  view: CalendarView = CalendarView.Month;

  CalendarView;

  viewDate: Date = new Date();

  events$: Observable<Array<CalendarEvent<{ appointment: Appointment }>>>;

  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject();

  isPatientScheduler: boolean = false;
  patientSchedulerId: number;
  // scheduler data
  officeTime: OfficeTime;
  officeLocations: Array<any>;
  officeStaffs: Array<any>;
  officeClients: Array<any>;
  selectedOfficeLocations: Array<any>;
  selectedOfficeStaffs: Array<any>;
  selectedOfficeClients: Array<any>;
  currentLocationId: string;
  currentLoginUserId: string;
  staffsAvailibility: any;
  isCheckedValidate: boolean = false;
  isCheckedAuthorization: boolean = false;
  isRequestFromPatientPortal: boolean;
  isAdminLogin: boolean;
  isClientLogin: boolean;
  appointmentType: any = ["View Appointment", "Reshedule", "Cancel Appointment", "Set Reminder", "Set Availability", "New/followup Appointment", "Invite"];
  schedulerPermissions: any;
  statusColors: Array<any>;
  EVENT_LIMIT = 3;
  showAllEventDaysArray: number[] = [];
  defaultState: String = "";
  sub: Subscription;
  isWaitingRoomScreen = false;
  waitingRoomApptId: number;
  isFirstLoad = true;
  waitingRoomApptPatientId: number;
  waitingRoomApptStaffId: number;
  bookingAvailableDates: string[] =[];
  isRescheduleShow = false;
  appttype:string;
  apptmode:string;
  currentdayview:string;
  flag: boolean = false;
  userId: any;
  appointmentId: any;
  patientAppointmentDetails: any;
  constructor(
    private http: HttpClient,
    private appointmentDailog: MatDialog,
    private schedulerService: SchedulerService,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private addNewCallerService: AddNewCallerService,
    private encounterService: EncounterService,
    private appService: AppService,
    private textChatService: TextChatService,
    private contextMenuService: ContextMenuService,
    private date: DatePipe,
    private cdr:ChangeDetectorRef,
    private hubService: HubService,
  ) {


    this.activatedRoute.queryParams.subscribe((params) => {

      if (this.router.url.includes("/web/client/scheduling") && params.id) {
        const decrptId = this.commonService.encryptValue(params.id, false),
          patientId = parseInt(decrptId, 10);
        this.isPatientScheduler = true;
        this.selectedOfficeClients = [patientId];
        this.patientSchedulerId = patientId;
      } else {
        this.isPatientScheduler = false;
        this.selectedOfficeClients = [];
        this.patientSchedulerId = null;

         this.isWaitingRoomScreen  = (this.activatedRoute.snapshot.url[0] && this.activatedRoute.snapshot.url[0].path == "reshedule") ? true : false;
         if(this.isWaitingRoomScreen){
          this.route.paramMap.subscribe(paramMap =>{
            const apptStr = this.commonService.encryptValue(paramMap.get('id'),false);

         this.waitingRoomApptId = Number(apptStr);
         this.currentAppointmentId = this.waitingRoomApptId;
          })
        //  const apptStr = this.activatedRoute.snapshot.paramMap.get('id');
        // this.waitingRoomApptId = Number(apptStr);
        //  this.currentAppointmentId = this.waitingRoomApptId;

         }
      }
    });

    this.CalendarView = CalendarView;

    this.officeLocations = [];
    this.officeStaffs = [];
    this.officeClients = [];
    this.selectedOfficeLocations = [];
    this.selectedOfficeStaffs = [];
    this.staffsAvailibility = null;
    this.statusColors = [
      { name: "pending", color: "#74d9ff" },
      { name: "approved", color: "#93ee93" },
      { name: "cancelled", color: "#ff8484" },
      { name: "Accepted", color: "rgb(179, 236, 203)" },
      { name: "Tentative", color: "rgb(253, 209, 100)" },
    ];
    this.officeTime = {
      dayStartHour: "00",
      dayStartMinute: "00",
      dayEndHour: "23",
      dayEndMinute: "59",
    };
  }
  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;



  onCreated() { }
  public onContextMenu($event: any, selectedEvent: CalendarEvent = null, rescheduleDate: null | Date = null): void {

    if (rescheduleDate && this.isWaitingRoomScreen) {
      this.isRescheduleShow = this.isBoolingDateAvailable(rescheduleDate);
    }

    this.appointId = ($event.target.className.toLowerCase().indexOf("cal-event") == 0 ||
      $event.target.className.toLowerCase().indexOf("appt-blk") == 0
      || $event.target.className.toLowerCase().indexOf("month-event-txt-s") == 0) ? 1 : 0;
    if ($event.target.className.indexOf("material-icons") != 0 && $event.target.className.indexOf("cal-event-title") != 0) {
      this.contextMenuService.show.next({
        anchorElement: $event.target,
        // Optional - if unspecified, all context menu components will open
        contextMenu: this.contextMenu,
        event: <any>$event,
        item: 5

      });

      if (selectedEvent && selectedEvent.meta) {
        localStorage.setItem('apptId', this.commonService.encryptValue(selectedEvent.meta.patientAppointmentId,true));
        this.currentAppointmentId = selectedEvent.meta.patientAppointmentId;
        this.currentStaff=selectedEvent.meta.appointmentStaffs!=null?selectedEvent.meta.appointmentStaffs[0].staffId:0
        this.currentNotes=selectedEvent.meta.notes;
      }

      $event.preventDefault();
      $event.stopPropagation();
    }

  }
  openDialogBookAppointment(staffId: number, providerId: string, type: boolean) {
 if(this.isWaitingRoomScreen){
  this.currentAppointmentId = this.waitingRoomApptId;
  staffId = this.waitingRoomApptStaffId;
  providerId = this.waitingRoomApptStaffId + "";
 }
    let dbModal;
    dbModal = this.appointmentDailog.open(StaffAppointmentComponent, {
      hasBackdrop: true, minWidth: '70%', maxWidth: '70%',
      data: {
        staffId: staffId,
        userInfo: null,
        providerId: providerId,
        locationId: this.currentLocationId || 0,
        isNewAppointment: type,
        appointmentId: type ? 0 : this.currentAppointmentId,
        patientId: type ? 0 : this.currentPatientId,
        currentNotes:type?'':this.currentNotes
      }
    });
    dbModal.afterClosed().subscribe((result: string) => {

      if (result != null && result != "close") {
        if (result == "booked") {
        }
      }
      else {
        this.fetchEvents();
      }
    });
  }

openDialogRecheduleAppointment(staffId: number, providerId: string, type: boolean) {
  if(this.isWaitingRoomScreen){
   this.currentAppointmentId = this.waitingRoomApptId;
   staffId = this.waitingRoomApptStaffId;
   providerId = this.waitingRoomApptStaffId + "";
  }
     let dbModal;
     dbModal = this.appointmentDailog.open(AppointmentReschedulingDialogComponent, {
       hasBackdrop: true, minWidth: '50%', maxWidth: '50%',
       data: {
         staffId: staffId,
         userInfo: null,
         providerId: providerId,
         locationId: this.currentLocationId || 0,
         isNewAppointment: type,
         appointmentId: type ? 0 : this.currentAppointmentId,
         patientId: type ? 0 : this.currentPatientId,
         currentNotes:type?'':this.currentNotes
       }
     });
     dbModal.afterClosed().subscribe((result: string) => {

       if (result != null && result != "close") {
         if (result == "booked") {
         }
       }
       else {
         this.fetchEvents();
       }
     });
   }

  addEvent(event: any, type: any): void {

    let id = this.currentAppointmentId;
    var appStaff = this.isClientLogin ? this.currentStaff : parseInt(this.currentLoginUserId);

    switch (type) {
      case '1':

        this.openDialogBookAppointment(parseInt(this.currentLoginUserId), this.currentLoginUserId, true)
        break;

      case '2':
        this.createViewAppointmentModel(id);
        break;
      case '3':
        this.openDialogRecheduleAppointment(appStaff, appStaff.toString(), false)
        break;
      case '4':
        this.createCancelAppointmentModel(id);
        break;
      case '5':
        const modalPopup = this.appointmentDailog.open(SetReminderComponent, {
          hasBackdrop: true,
          data: { appointmentId: id },
        });

        modalPopup.afterClosed().subscribe((result) => {
          if (result === "save") this.fetchEvents();
        });
        break;

      case '6':
        if (this.userRole == 'ADMIN') {
          this.router.navigate(["/web/manage-users/users"]);
        }
        else if (this.userRole == 'PROVIDER' || this.userRole == 'STAFF') {
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
          .getOTSessionByAppointmentId(id)
          .subscribe((response) => {
            if (response.statusCode == 200) {
              this.createAddPersonModel(
                id,
                response.data.id
              );
            }
          });
        break;


    }

  }
  //activates the menu with the coordinates
  // onrightClick(event) {
  //   event.preventDefault();
  //   this.contextMenuPosition.x = event.clientX ;
  //   this.contextMenuPosition.y = event.clientY ;
  //   this.contextMenu.menuData = { 'item': "djfhdf" };
  //   this.contextMenu.menu.focusFirstItem('mouse');
  //   this.contextMenu.openMenu();
  // }
  //disables the menu
  disableContextMenu() {
    this.contextmenu = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
//code by ali
this.appService.call.subscribe((callInitModel: CallInitModel) => { 
  console.log("chat model message from server: ",callInitModel);
  if(callInitModel.CallStatus == 4 || callInitModel.CallStatus == 3)
  {
    this.flag = false
  }
});



    this.route.queryParams
      .subscribe(params => {
        this.defaultState = params.calendermonth;
        this.appttype=params.appttype;
        this.apptmode=params.apptmode;
        this.currentdayview=params.currentdayview;

        if(this.defaultState=='currentmonth'){
          this.view = CalendarView.Month;
          if(this.appttype!=null && this.apptmode!=null){
            this.fetchfilteredappt();
          }
          else{
            this.fetchEvents();
          }

        }else if(this.defaultState=='previousmonth'){
          this.view = CalendarView.Month;
          this.viewDate = new Date();
          this.viewDate.setDate(1);
          this.viewDate.setMonth(this.viewDate.getMonth()-1);
          this.fetchEvents();
        }
        else if(this.currentdayview!=null){
          this.view = CalendarView.Day;
        }
      });

    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {

          this.currentLoginUserId = user.id;

          if (user.users3 && user.users3.userRoles) {
            this.userRole = (user.users3.userRoles.userType || "").toUpperCase()
          }

          this.isAdminLogin =
            user.users3 &&
            user.users3.userRoles &&
            (user.users3.userRoles.userType || "").toUpperCase() == "ADMIN";
          this.isClientLogin = this.userRole == "CLIENT";


          if (this.isClientLogin) {

            this.isRequestFromPatientPortal = true;
            this.currentLocationId = user.locationID;
            const patientId = user.id;
            this.isPatientScheduler = true;

            this.selectedOfficeClients = [patientId];
            this.patientSchedulerId = patientId;
            this.selectedOfficeLocations.push(this.currentLocationId);
          } else {
            this.isRequestFromPatientPortal = false;
            this.selectedOfficeStaffs = !this.isPatientScheduler
              ? [user.id]
              : [];
            this.currentLocationId = user.currentLocationId;
            this.officeLocations = (user.userLocations || []).map(
              (obj: any) => {
                if (obj.id === this.currentLocationId)
                  this.selectedOfficeLocations.push(obj.id);
                return {
                  id: obj.id,
                  value: obj.locationName,
                };
              }
            );
          }
          this.getUserPermissions(this.isRequestFromPatientPortal);
          this.fetchOfficeTimming();
          //this.fetchEvents();

          if(this.appttype!=null && this.apptmode!=null){
            this.fetchfilteredappt();
          }
          else{
            this.fetchEvents();
          }
          if (!this.isPatientScheduler) {
            this.fetchStaffsAndPatients();
            this.fetchStaffAvailability();
          }

        }

        this.cdr.detectChanges(); // added by shubham i.e on 9/11/2021
      }
    );


  }



  onDateChange(event: any) {
    this.viewDate = event.value;
    this.fetchEvents();
  }

  onDropdownSelectionChange(event: any): void {
    const source: MatSelect = event.source,
      value: any = event.value;
    if (source.id === "officeLocations") {
      this.fetchOfficeTimming();
      this.fetchStaffsAndPatients();
    }
    if (source.id === "officeStaffs") {
      this.fetchStaffAvailability();
    }

    this.fetchEvents();
  }

  onSelectOrDeselectChange(instanceName: string, type: string): void {
    switch (instanceName) {
      case "Locations":
        if (type == "SelectAll")
          this.selectedOfficeLocations = (this.officeLocations || []).map(
            (obj) => obj.id
          );
        else this.selectedOfficeLocations = [];

        if (this.selectedOfficeLocations.length) this.fetchOfficeTimming();
        this.fetchStaffsAndPatients();
        break;
      case "Staffs":
        if (type == "SelectAll")
          this.selectedOfficeStaffs = (this.officeStaffs || []).map(
            (obj) => obj.id
          );
        else this.selectedOfficeStaffs = [];
        break;
      case "Clients":
        if (type == "SelectAll")
          this.selectedOfficeClients = (this.officeClients || []).map(
            (obj) => obj.id
          );
        else this.selectedOfficeClients = [];
        break;
      default:
        break;
    }
    this.fetchEvents();
  }

  fetchOfficeTimming(locationId?: string): void {
    locationId = locationId || (this.selectedOfficeLocations || []).join(",");
    this.schedulerService
      .getMinMaxOfficeTime(locationId)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          let startDateTime = response.data.startTime;
          let endDateTime = response.data.endTime;

          this.officeTime = {
            dayStartHour: startDateTime.substring(0, 2),
            dayStartMinute: startDateTime.substring(3, 5),
            dayEndHour: endDateTime.substring(0, 2),
            dayEndMinute: endDateTime.substring(3, 5),
          };
        }
      });
  }

  fetchStaffsAndPatients(locationId?: string): void {
    locationId = locationId || (this.selectedOfficeLocations || []).join(",");

    let permissionKey = "";
    if (this.schedulerPermissions) {
      permissionKey = this.schedulerPermissions
        .SCHEDULING_LIST_VIEW_TEAM_SCHEDULES
        ? "SCHEDULING_LIST_VIEW_TEAM_SCHEDULES"
        : "";
      permissionKey = this.schedulerPermissions
        .SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES
        ? "SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES"
        : "";
    }

    this.schedulerService
      .getStaffAndPatientByLocation(locationId, permissionKey)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          (this.officeStaffs = []), (this.officeClients = []);
        } else {

          this.officeStaffs = response.data.staff || [];
          this.officeClients = response.data.patients || [];
        }
      });
  }

  fetchEvents(): void {
    this.showAllEventDaysArray = [];
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    if(!this.isWaitingRoomScreen){
      const filterModal = {
        locationIds: (this.selectedOfficeLocations || []).join(","),
        fromDate: format(getStart(this.viewDate), "YYYY-MM-DD"),
        toDate: format(getEnd(this.viewDate), "YYYY-MM-DD"),
        staffIds: (this.selectedOfficeStaffs || []).join(","),
        patientIds: (this.selectedOfficeClients || []).join(","),
      };
      this.fetchAppointments(filterModal).subscribe();

      this.refresh.next();
    }
    else {
      this.fetchSingleAppointment().subscribe();
      this.refresh.next();
    }

  }


  fetchSingleAppointment() : Observable<any> {
    return (this.events$ = this.schedulerService.getAppointmentDetailsAsList(this.waitingRoomApptId).pipe(
      map((response: any) => {
        if (response.statusCode !== 200) return [];
        else {

          if(response.data && response.data.length >0 && this.isFirstLoad){
            this.viewDate = response.data[0].startDateTime;
            const staffs = response.data[0].appointmentStaffs as AppointmentStaff[];
            this.waitingRoomApptPatientId = response.data[0].patientID as number;
            this.waitingRoomApptStaffId = response.data[0].appointmentStaffs[0].staffId as number;
            this.isFirstLoad = false;
            this.getStaffAvailability(this.waitingRoomApptStaffId,this.currentLocationId);;
          } else if(this.waitingRoomApptStaffId) {
            this.getStaffAvailability(this.waitingRoomApptStaffId,this.currentLocationId);
          }
          let data = response.data;
          data = data.filter((s) => !s.cancelTypeId || s.cancelTypeId === 0);
          if (this.isRequestFromPatientPortal) {
            data = data.filter(
              (s) =>
                s.invitationAppointentId == undefined ||
                s.invitationAppointentId == null ||
                s.invitatioppointentId == 0
            );
          }
          return (data || []).map((appointmentObj: Appointment) => {
            const timeRange = `${format(
              appointmentObj.startDateTime,
              "h:mm a"
            )} - ${format(appointmentObj.endDateTime, "h:mm a")} `;
            const actions = this.getCalendarActions(appointmentObj);
            const bgColor = (this.statusColors || []).find(
              (x) =>
                (x.name || "").toUpperCase() ==
                (appointmentObj.statusName || "").toUpperCase()
            );
            let appointmentTitle =
              timeRange + (appointmentObj.patientName || "");
            if (
              appointmentObj.invitedStaffs &&
              appointmentObj.invitedStaffs.length > 0
            ) {
              appointmentTitle += "<ul class='list-invited-staff'>";
              appointmentObj.invitedStaffs.forEach((element) => {
                appointmentTitle +=
                  "<li><span class='sp-large'>" +
                  element.name +
                  "</span><br/><span  class='sp-small'>" +
                  element.email +
                  "</span></li>";
              });
              appointmentTitle += "</ul>";
            }
            if (this.isRequestFromPatientPortal) {
              appointmentTitle =
                timeRange +
                (appointmentObj.appointmentStaffs || [])
                  .map((x) => x.staffName)
                  .join(",");
              if (
                (appointmentObj.statusName || "").toUpperCase() == "PENDING"
              ) {
                appointmentTitle =
                  appointmentTitle + " Waiting For Provider Approval";
              } else if (
                (appointmentObj.statusName || "").toUpperCase() == "CANCELLED"
              ) {
                appointmentTitle = appointmentTitle + " Appointement Cancelled";
              }
            }
            const eventObj: CalendarEvent<Appointment> = {
              title: appointmentTitle, //timeRange + appointmentObj.patientName,
              start: new Date(appointmentObj.startDateTime),
              end: new Date(appointmentObj.endDateTime),
              color: {
                primary: appointmentObj.fontColor,
                secondary: appointmentObj.color, // (bgColor && bgColor.color) || "#93ee93" //appointmentObj.color
              },
              cssClass: "CustomEvent",
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: true,
              actions: actions,
              meta: {
                ...appointmentObj,
              },
            };
            return eventObj;
          });
        }
      })
    ));
  }

  fetchAppointments(filterModal: any): Observable<any> {
    return (this.events$ = this.schedulerService.getListData(filterModal).pipe(
      map((response: any) => {
        if (response.statusCode !== 200) return [];
        else {
          var data = response.data;
          data = data.filter((s) => s.cancelTypeId == 0);
          if (this.isRequestFromPatientPortal) {
            data = data.filter(
              (s) =>
                s.invitationAppointentId == undefined ||
                s.invitationAppointentId == null ||
                s.invitationAppointentId == 0
            );
          }
          return (data || []).map((appointmentObj: Appointment) => {
            const timeRange = `${format(
              appointmentObj.startDateTime,
              "h:mm a"
            )} - ${format(appointmentObj.endDateTime, "h:mm a")} `;
            const actions = this.getCalendarActions(appointmentObj);
            const bgColor = (this.statusColors || []).find(
              (x) =>
                (x.name || "").toUpperCase() ==
                (appointmentObj.statusName || "").toUpperCase()
            );
            let appointmentTitle =
              timeRange + (appointmentObj.patientName || "");
            if (
              appointmentObj.invitedStaffs &&
              appointmentObj.invitedStaffs.length > 0
            ) {
              appointmentTitle += "<ul class='list-invited-staff'>";
              appointmentObj.invitedStaffs.forEach((element) => {
                appointmentTitle +=
                  "<li><span class='sp-large'>" +
                  element.name +
                  "</span><br/><span  class='sp-small'>" +
                  element.email +
                  "</span></li>";
              });
              appointmentTitle += "</ul>";
            }
            if (this.isRequestFromPatientPortal) {
              appointmentTitle =
                timeRange +
                (appointmentObj.appointmentStaffs || [])
                  .map((x) => x.staffName)
                  .join(",");
              if (
                (appointmentObj.statusName || "").toUpperCase() == "PENDING"
              ) {
                appointmentTitle =
                  appointmentTitle + " Waiting For Provider Approval";
              } else if (
                (appointmentObj.statusName || "").toUpperCase() == "CANCELLED"
              ) {
                appointmentTitle = appointmentTitle + " Appointement Cancelled";
              }
            }
            const eventObj: CalendarEvent<Appointment> = {
              title: appointmentTitle, //timeRange + appointmentObj.patientName,
              start: new Date(appointmentObj.startDateTime),
              end: new Date(appointmentObj.endDateTime),
              color: {
                primary: appointmentObj.fontColor,
                secondary: appointmentObj.color, // (bgColor && bgColor.color) || "#93ee93" //appointmentObj.color
              },
              cssClass: "CustomEvent",
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: true,
              actions: actions,
              meta: {
                ...appointmentObj,
              },
            };
            return eventObj;
          });
        }
      })
    ));
  }

  fetchStaffAvailability(staffIds?: string, locationId?: string): void {
    staffIds = staffIds || this.selectedOfficeStaffs.join(",");
    locationId = locationId || (this.selectedOfficeLocations || []).join(",");

    if (!staffIds || !locationId) {
      this.staffsAvailibility = null;
      return null;
    }
    this.schedulerService
      .getStaffAvailability(staffIds, locationId)
      .subscribe((response: any) => {

        if (response.statusCode !== 200) {
          this.staffsAvailibility = null;
        } else {
          this.staffsAvailibility = response.data;
        }
      });
  }

  checkIsValidAppointment(appointmentObj: AppointmentModel) {
    const appointmentData = [
      {
        PatientAppointmentId: appointmentObj.patientAppointmentId,
        AppointmentTypeID: appointmentObj.appointmentTypeID,
        AppointmentStaffs: appointmentObj.appointmentStaffs,
        PatientID: appointmentObj.patientID,
        LocationId: appointmentObj.serviceLocationID,
        StartDateTime: format(
          appointmentObj.startDateTime,
          "YYYY-MM-DDTHH:mm:ss"
        ),
        EndDateTime: format(appointmentObj.endDateTime, "YYYY-MM-DDTHH:mm:ss"),
      },
    ];

    this.schedulerService
      .checkIsValidAppointment(appointmentData)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.notifierService.notify("error", response.message);
        } else {
          let data = response.data;
          let messagesArray = [];
          let isValidAppointment = true;
          if (data && data.length) {
            messagesArray = data.map((obj) => {
              if (!obj.valid) {
                isValidAppointment = obj.valid;
                return obj.message;
              } else {
                return null;
              }
            });
          }
          let availabilityMessage = messagesArray.join(", ");
          if (isValidAppointment) {
            this.isCheckedValidate = true;
            if (this.isCheckedValidate && this.isCheckedAuthorization) {
              this.createAppointment(appointmentObj);
              this.isCheckedValidate = false;
              this.isCheckedAuthorization = false;
            }
          } else this.notifierService.notify("warning", availabilityMessage);
        }
      });
  }

  checkAuthorizationDetails(appointmentObj: AppointmentModel): void {
    const appointmentData = {
      appointmentId: appointmentObj.patientAppointmentId,
      patientId: appointmentObj.patientID,
      appointmentTypeId: appointmentObj.appointmentTypeID,
      startDate: format(appointmentObj.startDateTime, "YYYY-MM-DDTHH:mm:ss"),
      endDate: format(appointmentObj.endDateTime, "YYYY-MM-DDTHH:mm:ss"),
      isAdmin: true,
      patientInsuranceId: null,
      authorizationId: null,
    };

    this.schedulerService
      .checkAuthorizationDetails(appointmentData)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.notifierService.notify("error", response.message);
        } else {
          const authorization = response.data;
          let authMessage = "",
            isValid = true;
          if (authorization && authorization.length) {
            let message = authorization[0].authorizationMessage;
            if (message.toLowerCase() === "valid") {
              isValid = true;
              authMessage = "";
            } else {
              isValid = false;
              authMessage = message;
            }
          }
          let authorizationMessage = authMessage;
          if (isValid) {
            this.isCheckedAuthorization = true;
            if (this.isCheckedValidate && this.isCheckedAuthorization) {
              this.createAppointment(appointmentObj);
              this.isCheckedValidate = false;
              this.isCheckedAuthorization = false;
            }
          } else this.notifierService.notify("warning", authorizationMessage);
        }
      });
  }

  createAppointment(appointmentData: any) {
    const queryParams = {
      IsFinish: true,
      isAdmin: false,
    };
    appointmentData = [
      {
        ...appointmentData,
        startDateTime: format(
          appointmentData.startDateTime,
          "YYYY-MM-DDTHH:mm:ss"
        ),
        endDateTime: format(appointmentData.endDateTime, "YYYY-MM-DDTHH:mm:ss"),
      },
    ];
    this.schedulerService
      .createAppointment(appointmentData, queryParams)
      .subscribe((response) => {
        if (response.statusCode === 200) {
          this.notifierService.notify("success", response.message);
          this.fetchEvents();
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  handleMoveAppointmentClick(appointment: any) {
    let isAdminUpdateAfterRendered = appointment.claimId ? true : false;
    let appointmentData = {
      ...appointment,
    };
    this.isCheckedValidate = false;
    this.checkIsValidAppointment(appointmentData);
    if (appointmentData.isBillable) {
      this.isCheckedAuthorization = false;
      this.checkAuthorizationDetails(appointmentData);
    } else {
      this.isCheckedAuthorization = true;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    if (this.isRequestFromPatientPortal) {
      return null;
    }

    const appointmentObj: AppointmentModel = {
      ...event.meta,
      startDateTime: newStart,
      endDateTime: newEnd,
    };
    this.notifierService.notify(
      "error",
      "You can not edit timing once payment done."
    );
    // this.dialogService
    //   .confirm("Are you sure you want to move appointment?")
    //   .subscribe((result: any) => {
    //     if (result == true) {
    //       //this.handleMoveAppointmentClick(appointmentObj);
    //     }
    //   });
  }

  getCalendarActions(appointmentObj: Appointment): Array<CalendarEventAction> {

    let actions = [];
    if(this.isWaitingRoomScreen){
      return actions;
    }
    if (
      (appointmentObj.statusName || "").toUpperCase() == "PENDING" ||
      appointmentObj.cancelTypeId > 0
    ) {
      actions = [
        {
          //   icon: '<i class="fa fa-fw fa-pencil" title="Edit"></i>',
          //   name: 'Edited'
          // },
          //{
          icon:
            '<span class="material-icons material-icons-delete" title="Delete" style="color:#d00;">delete_forever</span>', // '<i class="fa fa-fw fa-trash" title="Delete"></i>',
          name: "Deleted",
        },
      ];
    }
    if (appointmentObj.patientEncounterId) {
      actions.push({
        icon:
          '<span class="material-icons material-icons-view-soap" title="View Soap Note" style="color:#3b4da5">pageview</span>',
        //'<i class="fa fa-fw fa-pencil-square" title="View Soap Note"></i>',
        name: "ViewSoapNote",
      });
    } else if (
      // appointmentObj.cancelTypeId > 0 &&
      // new Date(appointmentObj.startDateTime) < new Date()
      appointmentObj.patientID > 0 &&
      !(appointmentObj.cancelTypeId > 0)
    ) {
      actions.push({
        icon:
        '<span class="material-icons material-icons-outlined" title="video call" style="color:#90962f">video_call</span>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
      name: "VideoCall",

       // icon: '<span class="material-icons material-icons-outlined"  title="go to waiting-room" style="color:#90962f">fact_check</span>',
        //'<i class="fa fa-fw fa-pencil-square-o" title="Create Soap Note"></i>',
        // name: "CreateSoapNote",

        // });
        // actions.push({
        //   icon:
        //     '<span class="material-icons-create-soap material-icons" title="Edit" style="color:#217971">mode_edit</span>',
        //   //'<i class="fa fa-fw fa-pencil-square-o" title="Create Soap Note"></i>',
        //   name: "Edited",
        //todayss
      });
      if (
        !this.isRequestFromPatientPortal &&
        (appointmentObj.statusName || "").toUpperCase() != "PENDING" &&
        appointmentObj.isTelehealthAppointment
      ) {
        let invitedBadge = "";
        if (
          appointmentObj.invitedStaffs &&
          appointmentObj.invitedStaffs.length > 0
        ) {
          invitedBadge =
            '<span class="invited-badge invited-badge-' +
            appointmentObj.patientAppointmentId +
            '">' +
            appointmentObj.invitedStaffs.length +
            "</span>";
        }
        actions.push({
          icon:
            '<span class="material-icons material-icons-chat" title="Chat" style="color:#513671">chat</span>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
          name: "Chat",
        });
        // actions.push({
        //   icon:
        //     '<span class="material-icons material-icons-add-person" title="Invite" style="color:#217971">person_add</span>' +
        //     invitedBadge, //<i class="fa fa-video-camera" title="Join Video Call"></i>',
        //   name: "AddNewPerson",
        // });
      }
      if(appointmentObj.invitedStaffs &&
        appointmentObj.invitedStaffs.length > 0){
           actions.push({
       icon: '<span class="material-icons material-icons-users" title="Chat" >supervisor_account</span>',
       name: "CHAT",
     });}

      if (
        this.isRequestFromPatientPortal &&
        (appointmentObj.statusName || "").toUpperCase() != "PENDING" &&
        appointmentObj.isTelehealthAppointment
      ) {
        // actions.push({
        //   icon:
        //     '<span class="material-icons material-icons-outlined" title="go to waiting-room " style="color:#90962f">fact_check</span>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
        //   name: "VideoCall",
        // });
        // actions.push({
        //   icon:
        //     '<span class="material-icons-create-soap material-icons" title="Edit" style="color:#217971">mode_edit</span>',
        //   //'<i class="fa fa-fw fa-pencil-square-o" title="Create Soap Note"></i>',
        //   name: "Edited",

        // });
      }
    }

    // check for appointment is cancelled or not
    if (appointmentObj.cancelTypeId > 0) {
      actions = actions.filter(
        (obj) => obj.name !== "Edited" && obj.name !== "Deleted"
      );
      !this.isRequestFromPatientPortal;
      // && actions.push({
      //   icon: '<i class="fa fa-undo" title="Undo Cancel"></i>',
      //   name: 'UndoCancel'
      // })
    } else {
      if ((appointmentObj.statusName || "").toUpperCase() == "PENDING" || (appointmentObj.statusName || "").toUpperCase() == "APPROVED") {
        // actions.push({
        //   icon:
        //     '<span class="material-icons material-icons-cancel" title="Cancel" style="color:#ce7930">clear</span>', //<i class="fa fa-ban" title="Cancel"></i>',
        //   name: "Cancel",
        // });
      }
    }
    // check wheater claim is generated or not
    if (appointmentObj.claimId > 0) {
      actions = actions.filter((obj) => obj.name !== "Cancel");
      actions = appointmentObj.canEdit
        ? actions
        : actions.filter(
          (obj) => obj.name !== "Edited" && obj.name !== "Deleted"
        );
    }
    if (this.schedulerPermissions) {
      !this.schedulerPermissions.SCHEDULING_LIST_CREATESOAP &&
        (actions = actions.filter((obj) => obj.name !== "CreateSoapNote"));
      !this.schedulerPermissions.SCHEDULING_LIST_VIEWSOAP &&
        (actions = actions.filter((obj) => obj.name !== "ViewSoapNote"));
      !this.schedulerPermissions.SCHEDULING_LIST_UPDATE &&
        (actions = actions.filter((obj) => obj.name !== "Edited"));
      !this.schedulerPermissions.SCHEDULING_LIST_DELETE &&
        (actions = actions.filter((obj) => obj.name !== "Deleted"));
      !this.schedulerPermissions.SCHEDULING_LIST_CANCEL_APPOINTMENT &&
        (actions = actions.filter((obj) => obj.name !== "Cancel"));
      // this.schedulerPermissions.SCHEDULING_LIST_CREATESOAP && actions.filter(obj => obj.name !== 'SoapNote')

      if (
        !this.isAdminLogin &&
        (appointmentObj.statusName || "").toUpperCase() != "PENDING"
      ) {
        const staffId =
          appointmentObj.appointmentStaffs &&
            appointmentObj.appointmentStaffs.length
            ? appointmentObj.appointmentStaffs[0].staffId
            : null;
        if (this.schedulerPermissions.SCHEDULING_LIST_CREATEOWNSOAP_ONLY) {
          if (staffId != this.currentLoginUserId)
            actions = actions.filter((obj) => obj.name !== "CreateSoapNote");
        }
        if (this.schedulerPermissions.SCHEDULING_LIST_VIEWOWNSOAP_ONLY) {
          if (staffId != this.currentLoginUserId)
            actions = actions.filter((obj) => obj.name !== "ViewSoapNote");
        }
      }

      if (
        !this.isRequestFromPatientPortal &&
        (appointmentObj.statusName || "").toUpperCase() == "PENDING"
      ) {
        actions = actions.filter(
          (obj) => obj.name !== "CreateSoapNote" && obj.name !== "ViewSoapNote"
          //(obj) => obj.name !== "CreateSoapNote" && obj.name !== "ViewSoapNote" && obj.name !== "Edited",
          //todayss
        );
        actions.push({
          icon:
            '<span class="material-icons material-icons-approv" title="Approve" style="color:#50ce30">check_circle_outline</span>', //'<i class="fa fa-check" title="Approve"></i>',
          name: "Approve",
        });
      } else if (
        this.isRequestFromPatientPortal &&
        (appointmentObj.statusName || "").toUpperCase() != "PENDING"
      ) {
        actions = actions.filter(
          (obj) => obj.name !== "Edited" && obj.name !== "Deleted"
          //(obj) => obj.name !== "Deleted"
          //todayss
        );
      }
    }
    if (appointmentObj.invitationAppointentId) {
      this.commonService.userRole.subscribe((role) => {
        if (role.toLowerCase() == "provider") {
          actions = [];
          actions.push({
            icon:
              '<span class="material-icons material-icons-video" title="Join Invited Video Call" style="color:#90962f">voice_chat</span>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
            name: "OnlyVideoCall",
          });
        }
      });
    }
    actions.push({
      icon:
        '<div class="appt-blk"><span class="cal-event" title="appt" style="color:#513671"></span></div>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
      name: "APPT",
    });
    return actions.map((obj) => {

      const icn = obj.icon as string;
      const [s1, ...s2Array] = icn.split(' ');
      const iconStr = [s1, 'value="' + obj.name + '"', s2Array].join(' ');
      obj.icon = iconStr.split(',').join(' ');


      return {
        label: obj.icon,
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.handleEvent(obj.name, event.meta);
        },
      };
    });
  }

  handleEvent(type: string, event: AppointmentModel) {

    let appointmentObj = {
      appointmentId: event.patientAppointmentId,
      isRecurrence: event.isRecurrence,
      parentAppointmentId: event.parentAppointmentId,
      deleteSeries: false,
      claimId: event.claimId,
      patientEncounterId: event.patientEncounterId || 0,
      isBillable: event.isBillable,
      patientId: event.patientID,
      currentStaffid: this.isClientLogin ? event.appointmentStaffs[0].staffId : 0
    };
    // localStorage.removeItem('apptId');

    // localStorage.setItem('apptId',appointmentObj.appointmentId.toString());
    this.currentAppointmentId = appointmentObj.appointmentId;
    this.currentPatientId = appointmentObj.patientId
    this.isClientLogin
    {
      this.currentStaff = appointmentObj.currentStaffid
    }
    switch (type.toUpperCase()) {
      case "EDITED":
        this.schedulerService
          .getAppointmentDetails(appointmentObj.appointmentId)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              const appointmentObj: AppointmentModel = response.data;
              this.createModel(appointmentObj, true);
            } else {
              this.createModel(null, true);
            }
          });
        break;
      case "DELETED":
        this.handleDeleteAppoitnment(appointmentObj);
        break;
      case "APPT":
        break;


      case "CANCEL":
        this.createCancelAppointmentModel(appointmentObj.appointmentId);
        break;
      case "ADDNEWPERSON":
        this.addNewCallerService
          .getOTSessionByAppointmentId(appointmentObj.appointmentId)
          .subscribe((response) => {
            if (response.statusCode == 200) {
              this.createAddPersonModel(
                appointmentObj.appointmentId,
                response.data.id
              );
            }
          });
        break;
      case "UNDOCANCEL":
        this.schedulerService
          .unCancelAppointment(appointmentObj.appointmentId)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifierService.notify("success", response.message);
              this.fetchEvents();
            } else {
              this.notifierService.notify("error", response.message);
            }
          });
        break;
      // //case "CREATESOAPNOTE":
      // //case "VIEWSOAPNOTE":
      //   // this.commonService.appointmentDataSubject.next(appointmentObj.appointmentId);
      //   // localStorage.setItem('apptId', this.commonService.encryptValue(appointmentObj.appointmentId,true));
      //   // if(appointmentObj.patientEncounterId){
      //   //  // if (appointmentObj.isBillable)
      //   // this.router.navigate(["/web/appointment/soap"], {
      //   //   queryParams: {
      //   //     id: this.commonService.encryptValue(appointmentObj.appointmentId,true),
      //   //     enc_EId: this.commonService.encryptValue(appointmentObj.patientEncounterId,true),
      //   //   },
      //   // });
      //   // }
        //// else{
          //this.commonService.appointmentDataSubject.next(appointmentObj.appointmentId);
        // if (appointmentObj.isBillable)
        // this.router.navigate(["/web/encounter/soap"], {
        //   queryParams: {
        //     apptId: appointmentObj.appointmentId,
        //     encId: appointmentObj.patientEncounterId,
        //   },
        // });
        // this.router.navigate(["/web/waiting-room/"+appointmentObj.appointmentId]);
        ////this.router.navigate(["/web/waiting-room"], { queryParams: { id: this.commonService.encryptValue(appointmentObj.appointmentId,true) } });

        // localStorage.setItem('apptId', this.commonService.encryptValue(appointmentObj.appointmentId,true));
        // else
        //   this.router.navigate(["/web/encounter/non-billable-soap"], {
        // queryParams: {
        //   apptId: appointmentObj.appointmentId,
        //   encId: appointmentObj.patientEncounterId
        // }
        // });
        ////}
       //// break;
      case "APPROVE":
        const appointmentData = {
          id: appointmentObj.appointmentId,
          status: "APPROVED",
        };
        this.schedulerService
          .updateAppointmentStatus(appointmentData)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifierService.notify("success", response.message);
              this.fetchEvents();
            } else {
              this.notifierService.notify("error", response.message);
            }
          });
        break;
      case "VIDEOCALL":
        this.patientAppointmentDetails = event;
      this.startVideoCall(appointmentObj.appointmentId);

      //console.log("sch here...");

   // this.commonService.appointmentDataSubject.next(appointmentObj.appointmentId);
        // this.router.navigate(["/web/waiting-room/"+appointmentObj.appointmentId]);
        //this.router.navigate(["/web/waiting-room"], { queryParams: { id: this.commonService.encryptValue(appointmentObj.appointmentId,true) } });
       // localStorage.setItem('apptId', this.commonService.encryptValue(appointmentObj.appointmentId,true));

        // this.router.navigate(["/web/encounter/video-call"], {
        //   queryParams: {
        //     apptId: appointmentObj.appointmentId,
        //   },
        // });
      case "ONLYVIDEOCALL":
        this.encounterService
          .getTelehealthSessionForInvitedAppointmentId(
            appointmentObj.appointmentId
          )
          .subscribe((response) => {
            if (response.statusCode == 200) {
              var otSession = this.commonService.encryptValue(
                JSON.stringify(response.data)
              );
              localStorage.setItem("otSession", otSession);
              this.commonService.videoSession(true);
            }
          });
      case "CHAT":
        this.commonService.loginUser.subscribe((response: any) => {
          if (response.access_token) {
            var chatInitModel = new ChatInitModel();
            chatInitModel.isActive = true;
            chatInitModel.AppointmentId = appointmentObj.appointmentId;
            chatInitModel.UserId = response.data.userID;
             // added by shubham i.e on 9/11/2021
            if(this.isClientLogin){
              chatInitModel.UserRole = response.data.users3.userRoles.userType;
            }else{
              chatInitModel.UserRole = response.data.userRoles.userType;
            }
            /// added by shubham i.e on 9/11/2021

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
        default:
        break;
    }
  }

  handleDeleteAppoitnment(appointmentObj: any) {
    if (appointmentObj.isRecurrence) {
      this.dialogService
        .confirm("Do you want to delete whole series or this one?", [
          {
            name: "Delete Series",
            value: true,
          },
          {
            name: "Delete One",
            value: false,
          },
        ])
        .subscribe((result: any) => {
          if (result == true) {
            appointmentObj.deleteSeries = true;
            this.schedulerService
              .deleteAppointmentDetails(
                appointmentObj.appointmentId,
                appointmentObj.parentAppointmentId,
                appointmentObj.deleteSeries,
                false
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify("success", response.message);
                  this.fetchEvents();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              });
          } else if (result == false) {
            this.schedulerService
              .deleteAppointmentDetails(
                appointmentObj.appointmentId,
                appointmentObj.parentAppointmentId,
                appointmentObj.deleteSeries,
                false
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify("success", response.message);
                  this.fetchEvents();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              });
          }
        });
    } else {
      this.dialogService
        .confirm("Are you sure you want to delete appointment?")
        .subscribe((result: any) => {
          if (result == true) {
            this.schedulerService
              .deleteAppointmentDetails(
                appointmentObj.appointmentId,
                appointmentObj.parentAppointmentId,
                appointmentObj.deleteSeries,
                false
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify("success", response.message);
                  this.fetchEvents();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              });
          }
        });
    }
  }

  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: Array<CalendarEvent<{ appointment: Appointment }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ appointment: Appointment }>): void {

  }

  hourSegmentClicked(event: any): void {

if (!this.schedulerPermissions.SCHEDULING_LIST_ADD) {
      return null;
    }

    const slotInfo = {
      start: event.date,
      end: addMinutes(event.date, 59),
    };
    // if (!this.checkAvailability(slotInfo) && !this.isPatientScheduler) {
    //   this.notifierService.notify(
    //     "warning",
    //     "Selected staff(s) is not available at this date, time."
    //   );
    //   return null;
    // }
    this.notifierService.hideAll();
    this.apptObj = new AppointmentModel();
    this.apptObj.startDateTime = slotInfo.start;
    this.apptObj.endDateTime = addMinutes(slotInfo.start, 60);

  }

  createModel(appointmentModal: AppointmentModel, type: any) {

    const selectedOfficeClients = !this.isPatientScheduler                //todayss
      ? this.officeClients.filter(obj =>
        this.selectedOfficeClients.includes(obj.id)
      )
      : [{ id: this.patientSchedulerId, value: "" }];
    const selectedOfficeLocations = !this.isPatientScheduler
      ? this.officeLocations.filter(obj =>
        this.selectedOfficeLocations.includes(obj.id)
      )
      : [{ id: this.currentLocationId, value: "" }];
    const modalPopup = this.appointmentDailog.open(SchedulerDialogComponent, {
      hasBackdrop: true,
      data: {
        appointmentData: appointmentModal || new AppointmentModel(),
        selectedOfficeLocations: selectedOfficeLocations,
        selectedOfficeStaffs: this.officeStaffs.filter(obj =>
          this.selectedOfficeStaffs.includes(obj.id)
        ),
        selectedOfficeClients,
        isPatientScheduler: this.isPatientScheduler,
        isRequestFromPatientPortal: this.isRequestFromPatientPortal,
        isNew: type
      }
    });
    modalPopup.afterClosed().subscribe(result => {
      if (result === "SAVE") this.fetchEvents();
    });
  }

  createCancelAppointmentModel(appointmentId: number) {
    const modalPopup = this.appointmentDailog.open(
      CancelAppointmentDialogComponent,
      {
        hasBackdrop: true,
        data: appointmentId,
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") this.fetchEvents();
    });
  }
  createAddPersonModel(appointmentId: number, sessionId: number) {

    const modalPopup = this.appointmentDailog.open(AddNewCallerComponent, {
      hasBackdrop: true,
      data: { appointmentId: appointmentId, sessionId: sessionId },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "save") this.fetchEvents();
    });
  }
  // before render of the Calendar events ...
  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      const slotInfo = {
        start: day.date,
        end: day.date,
      };
      if (this.checkAvailability(slotInfo) && !this.isPatientScheduler) {
        day.cssClass = "available-bg-color";
      }
    });
  }
  beforeWeekViewRender(e: CalendarWeekViewBeforeRenderEvent) {

    e.hourColumns.forEach((obj) => {
      obj.hours.forEach((h) => {
        h.segments.forEach((s) => {
          const slotInfo = {
            start: s.date,
            end: addMinutes(s.date, 59),
          };
         // const isAvailableForWRResche = this.isBoolingDateAvailable(slotInfo.start);

          let cssClass = "";
          if (this.checkAvailability(slotInfo) && !this.isPatientScheduler) {
            cssClass = "available-bg-color";
          }
          // if(isAvailableForWRResche){
          //   cssClass = cssClass + " is-available-cell-week-re";
          // }
          s.cssClass = cssClass;
        });
      });
    });
  }
  beforeDayViewRender(e: CalendarDayViewBeforeRenderEvent) {
    e.body.hourGrid.forEach((h) => {
      h.segments.forEach((s) => {
        const slotInfo = {
          start: s.date,
          end: addMinutes(s.date, 59),
        };
        let cssClass = "";
        if (this.checkAvailability(slotInfo) && !this.isPatientScheduler) {
          cssClass = "available-bg-color";
        }
        s.cssClass = cssClass;
      });
    });
  }

  // staff availability check
  checkAvailability = (slotInfo) => {
    let isAvailable = false;
    let isUnavailable = false;
    if (this.staffsAvailibility) {
      let availableArray = this.staffsAvailibility;
      if (availableArray.unavailable && availableArray.unavailable.length) {
        let isDayAvailibility = false,
          isMonthView = (this.view || "").toLowerCase() === "month";
        isUnavailable = this.isAvailableDateTime(
          availableArray.unavailable,
          slotInfo,
          isDayAvailibility,

          isMonthView
        );
      }

      if (isUnavailable) {
        isAvailable = false;
      } else {
        if (availableArray.available && availableArray.available.length) {
          let isDayAvailibility = false,
            isMonthView = (this.view || "").toLowerCase() === "month";
          isAvailable = this.isAvailableDateTime(
            availableArray.available,
            slotInfo,
            isDayAvailibility,
            isMonthView
          );
        }

        if (!isAvailable && availableArray.days && availableArray.days.length) {
          let isDayAvailibility = true,
            isMonthView = (this.view || "").toLowerCase() === "month";
          isAvailable = this.isAvailableDateTime(
            availableArray.days,
            slotInfo,
            isDayAvailibility,
            isMonthView
          );
        }
      }
    }
    return isAvailable;
  };

  isAvailableDateTime(
    availibilityArray,
    slotInfo,
    isDayAvailibility,
    isMonthView
  ) {
    let isValidDateTime = false,
      tempArray = availibilityArray;

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let SlotStartDate = new Date(slotInfo.start).toDateString(),
      nowDate = new Date(),
      year = nowDate.getFullYear(),
      month = nowDate.getMonth(),
      date = nowDate.getDate(),
      slotStart = new Date(slotInfo.start),
      slotEnd = new Date(slotInfo.end),
      slotStartTime = new Date(
        year,
        month,
        date,
        slotStart.getHours(),
        slotStart.getMinutes()
      ),
      slotEndTime = new Date(
        year,
        month,
        date,
        slotEnd.getHours(),
        slotEnd.getMinutes()
      ),
      SlotDayName = days[new Date(slotInfo.start).getDay()];

    for (let index = 0; index < tempArray.length; index++) {
      let isValidDay = false;
      if (isDayAvailibility) {
        let availableDayName = tempArray[index].dayName || "";
        isValidDay =
          SlotDayName.toLowerCase() === availableDayName.toLowerCase();
      } else {
        let availableDate = new Date(tempArray[index].date).toDateString();
        isValidDay = availableDate === SlotStartDate;
      }
      let availStartTime = new Date(tempArray[index].startTime),
        avialEndTime = new Date(tempArray[index].endTime),
        startTime = new Date(
          year,
          month,
          date,
          availStartTime.getHours(),
          availStartTime.getMinutes()
        ),
        endTime = new Date(
          year,
          month,
          date,
          avialEndTime.getHours(),
          avialEndTime.getMinutes()
        );

      let isValidTime = startTime <= slotStartTime && endTime >= slotEndTime;
      let isResourceId = slotInfo.resourceId
        ? slotInfo.resourceId === tempArray[index].staffID || ""
        : true;

      if (isResourceId && isValidDay && (isMonthView || isValidTime)) {
        isValidDateTime = true;
        break;
      }
    }
    return isValidDateTime;
  }

  getUserPermissions(isRequestFromPatientPortal: boolean) {
    const actionPermissions = this.schedulerService.getUserScreenActionPermissions(
      "SCHEDULING",
      "SCHEDULING_LIST"
    );

    const {
      SCHEDULING_LIST_ADD,
      SCHEDULING_LIST_UPDATE,
      SCHEDULING_LIST_DELETE,
      SCHEDULING_LIST_CREATESOAP,
      SCHEDULING_LIST_VIEWSOAP,
      SCHEDULING_LIST_VIEW_CLIENT_SCHEDULES,
      SCHEDULING_LIST_VIEW_TEAM_SCHEDULES,
      SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES,
      SCHEDULING_LIST_CANCEL_APPOINTMENT,
      SCHEDULING_LIST_MODIFYAPPOINTMENT_AFTER_RENDERING,
      SCHEDULING_EDIT_APPOINTMENT_TIME_ONLY,
      SCHEDULING_LIST_CREATEOWNSOAP_ONLY,
      SCHEDULING_LIST_VIEWOWNSOAP_ONLY,
    } = actionPermissions;
    if (isRequestFromPatientPortal) {
      this.schedulerPermissions = {
        SCHEDULING_LIST_ADD: true,
        SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES: true,
        SCHEDULING_LIST_UPDATE: true,
        SCHEDULING_LIST_VIEWSOAP: false,
        SCHEDULING_LIST_CANCEL_APPOINTMENT: true
      };
    } else {
      this.schedulerPermissions = {
        SCHEDULING_LIST_ADD,
        SCHEDULING_LIST_UPDATE,
        SCHEDULING_LIST_DELETE,
        SCHEDULING_LIST_CREATESOAP,
        SCHEDULING_LIST_VIEWSOAP,
        SCHEDULING_LIST_VIEW_CLIENT_SCHEDULES,
        SCHEDULING_LIST_VIEW_TEAM_SCHEDULES,
        SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES,
        SCHEDULING_LIST_CANCEL_APPOINTMENT,
        SCHEDULING_LIST_MODIFYAPPOINTMENT_AFTER_RENDERING,
        SCHEDULING_EDIT_APPOINTMENT_TIME_ONLY,
        SCHEDULING_LIST_CREATEOWNSOAP_ONLY,
        SCHEDULING_LIST_VIEWOWNSOAP_ONLY,
      };
    }
  }

  createViewAppointmentModel(appointmentId: number) {
    const modalPopup = this.appointmentDailog.open(
      AppointmentViewComponent,
      {
        hasBackdrop: true,
        data: appointmentId,
        width:"80%"
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      // if (result === "SAVE") this.fetchEvents();
    });
  }

  // test(e){
  //   console.log(e);
  //
  // }


  toDateString(date) {
    return this.date.transform(new Date(date), 'dd');
  }
  // getBgColor(appointmentStatus): string{

  //   //return this.statusColors.find(x => x.name.toLowerCase() == appointmentStatus.toLowerCase()).color;
  // }

  getBgClass(index: number): string {
    return index % 2 == 0 ? 'evenCellColor' : 'oddCellColor';
  }


  monthViewActionCliked(action, event: CalendarEvent) {
    const actionEl = this.commonService.parseStringToHTML(action.label) as HTMLElement;
    const actionName = actionEl.getAttribute("value") as string;
    this.handleEvent(actionName, event.meta)
  }
  //  countColor=0;
  // getBgClassForWeek(): string{
  //   this.countColor = this.countColor+ 1;
  //  return this.getBgClass(this.countColor)
  // }

  openShowAllEvents(day: number) {
    if (!this.showAllEventDaysArray.includes(day))
      this.showAllEventDaysArray.push(day);
  }

  closeShowAllEvents(day: number) {
    const index: number = this.showAllEventDaysArray.indexOf(day);
    if (index !== -1) {
      this.showAllEventDaysArray.splice(index, 1);
    }

  }

  isDayOpened(day: number): boolean {
    return this.showAllEventDaysArray.includes(day) ? true : false;
  }

  monthEvntsToolTip(appointmentTitle){
      return '<div class="month-title-tip-view"> '+appointmentTitle+' </div>';
  }

  getStartEndTime(obj: any) {
    let startDate: Date = new Date(obj.startTime),
      endDate: Date = new Date(obj.endTime);

    let slotStartHr = startDate.getHours(),
      slotStartMin = startDate.getMinutes(),
      slotEndHr = endDate.getHours(),
      slotEndMin = endDate.getMinutes(),
      startTime = this.parseTime(slotStartHr + ":" + slotStartMin),
      endTime = this.parseTime(slotEndHr + ":" + slotEndMin);
    return { startTime: startTime, endTime: endTime };
  }

  parseTime(s) {
    let c = s.split(":");
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  convertHours(mins: number) {
    let hour = Math.floor(mins / 60);
    mins = mins % 60;
    let time = "";
    if (this.pad(hour, 2) < 12) {
      time = this.pad(hour, 2) + ":" + this.pad(mins, 2) + " AM";
    } else {
      time =
        this.pad(hour, 2) == 12
          ? this.pad(hour, 2) + ":" + this.pad(mins, 2) + " PM"
          : this.pad(hour, 2) - 12 + ":" + this.pad(mins, 2) + " PM";
    }
    //let converted = this.pad(hour, 2)+':'+this.pad(mins, 2);
    return time;
  }

  pad(str, max) {
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
  }

  calculateTimeSlotRange(
    start_time: number,
    end_time: number,
    interval: number = 30
  ) {
    let i, formattedStarttime, formattedEndtime;
    let time_slots: Array<any> = [];
    for (let i = start_time; i <= end_time - interval; i = i + interval) {
      formattedStarttime = this.convertHours(i);
      formattedEndtime = this.convertHours(i + interval);
      time_slots.push({
        startTime: formattedStarttime,
        endTime: formattedEndtime
      });
    }
    return time_slots;
  }

  staffAvailability: any;
  providerAvailableDates: any = [];
  providerNotAvailableDates: any = [];


  getStaffAvailability(staffId, locationId){
    locationId = locationId ? locationId : 101;
    this.schedulerService.getStaffAvailabilityByLocation(staffId,locationId)
    .subscribe((response: ResponseModel) => {
      let availibiltyResponse = response;
      if (response.statusCode == 200) {
        this.staffAvailability = availibiltyResponse.data.days;
        this.providerAvailableDates = availibiltyResponse.data.available;
        this.providerNotAvailableDates =  availibiltyResponse.data.unavailable;
        this.getProviderAvailabilityForReschedule();
      }
    }
    )
  }


  getProviderAvailabilityForReschedule() {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

  //  const fromDate = getStart(this.viewDate);
    const fromDate = new Date();
    const toDate = getEnd(this.viewDate);
    var currentDate =fromDate;
    while (currentDate <= toDate) {
      const newDate = currentDate.setDate(currentDate.getDate() + 1);
      currentDate = new Date(newDate);
      this.checkAvailabilityForDate(currentDate,this.waitingRoomApptStaffId,30);
    }

  }


  checkAvailabilityForDate(reqDate: Date, staffId, interval) {

    let currentAvailabilityDay: any;
    let currentAvailableDates: Array<any> = [];
    let currentUnAvailableDates: Array<any> = [];
    let clientAppointments: Array<any> = [];

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];


    const filterModal = {
      locationIds: this.currentLocationId,
      fromDate: format(reqDate, "YYYY-MM-DD"),
      toDate: format(reqDate, "YYYY-MM-DD"),
      staffIds: staffId,
      patientIds: ("" || []).join(",")
    };


    let dayName = days[reqDate.getDay()];
    currentAvailabilityDay = this.staffAvailability.filter(
      x => x.dayName === dayName
    );

    //Find date wise availability
    if (this.providerAvailableDates != null && this.providerAvailableDates.length > 0) {
      currentAvailableDates = this.providerAvailableDates.filter(
        x => this.date.transform(new Date(x.date), "yyyyMMdd") === this.date.transform(reqDate, "yyyyMMdd")
      );
    }

    //find datewise unavailabilty
    if (this.providerNotAvailableDates != null && this.providerNotAvailableDates.length > 0) {
      currentUnAvailableDates = this.providerNotAvailableDates.filter(
        x => this.date.transform(new Date(x.date), "yyyyMMdd") === this.date.transform(reqDate, "yyyyMMdd")
      );
    }


    this.schedulerService.getListData(filterModal).subscribe((response: any) => {

      if (response.statusCode == 200) {

        let patientAppointments = response.data;

        patientAppointments.forEach(app => {
          let obj = {
            startTime: app.startDateTime,
            endTime: app.endDateTime
          };
          let timeObj = this.getStartEndTime(obj),
            startTime = timeObj.startTime,
            endTime = timeObj.endTime;
          if (!app.cancelTypeId || app.cancelTypeId == null && app.cancelTypeId == 0) {
            this.calculateTimeSlotRange(
              startTime,
              endTime,
              interval
            ).forEach(x => {
              clientAppointments.push({
                startTime: x.startTime,
                endTime: x.endTime,
                statusName: app.statusName
              });
            });
          }
        });

        let slots: Array<any> = [];
        let availDaySlots: Array<any> = [];
        let availDateSlots: Array<any> = [];
        let unAvailDateSlots: Array<any> = [];
        let providerAvailiabilitySlots : Array<any> = [];


        if (
          currentAvailabilityDay != null &&
          currentAvailabilityDay.length > 0
        ) {
          currentAvailabilityDay.forEach(currentDay => {
            let timeObj = this.getStartEndTime(currentDay),
              startTime = timeObj.startTime,
              endTime = timeObj.endTime;

            this.calculateTimeSlotRange(
              startTime,
              endTime,
              interval
            ).forEach(x => {
              availDaySlots.push(x);
            });
          });
        }

        if (
          currentAvailableDates != null &&
          currentAvailableDates.length > 0
        ) {
          currentAvailableDates.forEach(avail => {
            let timeObj = this.getStartEndTime(avail),
              startTime = timeObj.startTime,
              endTime = timeObj.endTime;

            this.calculateTimeSlotRange(
              startTime,
              endTime,
              interval
            ).forEach(x => {
              availDateSlots.push(x);
            });
          });
        }


        if (
          currentUnAvailableDates != null &&
          currentUnAvailableDates.length > 0
        ) {
          currentUnAvailableDates.forEach(avail => {
            let timeObj = this.getStartEndTime(avail),
              startTime = timeObj.startTime,
              endTime = timeObj.endTime;

            this.calculateTimeSlotRange(
              startTime,
              endTime,
              interval
            ).forEach(x => {
              unAvailDateSlots.push(x);
            });
          });
        }


        if (availDateSlots.length == 0) {
          if (availDaySlots.length > 0) {
            if (unAvailDateSlots.length > 0) {
              unAvailDateSlots.forEach(slot => {
                const foundIndex = availDaySlots.findIndex(
                  x =>
                    x.startTime == slot.startTime &&
                    x.endTime == slot.endTime
                );
                if (foundIndex != -1) {
                  availDaySlots = availDaySlots.filter(
                    (_, index) => index !== foundIndex
                  );
                }
              });
            }
            slots = availDaySlots;
          }
        } else {
          if (unAvailDateSlots.length > 0) {
            unAvailDateSlots.forEach(slot => {
              const foundIndex = availDateSlots.findIndex(
                x =>
                  x.startTime == slot.startTime &&
                  x.endTime == slot.endTime
              );
              if (foundIndex != -1) {
                availDateSlots = availDateSlots.filter(
                  (_, index) => index !== foundIndex
                );
              }
            });
          }
          slots = availDateSlots;
        }



        if (slots.length > 0) {
          slots.forEach(x => {
            providerAvailiabilitySlots.push({
              startTime: x.startTime,
              endTime: x.endTime,
              location: "Max Hospital, Mohali",
              isAvailable: true,
              isSelected: false,
              isPassed: false,
              isReserved: false
            });
          });
        }



        if (clientAppointments.length > 0) {

          clientAppointments.forEach(slot => {
            if ((slot.statusName as string).toLowerCase() != "cancel") {
              const foundIndex = providerAvailiabilitySlots.findIndex(
                x =>
                  x.startTime == slot.startTime &&
                  x.endTime == slot.endTime
              );
              if (foundIndex != -1) {
                providerAvailiabilitySlots[
                  foundIndex
                ].isAvailable = false;
                providerAvailiabilitySlots[
                  foundIndex
                ].isReserved = true;

              }
            }
          });
        }

        if(providerAvailiabilitySlots && providerAvailiabilitySlots.length >0){
            const isAvailable = providerAvailiabilitySlots.some(slot => slot.isAvailable == true);
            if(isAvailable){
              this.bookingAvailableDates.push(format(reqDate, "YYYY-MM-DD"));
              this.cdr.detectChanges();
            }
        }
      }

    })
  }


  isBoolingDateAvailable(reqDate: Date): boolean {
    if (this.bookingAvailableDates && this.bookingAvailableDates.length > 0) {
      const dateStr = format(reqDate, "YYYY-MM-DD");
      return this.bookingAvailableDates.some(x => x == dateStr) ? true : false;
    } else {
      return false;
    }
  }

  fetchfilteredappt(): void {
    this.showAllEventDaysArray = [];
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    if(!this.isWaitingRoomScreen){
      const filterModal = {
        locationIds: (this.selectedOfficeLocations || []).join(","),
        fromDate: format(getStart(this.viewDate), "YYYY-MM-DD"),
        toDate: format(getEnd(this.viewDate), "YYYY-MM-DD"),
        staffIds: (this.selectedOfficeStaffs || []).join(","),
        patientIds: (this.selectedOfficeClients || []).join(","),
        appttype:this.appttype,
        apptmode:this.apptmode
      };
      this.fetchfilteredAppointments(filterModal).subscribe();

      this.refresh.next();
    }
    else {
      this.fetchSingleAppointment().subscribe();
      this.refresh.next();
    }

  }

  fetchfilteredAppointments(filterModal: any): Observable<any> {

    return (this.events$ = this.schedulerService.getfilteredAppointmentListData(filterModal).pipe(
      map((response: any) => {
        if (response.statusCode !== 200) return [];
        else {
          var data = response.data;
          data = data.filter((s) => s.cancelTypeId == 0);
          if (this.isRequestFromPatientPortal) {
            data = data.filter(
              (s) =>
                s.invitationAppointentId == undefined ||
                s.invitationAppointentId == null ||
                s.invitationAppointentId == 0
            );
          }
          return (data || []).map((appointmentObj: Appointment) => {
            const timeRange = `${format(
              appointmentObj.startDateTime,
              "h:mm a"
            )} - ${format(appointmentObj.endDateTime, "h:mm a")} `;
            const actions = this.getCalendarActions(appointmentObj);
            const bgColor = (this.statusColors || []).find(
              (x) =>
                (x.name || "").toUpperCase() ==
                (appointmentObj.statusName || "").toUpperCase()
            );
            let appointmentTitle =
              timeRange + (appointmentObj.patientName || "");
            if (
              appointmentObj.invitedStaffs &&
              appointmentObj.invitedStaffs.length > 0
            ) {
              appointmentTitle += "<ul class='list-invited-staff'>";
              appointmentObj.invitedStaffs.forEach((element) => {
                appointmentTitle +=
                  "<li><span class='sp-large'>" +
                  element.name +
                  "</span><br/><span  class='sp-small'>" +
                  element.email +
                  "</span></li>";
              });
              appointmentTitle += "</ul>";
            }
            if (this.isRequestFromPatientPortal) {
              appointmentTitle =
                timeRange +
                (appointmentObj.appointmentStaffs || [])
                  .map((x) => x.staffName)
                  .join(",");
              if (
                (appointmentObj.statusName || "").toUpperCase() == "PENDING"
              ) {
                appointmentTitle =
                  appointmentTitle + " Waiting For Provider Approval";
              } else if (
                (appointmentObj.statusName || "").toUpperCase() == "CANCELLED"
              ) {
                appointmentTitle = appointmentTitle + " Appointement Cancelled";
              }
            }
            const eventObj: CalendarEvent<Appointment> = {
              title: appointmentTitle, //timeRange + appointmentObj.patientName,
              start: new Date(appointmentObj.startDateTime),
              end: new Date(appointmentObj.endDateTime),
              color: {
                primary: appointmentObj.fontColor,
                secondary: appointmentObj.color, // (bgColor && bgColor.color) || "#93ee93" //appointmentObj.color
              },
              cssClass: "CustomEvent",
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: true,
              actions: actions,
              meta: {
                ...appointmentObj,
              },
            };
            return eventObj;
          });
        }
      })
    ));
  }

  startVideoCall(apptId: any){ 
    if (localStorage.getItem("access_token")) {
      this.commonService.loginUser.subscribe((user: LoginUser) => {
        if (user.data) {
          let userInfo: any;

          this.userId = user.data.userID;
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "CLIENT") {
            userInfo = user.patientData;
          } else {
            userInfo = user.data;
          }
        } else {
        }
      });
    }
    if (apptId > 0 && this.userId > 0) {
     // this.flag = !this.flag;
      this.flag = true;
      this.appointmentId = apptId;
      this.appService
        .getCallInitiate(this.appointmentId, this.userId)
        .subscribe((res) => {
          console.log(res);
        });
        let callInitModel: CallInitModel = new CallInitModel();
    callInitModel.AppointmentId = this.appointmentId;
    callInitModel.CallStatus = CallStatus.Picked;
    this.appService.CheckCallStarted(callInitModel);

    }
  }


}
