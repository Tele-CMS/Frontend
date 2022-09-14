import { AcceptRejectAppointmentInvitationComponent } from './../../shared/accept-reject-appointment-invitation/accept-reject-appointment-invitation.component';
import { CancelAppointmentModel } from './../../platform/modules/scheduling/scheduler/scheduler.model';
import { NotificationsModel } from './../../shared/models/headerInfo';
import { debug } from "util";
import { state } from "@angular/animations";
import { SchedulerService } from "./../../platform/modules/scheduling/scheduler/scheduler.service";

//import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { isatty } from "tty";
import { userInfo } from "os";
import { Router } from "@angular/router";
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
  Renderer2,
  ViewChild,
  ElementRef
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HomeService } from "src/app/front/home/home.service";
import { CommonService } from "src/app/platform/modules/core/services";
import {
  StaffAward,
  StaffQualification,
  StaffExperience
} from "src/app/front/doctor-profile/doctor-profile.model";
import { NotifierService } from "angular-notifier";
import { format, getHours, getMinutes } from "date-fns";
import { map, startWith, switchMap } from "rxjs/operators";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { DatePipe, DOCUMENT } from "@angular/common";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { AddUserDocumentComponent } from "src/app/platform/modules/agency-portal/users/user-documents/add-user-document/add-user-document.component";
import { TermsConditionModalComponent } from "../terms-conditions/terms-conditions.component";
import { SaveDocumentComponent } from "../save-document/save-document.component";
import { ManageFeesRefundsModel } from "src/app/platform/modules/agency-portal/Payments/payment.models";
import { AppService } from 'src/app/app-service.service';
import { UrgentCareProviderActionInitModel } from 'src/app/shared/models/callModel';
import { Observable, of } from 'rxjs';
import { SymptomCheckerService } from 'src/app/shared/symptom-checker/symptom-checker.service';
//import { StripeToken, StripeSource } from "stripe-angular";

