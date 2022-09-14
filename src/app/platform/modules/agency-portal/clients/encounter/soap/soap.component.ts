import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EncounterService } from '../encounter.service';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';
import { MatDialog } from '@angular/material';
import { SignDialogComponent } from '../sign-dialog/sign-dialog.component';
import { CommonService } from '../../../../core/services';
import { Alert } from 'selenium-webdriver';
import { EncounterPrintPDFModalComponent } from '../encounter-pdf-print-dialog/encounter-pdf-print-dialog.component';
import { ResponseModel, Metadata, FilterModel } from '../../../../core/modals/common-model';

class signModal {
  id: number = 0;
  bytes: string = null;
  date: string = null;
  name: string = null;
}

class EncounterPrograms {
  programTypeId: number = null;
  programName: string;
}

@Component({
  selector: 'app-soap',
  templateUrl: './soap.component.html',
  styleUrls: ['./soap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SoapComponent implements OnInit {
  soapForm: FormGroup;
  appointmentId: number;
  encounterId: number;
  soapNoteId: number;
  submitted: boolean;
  Completed: boolean;
  submittedSign: boolean;
  appConfiguration: Array<any>;
  patientEncounterDetails: any;
  masterEncounterChecklistModel: Array<any>;
  masterEncounterChecklistAdministativeModel: Array<any>;
  patientEncounterChecklistModel: Array<any>;
  patientEncounterDiagnosisCodes: Array<any>;
  patientEncounterServiceCodes: Array<any>;
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
  masterEncChecklistReviewItems: Array<any>;
  encounterChangeHistory: Array<any>;
  masterProgramTypes: Array<any>;
  masterEncounterTypes: Array<any>;
  masterEncounterMethods: Array<any>;
  isAdminLogin: boolean;
  loginUserId: number;
  ServiceLocationAddress: string;
  patientCurrentMedicationModel: Array<any>;
  metaData: Metadata;
  displayedColumns: Array<any>;
  followUpNotes: string;
  constructor(
    private signDailog: MatDialog,
    private encounterSummaryPDFDialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private encounterService: EncounterService,
    private notifierService: NotifierService,
    private commonService: CommonService
  ) {
    this.submitted = false;
    this.Completed = false;
    this.submittedSign = false;
    this.soapNoteId = 0;
    this.appConfiguration = [];
    this.patientEncounterChecklistModel = [];
    this.masterEncounterChecklistModel = [];
    this.masterEncounterChecklistAdministativeModel = [];
    this.patientEncounterDiagnosisCodes = [];
    this.patientEncounterServiceCodes = [];
    this.masterEncChecklistReviewItems = [];
    this.encounterChangeHistory = [];
    this.masterProgramTypes = [];
    this.masterEncounterMethods = [];
    this.masterEncounterTypes = [];
    this.patientAppointmentDetails = null;
    this.patientEncounterDetails = null;
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
    this.patientCurrentMedicationModel = [];
    this.followUpNotes = null;

    this.getUserPermissions();
    this.activatedRoute.queryParams.subscribe(params => {
      this.appointmentId = params.apptId == undefined ? 0 : parseInt(params.apptId);
      this.encounterId = params.encId == undefined ? 0 : parseInt(params.encId);
      this.getPatientEncounterDetails();
    });

    this.metaData = new Metadata();
    this.displayedColumns = [
      { displayName: 'Medication', key: 'medication', class: '', width: '10%', isSort: true },
      { displayName: 'Medication Form', key: 'dosageForm', class: '', width: '8%' },
      { displayName: 'Dose', key: 'dose', class: '', width: '8%' },
      { displayName: 'Quantity', key: 'quantity', class: '', width: '8%', },
      { displayName: 'Days Supply', key: 'daySupply', width: '10%' },
      { displayName: 'Frequency', key: 'frequency', class: '', width: '10%', },
      { displayName: 'Condition', key: 'condition', class: '', width: '10%', },
      { displayName: 'Provider Name', key: 'providerName', width: '12%' },
      { displayName: 'Prescribed Date', key: 'prescribedDate', width: '10%', type: 'date', isSort: true },
      { displayName: 'Refills', key: 'refills', width: '8%', isSort: true },
      { displayName: 'Source', key: 'source', width: '8%', type: ['Self Reported', 'Claim'] },
      { displayName: 'Notes', key: 'notes', class: '', width: '10%', },

    ];
  }
  ngOnInit() {
    this.soapForm = this.formBuilder.group({
      notes: [''],
      memberNotes: [''],
      ProgramTypeIds: [''],
      ManualChiefComplaint: [''],
      EncounterMethodId: [''],
      EncounterTypeId: [''],
    });
    this.getProgramList();
    this.getMasterData();
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.loginUserId = user.userID
      }
    });
  }
  get formControls() {
    return this.soapForm.controls;
  }
  onBackClick() {
    window.history.back();
  }
  printEncounterSummary() {
    let dailogModal;
    dailogModal = this.encounterSummaryPDFDialog.open(EncounterPrintPDFModalComponent, { data: { encounterId: this.encounterId, key: 'print' } })
    dailogModal.afterClosed().subscribe((result: string) => {
      if (result == 'SAVE') { }
    });
  }
  emailEncounterSummary() {
    let dailogModal;
    dailogModal = this.encounterSummaryPDFDialog.open(EncounterPrintPDFModalComponent, { data: { encounterId: this.encounterId, key: 'email' } })
    dailogModal.afterClosed().subscribe((result: string) => {
      if (result == 'SAVE') { }
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
      id: this.patientEncounterDetails && this.patientEncounterDetails.patientID,
      value: this.patientEncounterDetails && this.patientEncounterDetails.patientName
    }
    const modalPopup = this.signDailog.open(SignDialogComponent, {
      hasBackdrop: true,
      data: {
        staffsList,
        clientDetails,
        SignatoryLists: ['Provider', 'Member']
      }
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result) {
        switch ((result.Signatory || '').toUpperCase()) {
          case 'PROVIDER':
            this.employeeSign = {
              ...this.employeeSign,
              date: format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
              name: result.name,
              bytes: (result.bytes || '').split(',')[1]
            }
            this.saveSignature(this.employeeSign.id, this.employeeSign, null, null);
            break;
          case 'MEMBER':
            this.patientSign = {
              ...this.patientSign,
              date: format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
              name: result.name,
              bytes: (result.bytes || '').split(',')[1]
            }
            this.saveSignature(this.patientSign.id, null, this.patientSign, null);
            break;
          case 'GUARDIAN':
            this.guardianSign = {
              ...this.guardianSign,
              date: format(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
              name: result.name,
              bytes: (result.bytes || '').split(',')[1]
            }
            this.saveSignature(this.guardianSign.id, null, null, this.guardianSign);
            break;
        }
      }
    });
  }

  onChecklistSelection(event: any, item: any) {
    let tempChecklist = this.patientEncounterChecklistModel || [];
    if (event.checked) {
      tempChecklist.push(item);
    } else {
      let index = tempChecklist.findIndex(x => x.masterEncounterChecklistId == item.masterEncounterChecklistId);
      tempChecklist.splice(index, 1);
    }
    this.patientEncounterChecklistModel = tempChecklist;
  }

  isItemChecked(item: any) {
    return this.patientEncounterChecklistModel.findIndex(x => x.masterEncounterChecklistId == item.masterEncounterChecklistId) != -1;
  }

  onSubmitAsComplete() {
    this.onSubmit(true);
  }

  onSubmit(isCompleted: boolean = false) {
    if (this.soapForm.invalid) {
      return null;
    }
    const { notes, ProgramTypeIds, ManualChiefComplaint, EncounterMethodId, EncounterTypeId, memberNotes } = this.soapForm.value;
    //const { patientID, startDateTime, endDateTime, serviceLocationID, patientAddressID, officeAddressID, customAddressID, customAddress } = this.appointmentId > 0 ? this.patientAppointmentDetails : this.patientEncounterDetails;
    const { patientID, startDateTime, endDateTime, serviceLocationID, patientAddressID, officeAddressID, customAddressID, customAddress } =  this.patientEncounterDetails;
    let tempPrograms = (ProgramTypeIds || []).map(x => {
      let apptPrograms = new EncounterPrograms();
      apptPrograms.programTypeId = x;
      return apptPrograms;
    });

    const postData = {
      "Id": this.encounterId,
      "PatientID": patientID,
      "PatientAppointmentId": this.appointmentId,
      "DateOfService": startDateTime,
      "StartDateTime": startDateTime,
      "EndDateTime": endDateTime,
      "StaffID": this.staffDetails && this.staffDetails.staffId,
      "ServiceLocationID": serviceLocationID,
      "PatientAddressID": patientAddressID,
      "OfficeAddressID": officeAddressID,
      "CustomAddressID": customAddressID,
      "CustomAddress": customAddress,
      notes: notes,
      memberNotes: memberNotes,
      "patientEncounterChecklistModel": this.patientEncounterChecklistModel || [],
      "PatientEncounterServiceCodes": this.patientEncounterServiceCodes || [],
      "PatientEncounterDiagnosisCodes": this.patientEncounterDiagnosisCodes || [],
      "ProgramTypeIds": tempPrograms,
      "ManualChiefComplaint": ManualChiefComplaint || '',
      "EncounterMethodId": EncounterMethodId,
      "EncounterTypeId": EncounterTypeId,
      "isBillableEncounter": false,
      "isCompleted": this.encounterId > 0 ? isCompleted : false,
    }
    this.savePatientEncounter(postData, isCompleted);
  }

  getPatientEncounterDetails() {
    const isAdmin = false;
    this.encounterService.GetPatientEncounterDetails(this.appointmentId, this.encounterId, isAdmin)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.getLocationById(response.data.serviceLocationID);
            this.patientEncounterDetails = response.data;
            let allChecklistItems = response.data.patientEncounterChecklistModel || [];
            this.masterEncounterChecklistModel = allChecklistItems.filter(x => !x.isAdministrativeType);
            this.masterEncounterChecklistAdministativeModel = allChecklistItems.filter(x => x.isAdministrativeType);
            this.patientEncounterChecklistModel = allChecklistItems.filter(x => x.id > 0);
            this.patientEncounterDiagnosisCodes = response.data.patientEncounterDiagnosisCodes || [];
            this.patientEncounterServiceCodes = response.data.patientEncounterServiceCodes || [];
            this.masterEncChecklistReviewItems = response.data.encounterChecklistReviewItems || [];
            this.encounterChangeHistory = response.data.encounterChangeHistory || [];
            this.patientAppointmentDetails = response.data.patientAppointment || null;
            this.soapNotes = response.data.soapNotes || null;
            this.encounterSignature = response.data.encounterSignature || [];
            this.unitsConsumed = response.data.unitsConsumed;
            this.patientCurrentMedicationModel = response.data.patientCurrentMedicationModel || [];
            this.isSoapCompleted = (response.data.status || '').toUpperCase() === 'RENDERED' && !this.isAdminLogin; // do not mark complete for admin
            const notes = (response.data.notes || '').replace(/#x20;/g, '').replace(/\\n/g, '\n'),
              ProgramTypeIds = (response.data.programTypeIds || []).map(x => x.programTypeId),
              ManualChiefComplaint = response.data.manualChiefComplaint || '',
              EncounterMethodId = response.data.encounterMethodId,
              EncounterTypeId = response.data.encounterTypeId,
              memberNotes = response.data.memberNotes;
            this.followUpNotes = response.data.followUpNotes; 
            this.soapForm.patchValue({ notes: notes, ProgramTypeIds, ManualChiefComplaint, EncounterMethodId, EncounterTypeId, memberNotes });
            this.filterDetails();
            if (response.data.createdBy != this.loginUserId && !this.isAdminLogin) {
              this.isSoapCompleted = true;
            }

          } else {
            this.patientEncounterDiagnosisCodes = [];
            this.patientEncounterServiceCodes = [];
            this.masterEncChecklistReviewItems = [];
            this.encounterChangeHistory = [];
            this.patientAppointmentDetails = null;
            this.soapNotes = null;
            this.encounterSignature = [];
            this.unitsConsumed = 0;
            this.isSoapCompleted = false;
          }
        }
      )
  }

  filterDetails() {
    if (this.patientAppointmentDetails) {
      const { appointmentStaffs, endDateTime, startDateTime } = this.patientAppointmentDetails;
      if (appointmentStaffs && appointmentStaffs.length) {
        this.staffDetails = appointmentStaffs[0];
      }
      this.appointmentStartTime = `${format(startDateTime, 'hh:mm a')}`
      this.appointmentEndTime = `${format(endDateTime, 'hh:mm a')}`
    } else if (this.patientEncounterDetails) {
      const { staffID, staffName } = this.patientEncounterDetails;
      this.staffDetails = { staffId: staffID, staffName };
    }

    if (this.soapNotes) {
      this.soapForm.patchValue({ ...this.soapNotes })
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
            name: this.patientEncounterDetails && this.patientEncounterDetails.patientName,
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

  savePatientEncounter(postData: any, isCompleted: boolean, isAdmin: boolean = false) {
    isCompleted ? this.Completed = true : this.submitted = true;
    this.encounterService.SavePatientEncounter(postData, isAdmin)
      .subscribe(
        response => {
          isCompleted ? this.Completed = false : this.submitted = false;
          if (response.statusCode == 200) {
            this.notifierService.notify('success', response.message);
            if (!this.encounterId) {
              this.encounterId = response.data.id || 0;
              const patientId = (response.data && response.data.patientID) ? this.commonService.encryptValue(response.data.patientID) : null;
              this.router.navigate(["/web/member/encounter/soap"], {
                queryParams: {
                  id: patientId,
                  apptId: this.appointmentId,
                  encId: this.encounterId
                }
              });
            } else {
              this.getPatientEncounterDetails();
            }
          } else {
            this.notifierService.notify('error', response.message)
          }
        }
      )
  }

  saveSignature(id = 0, employeeSign, patientSign, guradianSign) {
    let postData = {
      'id': id,
      'patientEncounterId': this.encounterId,
      'patientId': patientSign ? (this.patientEncounterDetails && this.patientEncounterDetails.patientID) : null,
      'patientSign': patientSign ? patientSign.bytes : null,
      'patientSignDate': patientSign ? patientSign.date : null,
      'staffId': employeeSign ? (this.staffDetails && this.staffDetails.staffId) : null,
      'clinicianSign': employeeSign ? employeeSign.bytes : null,
      'clinicianSignDate': employeeSign ? employeeSign.date : null,
      'guardianName': guradianSign ? guradianSign.name : null,
      'guardianSign': guradianSign ? guradianSign.bytes : null,
      'guardianSignDate': guradianSign ? guradianSign.date : null,
    };
    this.submittedSign = true;
    this.encounterService.saveEncounterSignature(postData)
      .subscribe(
        response => {
          this.submittedSign = false;
          if (response.statusCode == 200) {
            this.notifierService.notify('success', response.message);
            let signObj = response.data;
            if (signObj.guardianSign) {
              this.guardianSign = {
                ...this.guardianSign,
                id: signObj.id
              }
              this.isGuardianSigned = true;
            }
            if (signObj.patientSign) {
              this.patientSign = {
                ...this.patientSign,
                id: signObj.id
              }
              this.isClientSigned = true;
            }
            if (signObj.clinicianSign) {
              this.employeeSign = {
                ...this.employeeSign,
                id: signObj.id
              }
              this.isEmployeeSigned = true;
            }
            this.checkIsRequiredSigned();
          } else {
            this.notifierService.notify('error', response.message);
          }
        }
      )
  }

  getDetails(key: string) {
    return this.appointmentId > 0 ? this.patientAppointmentDetails && this.patientAppointmentDetails[key] : this.patientEncounterDetails && this.patientEncounterDetails[key];
  }

  getMmasterEncChecklistReviewItems(id: number) {
    return this.masterEncChecklistReviewItems.filter(x => x.masterEncounterChecklistId == id);
  }

  getEncounterChangeHistory(id: number) {
    return this.encounterChangeHistory.filter(x => x.masterEncounterChecklistId == id);
  }

  getProgramList() {
    this.encounterService.getDiseaseManagementProgramList().subscribe((response) => {
      if (response.statusCode == 200) {
        this.masterProgramTypes = response.data || [];
      } else {
        this.masterProgramTypes = [];
      }
    }
    );
  }

  getMasterData() {
    const masterData = { masterdata: "ENCOUNTERTYPES,ENCOUNTERMETHODS" };
    this.encounterService.getMasterData(masterData)
      .subscribe((response: any) => {
        this.masterEncounterTypes = response.encounterTypes || [];
        this.masterEncounterMethods = response.encounterMethods || [];
      });
  }

  getUserPermissions() {
    const actionPermissions = this.encounterService.getUserScreenActionPermissions('SCHEDULING', 'SCHEDULING_LIST');
    const { isAdminLogin, SCHEDULING_LIST_CREATESOAP, SCHEDULING_LIST_VIEWSOAP } = actionPermissions;
    this.isAdminLogin = isAdminLogin;
    if (!SCHEDULING_LIST_VIEWSOAP) {
      if (SCHEDULING_LIST_CREATESOAP) {
        return;
      }
      this.router.navigate(['/web/not-found']);
    }
  }


  getLocationById(Id:number) {
    this.encounterService.getLocation(Id).subscribe((response: any) => {
        console.log(response);
        this.ServiceLocationAddress = response.data.address + ' ' + response.data.city + ' ' + response.data.stateName + ' ' + response.data.countryName;
        console.log(this.ServiceLocationAddress);
      });
    }

  }
