import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { LayoutService, CommonService } from "../../../core/services";
import { ResizeEvent } from "angular-resizable-element";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { format, addMinutes, addSeconds } from "date-fns";
import { EncounterService } from "./encounter.service";
import { NotifierService } from "angular-notifier";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { LocationModalComponent } from "../../masters/location-master/location-master-modal/location-master-modal.component";
import {
  FilterModel,
  ResponseModel,
  Metadata,
} from "../../../core/modals/common-model";
import { ServiceCodeModal } from "../../masters/service-codes/service-code.modal";
import { AgencyRegistrationService } from "../../../auth/agency-registration/agency-registration.service";

class EncounterPrograms {
  programTypeId: number = null;
  programName: string;
}

@Component({
  selector: "app-create-encounter",
  templateUrl: "./create-encounter.component.html",
  styleUrls: ["./create-encounter.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CreateEncounterComponent implements OnInit, OnDestroy {
  @Input() patientId: number;
  soapForm: FormGroup;
  submitted: boolean = false;
  submittedEmail: boolean = false;
  submittedEligibility: boolean = false;
  autoSaveSubmit: boolean;
  staffId: number;
  currenLocationId: number;
  patientEncounterChecklistModel: Array<any>;
  masterEncounterChecklistModel: Array<any>;
  masterEncounterChecklistAdministativeModel: Array<any>;
  masterEncChecklistReviewItems: Array<any>;
  encountersList: Array<any>;
  encounterChangeHistory: Array<any>;
  encounterId: number;
  isOpen: boolean;
  previousWidth: number;
  @ViewChild("dragsidebar") panel: ElementRef;
  isLoading: boolean;
  isLoadingList: boolean;
  firstTimeSaved: boolean;
  isFirstTime: boolean;
  appointmentId: number;
  patientAppointmentDetails: any;
  patientEncounterDetails: any;
  masterProgramTypes: Array<any>;
  masterEncounterMethods: Array<any>;
  masterEncounterTypes: Array<any>;
  encStartTime: string;
  encEndTime: string;
  countdownSeconds: number;
  countdownTimer: string;
  countdownFunction: any;
  autoSaveFunction: any;
  timeZoneName: string;
  locationData: LocationModalComponent[];
  LocationId: number;
  patientCurrentMedicationModel: Array<any>;
  metaData: Metadata;
  displayedColumns: Array<any>;
  masterServiceCode: any = [];
  isPatientEligible: boolean = false;
  userId: any;
  userDisplayName: any;
  patientEncounterServiceCodes: ServiceCodeModal[];
  previousEncounterServiceCodes: Array<ServiceCodeModal> = [];
  patientEncounterServiceCode: ServiceCodeModal;
  checkEligibilityAPIs: Array<any>;
  isMailSent: boolean = false;
  clientId: number;
  isCreate: boolean = false;
  apiId: number;
  eligibilityRequired: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private layoutService: LayoutService,
    private commonService: CommonService,
    private encounterService: EncounterService,
    private notifierService: NotifierService,
    private renderer: Renderer2,
    private router: Router,
    private dialogService: DialogService,
    private ref: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private agencyRegistrationService: AgencyRegistrationService
  ) {
    //this.submitted = false;
    this.staffId = null;
    this.currenLocationId = null;
    this.patientEncounterChecklistModel = [];
    this.masterEncounterChecklistModel = [];
    this.masterEncounterChecklistAdministativeModel = [];
    this.masterEncChecklistReviewItems = [];
    this.encounterChangeHistory = [];
    this.isOpen = true;
    this.encountersList = [];
    this.encounterId = 0;
    this.isLoading = this.isLoadingList = false;
    this.firstTimeSaved = undefined;
    this.isFirstTime = false;
    this.appointmentId = null;
    this.masterProgramTypes = [];
    this.masterEncounterMethods = [];
    this.masterEncounterTypes = [];
    this.countdownSeconds = 0;
    this.countdownTimer = "00:00:00";
    this.patientCurrentMedicationModel = [];
    this.metaData = new Metadata();
    this.displayedColumns = [
      {
        displayName: "Medication",
        key: "medication",
        class: "",
        width: "10%",
        isSort: true,
      },
      { displayName: "Dose", key: "dose", class: "", width: "8%" },
      { displayName: "Quantity", key: "quantity", class: "", width: "8%" },
      { displayName: "Days Supply", key: "daySupply", width: "10%" },
      { displayName: "Frequency", key: "frequency", class: "", width: "10%" },
      { displayName: "Condition", key: "condition", class: "", width: "10%" },
      { displayName: "Provider Name", key: "providerName", width: "12%" },
      {
        displayName: "Prescribed Date",
        key: "prescribedDate",
        width: "10%",
        type: "date",
        isSort: true,
      },
      { displayName: "Refills", key: "refills", width: "8%", isSort: true },
      {
        displayName: "Source",
        key: "source",
        width: "8%",
        type: ["Self Reported", "Claim"],
      },
      { displayName: "Notes", key: "notes", class: "", width: "10%" },
    ];

    this.checkEligibilityAPIs = [
      { displayName: "Internal", id: 5 },
      { displayName: "Blue Button", id: 1 },
      { displayName: 'AB2D', id: 2},
      { displayName: 'DPC', id: 3},
      { displayName: "BCDA", id: 4 },

    ];

    this.activatedRoute.queryParams.subscribe((params) => {
      this.clientId =
        params.id == undefined
          ? null
          : parseInt(this.commonService.encryptValue(params.id, false));
    });
  }

  ngOnInit() {
    this.layoutService.clientDrawerData.subscribe(
      ({ changedState, encounterId, appointmentId }) => {
        let clientPanel = this.layoutService.clientPanelRef;
        this.renderer.removeAttribute(clientPanel.nativeElement, "style");
        this.renderer.setAttribute(
          clientPanel.nativeElement,
          "class",
          `${changedState ? "resizepanel" : ""}`
        );
        this.appointmentId = appointmentId;
        this.encounterId = encounterId;
        if (
          this.encounterId == 0 ||
          this.encounterId == null ||
          this.encounterId == undefined
        )
          this.isCreate = true;
      }
    );

    this.commonService.currentLoginUserInfo.subscribe((user) => {
      this.staffId = user && user.id;
      this.currenLocationId = user && user.currentLocationId;

      if (user && user.userLocations)
        this.timeZoneName =
          user.userLocations.find((x) => x.id == this.currenLocationId) &&
          user.userLocations.find((x) => x.id == this.currenLocationId)
            .timeZoneName;
    });

    // (this.encStartTime = format(new Date(), "hh:mm A")),
    //   (this.encEndTime = format(addMinutes(new Date(), 1), "hh:mm A"));

    (this.encStartTime = convertTime12to24(format(new Date(), "hh:mm a"))),
    (this.encEndTime = convertTime12to24(format(addMinutes(new Date(), 1), "hh:mm a"))),

    // format(element.startTime, "HH:mm");
    this.soapForm = this.formBuilder.group({
      selectedEncounterId: [""],
      notes: [""],
      memberNotes: [""],
      startDate: [new Date()],
      startTime: [this.encStartTime],
      endTime: [this.encEndTime],
      // startTime: [format(new Date(), "hh:mm")],
     // endTime: [format(addMinutes(new Date(), 1), "hh:mm")],
      ProgramTypeIds: [""],
      ManualChiefComplaint: [""],
      EncounterMethodId: [""],
      EncounterTypeId: [""],
      LocationId: [""],
      serviceCodeIds: [""],
      apiId: [""],
    });

    this.getProgramList();
    this.getMasterData();

    if (this.encounterId > 0) {
      this.firstTimeSaved = false;
      this.getEncounterDetails(this.encounterId);
    } else if (this.appointmentId > 0) {
      this.getEncounterDetails(null, this.appointmentId).then((res) => {
        this.onSubmit();
      });
    } else {
      // this.isFirstTime = true;
      this.onSubmit();
      this.getEncountersList();
    }

    //This will start after eligibility check
    // if (this.firstTimeSaved === undefined) {
    //   this.startCountdownTimer();
    // }
    this.startAutoSaveAction();
    this.getLocationList();
  }

  ngOnDestroy(): void {
    this.countdownFunction && clearInterval(this.countdownFunction);
    this.autoSaveFunction && clearInterval(this.autoSaveFunction);
  }

  startAutoSaveAction() {
    this.autoSaveFunction = setInterval(() => {
      this.onSubmit(true);
    }, 240000);
  }

  startCountdownTimer() {
    this.countdownSeconds = 0;
    var theUpdatedMinute = 1;

    this.countdownFunction = setInterval(() => {
      this.countdownSeconds = this.countdownSeconds + 1;

      let totalSeconds = this.countdownSeconds;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;

      this.countdownTimer =
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);

        //this.soapForm.get("endTime").patchValue(convertTime12to24(format(updatedTime, "hh:mm A")));

      // console.log(totalSeconds, this.countdownSeconds)
      if(this.countdownSeconds < 60){
        let updatedTime = addMinutes(
          new Date(
            getDateTimeString(
              format(new Date(), "YYYY-MM-DD"),
              this.encStartTime
            )
          ),
          0
        );
        this.soapForm.get("endTime").patchValue(convertTime12to24(format(updatedTime, "hh:mm a")));
      }

      if (seconds == 0) {
        let updatedTime = addMinutes(
          new Date(
            getDateTimeString(
              format(new Date(), "YYYY-MM-DD"),
              this.encStartTime
            )
          ),
          minutes
        );
        //this.encEndTime = convertTime12to24(format(updatedTime, "hh:mm a"));
        this.encEndTime = format(updatedTime, "hh:mm a");
        this.soapForm.get("endTime").patchValue(convertTime12to24(format(updatedTime, "hh:mm a")));
      }
    }, 1000);
  }

  get formControls() {
    return this.soapForm.controls;
  }

  checkPatientEligibility() { 
    this.apiId= this.soapForm.value.apiId;
    if(!this.apiId){
      this.notifierService.notify("warning", "Please select an api.");
      return;
    } 
    this.submittedEligibility = true;
    var sjWT = '';
    if(this.apiId != 5){
    if(this.apiId == 3){
      sjWT = this.agencyRegistrationService.createJWTToken();
    }
    const data = {
      apiId: this.apiId,
      clientId: this.clientId,
      authToken: sjWT
    }
 
    this.encounterService
      .checkPatientEligibility(data)
      .subscribe((response) => {
        this.submittedEligibility = false;
        if (response.statusCode == 200) {
          this.isPatientEligible = response.data;
          if (this.isPatientEligible) {
            this.startCountdownTimer();
            this.notifierService.notify("success", response.message);
          } else
            this.notifierService.notify("warning", "Patient is not eligible.");
        }
        else if(response.statusCode == 500){
          this.notifierService.notify("error", response.message);
        }
        else{
          this.notifierService.notify("warning", response.message);
        }
      });
    }
    else{
      this.submittedEligibility = false;
      this.isPatientEligible = true;
      this.startCountdownTimer();
    }
    this.encStartTime = convertTime12to24(format(new Date(), "hh:mm a")),
    this.encEndTime = convertTime12to24(format(addMinutes(new Date(), 1), "hh:mm a"));
    this.soapForm.get("startTime").patchValue(convertTime12to24(format(new Date(), "hh:mm a")));
    this.soapForm.get("endTime").patchValue(format(addMinutes(new Date(), 1), "hh:mm a"));
    //this.getEncounterDetails(this.encounterId);
  }

  sendBBIntructionsMail() {
    this.submittedEmail = true;
    const webUrl = window.location.origin;
    const postData = {
      clientId: this.clientId,
      loginUrl: `${webUrl}/web/client-login`,
    };
    this.encounterService
      .sendBBIntructionsMail(postData)
      .subscribe((response) => {
        this.submittedEmail = false;
        if (response.statusCode == 200) {
          this.isMailSent = response.data;
          this.notifierService.notify("success", response.message);
        } else {
          this.isMailSent = response.data;
          this.notifierService.notify("error", response.message);
        }
      });
  }

  onChecklistSelection(event: any, item: any) {
    let tempChecklist = this.patientEncounterChecklistModel || [];
    this.redirectToTab(item);
    if (event.checked) {
      tempChecklist.push(item);
    } else {
      let index = tempChecklist.findIndex(
        (x) => x.masterEncounterChecklistId == item.masterEncounterChecklistId
      );
      tempChecklist.splice(index, 1);
    }
    this.patientEncounterChecklistModel = tempChecklist;
  }

  isItemChecked(item: any) {
    return (
      this.patientEncounterChecklistModel.findIndex(
        (x) => x.masterEncounterChecklistId == item.masterEncounterChecklistId
      ) != -1
    );
  }

  onEncounterSelect(event: any) {
    if (this.firstTimeSaved == true) {
      this.dialogService
        .confirm("Are you sure you want to discard the encounter changes?")
        .subscribe((result: any) => {
          if (result == true) {
            this.firstTimeSaved = false;
            this.encounterId > 0 &&
              this.encounterService
                .discardEncounterChanges(this.encounterId)
                .subscribe();
            this.countdownFunction && clearInterval(this.countdownFunction);
            this.encounterId = event.value;
            this.layoutService.changeClientDrawerData(true, {
              encounterId: this.encounterId,
              firstTimeSaved: this.firstTimeSaved,
            });
            this.getEncounterDetails(this.encounterId);
          } else {
            this.soapForm.get("selectedEncounterId").patchValue(null);
          }
        });
    } else {
      this.encounterId = event.value;
      this.getEncounterDetails(this.encounterId);
    }
  }

  onEncounterTimeSet(key: string, value: any) {
    this[key] = value;

    if (this.firstTimeSaved === true && key == "encStartTime") {
      let updatedTime = addSeconds(
        new Date(
          getDateTimeString(format(new Date(), "YYYY-MM-DD"), this.encStartTime)
        ),
        this.countdownSeconds
      );
      this.encEndTime = format(updatedTime, "hh:mm a");
    }
  }

  resetFormValue(key: string) {
    this.soapForm.get(key).patchValue(null);
  }

  onSubmit(isAutoSave?: boolean) { 
    if (
      this.soapForm.invalid &&
      this.firstTimeSaved != undefined &&
      !isAutoSave
    ) { 
      alert("Please fill mandatory fields.");
      return null;
    }
    const {
      notes,
      memberNotes,
      startDate,
      startTime,
      endTime,
      ProgramTypeIds,
      ManualChiefComplaint,
      EncounterMethodId,
      EncounterTypeId,
      LocationId,
    } = this.soapForm.value;
    let appointmentStaffs;
    let {
      staffID,
      serviceLocationID,
      patientAddressID,
      officeAddressID,
      customAddressID,
      customAddress,
    } = this.patientEncounterDetails || {
      staffID: null,
      serviceLocationID: null,
      patientAddressID: null,
      officeAddressID: null,
      customAddressID: null,
      customAddress: null,
    };
    if (this.patientAppointmentDetails) {
      appointmentStaffs =
        this.patientAppointmentDetails.appointmentStaffs || [];
      serviceLocationID = this.patientAppointmentDetails.serviceLocationID;
      patientAddressID = this.patientAppointmentDetails.patientAddressID;
      officeAddressID = this.patientAppointmentDetails.officeAddressID;
      customAddressID = this.patientAppointmentDetails.customAddressID;
      customAddress = this.patientAppointmentDetails.customAddress;
    } else if (!this.patientEncounterDetails) {
      serviceLocationID = this.currenLocationId;
      officeAddressID = this.currenLocationId;
    }
    if (appointmentStaffs && appointmentStaffs.length > 0) {
      this.staffId = appointmentStaffs[0] && appointmentStaffs[0].staffId;
    }
    //  const startDateTime = getDateTimeString(startDate, this.encStartTime),
    //    endDateTime = getDateTimeString(startDate, this.encEndTime);
    const startDateTime = getDateTimeString(startDate, startTime),
      endDateTime = getDateTimeString(startDate, endTime);

    let tempPrograms = (ProgramTypeIds || []).map((x) => {
      let apptPrograms = new EncounterPrograms();
      apptPrograms.programTypeId = x;
      return apptPrograms;
    });
    let formValues = this.soapForm.value;
    this.patientEncounterServiceCodes = new Array<ServiceCodeModal>();
    formValues.serviceCodeIds != null &&
      formValues.serviceCodeIds != "" &&
      formValues.serviceCodeIds.forEach((element) => {
        this.patientEncounterServiceCode = new ServiceCodeModal();
        this.patientEncounterServiceCode.serviceCodeId = element;
        this.patientEncounterServiceCodes.push(
          this.patientEncounterServiceCode
        );
      });
    this.previousEncounterServiceCodes != null &&
      this.previousEncounterServiceCodes.forEach((x) => {
        if (
          this.patientEncounterServiceCodes.findIndex(
            (y) => +y.serviceCodeId == +x.serviceCodeId
          ) == -1
        ) {
          this.patientEncounterServiceCodes.push(x);
        }
      });

    const postData = {
      Id: this.encounterId || 0,
      PatientID: this.patientId,
      PatientAppointmentId: this.appointmentId,
      DateOfService: startDateTime,
      StartDateTime: startDateTime,
      EndDateTime: endDateTime,
      StaffID: staffID || this.staffId,
      ServiceLocationID:
        LocationId != undefined && LocationId > 0
          ? LocationId
          : serviceLocationID,
      locationName: LocationId,
      PatientAddressID: patientAddressID,
      OfficeAddressID: officeAddressID,
      CustomAddressID: customAddressID,
      CustomAddress: customAddress,
      notes: notes || null,
      memberNotes: memberNotes || null,
      patientEncounterChecklistModel: this.patientEncounterChecklistModel || [],
      PatientEncounterServiceCodes: this.patientEncounterServiceCodes || [],
      PatientEncounterDiagnosisCodes: [],
      ProgramTypeIds: tempPrograms,
      ManualChiefComplaint: ManualChiefComplaint || "",
      EncounterMethodId: EncounterMethodId,
      EncounterTypeId: EncounterTypeId,
      isBillableEncounter: false,
      isCompleted: false,
      isActive: true,
      patientCurrentMedicationModel: this.patientCurrentMedicationModel || [],
      isPatientEligible: this.isPatientEligible,
    };

    if (!isAutoSave) this.savePatientEncounter(postData);
    else this.autoSavePatientEncounter(postData);
  }

  savePatientEncounter(postData: any, isAdmin: boolean = false) {
    this.submitted = true;
    this.encounterService
      .SavePatientEncounter(postData, isAdmin)
      .subscribe((response) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.encounterId = response.data && response.data.id;
          // condition
          if (this.firstTimeSaved == true) {
            this.firstTimeSaved = false;
          }

          if (this.firstTimeSaved != undefined) {
            //this.notifierService.notify("success", response.message);
            if (this.isCreate) {
              this.createClaim(this.encounterId, response.message);
              //this.notifierService.notify("success", response.message);
            }
            // this.layoutService.changeClientDrawerData(false, {}, true);
            // const encClientId = this.commonService.encryptValue(
            //   this.patientId,
            //   true
            // );
            // this.router.navigate([`/web/client/encounter`], {
            //   queryParams: { id: encClientId },
            // });
          } else if (this.firstTimeSaved == undefined) {
            this.firstTimeSaved = true;
            this.layoutService.changeClientDrawerData(true, {
              encounterId: this.encounterId,
              firstTimeSaved: this.firstTimeSaved,
            });
            this.getEncounterDetails(this.encounterId, this.appointmentId);
          }
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  autoSavePatientEncounter(postData: any, isAdmin: boolean = false) {
    console.log("auto save is calling..");

    this.autoSaveSubmit = true;
    this.encounterService.SavePatientEncounter(postData, isAdmin).subscribe(
      (response) => {
        this.autoSaveSubmit = false;
        if (response.statusCode == 200) {
          // update only the Ids for checklist items
          this.encounterService
            .GetPatientEncounterDetails(
              this.appointmentId,
              this.encounterId,
              false
            )
            .subscribe((response) => {
              if (response.statusCode == 200) {
                let allChecklistItems =
                  response.data.patientEncounterChecklistModel || [];
                let masterEncounterChecklist = allChecklistItems.filter(
                  (x) => !x.isAdministrativeType
                );
                let masterEncounterChecklistAdministative =
                  allChecklistItems.filter((x) => x.isAdministrativeType);

                this.masterEncounterChecklistModel.forEach((item) => {
                  let obj = masterEncounterChecklist.find(
                    (x) =>
                      x.masterEncounterChecklistId ==
                        item.masterEncounterChecklistId && x.id > 0
                  );
                  if (obj) {
                    item.id = obj.id;
                    item.patientEncounterId = obj.patientEncounterId;
                  }
                });

                this.masterEncounterChecklistAdministativeModel.forEach(
                  (item) => {
                    let obj = masterEncounterChecklistAdministative.find(
                      (x) =>
                        x.masterEncounterChecklistId ==
                          item.masterEncounterChecklistId && x.id > 0
                    );
                    if (obj) {
                      item.id = obj.id;
                      item.patientEncounterId = obj.patientEncounterId;
                    }
                  }
                );
              }
            });
        } else {
          this.notifierService.notify("error", response.message);
        }
      },
      () => {
        this.autoSaveSubmit = false;
      }
    );
  }

  getEncounterDetails(
    encounterId: number,
    appointmentId: number = null
  ): Promise<boolean> {
    console.log("get encounter details is calling..");
    // var appointmentId;
    // var encounterId;
    // if(this.isFirstTime){
    //   encounterId = 0;
    //   appointmentId = 0;
    // }else{
    //   encounterId = theEncounterId;
    //   appointmentId = theAppointmentId;
    // }
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      this.encounterService
        .GetPatientEncounterDetails(appointmentId, encounterId, false)
        .subscribe(
          (response) => {
            console.log("response ", response);
            this.isLoading = false;
            if (response.statusCode == 200) {
              let allChecklistItems =
                response.data.patientEncounterChecklistModel || [];
              this.patientEncounterDetails = response.data;
              this.patientAppointmentDetails =
                response.data.patientAppointment || null;
              this.masterEncounterChecklistModel = allChecklistItems.filter(
                (x) => !x.isAdministrativeType
              );
              this.masterEncounterChecklistAdministativeModel =
                allChecklistItems.filter((x) => x.isAdministrativeType);
              this.masterEncChecklistReviewItems =
                response.data.encounterChecklistReviewItems || [];
              this.encounterChangeHistory =
                response.data.encounterChangeHistory || [];
              this.patientEncounterChecklistModel = allChecklistItems.filter(
                (x) => x.id > 0
              );
              this.patientCurrentMedicationModel =
                response.data.patientCurrentMedicationModel || [];
              if (encounterId > 0) {
                const ProgramTypeIds = (response.data.programTypeIds || []).map(
                  (x) => x.programTypeId
                );
                const notes = (response.data.notes || "")
                    .replace(/#x20;/g, "")
                    .replace(/\\n/g, "\n"),
                  startDate = new Date(response.data.startDateTime),
                  ManualChiefComplaint =
                    response.data.manualChiefComplaint || "",
                  EncounterMethodId = response.data.encounterMethodId,
                  EncounterTypeId = response.data.encounterTypeId,
                  memberNotes = response.data.memberNotes,
                  startTime = convertTime12to24(
                    format(new Date(response.data.startDateTime), "hh:mm a")
                  ),
                  endTime = convertTime12to24(
                    format(new Date(response.data.endDateTime), "hh:mm a")
                  ),
                  LocationId = response.data.serviceLocationID;
                // LocationId = response.data.ServiceLocationID;

                // this.encStartTime = convertTime12to24(
                //   format(new Date(response.data.startDateTime), "hh:mm A")
                // ),
                // this.encEndTime = convertTime12to24(
                //   format(new Date(response.data.endDateTime), "hh:mm A")
                // ),
                // this.encStartTime = format(
                //   new Date(response.data.startDateTime),
                //   "hh:mm A"
                // );
                // this.encEndTime = format(
                //   new Date(response.data.endDateTime),
                //   "hh:mm A"
                // );
                this.previousEncounterServiceCodes =
                  response.data.patientEncounterServiceCodes;

                this.patientEncounterServiceCodes =
                  response.data.patientEncounterServiceCodes != null &&
                  response.data.patientEncounterServiceCodes.length > 0
                    ? response.data.patientEncounterServiceCodes.map(
                        ({ serviceCodeId }) => +serviceCodeId
                      )
                    : [];
                const serviceCodeIds = (
                  response.data.patientEncounterServiceCodes || []
                ).map((x) => x.serviceCodeId);
                if (this.patientEncounterServiceCodes.length > 0)
                  this.isPatientEligible =
                    this.patientEncounterDetails.isPatientEligible;

                    if(this.isPatientEligible){
                      this.soapForm.get("apiId").clearValidators();
                    }

                this.soapForm.patchValue({
                  notes,
                  startDate,
                  startTime,
                  endTime,
                  ProgramTypeIds,
                  ManualChiefComplaint,
                  EncounterMethodId,
                  EncounterTypeId,
                  memberNotes,
                  LocationId,
                  serviceCodeIds,
                });
              } else if (this.patientAppointmentDetails) {
                const ProgramTypeIds = (
                  this.patientAppointmentDetails.programTypeIds || []
                ).map((x) => x.programTypeId);
                const startDate = new Date(
                    this.patientAppointmentDetails.startDateTime
                  ),
                  EncounterMethodId =
                    this.patientAppointmentDetails.encounterMethodId,
                  EncounterTypeId =
                    this.patientAppointmentDetails.encounterTypeId,
                  LocationId = this.patientAppointmentDetails.serviceLocationID;
                // LocationId = this.patientAppointmentDetails.locationName;
                this.encStartTime = format(
                  new Date(this.patientAppointmentDetails.startDateTime),
                  "hh:mm a"
                );
                this.encEndTime = format(
                  new Date(this.patientAppointmentDetails.startDateTime),
                  "hh:mm a"
                ); // same as startDateTime cause its being update by countdown
                this.soapForm.patchValue({
                  startDate,
                  ProgramTypeIds,
                  EncounterMethodId,
                  EncounterTypeId,
                  LocationId,
                });
              }
            } else {
              this.masterEncounterChecklistModel = [];
              this.patientEncounterChecklistModel = [];
              this.masterEncChecklistReviewItems = [];
              this.encounterChangeHistory = [];
              this.patientEncounterServiceCodes = [];
            }
            resolve(true);
          },
          () => {
            this.isLoading = false;
            reject();
          }
        );
    });
  }

  getEncountersList() {
    this.isLoadingList = true;
    this.encounterService.getClientEncounters(this.patientId).subscribe(
      (response) => {
        this.isLoadingList = false;
        if (response.statusCode == 200) {
          this.encountersList = (response.data || []).map((obj: any) => {
            obj.dateOfService =
              format(obj.dateOfService, "MM/DD/YYYY") +
              " (" +
              format(obj.startDateTime, "h:mm A") +
              " - " +
              format(obj.endDateTime, "h:mm A") +
              ")";
            return obj;
          });
        } else {
          this.encountersList = [];
        }
      },
      () => {
        this.isLoadingList = false;
      }
    );
  }

  getMmasterEncChecklistReviewItems(id: number) {
    return this.masterEncChecklistReviewItems.filter(
      (x) => x.masterEncounterChecklistId == id
    );
  }

  getEncounterChangeHistory(id: number) {
    return this.encounterChangeHistory.filter(
      (x) => x.masterEncounterChecklistId == id
    );
  }

  onValidateResize(event: ResizeEvent): boolean {
    let perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    return true;
  }

  onResizing(event: ResizeEvent): boolean {
    const perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    this.renderer.setStyle(this.panel.nativeElement, "width", `${perValue}%`);
    let clientPanel = this.layoutService.clientPanelRef;
    this.renderer.setStyle(
      clientPanel.nativeElement,
      "margin-right",
      `${event.rectangle.width}px`
    );
  }

  onClientToggle() {
    this.isOpen = !this.isOpen;
    let clientPanel = this.layoutService.clientPanelRef;
    if (!this.isOpen) {
      this.previousWidth = this.panel.nativeElement.clientWidth;
      this.renderer.setStyle(this.panel.nativeElement, "width", `0px`);
      this.renderer.setStyle(clientPanel.nativeElement, "margin-right", `0px`);
    } else {
      this.renderer.removeAttribute(this.panel.nativeElement, "style");
      this.renderer.removeAttribute(clientPanel.nativeElement, "style");
    }
  }

  redirectToTab(item) {
    if (!item.navigationLink || item.navigationLink.trim().length == 0) return;
    const encClientId = this.commonService.encryptValue(this.patientId, true);
    this.router.navigate([`/web${item.navigationLink}`], {
      queryParams: { id: encClientId },
    });
  }

  onCloseCreateEncounterForm() {
    if (this.firstTimeSaved == true) {
      this.dialogService
        .confirm(
          "Are you sure you want to discard the current encounter changes?"
        )
        .subscribe((result: any) => {
          if (result == true) {
            this.encounterId > 0 &&
              this.encounterService
                .discardEncounterChanges(this.encounterId)
                .subscribe();
            this.layoutService.changeClientDrawerData(false, {});
          }
        });
    } else {
      this.layoutService.changeClientDrawerData(false, {});
    }
  }

  getProgramList() {
    this.encounterService
      .getDiseaseManagementProgramList()
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.masterProgramTypes = response.data || [];
        } else {
          this.masterProgramTypes = [];
        }
      });
  }

  getMasterData() {
    const masterData = {
      masterdata: "ENCOUNTERTYPES,ENCOUNTERMETHODS,MASTERSERVICECODE",
    };
    this.encounterService
      .getMasterData(masterData)
      .subscribe((response: any) => {
        this.masterEncounterTypes = response.encounterTypes || [];
        this.masterEncounterMethods = response.encounterMethods || [];
        this.masterServiceCode = response.masterServiceCode || [];
      });
  }

  getLocationList() {
    this.encounterService.getAll().subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.locationData = response.data;
        console.log("locationn data ", this.locationData);
      } else {
        this.locationData = [];
      }
    });
  }

  createClaim(encounterId: number, message: any) {
    this.encounterService
      .createClaim(encounterId, false)
      .subscribe((response) => {
        if (response.statusCode == 1) {
          //this.notifierService.notify("success", response.message);
          this.layoutService.changeClientDrawerData(false, {}, true);
            const encClientId = this.commonService.encryptValue(
              this.patientId,
              true
            );
            this.notifierService.notify("success", "Encounter saved successfully.");
            this.router.navigate([`/web/client/encounter`], {
              queryParams: { id: encClientId },
            });
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }
}

const getDateTimeString = (date: string, time: string): string => {
  const y = new Date(date).getFullYear(),
    m = new Date(date).getMonth(),
    d = new Date(date).getDate(),
    splitTime = time.split(":"),
    hours = parseInt(
      splitTime[0] && splitTime[0] != "12" ? splitTime[0] : "0",
      10
    ),
    minutes = parseInt(splitTime[1].substring(0, 2) || "0", 10),
    meridiem = splitTime[1].substring(3, 5) || "",
    updatedHours = (meridiem || "").toUpperCase() === "PM" ? hours + 12 : hours;

  const startDateTime = new Date(y, m, d, updatedHours, minutes);

  return format(startDateTime, "YYYY-MM-DDTHH:mm:ss");
};

const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier.toUpperCase() === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};
