
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EncounterService } from '../../encounter.service';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';
import { MatDialog } from '@angular/material';
import { SignDialogComponent } from '../../sign-dialog/sign-dialog.component';
import { ClientHeaderModel } from '../../../clients/client-header.model';
import { CommonService } from '../../../../core/services';

class signModal {
  id: number = 0;
  bytes: string = null;
  date: string = null;
  name: string = null;
}

@Component({
  selector: 'app-non-billable-soap',
  templateUrl: './non-billable-soap.component.html',
  styleUrls: ['./non-billable-soap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NonBillableSoapComponent implements OnInit {
  soapForm: FormGroup;
  @Input('appointmentId') appointmentId;
  @Input('encounterId') encounterId ;

  soapNoteId: number;
  submitted: boolean;
  submittedSign: boolean;
  appConfiguration: Array<any>;
  patientAppointmentDetails: any;
  soapNotes: any;
  encounterSignature: Array<any>;
  staffDetails: any;
  appointmentStartTime: string;
  appointmentEndTime: string;
  patientSign: signModal = new signModal();
  employeeSign: signModal = new signModal();
  guardianSign: signModal = new signModal();
  isGuardianSigned: boolean;
  isClientSigned: boolean;
  isEmployeeSigned: boolean;
  isAllSigned: boolean;
  isSoapCompleted: boolean;

  // client header info
  clientHeaderModel: ClientHeaderModel;
  PatientEncounterDetails: any;
  PatientEncounterNotes: any;
  typeId: any;
  staffId: any;
  constructor(
    private signDailog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private encounterService: EncounterService,
    private notifierService: NotifierService,
    private commonService: CommonService
  ) {
    this.submitted = false;
    this.submittedSign = false;
    this.soapNoteId = 0;
    this.appConfiguration = [];
    this.patientAppointmentDetails = null;
    this.soapNotes = null;
    this.encounterSignature = [];
    this.staffDetails = null;
    this.appointmentStartTime = null;
    this.appointmentEndTime = null;
    this.isGuardianSigned = false;
    this.isClientSigned = false;
    this.isEmployeeSigned = false;
    this.isAllSigned = false;
    this.isSoapCompleted = false;

    this.clientHeaderModel = new ClientHeaderModel();

  }

  ngOnInit() {

    //this.activatedRoute.queryParams.subscribe(params => {
      // this.appointmentId = params.apptId == undefined ? 0 : parseInt(params.apptId);
      // this.encounterId = params.encId == undefined ? 0 : parseInt(params.encId);
      this.getNonBillableEncounterDetails();
      this.GetPatientEncounterDetails();
      this.GetPatientEncounterNotes();
      //this.GetProvidersQuestionnaireControlsByAppointment();
    ///});
    this.soapForm = this.formBuilder.group({
      'nonBillableNotes': [''],
    });
    this.getAppConfigurations();
  }

  get formControls() {
    return this.soapForm.controls;
  }

  onBackClick() {
    this.router.navigate(['/web/scheduling']);
  }

  onNavigate(url: string) {
    const clientId = this.patientAppointmentDetails && this.patientAppointmentDetails.patientID;
    if(clientId)
      this.router.navigate([url], { queryParams: { id: this.commonService.encryptValue(clientId, true) } });
  }

  checkIsRequiredSigned() {
    let employee_signRequired = false,
      client_signRequired = false,
      guardian_signRequired = false;
    if (this.appConfiguration && this.appConfiguration.length) {
      this.appConfiguration.forEach((Obj) => {
        if (Obj.configType === 1) {
          switch (Obj.key) {
            case 'CLINICIAN_SIGN':
              employee_signRequired = (Obj.value.toString().toLowerCase() === 'true');
              break;
            case 'PATIENT_SIGN':
              client_signRequired = (Obj.value.toString().toLowerCase() === 'true');
              break;
            case 'GUARDIAN_SIGN':
              guardian_signRequired = (Obj.value.toString().toLowerCase() === 'true');
              break;
            default:
              break;
          }
        }
      });
    }
    let employee_Signed = true, client_signed = true, guardian_signed = true;
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
    if (employee_Signed && client_signed && guardian_signed) {
      this.isAllSigned = true;
    } else {
      this.isAllSigned = false;
    }
  }

  openSignDialog() {
    const staffsList = [{
      id: this.staffDetails && this.staffDetails.staffId,
      value: this.staffDetails && this.staffDetails.staffName,
    }]
    const clientDetails = {
      id: this.patientAppointmentDetails && this.patientAppointmentDetails.patientID,
      value: this.patientAppointmentDetails && this.patientAppointmentDetails.patientName
    }
    const modalPopup = this.signDailog.open(SignDialogComponent, {
      hasBackdrop: true,
      data: {
        staffsList,
        clientDetails,
        SignatoryLists : ['Employee']
      }
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result) {
        switch ((result.Signatory || '').toUpperCase()) {
          case 'EMPLOYEE':
            this.employeeSign = {
              ...this.employeeSign,
              date: format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
              name: result.name,
              bytes: (result.bytes || '').split(',')[1]
            }
            this.isEmployeeSigned=true;
            break;
          case 'CLIENT':
            this.patientSign = {
              ...this.patientSign,
              date: format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
              name: result.name,
              bytes: (result.bytes || '').split(',')[1]
            }
            this.isClientSigned=true;
            break;
          case 'GUARDIAN':
            this.guardianSign = {
              ...this.guardianSign,
              date: format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
              name: result.name,
              bytes: (result.bytes || '').split(',')[1]
            }
            this.isGuardianSigned=true;
            break;
        }
        this.checkIsRequiredSigned();
      }
    });
  }

  onSubmit() {
    if (this.soapForm.invalid) {
      return null;
    }
    const { nonBillableNotes } = this.soapForm.value;
    const postData = {
      "Id": this.encounterId,
      "PatientID": this.patientAppointmentDetails && this.patientAppointmentDetails.patientID,
      "AppointmentStartDateTime": this.patientAppointmentDetails && this.patientAppointmentDetails.startDateTime,
      "AppointmentEndDateTime": this.patientAppointmentDetails && this.patientAppointmentDetails.endDateTime,
      "PatientAppointmentId": this.appointmentId,
      "DateOfService": this.patientAppointmentDetails && this.patientAppointmentDetails.startDateTime,
      "StartDateTime": this.patientAppointmentDetails && this.patientAppointmentDetails.startDateTime,
      "EndDateTime": this.patientAppointmentDetails && this.patientAppointmentDetails.endDateTime,
      "StaffID": this.staffDetails && this.staffDetails.staffId,
      "ServiceLocationID": this.patientAppointmentDetails && this.patientAppointmentDetails.serviceLocationID,
      "PatientAddressID": this.patientAppointmentDetails && this.patientAppointmentDetails.patientAddressID,
      "OfficeAddressID": this.patientAppointmentDetails && this.patientAppointmentDetails.officeAddressID,
      "CustomAddressID": this.patientAppointmentDetails && this.patientAppointmentDetails.customAddressID,
      "CustomAddress": this.patientAppointmentDetails && this.patientAppointmentDetails.customAddress,
      "NotetypeId": 1,
      "nonBillableNotes": nonBillableNotes,
      "isBillableEncounter": this.patientAppointmentDetails && this.patientAppointmentDetails.isBillable,
      "encounterSignature": {
        'id': this.employeeSign && this.employeeSign.id,
        'patientEncounterId': this.encounterId,
        'patientId': null,
        'patientSign': null,
        'patientSignDate': null,
        'staffId': this.employeeSign ? (this.staffDetails && this.staffDetails.staffId) : null,
        'clinicianSign': this.employeeSign ? this.employeeSign.bytes : null,
        'clinicianSignDate': this.employeeSign ? this.employeeSign.date : null,
        'guardianName': null,
        'guardianSign': null,
        'guardianSignDate': null,
      }
    }
    this.saveNonBillableEncounter(postData);
  }

  getAppConfigurations() {
    this.encounterService.getAppConfigurations()
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.appConfiguration = response.data || [];
          } else {
            this.appConfiguration = [];
          }
          this.checkIsRequiredSigned();
        }
      )
  }

  getNonBillableEncounterDetails() {

    this.encounterService.getNonBillableEncounterDetails(this.appointmentId, this.encounterId, false)
      .subscribe(
        response => {

          if (response.statusCode == 200) {
            this.patientAppointmentDetails = response.data.patientAppointment || [];
            this.soapNotes = response.data.nonBillableNotes || null;
            this.encounterSignature = response.data.encounterSignature || [];
            this.isSoapCompleted = (response.data.status || '').toUpperCase() === 'RENDERED';
            this.filterDetails();
          } else {
            this.patientAppointmentDetails = null;
            this.soapNotes = null;
            this.encounterSignature = [];
            this.isSoapCompleted = false;
          }
        }
      )
  }

  GetPatientEncounterDetails() {

    this.encounterService.GetPatientEncounterDetails(this.appointmentId, this.encounterId, false)
    .subscribe(
      response => {

        if (response.statusCode == 200) {
           this.PatientEncounterDetails = JSON.parse(response.data.patientEncounterTemplate[0].templateData).data;

         }
      }
    )
  }
  GetPatientEncounterNotes() {

    this.encounterService.GetPatientEncounterNotes(this.appointmentId)
    .subscribe(
      response => {

        if (response.statusCode == 200) {
           this.PatientEncounterNotes =(response.data[0].encounterNotes);

         }
      }
    )
  }

  // GetProvidersQuestionnaireControlsByAppointment() {
  //   this.encounterService.GetProvidersQuestionnaireControlsByAppointment(this.appointmentId,this.typeId,this.staffId)
  //   .subscribe(
  //     res => {
  //       if(res.statusCode == 200) {
  //         this.ProvidersQuestionnaireControlsByAppointment =(res.data[]);
  //       }
  //     }
  //   )
  // }

  filterDetails() {
    if (this.patientAppointmentDetails) {
      const { appointmentStaffs, endDateTime, startDateTime } = this.patientAppointmentDetails;
      if (appointmentStaffs && appointmentStaffs.length) {
        this.staffDetails = appointmentStaffs[0];
      }
      this.appointmentStartTime = `${format(startDateTime, 'hh:mm a')}`
      this.appointmentEndTime = `${format(endDateTime, 'hh:mm a')}`

      if (this.patientAppointmentDetails.patientID)
        this.getClientHeaderInfo(this.patientAppointmentDetails.patientID);
    }

    if (this.soapNotes) {
      this.soapForm.patchValue({ nonBillableNotes: this.soapNotes })
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
            name: this.patientAppointmentDetails && this.patientAppointmentDetails.patientName,
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

  saveNonBillableEncounter(postData: any, isAdmin: boolean = false) {
    this.submitted = true;
    this.encounterService.saveNonBillableEncounter(postData, isAdmin)
      .subscribe(
        response => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifierService.notify('success', response.message);
            if (!this.encounterId) {
              this.encounterId = response.data.id || 0;
              this.router.navigate(["/web/encounter/non-billable-soap"], {
                queryParams: {
                  apptId: this.appointmentId,
                  encId: this.encounterId
                }
              });
            }
          } else {
            this.notifierService.notify('error', response.message)
          }
        }
      )
  }

  getClientHeaderInfo(patientID: number) {
    this.encounterService.getClientHeaderInfo(patientID).subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {
        this.clientHeaderModel = response.data;
        this.clientHeaderModel.patientBasicHeaderInfo != null ? this.clientHeaderModel.patientBasicHeaderInfo.dob = format(this.clientHeaderModel.patientBasicHeaderInfo.dob, "MM/DD/YYYY") : '';
      }
    });
  }


}
