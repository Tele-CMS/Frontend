import { DiagnosisService } from "./../diagnosis/diagnosis.service";
import { DialogService } from "./../../../../../shared/layout/dialog/dialog.service";
import { ResponseModel } from "./../../../../../super-admin-portal/core/modals/common-model";
//import { DiagnosisModalComponent } from "./../../clients/diagnosis/diagnosis-modal/diagnosis-modal.component";
//import { ChatService } from "src/app/platform/modules/agency-portal/encounter/mean-video/chat.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { EncounterService } from "../encounter.service";
import { NotifierService } from "angular-notifier";
import { format, addDays } from "date-fns";
import { MatDialog, MatPaginator, MatSort } from "@angular/material";
import { SignDialogComponent } from "../sign-dialog/sign-dialog.component";
import { ClientHeaderModel } from "../../clients/client-header.model";
import { CommonService } from "../../../core/services";
import { DatePipe } from "@angular/common";
import { TemplateFormComponent } from "../template-form/template-form.component";
import { ServiceCodeModal } from "../../masters/service-codes/service-code.modal";
import { DiagnosisModel, PatientEncounterNotesModel } from "../../clients/diagnosis/diagnosis.model";
import { FormioOptions } from "angular-formio";
import { ResizeEvent } from "angular-resizable-element";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { DiagnosisModalComponent } from "src/app/platform/modules/agency-portal/encounter/diagnosis/diagnosis-modal/diagnosis-modal.component";
import { AddServiceCodeModalComponent } from "src/app/platform/modules/agency-portal/encounter/service-code-modal/add-service-code-modal.component";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus } from "src/app/shared/models/callModel";
import { PatientEncounterNotesModalComponent } from "../patientencounternotes-modal/patientencounternotes.component";
import { ClientsService } from "../../clients/clients.service";
import { UserDocumentModel } from "../../users/users.model";
import { FilterModel, Metadata } from "../../../core/modals/common-model";
import { ThrowStmt } from "@angular/compiler";
class signModal {
  id: number = 0;
  bytes: string = null;
  date: string = null;
  name: string = null;
}