const getDateTimeString = (date: string, time: string): string => {
  const y = new Date(date).getFullYear(),
    m = new Date(date).getMonth(),
    d = new Date(date).getDate(),
    splitTime = time.split(":"),
    hours = parseInt(splitTime[0] || "0", 10),
    minutes = parseInt(splitTime[1].substring(0, 2) || "0", 10),
    meridiem = splitTime[1].substring(3, 5) || "",
    updatedHours =
      (meridiem || "").toUpperCase() === "PM" && hours != 12
        ? hours + 12
        : hours;

  const startDateTime = new Date(y, m, d, updatedHours, minutes);

  return format(startDateTime, "YYYY-MM-DDTHH:mm:ss");
};
@Component({
  selector: "app-urgentcare-appointment",
  templateUrl: "./urgentcare-appointment.component.html",
  styleUrls: ["./urgentcare-appointment.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class UrgentCareAppointmentComponent implements OnInit {
  submitted: boolean = false;
  todayDate: Date = new Date();
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  userInfo: any;
  fullname: string;
  staffAwards: Array<StaffAward> = [];
  staffQualifications: Array<StaffQualification> = [];
  staffExperiences: Array<StaffExperience> = [];
  staffTaxonomy: any[] = [];
  tabs: any = [];
  staffSpecialities: any[] = [];
  staffServices: any[] = [];
  staffId: number;
  providerId: string;

  // appointmenType: any = ["New", "Followup", "Free"];
  //appointmenType: any = ["New", "Free"];
  appointmenType: any = ["New", "Followup"];
  appointmentMode: any = ["Online", "Face to Face"];
  confirmation: any = { type: "New", mode: "Online" };
  providerAvailiabilitySlots: any = [];
  patientAppointments: any;
  staffAvailability: any;
  locationId: number;
  showLoader: boolean = false;
  providerAvailableDates: any = [];
  providerNotAvailableDates: any = [];
  userId: number;
  masterPatientLocation: Array<any>;
  masterStaffs: Array<any>;
  masterAddressTypes: Array<any>;
  officeAndPatientLocations: Array<any>;
  masterAppointmentTypes: Array<any>;
  Organization: any;
  patientEmail: string;
  paymentToken: string = "";
  Message: any;
  isNotBooked: boolean;
  ApptReject: boolean=false;
  isProfileLoaded: boolean = false;
  //Notes: string = "";
  fileList: any = [];
  dataURL: any;
  // feeSettings: ManageFeesRefundsModel;
  hasPreviousNewMeeting = false;
  userControl = new FormControl();
  filteredSymptoms$: Observable<any[]>;
  symptoms: any = [];
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: Router,
    private dialogModalRef: MatDialogRef<UrgentCareAppointmentComponent>,
    private _formBuilder: FormBuilder,
    private homeService: HomeService,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private usersService: UsersService,
    private schedulerService: SchedulerService,
    private symptomCheckerService:SymptomCheckerService,
    private datePipe: DatePipe,
    private renderer2: Renderer2,
    private dialogModal: MatDialog,
    private userService: UsersService,
    private notifier: NotifierService,
    private appService: AppService,
    @Inject(DOCUMENT) private _document
  ) {

    this.staffId = data.staffId;
    this.userInfo = data.userInfo;
    this.locationId = data.locationId;
    this.providerId = data.providerId;

    dialogModalRef.disableClose = true;
    this.masterStaffs = [];
    this.masterPatientLocation = [];
    this.masterAppointmentTypes = [];
    this.masterAddressTypes = [];
    this.officeAndPatientLocations = [];
    this.filteredSymptoms$ = this.userControl.valueChanges

    .pipe(
      startWith(''),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value != null && typeof (value) == "string") {
          if (value.length > 2) {
              return this.getPatientSymptoms(value).pipe()
            } else {
              // if no value is present, return null
              return of(null);
            }
          }
          else return of(null);
        })
      );
  }

  ngOnInit() {

    this.Message = null;
    this.isNotBooked = true;
    this.homeService.getOrganizationDetail().subscribe(response => {
      if (response.statusCode == 200) {
        this.Organization = response.data;
      }
    });
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.userId = user.data.userID;
        const userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        if ((userRoleName || "").toUpperCase() === "CLIENT") {
          this.patientEmail = user.patientData.email;
        }
      }
    });
    const s = this.renderer2.createElement("script");
    s.type = "text/javascript";
    s.src = "https://checkout.stripe.com/checkout.js";
    s.text = ``;
    this.renderer2.appendChild(this._document.body, s);
    this.firstFormGroup = this._formBuilder.group({
      appointmentDate: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      Notes: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required]
    });

    if (this.providerId != ""){

      this.getStaffDetail();
      //this.callProvideractionInitiate(426);
      //this.getLastNewAppointment(this.providerId);
    }
    else {
      this.bindStaffProfile();
    }



   // this.getProvidersFollowUpDaysAllowed(this.providerId);
  }

  /*Stripe Start */
  openCheckout() {

    let _amount = this.userInfo.urgentCarePayRate;

      var handler = (<any>window).StripeCheckout.configure({
        key: this.Organization.stripeKey,
        locale: "auto",
        token: function(token: any) {
          //console.log(token);
          if (token.id != "") {
            localStorage.setItem("payment_token", token.id);
            //this.book(token.id);
          }
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
        }
      });

      handler.open({
        name: this.Organization.organizationName,
        description: this.Organization.description,
        image: this.Organization.logo,
        //amount: this.userInfo.payRate * 100,
        amount: _amount * 100,
        email: this.patientEmail,
        closed: () => {
          this.paymentToken = localStorage.getItem("payment_token");
          localStorage.setItem("payment_token", "");
          if (this.paymentToken != "")
            this.bookNewAppointment(this.paymentToken, "Stripe");
        }
      });

    // }
    // else{
    //   this.bookNewFreeAppointment("", "Free");
    // }
  }

  /*Stripe End */
  get formGroup1() {
    return this.firstFormGroup.controls;
  }
  get formGroup3() {
    return this.thirdFormGroup.controls;
  }

  onSlotSelect(slot: any) {
    var index = this.providerAvailiabilitySlots.findIndex(
      x => x.isSelected == true
    );
    if (index != -1) {
      this.providerAvailiabilitySlots[index].isSelected = false;
      this.providerAvailiabilitySlots[index].isAvailable = true;
    }
    // this.providerAvailiabilitySlots.forEach(slot => {
    //   slot.isSelected = false;

    // });
    this.confirmation.startTime = slot.startTime;
    this.confirmation.endTime = slot.endTime;
    slot.isSelected = true;
    slot.isAvailable = false;
  }

  onDateChange(event: any) {

    this.confirmation.startTime = null;
    this.confirmation.endTime = null;
    this.showLoader = true;
    this.providerAvailiabilitySlots = [];
    this.firstFormGroup.get('appointmentDate').setValue(event);
    //let interval = 30;
    let interval = this.userInfo.timeInterval;
    const filterModal = {
      locationIds: this.locationId,
      // fromDate: format(event.value, "YYYY-MM-DD"),
      // toDate: format(event.value, "YYYY-MM-DD"),
      fromDate: format(event, "YYYY-MM-DD"),
      toDate: format(event, "YYYY-MM-DD"),
      staffIds: this.staffId,
      patientIds: ("" || []).join(",")
    };
    let clientAppointments: Array<any> = [];

    let currentAvailabilityDay: any;
    let currentAvailableDates: Array<any> = [];
    let currentUnAvailableDates: Array<any> = [];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    // let dayName = days[new Date(event.value).getDay()];
    let dayName = days[new Date(event).getDay()];
    this.staffAvailability = [];
    this.usersService
      .getStaffAvailabilityByLocation(this.staffId, this.locationId)
      .subscribe((response: ResponseModel) => {
        let availibiltyResponse = response;
        if (response.statusCode == 200) {
          this.schedulerService
            .getListData(filterModal)
            .subscribe((response: any) => {
              this.showLoader = false;
              if (response.statusCode == 200) {
                this.patientAppointments = response.data;
                this.patientAppointments.forEach(app => {
                  let obj = {
                    startTime: app.startDateTime,
                    endTime: app.endDateTime
                  };
                  let timeObj = this.getStartEndTime(obj),
                    startTime = timeObj.startTime,
                    endTime = timeObj.endTime;
                    if(!app.cancelTypeId || app.cancelTypeId==null && app.cancelTypeId==0)
                      {
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
              }

              this.staffAvailability = availibiltyResponse.data.days;
              this.providerAvailableDates = availibiltyResponse.data.available;
              this.providerNotAvailableDates =
                availibiltyResponse.data.unavailable;

              //Find day wise availability
              currentAvailabilityDay = this.staffAvailability.filter(
                x => x.dayName === dayName
              );

              //Find date wise availability
              if (
                this.providerAvailableDates != null &&
                this.providerAvailableDates.length > 0
              ) {
                currentAvailableDates = this.providerAvailableDates.filter(
                  x =>
                    this.datePipe.transform(new Date(x.date), "yyyyMMdd") ===
                    // this.datePipe.transform(new Date(event.value), "yyyyMMdd")
                    this.datePipe.transform(new Date(event), "yyyyMMdd")
                );
              }

              //find datewise unavailabilty
              if (
                this.providerNotAvailableDates != null &&
                this.providerNotAvailableDates.length > 0
              ) {
                currentUnAvailableDates = this.providerNotAvailableDates.filter(
                  x =>
                    this.datePipe.transform(new Date(x.date), "yyyyMMdd") ===
                    // this.datePipe.transform(new Date(event.value), "yyyyMMdd")
                    this.datePipe.transform(new Date(event), "yyyyMMdd")
                );
              }
              let slots: Array<any> = [];
              let slotsIntervals: Array<any> = [];
              let unAvaiabilityIntervalArr: Array<any> = [];
              let availDaySlots: Array<any> = [];
              let availDateSlots: Array<any> = [];
              let unAvailDateSlots: Array<any> = [];

              //let curentTime = this.parseTime(currentDate);
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
                  this.providerAvailiabilitySlots.push({
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
                  let status = (slot.statusName as string).toLowerCase();
                  if ((slot.statusName as string).toLowerCase() != "cancel") {
                    const foundIndex = this.providerAvailiabilitySlots.findIndex(
                      x =>
                        x.startTime == slot.startTime &&
                        x.endTime == slot.endTime
                    );
                    if (foundIndex != -1) {
                      this.providerAvailiabilitySlots[
                        foundIndex
                      ].isAvailable = false;
                      this.providerAvailiabilitySlots[
                        foundIndex
                      ].isReserved = true;
                      //slots = slots.filter((_, index) => index !== foundIndex);
                    }
                  }
                });
              }

              let currentDate = new Date();
              if (
                this.datePipe.transform(new Date(currentDate), "yyyyMMdd") ===
                // this.datePipe.transform(new Date(event.value), "yyyyMMdd")
                this.datePipe.transform(new Date(event), "yyyyMMdd")
              ) {
                let currentStartHr = currentDate.getHours(),
                  currentStartMin = currentDate.getMinutes(),
                  currentTime = currentStartHr * 60 + currentStartMin;
                this.providerAvailiabilitySlots.forEach(slot => {
                  if (slot.isAvailable == true) {
                    let selStart = slot.startTime.split(" ");
                    let selStartTime = selStart[0];
                    let selStartHr = +selStartTime.split(":")[0];
                    let selHrMin =
                      selStart[1] == "AM"
                        ? selStartHr * 60
                        : selStartHr == 12
                          ? selStartHr * 60
                          : (selStartHr + 12) * 60;
                    let selStartMin = +selHrMin + +selStartTime.split(":")[1];

                    let selEnd = slot.endTime.split(" ");
                    let selEndTime = selEnd[0];
                    let selEndHr = +selEndTime.split(":")[0];
                    let selEndHrMin =
                      selEnd[1] == "AM"
                        ? selEndHr * 60
                        : selEndHr == 12 ? selEndHr * 60 : (selEndHr + 12) * 60;
                    let selEndMin = +selEndHrMin + +selEndTime.split(":")[1];
                    if (
                      currentTime >= selStartMin &&
                      (currentTime >= selEndMin || currentTime < selEndMin)
                    ) {
                      slot.isPassed = true;
                      slot.isAvailable = false;
                      //slots = slots.filter((_, index) => index !== foundIndex);
                    }
                  }
                });
              }
            });
        }
      });
    // this.confirmation.date = event.value;
    this.confirmation.date = event;
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

  onTypeChange(type: any) {
    this.confirmation.type = type;
  }
  onModeChange(mode: any) {
    this.confirmation.mode = mode;
  }
  bindStaffProfile() {

    this.staffAwards = this.userInfo.staffAwardModels;
    this.staffExperiences = this.userInfo.staffExperienceModels;
    this.staffQualifications = this.userInfo.staffQualificationModels;
    this.staffTaxonomy = this.userInfo.staffTaxonomyModel;
    this.staffSpecialities = this.userInfo.staffSpecialityModel;
    this.staffServices = this.userInfo.staffServicesModels;
    this.fullname = this.commonService.getFullName(
      this.userInfo.firstName,
      this.userInfo.middleName,
      this.userInfo.lastName
    );
    if (this.locationId == 0) {
      this.locationId = this.userInfo.staffLocationList.find(
        x => x.isDefault === true
      ).id;
    }
    this.isProfileLoaded = true;
  }
  getStaffDetail() {
    if (this.providerId != "") {

      this.homeService.getProviderDetail(this.providerId).subscribe(res => {
        if (res.statusCode == 200) {
          this.userInfo = res.data;
          //providerCancellationRules
          this.bindStaffProfile();
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
    //location.reload();
  }

  jumpwaitingroom(){
    this.dialogModalRef.close('close');
    this.route.navigate(["/web/client/waiting-room"]);

  }

  bookNewAppointment(tokenId: string, paymentMode: string): any {

    this.submitted = true;


    const patientId = null;
    this.confirmation.date=new Date(Date.now());

    let _amount = 0;
    if(this.confirmation.type=='New' && this.confirmation.mode=='Online'){
      _amount = this.userInfo.payRate;
    }
    else if(this.confirmation.type=='New' && this.confirmation.mode=='Face to Face'){
      _amount = this.userInfo.ftFpayRate;
    }
    else if(this.confirmation.type=='Followup'){
      if(!this.checkIfAllowed){
        return;
      }
      _amount = this.userInfo.followUpPayRate;
    }

    if (this.locationId == 0) {
      this.locationId = this.userInfo.staffLocationList.find(
        x => x.isDefault === true
      ).id;
    }
    const appointmentData = [
      {
        PatientAppointmentId: null,
        AppointmentTypeID: null,
        AppointmentStaffs: [{ StaffId: this.staffId }],
        PatientID: null,
        ServiceLocationID: this.locationId || null,

        StartDateTime: getDateTimeString(
          this.confirmation.date,
          "11:00 AM"
        ),
        EndDateTime: getDateTimeString(
          this.confirmation.date,
          "11:30 AM"
        ),

        //IsTelehealthAppointment: true,

        // StartDateTime:"2021-12-14T10:00:00",
        // EndDateTime:"2021-12-14T10:30:00",
        IsTelehealthAppointment: true,//this.confirmation.mode=="Online"?true:false,
        IsExcludedFromMileage: true,
        IsDirectService: true,
        Mileage: null,
        DriveTime: null,
        latitude: 0,
        longitude: 0,
        // Notes: this.formGroup3.Notes.value,
        Notes: this.userControl.value,
        IsRecurrence: false,
        RecurrenceRule: null,
        Mode: this.confirmation.mode,
        Type: this.confirmation.type,
        //PayRate: this.userInfo.payRate,
        PayRate: _amount ,
        PaymentToken: tokenId,
        PaymentMode: paymentMode,
        IsBillable: true,
        IsUrgentCareAppointment: true,
      }
    ];
    const queryParams = {
      IsFinish: !appointmentData[0].RecurrenceRule,
      isAdmin: false
    };

    this.createAppointmentFromPatientPortal(appointmentData[0]);
  }
  createAppointmentFromPatientPortal(appointmentData: any) {

    this.schedulerService
      .bookUrgentCareAppointmentFromPatientPortal(appointmentData)
      .subscribe(response => {
        //this.submitted = false;
        if (response.statusCode === 200) {
          this.isNotBooked = false;
          //this.notifierService.notify("success", response.message);
        //   this.Message = {
        //     title: "Success!",
        //     message:
        //       "Thank you, Your appointment has been successfully booked with us, please contact administation for further assistance.",
        //     imgSrc: "../assets/img/user-success-icon.png"
        //   };
          //this.dialogModalRef.close("SAVE");
          //this.saveDocuments(response.data);
          //this.callProvideractionInitiate(response.data);
          //this.dialogModalRef.close("SAVE");
          this.route.navigate(["/web/client/my-vitals"]);
          //this.opentermconditionmodal();
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }






  bookNewFreeAppointment(tokenId: string, paymentMode: string): any {

    this.submitted = true;
    // if (this.appointmentForm.invalid) {
    //   this.submitted = false;
    //   return;
    // }

    // submit form
    // const selectedStaffs = this.appointmentForm.get("StaffIDs").value,
    //   selectedAppointmentTypeId = this.appointmentForm.get("AppointmentTypeID")
    //     .value,
    //   selectedPatientId = this.appointmentForm.get("PatientID").value,
    //   startDate = this.appointmentForm.get("startDate").value,
    //   startTime = this.appointmentStartTime, // this.appointmentForm.get('startTime').value,
    //   endTime = this.appointmentEndTime; // this.appointmentForm.get('endTime').value;

    // let appointmentStaffs = null;
    // let staffIds = Array.isArray(selectedStaffs)
    //   ? selectedStaffs
    //   : [selectedStaffs];
    // appointmentStaffs = (this.appointmentModal.appointmentStaffs || []
    // ).map(Obj => {
    //   return { StaffId: Obj.staffId, IsDeleted: true };
    // });
    // staffIds.forEach(staffId => {
    //   // update case for appointment staffs ------
    //   let staff = appointmentStaffs.find(
    //     Obj => Obj.StaffId === staffId && Obj.IsDeleted
    //   );
    //   if (staff) {
    //     let index = appointmentStaffs.indexOf(staff);
    //     appointmentStaffs[index] = { StaffId: staff.StaffId, IsDeleted: false };
    //   } else {
    //     appointmentStaffs.push({ StaffId: staffId, IsDeleted: false });
    //   }
    // });

    // let addressesObj = {
    //   CustomAddressID: null,
    //   CustomAddress: null,
    //   PatientAddressID: null,
    //   OfficeAddressID: null
    // };
    // if (
    //   this.selectedServiceLocation &&
    //   (this.selectedServiceLocation.key || "").toUpperCase() === "OTHER"
    // ) {
    //   addressesObj.CustomAddress = this.appointmentForm.get(
    //     "CustomAddress"
    //   ).value;
    //   addressesObj.CustomAddressID = this.appointmentForm.get(
    //     "CustomAddressID"
    //   ).value;
    // } else if (
    //   this.selectedServiceLocation &&
    //   (this.selectedServiceLocation.key || "").toUpperCase() === "PATIENT"
    // ) {
    //   addressesObj.PatientAddressID = this.selectedServiceLocation.id;
    // } else if (
    //   this.selectedServiceLocation &&
    //   (this.selectedServiceLocation.key || "").toUpperCase() === "OFFICE"
    // ) {
    //   addressesObj.OfficeAddressID = this.selectedServiceLocation.id;
    // }

    const patientId = null;
    // selectedPatientId && typeof selectedPatientId === "object"
    //   ? selectedPatientId.id
    //   : null;
    //this.recurrenceRule = this.appointmentId ? "" : this.recurrenceRule;

    if (this.locationId == 0) {
      this.locationId = this.userInfo.staffLocationList.find(
        x => x.isDefault === true
      ).id;
    }
    const appointmentData = [
      {
        PatientAppointmentId: null,
        AppointmentTypeID: null,
        AppointmentStaffs: [{ StaffId: this.staffId }],
        PatientID: null,
        ServiceLocationID: this.locationId || null,
        StartDateTime: getDateTimeString(
          this.confirmation.date,
          this.confirmation.startTime
        ),
        EndDateTime: getDateTimeString(
          this.confirmation.date,
          this.confirmation.endTime
        ),
        // IsTelehealthAppointment: true,
        IsTelehealthAppointment: this.confirmation.mode=="Online"?true:false,
        IsExcludedFromMileage: true,
        IsDirectService: true,
        Mileage: null,
        DriveTime: null,
        latitude: 0,
        longitude: 0,
        Notes: this.formGroup3.Notes.value,
        IsRecurrence: false,
        RecurrenceRule: null,
        Mode: this.confirmation.mode,
        Type: this.confirmation.type,
        // PayRate: this.userInfo.payRate,
        // PayRate: this.confirmation.mode=="Online"?this.userInfo.payRate:this.userInfo.ftFpayRate ,
        PayRate: 0.00,
        PaymentToken: tokenId,
        PaymentMode: paymentMode,
        IsBillable: true
      }
    ];
    const queryParams = {
      IsFinish: !appointmentData[0].RecurrenceRule,
      isAdmin: false
    };

    this.createFreeAppointmentFromPatientPortal(appointmentData[0]);
  }
  createFreeAppointmentFromPatientPortal(appointmentData: any) {
    this.schedulerService
      .bookNewFreeAppointmentFromPatientPortal(appointmentData)
      .subscribe(response => {
        this.submitted = false;
        if (response.statusCode === 200) {

          this.isNotBooked = false;
          //this.notifierService.notify("success", response.message);
          this.Message = {
            title: "Success!",
            message:
              "Thank you, Your appointment has been successfully booked with us, please contact administation for further assistance.",
            imgSrc: "../assets/img/user-success-icon.png"
          };
          //this.dialogModalRef.close("SAVE");
          // this.saveDocuments(response.data);
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  openfreeapptCheckout()
  {
    this.bookNewFreeAppointment("", "Free");
  }

  createModal() {

      let documentModal;
      documentModal = this.dialogModal.open(SaveDocumentComponent,{ data: 0 })
      documentModal.afterClosed().subscribe((result: string) => {
        // if (result == 'save')
        //   this.getUserDocuments();
      });
    }
    show:boolean=false;
    opentermconditionmodal() {
      let dbModal;
      dbModal = this.dialogModal.open(TermsConditionModalComponent, {
        hasBackdrop: true,
        width:'70%'
      });
      dbModal.afterClosed().subscribe((result: string) => {
       //
        if (result != null && result != "close") {

        }
        this.show=true;
      });
    }

    checkboxchecked() {

    }

  handleImageChange(e) {
    //if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
    let fileExtension = e.target.files[0].name.split('.').pop().toLowerCase();
    var input = e.target;
    var reader = new FileReader();
    reader.onload = () => {
      this.dataURL = reader.result;
      this.fileList.push({
        data: this.dataURL,
        ext: fileExtension,
        fileName: e.target.files[0].name
      });
    };
    reader.readAsDataURL(input.files[0]);
    // }
    // else
    //   this.notifier.notify('error', "Please select valid file type");
  }
  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }

  saveDocuments(apptId:number) {
    ///Please chnage this API to avoid loops

      if (this.fileList.length > 0) {
        let formValues = {
          base64: this.fileList,
          documentTitle: "Document",
          documentTypeIdStaff: 15,
          expiration: "",
          key: "STAFF",
          otherDocumentType: "",
          userId: 0,
          patientAppointmentId: apptId
        }
        let dic = [];
        formValues.base64.forEach((element, index) => {
          dic.push(`"${element.data.replace(/^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/, '')}": "${element.ext}"`);
        });
        let newObj = dic.reduce((acc, cur, index) => {
          acc[index] = cur;
          return acc;
        }, {})
        formValues.base64 = newObj;
        this.submitted = true;
        this.userService.uploadUserDocuments(formValues).subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response != null && response.statusCode == 200) {

            //this.notifier.notify('success', response.message);
            //this.closeDialog("save");
          }
          else this.notifier.notify('error', response.message);
        });
      }
      else {
        //this.notifier.notify('error', "Please add atleast one file");
      }
    }

    // getProvidersFollowUpDaysAllowed(staffId){
    //     this.schedulerService.getStaffFeeSettings(staffId).subscribe(response => {
    //       if (response.statusCode === 200) {
    //         this.feeSettings = response.data as ManageFeesRefundsModel;
    //       }
    //     })
    // }

    get checkIfAllowed() {
        if (this.confirmation.type == 'Followup') {
            if (this.userInfo && this.userInfo.followUpDays &&
                 this.firstFormGroup.controls.appointmentDate.value) {

                  return this.hasPreviousNewMeeting;
                // const startDate = new Date(this.firstFormGroup.controls.appointmentDate.value);
                // const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                // const diffDates: any = (<any>this.lastAppointmentDateTime - <any>startDate);
                // const diffDays = Math.round(Math.abs((diffDates) / oneDay))
                // if (diffDays > -1 && diffDays <= this.userInfo.followUpDays) {
                //     return true;
                // } else {
                //     return false;
                // }

            } else { return false; }
        } else { return true; }
    }

    getLastNewAppointment(staffId) {

        this.schedulerService.getGetLastNewAppointment(staffId).subscribe(response => {
            if (response.statusCode === 200) {
              this.hasPreviousNewMeeting = response.data ? true : false;
                // if (lastAppointment) {
                //     this.lastAppointmentDateTime = new Date(lastAppointment.startDateTime);
                //     this.hasPreviousNewMeeting = true;
                // }
            }
        });
    }

    closeModal(){
      this.dialogModal.closeAll();
    }

callProvideractionInitiate(pateintapptid:number){

    if (pateintapptid > 0 && this.userId > 0) {
        this.appService
          .getUrgentCareProviderActionInitiate(pateintapptid, this.userId)
          .subscribe((res) => {

            console.log(res);
          });
      }
    //   let callInitModel: UrgentCareProviderActionInitModel = new UrgentCareProviderActionInitModel();
    //   callInitModel.AppointmentId = pateintapptid;
    //   //callInitModel.CallStatus = CallStatus.Picked;
    //   this.appService.ProviderActioncallStarted(callInitModel);
}

showproviderunavailable(){
    this.isNotBooked=true;
    this.ApptReject=true;

}

getPatientSymptoms(searchText: string = 'headache'): any {
  return this.symptomCheckerService.getPatientSymptoms( searchText)
    .pipe(map(x => {
      return x;
    }));

}
add(event: MatChipInputEvent): void {

  // Add fruit only when MatAutocomplete is not open
  // To make sure this does not conflict with OptionSelected Event
  if (!this.matAutocomplete.isOpen) {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.symptoms.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.userControl.setValue(null);
  }
}

selected(event: MatAutocompleteSelectedEvent): void {

  this.symptoms.push({
    id: event.option.value.id,
    value: event.option.viewValue,
    choice_id:"present"

  });
 //this.optionChecked=true;
  this.userInput.nativeElement.value = event.option.viewValue;
  this.userControl.setValue(event.option.viewValue);

}

}
