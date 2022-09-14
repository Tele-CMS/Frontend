import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  AppointmentModel,
  RecurrenceAppointmentModel
} from "../scheduler.model";
import { SchedulerService } from "../scheduler.service";
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { getHours, getMinutes, format, getDate } from "date-fns";
import { Observable, of } from "rxjs";
import {
  startWith,
  map,
  debounceTime,
  switchMap,
  catchError,
  tap,
  finalize
} from "rxjs/operators";

interface ClientModal {
  id: number;
  value: string;
  dob: Date;
  mrn: string;
}

const getDateTimeString = (date: string, time: string): string => {
  const y = new Date(date).getFullYear(),
    m = new Date(date).getMonth(),
    d = new Date(date).getDate(),
    splitTime = time.split(":"),
    hours = parseInt(splitTime[0] || "0", 10),
    minutes = parseInt(splitTime[1].substring(0, 2) || "0", 10),
    meridiem = splitTime[1].substring(3, 5) || "",
    updatedHours = (meridiem || "").toUpperCase() === "PM" ? hours + 12 : hours;

  const startDateTime = new Date(y, m, d, updatedHours, minutes);

  return format(startDateTime, "YYYY-MM-DDTHH:mm:ss");
};

@Component({
  selector: "app-scheduler-dialog",
  templateUrl: "./scheduler-dialog.component.html",
  styleUrls: ["./scheduler-dialog.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class SchedulerDialogComponent implements OnInit {
  appointmentForm: FormGroup;
  appointmentModal: AppointmentModel;
  appointmentId: number;
  appointmentStartTime: string;
  appointmentEndTime: string;
  submitted: boolean = false;
  isPatientScheduler: boolean;
  isRequestFromPatientPortal: boolean;
  isAppointmentInPendingStatus: boolean;
  selectedOfficeLocations: Array<any>;
  selectedOfficeStaffs: Array<any>;
  selectedOfficeClients: Array<any>;
  selectedLocationId: number;
  filteredPatients$: Observable<ClientModal[]>;
  isloadingPatients: boolean = false;
  isloadingMasterData: boolean = false;
  masterPatientLocation: Array<any>;
  masterStaffs: Array<any>;
  masterAddressTypes: Array<any>;
  officeAndPatientLocations: Array<any>;
  masterAppointmentTypes: Array<any>;
  availabilityMessage: string = "";
  authorizationMessage: string = "";
  recurrenceRule: string = "";

  // recurrence appointments list
  isRecurrenceAppointmentsList: boolean;
  RecurrenceAppointmentsList: RecurrenceAppointmentModel[];
  metaData: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  schedulerPermissions: any;
  isNewAppointment:boolean;
  pageHeader:any="Create Appointment";
  constructor(
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService,
    public dialogPopup: MatDialogRef<SchedulerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.appointmentModal = data.appointmentData || new AppointmentModel();
    this.appointmentId = this.appointmentModal.patientAppointmentId;
    this.selectedOfficeLocations = data.selectedOfficeLocations || [];
    this.selectedOfficeStaffs = data.selectedOfficeStaffs || [];
    this.selectedOfficeClients = data.selectedOfficeClients || [];
    this.isPatientScheduler = data.isPatientScheduler || false;
    this.isRequestFromPatientPortal = data.isRequestFromPatientPortal || false;
    this.isNewAppointment=data.isNew;
    
    if(this.isNewAppointment!=undefined && this.isNewAppointment!=null)
    {
      this.pageHeader=this.isNewAppointment ?"Create Appointment":"Reschedule Appointment";
    }
    this.isAppointmentInPendingStatus =
      (this.appointmentModal.statusName || "").toUpperCase() == "PENDING";
    this.masterStaffs = [];
    this.masterPatientLocation = [];
    this.masterAppointmentTypes = [];
    this.masterAddressTypes = [];
    this.officeAndPatientLocations = [];
    if (this.selectedOfficeLocations.length === 1) {
      let [firstLocation] = data.selectedOfficeLocations;
      this.selectedLocationId = firstLocation.id;
    }

    // recurrence appointments list
    this.isRecurrenceAppointmentsList = false;
    this.RecurrenceAppointmentsList = [];
    this.displayedColumns = [
      {
        displayName: "Appt. Date",
        key: "startDate",
        isSort: false,
        class: "",
        width: "20%"
      },
      {
        displayName: "Start Time",
        key: "startTime",
        isSort: false,
        class: "",
        width: "15%"
      },
      {
        displayName: "End Time",
        key: "endTime",
        isSort: false,
        class: "",
        width: "15%"
      },
      {
        displayName: "Message",
        key: "message",
        isSort: false,
        class: "",
        width: "50%"
      }
      // { displayName: 'Actions', key: 'Actions', width:'10%' }
    ];
    this.actionButtons = [];
  }

  onClose(): void {
    this.dialogPopup.close();
  }

  initializeFormFields(appointmentObj?: AppointmentModel) {
    appointmentObj = appointmentObj || new AppointmentModel();

    const startDate = appointmentObj.startDateTime || new Date(),
      startTime =
        getHours(appointmentObj.startDateTime || new Date()) +
        ":" +
        getMinutes(appointmentObj.startDateTime || new Date()),
      endTime =
        getHours(appointmentObj.endDateTime || new Date()) +
        ":" +
        getMinutes(appointmentObj.endDateTime || new Date());

    this.selectedLocationId =
      appointmentObj.serviceLocationID || this.selectedLocationId;
    let StaffsId = null,
      PatientID: ClientModal;
    if (!this.appointmentId) {
      if (this.selectedOfficeStaffs.length === 1) {
        let [firstStaff] = this.selectedOfficeStaffs;
        StaffsId = firstStaff.id;
      }
      if (this.selectedOfficeClients.length === 1) {
        let [firstClient] = this.selectedOfficeClients;
        PatientID = {
          id: firstClient.id,
          value: firstClient.value,
          mrn: "",
          dob: new Date()
        };
      }
    } else {
      if (
        appointmentObj.appointmentStaffs &&
        appointmentObj.appointmentStaffs.length == 1
      ) {
        let [firstStaff] = appointmentObj.appointmentStaffs;
        StaffsId = firstStaff.staffId;
      }
      PatientID = {
        id: appointmentObj.patientID,
        value: appointmentObj.patientName,
        mrn: "",
        dob: new Date()
      };
    }

    this.appointmentStartTime = startTime;
    this.appointmentEndTime = endTime;
    const configControls = {
      startDate: [startDate, Validators.required],
      SelectedLocationID: [this.selectedLocationId, Validators.required],
      PatientID: [PatientID],
      AppointmentTypeID: [
        appointmentObj.appointmentTypeID,
        //Validators.required
      ],
      StaffIDs: [StaffsId, Validators.required],
      // ServiceLocationID: ["", Validators.required],
      ServiceLocationID: [""],
      CustomAddressID: [appointmentObj.customAddressID],
      CustomAddress: [appointmentObj.customAddress],
      ServiceAddress: [""],
      IsTelehealthAppointment: [appointmentObj.isTelehealthAppointment],
      IsDirectService: [appointmentObj.isDirectService],
      IsExcludedFromMileage: [appointmentObj.isExcludedFromMileage],
      Mileage: [appointmentObj.mileage],
      DriveTime: [appointmentObj.driveTime],
      Notes: [appointmentObj.notes],
      IsRecurrence: [appointmentObj.isRecurrence]
    };
    this.appointmentForm = this.formBuilder.group(configControls);
  }

  ngOnInit() {
    this.getUserPermissions(this.isRequestFromPatientPortal);
    this.initializeFormFields(this.appointmentModal);

    this.fetchMasterData();
    if (this.selectedLocationId)
      this.fetchStaffsAndLocations(this.selectedLocationId.toString());
    if (
      this.selectedLocationId ||
      (this.selectedLocationId && this.appointmentModal.patientID)
    )
      this.fetchDataForScheduler(this.selectedLocationId.toString());
    if (this.selectedLocationId && this.selectedOfficeStaffs.length === 1) {
      this.checkIsValidAppointment();
    }

    this.filteredPatients$ = this.appointmentForm
      .get("PatientID")
      .valueChanges.pipe(
        startWith(""),
        // delay emits
        debounceTime(100),
        // use switch map so as to cancel previous subscribed events, before creating new once
        tap(value => {
          value.length > 3
            ? (this.isloadingPatients = true)
            : (this.isloadingPatients = false);
        }),
        switchMap(value => {
          if (value.length > 2) {
            return this._filter(value).pipe(
              finalize(() => (this.isloadingPatients = false))
            );
          } else {
            // if no value is present, return null
            return of(null);
          }
        })
      );
  }

  displayFn(client?: ClientModal): string | undefined {
    return client ? client.value : undefined;
  }

  private _filter(value: string): Observable<ClientModal> {
    const filterValue = value.toLowerCase();
    return this.schedulerService
      .getPatientsByLocation(filterValue, this.selectedLocationId.toString())
      .pipe(
        map((response: any) => {
          if (response.statusCode !== 201) return of(null);
          else
            return (response.data || []).map((clientObj: any) => {
              const Obj: ClientModal = {
                id: clientObj.patientId,
                value: clientObj.firstName + " " + clientObj.lastName,
                dob: new Date(clientObj.dob),
                mrn: clientObj.mrn
              };
              return Obj;
            });
        }),
        catchError(_ => {
          return of(null);
        })
      );
  }

  get formControls() {
    return this.appointmentForm.controls;
  }

  public handleAddressChange(addressObj: any) {
    const pObJ = {
      CustomAddress: addressObj.address1
    };
    this.appointmentForm.patchValue(pObJ);
    this.appointmentModal.latitude = addressObj.latitude;
    this.appointmentModal.longitude = addressObj.longitude;
    // Do some stuff
  }

  get selectedServiceLocation(): any {
    const selectedObj = (this.officeAndPatientLocations || []).find(
      obj => obj.rowNo === this.formControls.ServiceLocationID.value
    );
    return selectedObj;
  }

  onStartDateSelected(event: any): void {
    if (this.selectedLocationId) {
      this.checkIsValidAppointment();
    }
    if (this.selectedLocationId && this.formControls.PatientID.value) {
      this.fetchDataForScheduler();
      this.checkAuthorizationDetails();
    }
  }

  onStartOrEndTimeSelected(type: string, value: string): void {
    this[type] = value;
    if (this.selectedLocationId) {
      this.checkIsValidAppointment();
    }
    if (this.selectedLocationId && this.formControls.PatientID.value) {
      this.fetchDataForScheduler();
      this.checkAuthorizationDetails();
    }
  }

  onLocationSelected(event: any): void {
    const source: MatSelect = event.source,
      value: any = event.value;
    if (value) this.fetchStaffsAndLocations(value);
    else this.masterStaffs = [];
  }

  onPatientSelected(event: any): void {
    if (this.selectedLocationId) {
      this.fetchDataForScheduler();
      this.checkAuthorizationDetails();
    }
  }

  onAppointmentTypeSelected(event: any): void {
    this.checkAuthorizationDetails();
  }

  onStaffSelected(event: any): void {
    this.checkIsValidAppointment();
  }

  onServiceLocationSelected(event: any): void {}

  onTelehealthCheckSelected(event: any): void {}

  onExcludedFromMileageCheckSelected(event: any): void {}

  onDirectServiceSelected(event: any): void {}

  onRecurrenceSelected(event: any): void {}

  onChangeRecurrenceRule(value: any): void {
    this.recurrenceRule = value;
  }

  onSubmit(): any {
    
    this.submitted = true;
    if (this.appointmentForm.invalid) {
      this.submitted = false;
      return;
    }

    // submit form
    const selectedStaffs = this.appointmentForm.get("StaffIDs").value,
      selectedAppointmentTypeId = this.appointmentForm.get("AppointmentTypeID")
        .value,
      selectedPatientId = this.appointmentForm.get("PatientID").value,
      startDate = this.appointmentForm.get("startDate").value,
      startTime = this.appointmentStartTime, // this.appointmentForm.get('startTime').value,
      endTime = this.appointmentEndTime; // this.appointmentForm.get('endTime').value;

    let appointmentStaffs = null;
    let staffIds = Array.isArray(selectedStaffs)
      ? selectedStaffs
      : [selectedStaffs];
    appointmentStaffs = (this.appointmentModal.appointmentStaffs || []
    ).map(Obj => {
      return { StaffId: Obj.staffId, IsDeleted: true };
    });
    staffIds.forEach(staffId => {
      // update case for appointment staffs ------
      let staff = appointmentStaffs.find(
        Obj => Obj.StaffId === staffId && Obj.IsDeleted
      );
      if (staff) {
        let index = appointmentStaffs.indexOf(staff);
        appointmentStaffs[index] = { StaffId: staff.StaffId, IsDeleted: false };
      } else {
        appointmentStaffs.push({ StaffId: staffId, IsDeleted: false });
      }
    });

    let addressesObj = {
      CustomAddressID: null,
      CustomAddress: null,
      PatientAddressID: null,
      OfficeAddressID: null
    };
    if (
      this.selectedServiceLocation &&
      (this.selectedServiceLocation.key || "").toUpperCase() === "OTHER"
    ) {
      addressesObj.CustomAddress = this.appointmentForm.get(
        "CustomAddress"
      ).value;
      addressesObj.CustomAddressID = this.appointmentForm.get(
        "CustomAddressID"
      ).value;
    } else if (
      this.selectedServiceLocation &&
      (this.selectedServiceLocation.key || "").toUpperCase() === "PATIENT"
    ) {
      addressesObj.PatientAddressID = this.selectedServiceLocation.id;
    } else if (
      this.selectedServiceLocation &&
      (this.selectedServiceLocation.key || "").toUpperCase() === "OFFICE"
    ) {
      addressesObj.OfficeAddressID = this.selectedServiceLocation.id;
    }

    const patientId =
      selectedPatientId && typeof selectedPatientId === "object"
        ? selectedPatientId.id
        : null;
    this.recurrenceRule = this.appointmentId ? "" : this.recurrenceRule;
    const appointmentData = [
      {
        PatientAppointmentId: this.appointmentId || null,
        AppointmentTypeID: selectedAppointmentTypeId || null,
        AppointmentStaffs: appointmentStaffs,
        PatientID: patientId || null,
        ServiceLocationID: this.selectedLocationId || null,
        StartDateTime: getDateTimeString(startDate, startTime),
        EndDateTime: getDateTimeString(startDate, endTime),
        IsTelehealthAppointment: this.formControls.IsTelehealthAppointment
          .value,
        IsExcludedFromMileage: this.formControls.IsExcludedFromMileage.value,
        IsDirectService: this.formControls.IsDirectService.value,
        Mileage:
          (!this.formControls.IsExcludedFromMileage.value &&
            this.formControls.Mileage.value) ||
          null,
        DriveTime:
          (!this.formControls.IsExcludedFromMileage.value &&
            this.formControls.DriveTime.value) ||
          null,
        latitude: this.appointmentModal.latitude || 0,
        longitude: this.appointmentModal.longitude || 0,
        Notes: this.formControls.Notes.value,
        IsRecurrence: this.formControls.IsRecurrence.value,
        RecurrenceRule:
          (this.formControls.IsRecurrence.value && this.recurrenceRule) || null,
        ...addressesObj
      }
    ];
    const queryParams = {
      IsFinish: !appointmentData[0].RecurrenceRule,
      isAdmin: false
    };

    if (this.isRequestFromPatientPortal) {
      this.createAppointmentFromPatientPortal(appointmentData[0]);
      return null;
    }

    this.createAppointment(appointmentData, queryParams);
  }

  onRecurrenceAppointmentSubmit() {
    const queryParams = {
      IsFinish: true,
      isAdmin: false
    };
    this.createAppointment(this.RecurrenceAppointmentsList, queryParams);
  }

  createAppointment(appointmentData: any, queryParams: any) {
    
    this.schedulerService
      .createAppointment(appointmentData, queryParams)
      .subscribe(response => {
        this.submitted = false;
        if (response.statusCode === 200) {
          if (queryParams.IsFinish) {
            this.notifier.notify("success", response.message);
            this.dialogPopup.close("SAVE");
          } else {
            this.isRecurrenceAppointmentsList = true;
            this.RecurrenceAppointmentsList = response.data;

            this.RecurrenceAppointmentsList = this.RecurrenceAppointmentsList.map(
              (obj, index) => {
                const availMsgs = (response.data[index].availabilityMessages ||
                  []
                ).map(msgObj => msgObj.message);
                obj.startDate = format(
                  obj.startDateTime.toString().replace("Z", ""),
                  "DD/MM/YYYY"
                );
                obj.startTime = format(
                  obj.startDateTime.toString().replace("Z", ""),
                  "h:mm a"
                );
                obj.endTime = format(
                  obj.endDateTime.toString().replace("Z", ""),
                  "h:mm a"
                );
                obj.message = availMsgs.join(",");
                return obj;
              }
            );
          }
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }

  createAppointmentFromPatientPortal(appointmentData: any) {
    this.schedulerService
      .createAppointmentFromPatientPortal(appointmentData)
      .subscribe(response => {
        this.submitted = false;
        if (response.statusCode === 200) {
          this.notifier.notify("success", response.message);
          this.dialogPopup.close("SAVE");
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }

  // validateAppointmentTypeName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
  //   return new Promise((resolve) => {
  //     const postData = {
  //       "labelName": "Appointment name",
  //       "tableName": "MASTER_APPOINTMENT_NAME",
  //       "value": ctrl.value,
  //       "colmnName": "NAME",
  //       "id": this.appointmentId,
  //     }
  //     if (!ctrl.dirty) {
  //       resolve();
  //     } else
  //     this.appointmentTypeService.validate(postData)
  //       .subscribe((response: any) => {
  //         if (response.statusCode !== 202)
  //           resolve({ uniqueName: true })
  //         else
  //           resolve();
  //       })
  //   })
  // }

  // api's calling ......
  fetchMasterData(): void {
    // load master data
    this.isloadingMasterData = true;
    const masterData = { masterdata: "MASTERPATIENTLOCATION" };
    this.schedulerService
      .getMasterData(masterData)
      .subscribe((response: any) => {
        this.isloadingMasterData = false;
        this.masterPatientLocation = response.masterPatientLocation || [];
      });
  }
  fetchStaffsAndLocations(locationId?: string): void {
    locationId = locationId || this.selectedLocationId.toString();

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
          this.masterStaffs = [];
        } else {
          this.masterStaffs = response.data.staff || [];
        }
      });
  }
  fetchDataForScheduler(locationId?: string): void {
    locationId = locationId || this.selectedLocationId.toString();
    const selectedPatientId = this.appointmentForm.get("PatientID").value,
      startDate = this.appointmentForm.get("startDate").value,
      startTime = this.appointmentStartTime, // this.appointmentForm.get('startTime').value,
      endTime = this.appointmentEndTime; // this.appointmentForm.get('endTime').value;

    const patientId =
      selectedPatientId && typeof selectedPatientId === "object"
        ? selectedPatientId.id
        : null;
    const appointmentData = {
      locationId: locationId || null,
      patientId: patientId || null,
      startDate: getDateTimeString(startDate, startTime),
      endDate: getDateTimeString(startDate, endTime)
    };
    this.schedulerService
      .getDataForScheduler(appointmentData)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.officeAndPatientLocations = [];
          this.masterAppointmentTypes = [];
        } else {
          this.masterAppointmentTypes =
            response.data.PatientPayerActivities || [];
          this.officeAndPatientLocations = response.data.PatientAddresses || [];

          if (this.appointmentModal.serviceLocationID) {
            let locationObj = null;
            if (
              this.appointmentModal.patientAddressID ||
              this.appointmentModal.officeAddressID
            ) {
              // here find the key to know which address is choosen
              let findKey = this.appointmentModal.patientAddressID
                ? "PATIENT"
                : this.appointmentModal.officeAddressID ? "OFFICE" : "";
              let selectedId =
                this.appointmentModal.patientAddressID ||
                this.appointmentModal.officeAddressID;
              locationObj = (this.officeAndPatientLocations || []).find(
                address =>
                  (address.key || "").toUpperCase() === findKey &&
                  address.id === selectedId
              );
            } else if (this.appointmentModal.customAddressID) {
              locationObj = (this.officeAndPatientLocations || []).find(
                obj => (obj.key || "").toUpperCase() === "OTHER"
              );
            }
            this.appointmentForm.patchValue({
              ServiceLocationID: locationObj.rowNo
            });
          }
        }
      });
  }
  checkIsValidAppointment(): void {
    const selectedStaffs = this.appointmentForm.get("StaffIDs").value,
      selectedAppointmentTypeId = this.appointmentForm.get("AppointmentTypeID")
        .value,
      selectedPatientId = this.appointmentForm.get("PatientID").value,
      startDate = this.appointmentForm.get("startDate").value,
      startTime = this.appointmentStartTime, // this.appointmentForm.get('startTime').value,
      endTime = this.appointmentEndTime; // this.appointmentForm.get('endTime').value;

    let appointmentStaffs = null;
    let staffIds = Array.isArray(selectedStaffs)
      ? selectedStaffs
      : [selectedStaffs];
    appointmentStaffs = (this.appointmentModal.appointmentStaffs || []
    ).map(Obj => {
      return { StaffId: Obj.staffId, IsDeleted: true };
    });
    staffIds.forEach(staffId => {
      // update case for appointment staffs ------
      let staff = appointmentStaffs.find(
        Obj => Obj.StaffId === staffId && Obj.IsDeleted
      );
      if (staff) {
        let index = appointmentStaffs.indexOf(staff);
        appointmentStaffs[index] = { StaffId: staff.StaffId, IsDeleted: false };
      } else {
        appointmentStaffs.push({ StaffId: staffId, IsDeleted: false });
      }
    });

    if (!appointmentStaffs || !appointmentStaffs.length) return null;

    const patientId =
      selectedPatientId && typeof selectedPatientId === "object"
        ? selectedPatientId.id
        : null;
    const appointmentData = [
      {
        PatientAppointmentId: this.appointmentId || null,
        AppointmentTypeID: selectedAppointmentTypeId || null,
        AppointmentStaffs: appointmentStaffs,
        PatientID: patientId || null,
        LocationId: this.selectedLocationId || null,
        StartDateTime: getDateTimeString(startDate, startTime),
        EndDateTime: getDateTimeString(startDate, endTime)
      }
    ];

    this.appointmentForm.get("StaffIDs").setErrors(null);
    this.schedulerService
      .checkIsValidAppointment(appointmentData)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.appointmentForm.get("StaffIDs").setErrors(null);
        } else {
          let data = response.data;
          let messagesArray = [];
          let isValidAppointment = true;
          if (data && data.length) {
            messagesArray = data.map(obj => {
              if (!obj.valid) {
                isValidAppointment = obj.valid;
                return obj.message;
              } else {
                return null;
              }
            });
          }
          this.availabilityMessage = messagesArray.join(", ");
          if (isValidAppointment)
            this.appointmentForm.get("StaffIDs").setErrors(null);
          else
            this.appointmentForm
              .get("StaffIDs")
              .setErrors({ notAvailable: true });
        }
      });
  }

  checkAuthorizationDetails(): void {
    const selectedAppointmentTypeId = this.appointmentForm.get(
        "AppointmentTypeID"
      ).value,
      selectedPatientId = this.appointmentForm.get("PatientID").value,
      startDate = this.appointmentForm.get("startDate").value,
      startTime = this.appointmentStartTime, // this.appointmentForm.get('startTime').value,
      endTime = this.appointmentEndTime; // this.appointmentForm.get('endTime').value;

    const patientId =
      selectedPatientId && typeof selectedPatientId === "object"
        ? selectedPatientId.id
        : null;

    if (!patientId || !selectedAppointmentTypeId) {
      return null;
    }

    const appointmentData = {
      appointmentId: this.appointmentId || null,
      patientId: patientId || null,
      appointmentTypeId: selectedAppointmentTypeId,
      startDate: getDateTimeString(startDate, startTime),
      endDate: getDateTimeString(startDate, endTime),
      isAdmin: true,
      patientInsuranceId: null,
      authorizationId: null
    };

    this.appointmentForm.get("AppointmentTypeID").setErrors(null);
    this.schedulerService
      .checkAuthorizationDetails(appointmentData)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.appointmentForm.get("StaffIDs").setErrors(null);
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
          this.authorizationMessage = authMessage;
          if (isValid)
            this.appointmentForm.get("AppointmentTypeID").setErrors(null);
          else
            this.appointmentForm
              .get("AppointmentTypeID")
              .setErrors({ notValid: true });
        }
      });
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
      SCHEDULING_LIST_VIEWOWNSOAP_ONLY
    } = actionPermissions;

    if (isRequestFromPatientPortal) {
      this.schedulerPermissions = {
        SCHEDULING_LIST_ADD: true,
        SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES: true
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
        SCHEDULING_LIST_VIEWOWNSOAP_ONLY
      };
    }
  }
}