@Component({
  selector: "app-soap",
  templateUrl: "./soap.component.html",
  styleUrls: ["./soap.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class SoapComponent implements OnInit, OnDestroy {
  @ViewChild("dragsidebar") panel: ElementRef;
  @ViewChild("videoDiv") panelVideo: ElementRef;
  @ViewChild("SOAPPanel") SOAPPanel: ElementRef;
  @ViewChild("videoTool") videoTool: ElementRef;

  serviceCodeModal: ServiceCodeModal;
  patientEncounterServiceCodes: ServiceCodeModal[];
  soapForm: FormGroup;
  appointmentId: number;
  encounterId: number;
  soapNoteId: number;
  submitted: boolean;
  submittedSign: boolean;
  appConfiguration: Array<any>;
  patientEncounterDiagnosisCodes: DiagnosisModel[];
  patientEncounterTemplate: Array<any>;
  // patientEncounterServiceCodes: Array<any>;
  patientAppointmentDetails: any;
  soapNotes: any;
  encounterSignature: Array<any>;
  staffDetails: any;
  appointmentStartTime: string;
  appointmentEndTime: string;
  unitsConsumed: number;
  patientSign: signModal = new signModal();
  employeeSign: signModal = new signModal();
  guardianSign: signModal = new signModal();
  isGuardianSigned: boolean;
  isClientSigned: boolean;
  isEmployeeSigned: boolean;
  isAllSigned: boolean;
  isSoapCompleted: boolean;
  istelehealthappt: boolean;
  public style: object = {};
  public styleVideo: object = {};
  // template forms
  masterTemplates: Array<any>;
  // public jsonFormData: Object = {
  //   components: []
  // };
  // initialFormValues: Object = {};
  // formioOptions: FormioOptions = {
  //   disableAlerts: true
  // }
  templateFormId: number = null;
  templateFormName: string = null;
  diagnosisCodeModel: DiagnosisModel;
  // client header info
  clientHeaderModel: ClientHeaderModel;
  FormData: any;
  initialValue: any;
  isSoap: boolean = false;
  previousEncounters: Array<any>;
  previousEncounterId: number;
  isPreviousEncounter: boolean = false;
  isSubmitted: boolean = false;
  templateIdFromDD: any = null;
  encounterTemplateId: any;
  showFormioDiv: any;
  userDisplayName: string;
  public jsonFormData: Object = {
    components: [],
  };
  initialFormValues: Object = {
    data: {},
  };
  formioOptions: FormioOptions = {
    disableAlerts: true,
  };
  diagnosisModel: DiagnosisModel;
  patientencounternotesmodel: PatientEncounterNotesModel;
  clientId: number;
  userId: number;
  todayDate = new Date();
  fromDate: string;
  toDate: string;
  documentList: Array<UserDocumentModel> = [];
  enc_EId: any;
  encry_appTId: any;
  metaData: Metadata;
  filterModel: FilterModel;
  searchText: string = ''
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  encounterNotes: any;
  isTemplateSubmitted: boolean = false;
  isApptCompleted: boolean = false;

  constructor(
    private signDailog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private encounterService: EncounterService,
    private notifierService: NotifierService,
    private commonService: CommonService,
    private serviceCodeDailog: MatDialog,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    //private chatService: ChatService,
    private diagnosisService: DiagnosisService,
    private diagnosisDialogModal: MatDialog,
    private patientencounternotesDialogModal: MatDialog,
    private dialogService: DialogService,
    private appService: AppService,
    private clientService: ClientsService,
    private notifier: NotifierService
  ) {
    this.submitted = false;
    this.submittedSign = false;
    this.soapNoteId = 0;
    this.appConfiguration = [];
    this.patientEncounterDiagnosisCodes = [];
    this.patientEncounterServiceCodes = [];
    this.patientEncounterTemplate = [];
    this.patientAppointmentDetails = null;
    this.soapNotes = null;
    this.encounterSignature = [];
    this.staffDetails = null;
    this.appointmentStartTime = null;
    this.appointmentEndTime = null;
    this.unitsConsumed = 0;
    this.isGuardianSigned = false;
    this.isClientSigned = false;
    this.isEmployeeSigned = false;
    this.isAllSigned = false;
    this.isSoapCompleted = false;
    this.masterTemplates = [];
    this.metaData = new Metadata();
    this.filterModel = new FilterModel();
    this.clientHeaderModel = new ClientHeaderModel();
    if (this.activatedRoute.snapshot.url[0] && this.activatedRoute.snapshot.url[0].path === "check-in-soap") {
      this.encry_appTId = this.activatedRoute.snapshot.paramMap.get('id');
      var decryptAppID = this.commonService.encryptValue(this.encry_appTId,false);
      this.appointmentId = Number(decryptAppID);
      if(this.activatedRoute.snapshot.paramMap.get('enc_EId')){
      this.enc_EId = this.activatedRoute.snapshot.paramMap.get('enc_EId');
      var decryptEncID = this.commonService.encryptValue(this.enc_EId,false);
      this.encounterId = Number(decryptEncID);
      }
      else
      this.encounterId = 0;
      this.getPatientEncounterDetails();
      this.getMasterTemplates();

    }
    else if(this.router.url.includes("/web/appointment/soap")){
      this.activatedRoute.queryParams.subscribe(params => {
        if (
          params["id"] != "" &&
          params["id"] != null &&
          params["id"] != undefined
        ) {
          this.encry_appTId =  params["id"];
          var decryptAppID = this.commonService.encryptValue(params["id"], false);
          this.appointmentId = Number(decryptAppID);
        }
        if (
          params["enc_EId"] != "" &&
          params["enc_EId"] != null &&
          params["enc_EId"] != undefined
        ) {
          this.enc_EId =  params["enc_EId"];
          var decryptEncID = this.commonService.encryptValue(params["enc_EId"], false);
          this.encounterId = Number(decryptEncID);
          this.isApptCompleted = true;
        }
        this.getPatientEncounterDetails();
      this.getMasterTemplates();
      });
    }
    else {
      console.log("else is runn")
      this.activatedRoute.queryParams.subscribe((params) => {
        this.appointmentId =
          params.apptId == undefined ? 0 : parseInt(params.apptId);
        this.encounterId = params.encId == undefined ? 0 : parseInt(params.encId);
        this.getPatientEncounterDetails();
        this.getMasterTemplates();
      });

    }



    if (localStorage.getItem("access_token")) {
      this.commonService.loginUser.subscribe((user: LoginUser) => {
        if (user.data) {
          let userInfo: any;

          this.userId = user.data.userID;
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "CLIENT") {
            userInfo = user.patientData;
            //fullName = userInfo.lastName + " " + userInfo.firstName;
          } else {
            userInfo = user.data;
            //fullName = "Dr. " + userInfo.lastName + " " + userInfo.firstName;
          }
        } else {
        }
      });
    }
    if (this.appointmentId > 0 && this.userId > 0) {
      this.appService
        .getCallInitiate(this.appointmentId, this.userId)
        .subscribe((res) => {
          console.log(res);
        });
    }
    let callInitModel: CallInitModel = new CallInitModel();
    callInitModel.AppointmentId = this.appointmentId;
    callInitModel.CallStatus = CallStatus.Picked;
    this.appService.CheckCallStarted(callInitModel);
  }


  get f() {
    return this.soapForm.controls;
  }

  ngOnInit() {
    // this.soapForm = this.formBuilder.group({
    //   'subjective': [''],
    //   'objective': [''],
    //   'assessment': [''],
    //   'plans': ['']
    // });
    let fullName = "";
    if (localStorage.getItem("access_token")) {
      this.commonService.loginUser.subscribe((user: LoginUser) => {

        if (user.data) {
          let userInfo: any;
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "CLIENT") {
            userInfo = user.patientData;
            fullName = userInfo.lastName + " " + userInfo.firstName;
          } else {
            userInfo = user.data;
            fullName = "Dr. " + userInfo.lastName + " " + userInfo.firstName;
          }
        } else {
        }
      });
    }
    this.initilizeFormValues();
    this.getAppConfigurations();
    this.userDisplayName = "Provider";
    // this.chatService.changename({
    //   username: fullName,
    //   roomname: "room" + this.appointmentId.toString()
    // });
    this.getUserDocuments();
  }
  initilizeFormValues() {
    const currentDate = new Date();
    const previousWeekDate = addDays(currentDate, -7);

    this.soapForm = this.formBuilder.group({
      subjective: [""],
      objective: [""],
      assessment: [""],
      plans: [""],
      fromDate: [previousWeekDate],
      toDate: [currentDate],
    });
  }
  get formControls() {
    return this.soapForm.controls;
  }

  onBackClick() {
    localStorage.removeItem('called_'+this.appointmentId);
    //this.router.navigate(["/web/scheduling"]);
    this.router.navigate(["/web/waiting-room/check-in-call/"+this.appointmentId]);
  }

  onNavigate(url: string) {
    const clientId =
      this.patientAppointmentDetails &&
      this.patientAppointmentDetails.patientID;
    if (clientId)
      this.router.navigate([url], {
        queryParams: { id: this.commonService.encryptValue(clientId, true) },
      });
  }

  checkIsRequiredSigned() {
    let employee_signRequired = false,
      client_signRequired = false,
      guardian_signRequired = false;
    if (this.appConfiguration && this.appConfiguration.length) {
      this.appConfiguration.forEach((Obj) => {
        if (Obj.configType === 1) {
          switch (Obj.key) {
            case "CLINICIAN_SIGN":
              employee_signRequired =
                Obj.value.toString().toLowerCase() === "true";
              break;
            case "PATIENT_SIGN":
              client_signRequired =
                Obj.value.toString().toLowerCase() === "true";
              break;
            case "GUARDIAN_SIGN":
              guardian_signRequired =
                Obj.value.toString().toLowerCase() === "true";
              break;
            default:
              break;
          }
        }
      });
    }
    let employee_Signed = true,
      client_signed = true,
      guardian_signed = true;
    if (employee_signRequired) {
      if (this.isEmployeeSigned) {
        employee_Signed = true;
      } else {
        employee_Signed = false;
      }
    }
    if (client_signRequired) {
      if (this.isClientSigned) {
        client_signed = true;
      } else {
        client_signed = false;
      }
    }
    if (guardian_signRequired) {
      if (this.isGuardianSigned) {
        guardian_signed = true;
      } else {
        guardian_signed = false;
      }
    }
    // finally check if all required are signed ...
    if (employee_Signed) {
      //&& client_signed && guardian_signed) {
      this.isAllSigned = true;
    } else {
      this.isAllSigned = false;
    }
  }

  openSignDialog() {
    const staffsList = [
      {
        id: this.staffDetails && this.staffDetails.staffId,
        value: this.staffDetails && this.staffDetails.staffName,
      },
    ];
    const clientDetails = {
      id:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.patientID,
      value:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.patientName,
    };
    const modalPopup = this.signDailog.open(SignDialogComponent, {
      hasBackdrop: true,
      data: {
        staffsList,
        clientDetails,
        SignatoryLists: ["Employee", "Client", "Guardian"],
      },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result) {
        switch ((result.Signatory || "").toUpperCase()) {
          case "EMPLOYEE":
            this.employeeSign = {
              ...this.employeeSign,
              date: format(new Date(), "YYYY-MM-DDTHH:mm:ss"),
              name: result.name,
              bytes: (result.bytes || "").split(",")[1],
            };
            this.saveSignature(
              this.employeeSign.id,
              this.employeeSign,
              null,
              null
            );
            break;
          case "CLIENT":
            this.patientSign = {
              ...this.patientSign,
              date: format(new Date(), "YYYY-MM-DDTHH:mm:ss"),
              name: result.name,
              bytes: (result.bytes || "").split(",")[1],
            };
            this.saveSignature(
              this.patientSign.id,
              null,
              this.patientSign,
              null
            );
            break;
          case "GUARDIAN":
            this.guardianSign = {
              ...this.guardianSign,
              date: format(new Date(), "YYYY-MM-DDTHH:mm:ss"),
              name: result.name,
              bytes: (result.bytes || "").split(",")[1],
            };
            this.saveSignature(
              this.guardianSign.id,
              null,
              null,
              this.guardianSign
            );
            break;
        }
      }
    });
  }
  onSubmitTemplate(event: any) {
    if(this.isSoapCompleted){
      this.notifierService.notify("error", "You couldn't edit SOAP template after completing SOAP notes.");
    }
    else{
    const jsonData = {
      id: null,
      templateData: JSON.stringify(event),
      masterTemplateId: this.templateFormId,
      patientEncounterId: this.encounterId,
    };
    let postData: Array<any> = [];
    postData.push(jsonData);

    this.isSubmitted = true;
    this.isTemplateSubmitted = true;

    this.onSubmit(postData);
    // const postData = {
    //   id: this.encounterTemplateId > 0 ? this.encounterTemplateId : null,
    //   templateData: JSON.stringify(event),
    //   masterTemplateId: this.templateFormId,
    //   patientEncounterId: this.encounterId,
    // }

    // let formPostData: Array<any> = [];
    // formPostData.push(postData)
    // this.encounterService.saveTemplateData(postData)
    //   .subscribe(
    //     response => {
    //       if (response.statusCode == 200) {
    //         this.notifierService.notify("success", response.message);
    //         this.onSubmit(formPostData);
    //       } else {
    //         this.notifierService.notify("error", response.message);
    //       }
    //     })
    // this.onClose(postData);
  }
  }
  onSubmit(formioData: any) {
    if (this.soapForm.invalid) {
      return null;
    }
    const { subjective, objective, assessment, plans } = this.soapForm.value;
    const postData = {
      Id: this.encounterId,
      PatientID:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.patientID,
      AppointmentStartDateTime:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.startDateTime,
      AppointmentEndDateTime:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.endDateTime,
      PatientAppointmentId: this.appointmentId,
      DateOfService:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.startDateTime,
      StartDateTime:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.startDateTime,
      EndDateTime:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.endDateTime,
      StaffID: this.staffDetails && this.staffDetails.staffId,
      ServiceLocationID:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.serviceLocationID,
      PatientAddressID:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.patientAddressID,
      OfficeAddressID:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.officeAddressID,
      CustomAddressID:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.customAddressID,
      CustomAddress:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.customAddress,
      NotetypeId: 1,
      SOAPNotes: {
        Id: this.soapNotes && this.soapNotes.id,
        Subjective: subjective,
        Objective: objective,
        Assessment: assessment,
        Plans: plans,
      },
      PatientEncounterTemplate: formioData,
      PatientEncounterServiceCodes: this.patientEncounterServiceCodes || [],
      PatientEncounterDiagnosisCodes: this.patientEncounterDiagnosisCodes || [],
      isBillableEncounter:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.isBillable,
      notes: this.encounterNotes,
    };
    this.savePatientEncounter(postData);
  }

  getAppConfigurations() {
    this.encounterService.getAppConfigurations().subscribe((response) => {
      if (response.statusCode == 200) {
        this.appConfiguration = response.data || [];
      } else {
        this.appConfiguration = [];
      }
      this.checkIsRequiredSigned();
    });
  }

  getPatientEncounterDetails() {
    this.encounterService
      .GetPatientEncounterDetails(this.appointmentId, this.encounterId, false)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          // this.patientEncounterDiagnosisCodes =
          //   response.data.patientEncounterDiagnosisCodes || [];
          this.patientEncounterServiceCodes =
            response.data.patientEncounterServiceCodes || [];
          this.patientAppointmentDetails =
            response.data.patientAppointment || [];
          this.clientId =
            this.patientAppointmentDetails &&
            this.patientAppointmentDetails.patientID;
          this.soapNotes = response.data.soapNotes || null;
          this.encounterSignature = response.data.encounterSignature || [];
          this.unitsConsumed = response.data.unitsConsumed;
          this.patientEncounterTemplate =
            response.data.patientEncounterTemplate || [];
          this.templateFormId =
            (response.data.patientEncounterTemplate &&
              response.data.patientEncounterTemplate[0] && response.data.patientEncounterTemplate[0].masterTemplateId) ||
            0;
          this.isSoapCompleted =
            (response.data.status || "").toUpperCase() == "RENDERED";
            this.istelehealthappt=this.patientAppointmentDetails.isTelehealthAppointment;
          this.filterDetails();
          this.getDiagnosisList();
        } else {
          //this.patientEncounterDiagnosisCodes = [];
          this.patientEncounterServiceCodes = [];
          this.patientAppointmentDetails = null;
          this.soapNotes = null;
          this.encounterSignature = [];
          this.unitsConsumed = 0;
          this.isSoapCompleted = false;
        }
        if (this.encounterId) {
          this.getTemplateForm(this.templateFormId);
        }
        setTimeout(function () {
          window.scroll({
            top: 320,
            left: 0,
            behavior: "smooth",
          });
        }, 2000);
      });
  }

  filterDetails() {
    if (this.patientAppointmentDetails) {
      const {
        appointmentStaffs,
        endDateTime,
        startDateTime,
      } = this.patientAppointmentDetails;
      if (appointmentStaffs && appointmentStaffs.length) {
        this.staffDetails = appointmentStaffs[0];
      }
      this.appointmentStartTime = `${format(startDateTime, "hh:mm a")}`;
      this.appointmentEndTime = `${format(endDateTime, "hh:mm a")}`;

      if (this.patientAppointmentDetails.patientID)
        this.getClientHeaderInfo(this.patientAppointmentDetails.patientID);
    }

    if (this.soapNotes) {
      this.soapForm.patchValue({ ...this.soapNotes });
    }

    if (this.encounterSignature && this.encounterSignature.length) {
      this.encounterSignature.forEach((signObj) => {
        if (signObj.guardianSign) {
          let data = {
            id: signObj.id,
            bytes: signObj.guardianSign,
            date: signObj.guardianSignDate,
            name: signObj.guardianName,
          };
          this.isGuardianSigned = true;
          this.guardianSign = data;
        }
        if (signObj.patientSign) {
          let data = {
            id: signObj.id,
            bytes: signObj.patientSign,
            date: signObj.patientSignDate,
            name:
              this.patientAppointmentDetails &&
              this.patientAppointmentDetails.patientName,
          };
          this.isClientSigned = true;
          this.patientSign = data;
        }
        if (signObj.clinicianSign) {
          let data = {
            id: signObj.id,
            bytes: signObj.clinicianSign,
            date: signObj.clinicianSignDate,
            name: this.staffDetails && this.staffDetails.staffName,
          };
          this.isEmployeeSigned = true;
          this.employeeSign = data;
        }
      });
    }
    this.checkIsRequiredSigned();
  }

  savePatientEncounter(postData: any, isAdmin: boolean = false) {
    this.submitted = true;
    this.encounterService
      .SavePatientEncounterSOAP(postData, isAdmin)    //.SavePatientEncounter(postData, isAdmin)
      .subscribe((response) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          if(this.isTemplateSubmitted){
            this.notifierService.notify("success", response.message);
            this.isTemplateSubmitted = false;
          }
          if (!this.encounterId) {
            this.encounterId = response.data.id || 0;
            // this.router.navigate(["/web/encounter/soap"], {
            //   queryParams: {
            //     apptId: this.appointmentId,
            //     encId: this.encounterId,
            //   },
            // });
            //this.router.navigate(["/web/waiting-room/"+this.appointmentId]); commented as of now
           //  this.router.navigate(["/web/waiting-room/"+this.appointmentId]);
           //this.router.navigate(["/web/waiting-room/check-in-soap?id="+this.encry_appTId+"&&enc_EId="+this.enc_EId])
          } else {
            // this.isSoapCompleted = true;
            // let isPatient: boolean = false;
            // this.commonService.isPatient.subscribe((isPatient) => {
            //   if (!isPatient) this.router.navigate(["/web/scheduling"]);
            //   else this.router.navigate(["/web/client/my-scheduling"]);
            // });
            this.createClaim(this.encounterId);
          }
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  saveSignature(id = 0, employeeSign, patientSign, guradianSign) {
    let postData = {
      id: id,
      patientEncounterId: this.encounterId,
      patientId: patientSign
        ? this.patientAppointmentDetails &&
          this.patientAppointmentDetails.patientID
        : null,
      patientSign: patientSign ? patientSign.bytes : null,
      patientSignDate: patientSign ? patientSign.date : null,
      staffId: employeeSign
        ? this.staffDetails && this.staffDetails.staffId
        : null,
      clinicianSign: employeeSign ? employeeSign.bytes : null,
      clinicianSignDate: employeeSign ? employeeSign.date : null,
      guardianName: guradianSign ? guradianSign.name : null,
      guardianSign: guradianSign ? guradianSign.bytes : null,
      guardianSignDate: guradianSign ? guradianSign.date : null,
    };
    this.submittedSign = true;
    this.encounterService
      .saveEncounterSignature(postData)
      .subscribe((response) => {
        this.submittedSign = false;
        if (response.statusCode == 200) {
          this.notifierService.notify("success", response.message);
          let signObj = response.data;
          if (signObj.guardianSign) {
            this.guardianSign = {
              ...this.guardianSign,
              id: signObj.id,
            };
            this.isGuardianSigned = true;
          }
          if (signObj.patientSign) {
            this.patientSign = {
              ...this.patientSign,
              id: signObj.id,
            };
            this.isClientSigned = true;
          }
          if (signObj.clinicianSign) {
            this.employeeSign = {
              ...this.employeeSign,
              id: signObj.id,
            };
            this.isEmployeeSigned = true;
          }
          this.checkIsRequiredSigned();
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  createClaim(encounterId: number, isAdmin: boolean = false) {
    this.encounterService
      .createClaim(encounterId, isAdmin)
      .subscribe((response) => {
        if (response.statusCode == 1) {
          this.isSoapCompleted = true;
            let isPatient: boolean = false;
            this.commonService.isPatient.subscribe((isPatient) => {
              if (!isPatient) this.router.navigate(["/web/scheduling"]);
              else this.router.navigate(["/web/client/my-scheduling"]);
            });
          this.notifierService.notify("success", response.message);
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  getClientHeaderInfo(patientID: number) {
    this.encounterService
      .getClientHeaderInfo(patientID)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.clientHeaderModel = response.data;
          this.clientHeaderModel.patientBasicHeaderInfo != null
            ? (this.clientHeaderModel.patientBasicHeaderInfo.dob = format(
                this.clientHeaderModel.patientBasicHeaderInfo.dob,
                "MM/DD/YYYY"
              ))
            : "";
        }
      });
  }

  getMasterTemplates() {
    this.encounterService.getMasterTemplates().subscribe((response) => {
      if (response.statusCode == 200)
        // this.masterTemplates = response.data;
        this.masterTemplates = response.data.filter(
          (x) => x.templateCategoryName.toLowerCase() == "soap"
        );
    });
  }
  onMastertemplateSelect(event: any) {
    this.templateIdFromDD = event.value;
  }
  getTemplateForm(id: number) {
    // const encryptTempId = this.commonService.encryptValue(id, true);
    // const encryptEncId = this.commonService.encryptValue(this.encounterId, true);
    // this.router.navigate(['/web/Masters/template/render'], { queryParams: { id: encryptTempId, encId: encryptEncId } });

    this.encounterService
      .getTemplateForm(this.encounterId, id)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.showFormioDiv = true;
          // this.openTemplateForm(response.data, id);
          let formJson = { components: [] },
            formData = { data: {} };
          try {
            formJson = JSON.parse(response.data.templateJson);
            formData = JSON.parse(response.data.templateData);
          } catch (err) {}

          this.encounterTemplateId = response.data.id || null;
          this.jsonFormData = response.data.templateJson
            ? formJson
            : this.jsonFormData;
          this.templateFormName = response.data.templateName || "";
          this.initialFormValues = response.data.templateData
            ? formData
            : this.initialFormValues;
          this.templateFormId = id;
          //this.encounterId = data.encounterId;
          // this.encounterTemplateId = response.data.id || null;
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }
  onStartVideoEncounterClick() {
    this.router.navigate(["/web/encounter/video-encounter"], {
      queryParams: {
        templateIdFromDD: this.templateIdFromDD,
        encounterId: this.encounterId,
        appointmentId: this.appointmentId,
      },
    });
  }
  openTemplateForm(jsonFormData: any, templateId: number) {
    const modalPopup = this.signDailog.open(TemplateFormComponent, {
      hasBackdrop: true,
      data: {
        templateId,
        encounterId: this.encounterId,
        ...jsonFormData,
      },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result) {
        this.encounterService.saveTemplateData(result).subscribe((response) => {
          if (response.statusCode == 200) {
            this.notifierService.notify("success", response.message);
          } else {
            this.notifierService.notify("error", response.message);
          }
        });
      }
    });
  }
  getPreviousEncounters(patientId, fromDate, toDate) {
    this.encounterService
      .getPreviousEncounters(patientId, fromDate, toDate)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.previousEncounters = response.data;
          this.previousEncounterId = response.data.id;
          this.previousEncounters = (response.data || []).map((obj: any) => {
            obj.dateOfService = format(obj.dateOfService, "MM/DD/YYYY hh:mm a");
            return obj;
          });
        } else {
          this.previousEncounters = [];
        }
      });
  }
  getSelectedPreviousEncountersData(event: any) {
    this.previousEncounterId = event;
    this.encounterService
      .getPreviousEncountersData(this.previousEncounterId)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          //this.previousEncounters=response.data;
          if (response.statusCode == 200) {
            this.isPreviousEncounter = true;
            this.encounterId = 0;
            this.soapNotes = response.data.soapNotes || null;
            this.patientEncounterTemplate =
              response.data.patientEncounterTemplate || [];
            this.templateFormId =
              (response.data.patientEncounterTemplate &&
                response.data.patientEncounterTemplate[0].masterTemplateId) ||
              0;
            // this.filterDetails();
          } else {
            this.soapNotes = null;
            this.unitsConsumed = 0;
            this.isSoapCompleted = false;
          }
          if (this.previousEncounterId) {
            this.getTemplateForm(this.templateFormId);
          }
        }
      });
  }
  onResizing(event: ResizeEvent): boolean {
    const perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    this.renderer.setStyle(this.panel.nativeElement, "width", `${perValue}%`);
    // let SOAPPanel = this.encounterService.SOAPPanelRef;
    // if (this.SOAPPanel)
    //   this.renderer.setStyle(this.SOAPPanel.nativeElement, 'margin-right', `${event.rectangle.width}px`)
  }
  onDragChat(event: any) {
    let bottom = this.panel.nativeElement.style.bottom,
      right = this.panel.nativeElement.style.right;

    (bottom = bottom.replace("px", "")), (right = right.replace("px", ""));
    (bottom = (parseInt(bottom) || 0) + -event.y),
      (right = (parseInt(right) || 0) + -event.x);
    this.renderer.setStyle(this.panel.nativeElement, "bottom", `${bottom}px`);
    this.renderer.setStyle(this.panel.nativeElement, "right", `${right}px`);
  }
  // onValidateResize(event: ResizeEvent): boolean {
  //   let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
  //   if (perValue > 70 || perValue < 20) {
  //     return false;
  //   }
  //   return true;
  // }
  onValidateResize(event: ResizeEvent): boolean {
    // let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
    // const MIN_DIMENSIONS_PX: number = 50;
    // if (
    //   event.rectangle.width &&
    //   event.rectangle.height &&
    //   (event.rectangle.width < MIN_DIMENSIONS_PX ||
    //     event.rectangle.height < MIN_DIMENSIONS_PX) && (perValue > 70 || perValue < 20)
    // ) {
    //   return false;
    // }
    return true;
  }
  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: "fixed",
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
      // bottom: `${event.rectangle.bottom}px`,
      // right: `${event.rectangle.right}px`,
    };
  }

  onResizingVideo(event: ResizeEvent): boolean {
    const perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    this.renderer.setStyle(
      this.panelVideo.nativeElement,
      "width",
      `${perValue}%`
    );
    // let SOAPPanel = this.encounterService.SOAPPanelRef;
    // if (this.SOAPPanel)
    //   this.renderer.setStyle(this.SOAPPanel.nativeElement, 'margin-right', `${event.rectangle.width}px`)
  }
  onDragVideo(event: any) {
    let bottom = this.panelVideo.nativeElement.style.bottom,
      right = this.panelVideo.nativeElement.style.right;

    (bottom = bottom.replace("px", "")), (right = right.replace("px", ""));
    (bottom = (parseInt(bottom) || 0) + -event.y),
      (right = (parseInt(right) || 0) + -event.x);
    this.renderer.setStyle(
      this.panelVideo.nativeElement,
      "bottom",
      `${bottom}px`
    );
    this.renderer.setStyle(
      this.panelVideo.nativeElement,
      "right",
      `${right}px`
    );
  }
  // onValidateResize(event: ResizeEvent): boolean {
  //   let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
  //   if (perValue > 70 || perValue < 20) {
  //     return false;
  //   }
  //   return true;
  // }
  onValidateResizeVideo(event: ResizeEvent): boolean {
    // let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
    // const MIN_DIMENSIONS_PX: number = 50;
    // if (
    //   event.rectangle.width &&
    //   event.rectangle.height &&
    //   (event.rectangle.width < MIN_DIMENSIONS_PX ||
    //     event.rectangle.height < MIN_DIMENSIONS_PX) && (perValue > 70 || perValue < 20)
    // ) {
    //   return false;
    // }
    return true;
  }
  onResizeVideoEnd(event: ResizeEvent): void {
    this.styleVideo = {
      position: "fixed",
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
      // bottom: `${event.rectangle.bottom}px`,
      // right: `${event.rectangle.right}px`,
    };
  }
  openDiagnosisDialog(id?: number) {
    if (id != null && id > 0) {
      if(this.isSoapCompleted){
        this.notifierService.notify("error", "You couldn't update diagnosis codes after completing SOAP notes.");
      }
      else{
      this.diagnosisService.getDiagnosisById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.diagnosisModel = response.data;
          this.createDiagnosisModal(this.diagnosisModel);
        }
      });
    }
    } else {
      this.diagnosisModel = new DiagnosisModel();
      this.createDiagnosisModal(this.diagnosisModel);
    }
  }

  createDiagnosisModal(diagnosisModel: DiagnosisModel) {
    this.diagnosisModel.patientID = this.clientId;
    let diagnosisModal;
    diagnosisModal = this.diagnosisDialogModal.open(DiagnosisModalComponent, {
      data: {
        diagnosis: diagnosisModel,
        refreshGrid: this.refreshGrid.bind(this),
      },
    });
    diagnosisModal.afterClosed().subscribe((result: string) => {
      if (result == "save") this.getDiagnosisList();
    });
  }
  refreshGrid() {
    this.getDiagnosisList();
  }

  deleteDiagnosisCode(id: number) {
    if(this.isSoapCompleted){
      this.notifierService.notify("error", "You couldn't delete diagnosis codes after completing SOAP notes.");
    }
    else{
    this.dialogService
      .confirm("Are you sure you want to delete this diagnosis?")
      .subscribe((result: any) => {
        if (result == true) {
          this.diagnosisService
            .deleteDiagnosis(id)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 200) {
                  this.notifierService.notify("success", response.message);
                  this.getDiagnosisList();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              }
            });
        }
      });
    }
  }
  onSortOrPageChanges(changeState?: any) {
    var pageSize;
    if(changeState.pageSize == 5){
      pageSize = 5;
    }else{
      pageSize = changeState.pageSize;
    }

     changeState = {
              sort: this.sort.active || '',
              order: this.sort.direction || '',
              pageNumber: (this.paginator.pageIndex + 1)
            }

    this.setPaginatorModel(changeState.pageNumber,pageSize, "", "");
    this.getDiagnosisList();
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel = {
      pageNumber,
      pageSize,
      sortColumn,
      sortOrder,
      searchText: this.searchText
    }
  }
  getDiagnosisList() {
    this.diagnosisService
      .getSoapNoteDiagnosisList(this.clientId, this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0
        ) {
          this.patientEncounterDiagnosisCodes = response.data;
          this.metaData = response.meta || new Metadata();
          //this.diagnosisList = response.data;
        }else{
          this.patientEncounterDiagnosisCodes = [];
          this.metaData = new Metadata();
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      });
  }

  // openServiceDialog(id?: number) {
  //   if (id != null && id > 0) {
  //     this.clientsService.getDiagnosisById(id).subscribe((response: any) => {
  //       if (response != null && response.data != null) {
  //         this.diagnosisModel = response.data;
  //         this.createServiceModal(this.diagnosisModel);
  //       }
  //     });
  //   } else {
  //     this.diagnosisModel = new DiagnosisModel();
  //     this.createServiceModal(this.diagnosisModel);
  //   }
  // }

  // createServiceModal(diagnosisModel: DiagnosisModel) {
  //   this.diagnosisModel.patientID = this.clientId;
  //   let diagnosisModal;
  //   // diagnosisModal = this.diagnosisDialogModal.open(DiagnosisModalComponent, {
  //   //   data: {
  //   //     diagnosis: diagnosisModel,
  //   //     refreshGrid: this.refreshServiceGrid.bind(this)
  //   //   }
  //   // });
  //   // diagnosisModal.afterClosed().subscribe((result: string) => {
  //   //   if (result == "save") this.getServiceList();
  //   // });
  // }
  // refreshServiceGrid() {
  //   this.getServiceList();
  // }

  // deleteServiceCode(id: number) {
  //   this.dialogService
  //     .confirm("Are you sure you want to delete this diagnosis?")
  //     .subscribe((result: any) => {
  //       if (result == true) {
  //         this.clientsService.deleteDiagnosis(id).subscribe((response: any) => {
  //           if (response != null && response.data != null) {
  //             if (response.statusCode == 200) {
  //               this.notifierService.notify("success", response.message);
  //               this.getServiceList();
  //             } else {
  //               this.notifierService.notify("error", response.message);
  //             }
  //           }
  //         });
  //       }
  //     });
  // }
  // getServiceList() {
  //   this.clientsService
  //     .getSoapNoteDiagnosisList(this.clientId)
  //     .subscribe((response: ResponseModel) => {
  //       if (
  //         response != null &&
  //         response.data != null &&
  //         response.data.length > 0
  //       ) {
  //         this.patientEncounterDiagnosisCodes = response.data;
  //         //this.diagnosisList = response.data;
  //       }
  //     });
  // }
  openServiceDialog(id?: number): void {
    this.serviceCodeModal = {
      id: id || 0,
    };
    if (!this.serviceCodeModal.id) {
      this.createServiceModel(this.serviceCodeModal);
    }
  }
  createServiceModel(serviceCodeModal: ServiceCodeModal) {
    const serviceCodeModalPopup = this.serviceCodeDailog.open(
      AddServiceCodeModalComponent,
      {
        hasBackdrop: true,
        data: {
          serviceCodeModal: serviceCodeModal || new ServiceCodeModal(),
          refreshGrid: this.refreshServiceGrid.bind(this),
        },
      }
    );
    serviceCodeModalPopup.afterClosed().subscribe((result) => {
      // if (result === 'SAVE')
      //   this.getServiceCodeListData()
    });
  }
  refreshServiceGrid(data: any) {
    let ServiceCodes: string;
    this.patientEncounterServiceCodes.push(data);
    ServiceCodes = this.patientEncounterServiceCodes
      .map((obj) => obj.serviceCodeId)
      .toString();

    // this.encounterService
    //   .CheckServiceCodeAvailability(this.appointmentId, ServiceCodes)
    //   .subscribe((response) => {
    //     if (response.statusCode == 200) {
    //       return this.notifierService.notify("success", response.message);
    //     } else {
    //       this.patientEncounterServiceCodes;
    //       if (this.patientEncounterServiceCodes.length > 0) {
    //         this.patientEncounterServiceCodes.splice(
    //           this.patientEncounterServiceCodes.length - 1,
    //           1
    //         );
    //       }
    //       return this.notifierService.notify("warning", response.message);
    //     }
    //   });
  }
  deleteCPTCode(id: number) {
    if(this.isSoapCompleted){
      this.notifierService.notify("error", "You couldn't delete service codes after completing SOAP notes.");
    }
    else{
    this.patientEncounterServiceCodes.splice(id, 1);
    }
  }

  openPatientEncounterNotesDialog(id?: number) {

    this.patientencounternotesmodel = new PatientEncounterNotesModel();
    this.createPatientEncounterNotesModal(this.patientencounternotesmodel);

    // if (id != null && id > 0) {
    //   this.encounterService.getDiagnosisById(id).subscribe((response: any) => {
    //     if (response != null && response.data != null) {
    //       this.diagnosisModel = response.data;
    //       this.createDiagnosisModal(this.diagnosisModel);
    //     }
    //   });
    // } else {
    //   this.diagnosisModel = new DiagnosisModel();
    //   this.createDiagnosisModal(this.diagnosisModel);
    // }
  }

  createPatientEncounterNotesModal(patientencounternotesmodel: PatientEncounterNotesModel) {

    //this.patientencounternotesmodel.patientID = this.clientId;
    this.patientencounternotesmodel.patientID=this.clientId,
    this.patientencounternotesmodel.StaffId=this.staffDetails.staffId,
    this.patientencounternotesmodel.AppointmentID=  this.appointmentId
    let patientencounternotesModal;
    patientencounternotesModal = this.patientencounternotesDialogModal.open(PatientEncounterNotesModalComponent, {
      data: {
        patientencounternote: patientencounternotesmodel,
        //refreshGrid: this.refreshGrid.bind(this),
      },
    });
    patientencounternotesModal.afterClosed().subscribe((result: any) => {
      if (result){
        this.encounterNotes = result;
      }
      //this.getDiagnosisList();
    });
  }


  getUserDocuments() {

    if (this.appointmentId != null) {
      // this.fromDate =
      //   this.fromDate == null
      //     ? "1990-01-01"
      //     : format(this.fromDate, "YYYY-MM-DD");
      // this.toDate =
      //   this.toDate == null
      //     ? format(this.todayDate, "YYYY-MM-DD")
      //     : format(this.toDate, "YYYY-MM-DD");
      this.clientService
        .getPateintApptDocuments(this.appointmentId)
        .subscribe((response: ResponseModel) => {
          if (response != null) {
            this.documentList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];
          }
        });
    }
  }

  getUserDocument(value: UserDocumentModel) {
    this.clientService.getUserDocument(value.id).subscribe((response: any) => {
      this.clientService.downloadFile(response, response.type, value.url);
    });
  }

  deleteUserDocument(id: number) {
    if(this.isSoapCompleted){
      this.notifierService.notify("error", "You couldn't delete documents after completing SOAP notes.");
    }
    else{
    this.dialogService
      .confirm("Are you sure you want to delete this document?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteUserDocument(id)
            .subscribe((response: ResponseModel) => {
              if (response != null) {
                this.notifier.notify("success", response.message);
                this.getUserDocuments();
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.appService.newSelectedScreenSizeSubject.next("1:4");

    const top = screen.height * .10;
    const left = screen.width * .70;
    this.appService.newSelectedVideoPositionSubject.next(left+","+top);
  }


}
