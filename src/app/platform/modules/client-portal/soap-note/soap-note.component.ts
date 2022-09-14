import { ServiceCodeModal } from "./../../agency-portal/masters/service-codes/service-code.modal";
import { ClientHeaderModel } from "./../../agency-portal/clients/client-header.model";
import { DiagnosisModel } from "./../../agency-portal/clients/diagnosis/diagnosis.model";
import { EncounterService } from "./../../agency-portal/encounter/encounter.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { FormioOptions } from "angular-formio";
import { format, addDays } from "date-fns";
import { NotifierService } from "angular-notifier";
class signModal {
  id: number = 0;
  bytes: string = null;
  date: string = null;
  name: string = null;
}
@Component({
  selector: "app-soap-note",
  templateUrl: "./soap-note.component.html",
  styleUrls: ["./soap-note.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class SoapNoteComponent implements OnInit {
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
  public style: object = {};
  public styleVideo: object = {};
  // template forms
  masterTemplates: Array<any>;
  // public jsonFormData: Object = {
  //   components: []
  // };
  // initialFormValues: Object = {};
  // formioOptions: FormioOptions = {
  //   disableAlerts: true,

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
    components: []
  };
  initialFormValues: Object = {
    data: {}
  };
  formioOptions: FormioOptions = {
    disableAlerts: true
  };
  diagnosisModel: DiagnosisModel;
  clientId: number;
  constructor(
    private encounterService: EncounterService,
    private activatedRoute: ActivatedRoute,
    private notifierService: NotifierService,
    private formBuilder: FormBuilder
  ) {
    this.patientEncounterDiagnosisCodes = new Array<DiagnosisModel>();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.appointmentId =
        params.apptId == undefined ? 0 : parseInt(params.apptId);
      this.encounterId = params.encId == undefined ? 0 : parseInt(params.encId);
      if (
        this.appointmentId &&
        this.appointmentId > 0 &&
        this.encounterId &&
        this.encounterId > 0
      )
        this.getPatientEncounterDetails();
    });
    const currentDate = new Date();
    const previousWeekDate = addDays(currentDate, -7);
    this.soapForm = this.formBuilder.group({
      subjective: [""],
      objective: [""],
      assessment: [""],
      plans: [""],
      fromDate: [previousWeekDate],
      toDate: [currentDate]
    });
  }
  getPatientEncounterDetails() {
    this.encounterService
      .GetPatientEncounterDetails(this.appointmentId, this.encounterId, false)
      .subscribe(response => {
        if (response.statusCode == 200) {
          this.patientEncounterDiagnosisCodes =
            response.data.patientEncounterDiagnosisCodes || [];
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
              response.data.patientEncounterTemplate[0].masterTemplateId) ||
            0;
          this.isSoapCompleted =
            (response.data.status || "").toUpperCase() == "RENDERED";
          this.filterDetails();
        } else {
          this.patientEncounterDiagnosisCodes = [];
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
      });
  }
  filterDetails() {
    if (this.patientAppointmentDetails) {
      const {
        appointmentStaffs,
        endDateTime,
        startDateTime
      } = this.patientAppointmentDetails;
      if (appointmentStaffs && appointmentStaffs.length) {
        this.staffDetails = appointmentStaffs[0];
      }
      this.appointmentStartTime = `${format(startDateTime, "hh:mm a")}`;
      this.appointmentEndTime = `${format(endDateTime, "hh:mm a")}`;

      // if (this.patientAppointmentDetails.patientID)
      //   this.getClientHeaderInfo(this.patientAppointmentDetails.patientID);
    }

    if (this.soapNotes) {
      this.soapForm.patchValue({ ...this.soapNotes });
    }

    if (this.encounterSignature && this.encounterSignature.length) {
      this.encounterSignature.forEach(signObj => {
        if (signObj.guardianSign) {
          let data = {
            id: signObj.id,
            bytes: signObj.guardianSign,
            date: signObj.guardianSignDate,
            name: signObj.guardianName
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
              this.patientAppointmentDetails.patientName
          };
          this.isClientSigned = true;
          this.patientSign = data;
        }
        if (signObj.clinicianSign) {
          let data = {
            id: signObj.id,
            bytes: signObj.clinicianSign,
            date: signObj.clinicianSignDate,
            name: this.staffDetails && this.staffDetails.staffName
          };
          this.isEmployeeSigned = true;
          this.employeeSign = data;
        }
      });
    }
  }
  getTemplateForm(id: number) {
    // const encryptTempId = this.commonService.encryptValue(id, true);
    // const encryptEncId = this.commonService.encryptValue(this.encounterId, true);
    // this.router.navigate(['/web/Masters/template/render'], { queryParams: { id: encryptTempId, encId: encryptEncId } });

    this.encounterService
      .getTemplateForm(this.encounterId, id)
      .subscribe(response => {
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
}
