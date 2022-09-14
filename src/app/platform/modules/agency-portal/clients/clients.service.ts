import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import {
  ClientModel,
  AddUserDocumentModel,
  SocialHistoryModel
} from "./client.model";
import { GuardianModel } from "./guardian.model";
import { AddressModel } from "./address.model";
import { DiagnosisModel } from "./diagnosis/diagnosis.model";
import { PatientInsuranceModel } from "./insurance.model";
import { ClientCustomLabelModel } from "./clientCustomLabel.model";
import { PatientMedicalFamilyHistoryModel } from "./family-history/family-history.model";
import { ImmunizationModel } from "./immunization/immunization.model";
import { FilterModel } from "../../core/modals/common-model";
import { VitalModel } from "./vitals/vitals.model";
import { AllergyModel } from "./allergies/allergies.model";
import { AuthModel } from "./authorization/authorization.model";
import { MedicationModel } from "./medication/medication.model";
import { ClientLedgerPaymentDetailsModel } from "./client-ledger/client-ledger.model";
import { PrescriptionModel, PrescriptionFaxModel, PrescriptionDownloadModel } from "./prescription/prescription.model";
import { AlertsFilterModel } from "./alerts/alert.model";
import { Observable } from "rxjs";
import { PatientDocumentModel } from "./assessments/assessment.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ClientsService {
  private getMasterDataByNameURL = "api/MasterData/MasterDataByName";
  private createURL = "Patients/CreateUpdatePatient";
  private getClientByIdURL = "Patients/GetPatientById";
  private getClientHeaderInfoURL = "Patients/GetPatientHeaderInfo";
  private getClientProfileInfoURL = "Patients/GetPatientsDetails";

  private updateClientStatusURL = "patients/UpdatePatientActiveStatus";
  private updateUserStatusURL = "user/UpdateUserStatus";
  private getPatientCCDAURL = "patients/GetPatientCCDA";
  private updatePatientPortalVisibilityURL = "patients/UpdatePatientPortalVisibility";

  //Eligibility Enquiry Methods
  private getPayerByPatientURL = "GetPayerByPatient";
  private getEligibilityEnquiryServiceCodesURL = "EligibilityCheck/GetEligibilityEnquiryServiceCodes";
  private download270URL = "EligibilityCheck/Download270";

  //Allergy URL
  private createAllergyURL = "PatientsAllergy/SaveAllergy";
  private getAllergyListURL = "PatientsAllergy/GetAllergies";
  private getAllergyByIdURL = "PatientsAllergy/GetAllergyById";
  private deleteAllergyURL = "PatientsAllergy/DeleteAllergy";

  //Authorization
  private getAllAuthorizationsForPatientURL = "Authorizations/GetAllAuthorizationsForPatient";
  private getAuthorizationByIdURL = "Authorizations/GetAuthorizationById";
  private deleteAuthorizationURL = "Authorizations/DeleteAutorization";
  private getPatientPayerServiceCodesAndModifiersURL = "patients/GetPatientPayerServiceCodesAndModifiers";
  private createAuthorizationURL = "Authorizations/SaveAuthorization";

  //Vitals URL
  private createVitalURL = "PatientsVitals/SaveVital";
  private getVitalListURL = "PatientsVitals/GetVitals";
  private getVitalByIdURL = "PatientsVitals/GetVitalById";
  private deleteVitalURL = "PatientsVitals/DeleteVital";

  //Immunization URL
  private createImmunizationURL = "PatientsImmunization/SavePatientImmunization";
  private getImmunizationListURL = "PatientsImmunization/GetImmunization";
  private getImmunizationByIdURL = "PatientsImmunization/GetImmunizationById";
  private deleteImmunizationURL = "PatientsImmunization/DeleteImmunization";

  //Immunization URL
  private createMedicationURL = "PatientsMedication/SaveMedication";
  private getMedicationListURL = "PatientsMedication/GetMedication";
  private getMedicationByIdURL = "PatientsMedication/GetMedicationById";
  private deleteMedicationURL = "PatientsMedication/DeleteMedication";

  //Guardian URL
  private createGuardianURL = "PatientsGuardian/CreateUpdatePatientGuardian";
  private getGuardianListURL = "PatientsGuardian/GetPatientGuardian";
  private getGuardianByIdURL = "PatientsGuardian/GetPatientGuardianById";
  private deleteGuardianURL = "PatientsGuardian/DeletePatientGuardian";

  //Address URL
  private getAddressAndPhoneNumbersURL = "PatientsAddress/GetPatientPhoneAddress";
  private saveAddressAndPhoneNumbersURL = "PatientsAddress/SavePhoneAddress";

  // social history
  private getPatientSocialHistoryURL = "PatientsSocialHistory/GetPatientSocialHistory";
  private savePatientSocialHistoryURL = "PatientsSocialHistory/SavePatientSocialHistory";

  //Diagnosis URL
  private getDiagnosisListURL = "PatientsDiagnosis/GetDiagnosis";
  private getSoapNotePatientDiagnosisListURL = "patient-encounter/GetPatientDiagnosisDetails";
  private getDiagnosisByIdURL = "PatientsDiagnosis/GetDiagnosisById";
  private createDiagnosisURL = "PatientsDiagnosis/SavePatientDiagnosis";
  private deleteDiagnosisURL = "PatientsDiagnosis/DeleteDiagnosis";
  //Patient Insurance URL
  private getPatientInsurances = "PatientsInsurance/GetPatientInsurances";
  private savePatientInsurances = "PatientsInsurance/SavePatientInsurance";
  // Patient Custom Label
  private getPatientCustomLabels = "PatientsCustomLabel/GetPatientCustomLabels";
  private savePatientCustomLabels = "PatientsCustomLabel/SavePatientCustomLabels";

  // Patient Family History URL
  private getPatientMedicalFamilyHistoryListURL = "PatientMedicalFamilyHistory/GetPatientMedicalFamilyHistoryById";
  private deletePatientMedicalFamilyHistoryURL = "PatientMedicalFamilyHistory/DeletePatientMedicalFamilyHistory";
  private savePatientFamilyHistoryDataURL = "PatientMedicalFamilyHistory/SavePatientMedicalfamilyHistory";

  //Patient Encounters
  private getPatientEncountersListURL = "/patient-encounter/GetPatientEncounter";

  //Ledger URL
  private getClaimsForLedgerURL = "Claim/GetClaimsForPatientLedger";
  private getClaimServiceLineForPatientLedgerURL = "Claim/GetClaimServiceLinesForPatientLedger";
  private getPatientGuarantorURL = "patients/GetPatientGuarantor";
  private getPaymentDetailByIdURL = "api/Payment/GetPaymentDetailsById";
  private saveServiceLinePaymentURL = "api/Payment/SaveServiceLinePayment";
  private deleteServiceLinePaymentURL = "api/Payment/DeleteServiceLinePayment";

  //dpcuments
  private getUserDocumentsURL = "userDocument/GetUserDocuments";
  private getUserByLocationURL = "api/PatientAppointments/GetStaffAndPatientByLocation";
  private getUserDocumentURL = "userDocument/GetUserDocument";
  private deleteUserDocumentURL = "userDocument/DeleteUserDocument";
  private uploadUserDocumentURL = "userDocument/UploadUserDocuments";
  private getPateintApptDocumentsURL = "userDocument/GetPateintAppointmenttDocuments";
  //chat
  private getChatHistoryURL = "Chat/GetChatHistory";
  private getCareChatHistoryURL = "Chat/GetCareChatHistory";

  private importCCDAURL = "patients/ImportPatientCCDA";

  //Prescription
  private getPrescriptionlistURL = "PatientsPrescription/GetprescriptionDrugList"
  private createPrescriptionURL = "PatientsPrescription/SavePrescription";
  private getPrescriptionListURL = "PatientsPrescription/GetPrescriptions";
  private getPrescriptionByIdURL = "PatientsPrescription/GetPrescriptionById";
  private deletePrescriptionURL = "PatientsPrescription/DeletePrescription";
  private downloadPrescription = "PatientsPrescription/GetPrescriptionPdf";
  private sendfax = "PatientsPrescription/SendFax";
  private searchMasterPrescriptionDrugsURL = "PatientsPrescription/GetMasterprescriptionDrugs";
  private searchMasterPharmacyURL = "PatientsPrescription/GetMasterPharmacy";
  private getSentPrescriptionListURL = "PatientsPrescription/GetSentPrescriptions";

  //Alerts
  private getPatientAlertsURL = 'PatientsAlert/GetPatientAlerts';

  //Programs
  private getPatientDiseaseManagementProgramListURL = 'PatientDiseaseManagementProgram/GetPatientDiseaseManagementProgramList';
  private getDiseaseManagementProgramListURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramList';
  private terminateActivityURL = 'PatientDiseaseManagementProgram/EnrollmentPatientInDiseaseManagementProgram'
  private getProgramDetailsURL = 'PatientDiseaseManagementProgram/GetPatientDiseaseManagementProgramDetails'
  private deleteProgramURL = 'PatientDiseaseManagementProgram/deleteDiseaseManagementProgram'
  private saveProgramsURL = 'PatientDiseaseManagementProgram/AssignNewPrograms';
  private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';

  // assessments
  getPatientDocumentURL = 'Questionnaire/GetPatientDocuments';
  getPatientDocumentAnswerURL = 'Questionnaire/GetPatientDocumentAnswer';
  getPatientsURL = 'Patients/GetPatients';
  assignDocumentToPatientURL = 'Questionnaire/AssignDocumentToPatient';
  private discardEncounterChangesURL = 'patient-encounter/DiscardEncounterChanges';
  constructor(private commonService: CommonService) { }
  create(data: ClientModel) {
    return this.commonService.post(this.createURL, data);
  }
  getMasterData(value: string = "") {
    return this.commonService.post(this.getMasterDataByNameURL, {
      masterdata: value
    });
  }
  updateClientNavigations(id: number, userId: number = null) {
    this.commonService.updateClientNaviagations(id, userId);
  }
  getClientById(id: number) {
    return this.commonService.getById(
      this.getClientByIdURL + "?patientId=" + id,
      {}
    );
  }
  getClientHeaderInfo(id: number) {
    return this.commonService.getById(
      this.getClientHeaderInfoURL + "?id=" + id,
      {}
    );
  }
  getClientProfileInfo(id: number) {
    return this.commonService.getById(
      this.getClientProfileInfoURL + "?id=" + id,
      {}
    );
  }
  updateClientStatus(patientId: number, isActive: boolean) {
    return this.commonService.patch(
      this.updateClientStatusURL +
      "?patientID=" +
      patientId +
      "&isActive=" +
      isActive,
      {}
    );
  }

  updateUserStatus(patientId: number, isActive: boolean) {
    return this.commonService.patch(
      this.updateUserStatusURL + "/" + patientId + "/" + isActive,
      {}
    );
  }
  getPatientCCDA(patientId: number) {
    return this.commonService.download(
      this.getPatientCCDAURL + "?id=" + patientId,
      {}
    );
  }
  updatePatientPortalVisibility(
    patientId: number,
    userId: number,
    value: boolean,
    webUrl:string
  ) {
    let url =
      this.updatePatientPortalVisibilityURL +
      "?patientID=" +
      patientId +
      "&userID=" +
      userId +
      "&isPortalActive=" +
      value+
      "&url=" +
      webUrl;
    return this.commonService.patch(url, {});
  }

  //Eligibility Enquiry Method
  getPayerByPatient(patientID: number, key: string) {
    return this.commonService.getAll(
      this.getPayerByPatientURL + "?PatientID=" + patientID + "&Key=" + key,
      {}
    );
  }

  getEligibilityEnquiryServiceCodes() {
    return this.commonService.getAll(
      this.getEligibilityEnquiryServiceCodesURL,
      {}
    );
  }
  download270(
    patientId: number,
    patientInsuranceId: number,
    serviceTypeCodeIds: string,
    serviceCodeIds: string
  ) {
    let url =
      this.download270URL +
      "?patientId=" +
      patientId +
      "&patientInsuranceId=" +
      patientInsuranceId +
      "&serviceTypeCodeIds=" +
      serviceTypeCodeIds +
      "&serviceCodeIds=" +
      serviceCodeIds;
    return this.commonService.download(url, {});
  }

  //Guardian Method  -- Remove all if not needed
  createGuardian(data: GuardianModel) {
    return this.commonService.post(this.createGuardianURL, data);
  }
  getGuardianList(clientId: number, pageNumber: number, pageSize: number) {
    let url =
      this.getGuardianListURL +
      "?pageNumber=" +
      pageNumber +
      "&pageSize=" +
      pageSize +
      "&PatientId=" +
      clientId;
    return this.commonService.getAll(url, {});
  }
  getGuardianById(id: number) {
    return this.commonService.getById(
      this.getGuardianByIdURL + "?id=" + id,
      {}
    );
  }
  deleteGuardian(id: number) {
    return this.commonService.post(this.deleteGuardianURL + "?id=" + id, {});
  }
  //Address Method  -- Remove all if not needed
  getPatientAddressesAndPhoneNumbers(clientId: number) {
    return this.commonService.getById(
      this.getAddressAndPhoneNumbersURL + "?patientId=" + clientId,
      {}
    );
  }
  //Patient Inurance
  getPatientInsurance(clientId: number) {
    return this.commonService.getById(
      this.getPatientInsurances + "?patientId=" + clientId,
      {}
    );
  }

  savePatientAddressesAndPhoneNumbers(data: any) {
    return this.commonService.post(this.saveAddressAndPhoneNumbersURL, data);
  }

  // social history
  getPatientSocialHistory(patientId: number) {
    return this.commonService.getById(
      this.getPatientSocialHistoryURL + "?patientId=" + patientId,
      {}
    );
  }
  createSocialHistory(data: SocialHistoryModel) {
    return this.commonService.post(this.savePatientSocialHistoryURL, data);
  }

  //Diagnosis
  getDiagnosisList(clientId: number, filterModal: FilterModel = null) {
    // let url=this.getDiagnosisListURL+"?PatientId="+clientId;
    return this.commonService.getAll(
      this.getDiagnosisListURL + "?PatientId=" + clientId + "&pageNumber=" + filterModal.pageNumber + "&pageSize=" + filterModal.pageSize,
      {}
    );
  }
  getSoapNoteDiagnosisList(clientId: number, filterModel: FilterModel) {
    // let url=this.getDiagnosisListURL+"?PatientId="+clientId;
    return this.commonService.getAll(
      //this.getSoapNotePatientDiagnosisListURL + clientId,
      this.getSoapNotePatientDiagnosisListURL + "?patientId=" + clientId + "&pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize,
      {}
    );
  }
  getDiagnosisById(id: number) {
    return this.commonService.getById(
      this.getDiagnosisByIdURL + "?id=" + id,
      {}
    );
  }
  createDiagnosis(data: DiagnosisModel) {
    return this.commonService.post(this.createDiagnosisURL, data);
  }
  deleteDiagnosis(id: number) {
    return this.commonService.patch(this.deleteDiagnosisURL + "?id=" + id, {});
  }
  savePatientInsurance(data: Array<PatientInsuranceModel>) {
    return this.commonService.post(this.savePatientInsurances, data);
  }
  //Patient Custom Label
  getPatientCustomLabel(clientId: number) {
    return this.commonService.getById(
      this.getPatientCustomLabels + "?patientId=" + clientId,
      {}
    );
  }

  savePatientCustomLabel(data: Array<ClientCustomLabelModel>) {
    return this.commonService.post(this.savePatientCustomLabels, data);
  }

  //Patient Medical Family History
  getPatientMedicalFamilyHistoryList(clientId: number) {
    return this.commonService.getAll(
      this.getPatientMedicalFamilyHistoryListURL + "?patientID=" + clientId,
      {}
    );
  }
  getPatientMedicalFamilyHistoryById(id: number) {
    return this.commonService.getById(
      this.getPatientMedicalFamilyHistoryListURL + "?id=" + id,
      {}
    );
  }
  deletePatientMedicalFamilyHistory(id: number) {
    return this.commonService.patch(
      this.deletePatientMedicalFamilyHistoryURL + "?id=" + id,
      {}
    );
  }
  savePatientFamilyHistoryData(data: PatientMedicalFamilyHistoryModel) {
    return this.commonService.post(this.savePatientFamilyHistoryDataURL, data);
  }

  downloadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(data);
    }, 100);
  }
  //Immunization Method
  createImmunization(data: ImmunizationModel) {
    return this.commonService.post(this.createImmunizationURL, data);
  }
  getImmunizationList(clientId: number) {
    let url = this.getImmunizationListURL + "?patientId=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getImmunizationById(id: number) {
    return this.commonService.getById(
      this.getImmunizationByIdURL + "?id=" + id,
      {}
    );
  }
  deleteImmunization(id: number) {
    return this.commonService.patch(
      this.deleteImmunizationURL + "?id=" + id,
      {}
    );
  }

  //Medication Method
  createMedication(data: MedicationModel) {
    return this.commonService.post(this.createMedicationURL, data);
  }
  getMedicationList(clientId: number) {
    let url = this.getMedicationListURL + "?patientId=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getMedicationListPaginator(filterModel:any,clientId: number) {
    let url = this.getMedicationListURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + "&patientId=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getmedicationById(id: number) {
    return this.commonService.getById(
      this.getMedicationByIdURL + "?id=" + id,
      {}
    );
  }
  deleteMedication(id: number) {
    return this.commonService.patch(this.deleteMedicationURL + "?id=" + id, {});
  }

  //Vitals Method
  createVital(data: VitalModel) {
    return this.commonService.post(this.createVitalURL, data);
  }
  getVitalList(clientId: number, filterModel: FilterModel) {
    let url =
      this.getVitalListURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&PatientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder;
    return this.commonService.getAll(url, {});
  }
  getVitalById(id: number) {
    return this.commonService.getById(this.getVitalByIdURL + "?id=" + id, {});
  }
  deleteVital(id: number) {
    return this.commonService.patch(this.deleteVitalURL + "?id=" + id, {});
  }

  //Allergy Method
  createAllergy(data: AllergyModel) {
    return this.commonService.post(this.createAllergyURL, data);
  }
  getAllergyList(clientId: number, filterModel: FilterModel) {
    let url =
      this.getAllergyListURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&PatientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder;
    return this.commonService.getAll(url, {});
  }
  getAllergyById(id: number) {
    return this.commonService.getById(this.getAllergyByIdURL + "?id=" + id, {});
  }
  deleteAllergy(id: number) {
    return this.commonService.patch(this.deleteAllergyURL + "?id=" + id, {});
  }

  //authorization Methods
  getAllAuthorization(clientId: number, filterModel: any) {
    let url =
      this.getAllAuthorizationsForPatientURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&patientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder +
      "&authType=" +
      filterModel.authType;
    return this.commonService.getAll(url, {});
  }
  getAuthorizationById(authorizationId: number) {
    return this.commonService.getById(
      this.getAuthorizationByIdURL + "?authorizationId=" + authorizationId,
      {}
    );
  }
  deleteAuthorization(id: number) {
    return this.commonService.patch(
      this.deleteAuthorizationURL + "?id=" + id,
      {}
    );
  }
  getPatientPayerServiceCodesAndModifiers(
    clientId: number,
    payerId: number,
    patientInsuranceId: number
  ) {
    let url =
      this.getPatientPayerServiceCodesAndModifiersURL +
      "?patientId=" +
      clientId +
      "&PayerPreference=" +
      "Primary" +
      "&date=" +
      new Date() +
      "&payerId=" +
      payerId +
      "&patientInsuranceId=" +
      patientInsuranceId;
    return this.commonService.getAll(url, {});
  }
  createAuthorization(data: AuthModel) {
    return this.commonService.post(this.createAuthorizationURL, data);
  }

  //client encounter Methods
  getClientEncounters(
    filterModel: any,
    clientId: number,
    appointmentType: number,
    staffName: string,
    status: string,
    fromDate: string,
    toDate: string
  ) {
    let url =
      this.getPatientEncountersListURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&patientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder;
    if (appointmentType && appointmentType > 0)
      url = url + "&appointmentType=" + appointmentType;
    if (staffName && staffName != "") url = url + "&staffName=" + staffName;
    if (status && status != "") url = url + "&status=" + status;
    if (fromDate && fromDate != "") url = url + "&fromDate=" + fromDate;
    if (toDate && toDate != "") url = url + "&toDate=" + toDate;
    return this.commonService.getAll(url, {});
  }

  getClaimsForClientLegder(clientId: number, filterModel: FilterModel) {
    let url =
      this.getClaimsForLedgerURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&patientId=" +
      clientId +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder;
    return this.commonService.getAll(url, {});
  }
  getClaimServiceLinesForPatient(claimId: number) {
    return this.commonService.getById(
      this.getClaimServiceLineForPatientLedgerURL + "?claimId=" + claimId,
      {}
    );
  }
  getPaymentDetailById(paymentDetailId: number) {
    return this.commonService.getById(
      this.getPaymentDetailByIdURL + "?paymentDetailId=" + paymentDetailId,
      {}
    );
  }
  getPatientGuarantor(patientId: number) {
    return this.commonService.getById(
      this.getPatientGuarantorURL + "?patientId=" + patientId,
      {}
    );
  }
  saveServiceLinePayment(paymentModel: ClientLedgerPaymentDetailsModel) {
    return this.commonService.post(
      this.saveServiceLinePaymentURL,
      paymentModel
    );
  }
  deleteServiceLinePaymentDetail(id: number) {
    return this.commonService.patch(
      this.deleteServiceLinePaymentURL + "/" + id,
      {}
    );
  }

  getUserDocuments(userId: number, from: string, toDate: string) {
    return this.commonService.getAll(
      this.getUserDocumentsURL +
      "?userId=" +
      userId +
      "&from=" +
      from +
      "&to=" +
      toDate,
      {}
    );
  }

  getPateintApptDocuments(apptId: number) {
    return this.commonService.getAll(
      this.getPateintApptDocumentsURL +
      "?apptId=" +
      apptId,
      {}
    );
  }

  getUserByLocation(locationId: number) {
    let url =
      this.getUserByLocationURL +
      "?locationIds=" +
      locationId +
      "&permissionKey=SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES&isActiveCheckRequired=YES";
    return this.commonService.getAll(url, {});
  }
  getUserDocument(id: number) {
    return this.commonService.download(
      this.getUserDocumentURL + "?id=" + id,
      {}
    );
  }
  deleteUserDocument(id: number) {
    return this.commonService.patch(
      this.deleteUserDocumentURL + "?id=" + id,
      {}
    );
  }

  uploadUserDocuments(data: AddUserDocumentModel) {
    return this.commonService.post(this.uploadUserDocumentURL, data);
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(
      moduleName,
      screenName
    );
  }
  //chat
  getChatHistory(fromUserId: number, toUserId: number) {
    return this.commonService.getAll(
      `${this.getChatHistoryURL}?FromUserId=${fromUserId}&ToUserId=${toUserId}`,
      {}
    );
  }


  getCareChatHistory(fromUserId: number, toUserId: number) {
    return this.commonService.getAll(
      `${this.getCareChatHistoryURL}?FromUserId=${fromUserId}&ToUserId=${toUserId}`,
      {}
    );
  }
  importCCDA(data: any) {
    return this.commonService.post(this.importCCDAURL, { file: data });
  }

  //Medication Method
  createPrescription(data: PrescriptionModel) {
    return this.commonService.post(this.createPrescriptionURL, data);
  }

  getPrescriptionDrugList(id: number) {
    return this.commonService.getById(this.getPrescriptionlistURL + "?id=" + id, {});
  }

  getPrescriptionList(clientId: number, filterModel: FilterModel) {
    let url = this.getPrescriptionListURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&PatientId=" + clientId + "&SortColumn=" + filterModel.sortColumn + "&SortOrder=" + filterModel.sortOrder;
    return this.commonService.getAll(url, {});
  }

  getPrescriptionById(id: number) {
    return this.commonService.getById(this.getPrescriptionByIdURL + "?id=" + id, {});
  }

  deletePrescription(id: number) {
    return this.commonService.patch(this.deletePrescriptionURL + "?id=" + id, {});
  }

  DownloadPrescription(dataModel: PrescriptionDownloadModel) {
    const queryParams = `?PrescriptionId=${dataModel.PrescriptionId}&patientId=${dataModel.patientId}&Issentprescription=${dataModel.Issentprescription}`;
    return this.commonService.download(this.downloadPrescription + queryParams, {});
  }
  //
  downLoadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    document.body.appendChild(link);
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(data);
    }, 100);
  }

  sendFax(data: PrescriptionFaxModel) {
    return this.commonService.post(this.sendfax, data);
  }

  getMasterPrescriptionDrugsByFilter(searchText: string) {
    const params = `?searchText=${searchText}&pageNumber=1&pageSize=10`
    return this.commonService.getAll(this.searchMasterPrescriptionDrugsURL + params, {}, false);
  }

  getMasterPharmacyByFilter(searchText: string) {
    const params = `?searchText=${searchText}&pageNumber=1&pageSize=10`
    return this.commonService.getAll(this.searchMasterPharmacyURL + params, {}, false);
  }
  getSentPrescriptionList(clientId: number, filterModel: FilterModel) {
    let url = this.getSentPrescriptionListURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&PatientId=" + clientId + "&SortColumn=" + filterModel.sortColumn + "&SortOrder=" + filterModel.sortOrder;
    return this.commonService.getAll(url, {});
  }

  getPatientAlertsList(filterModal: AlertsFilterModel) {
    const queryParams = `?patientId=${filterModal.PatientId}&AlertTypeIds=${(filterModal.AlertTypeIds || []).join(',')}&startDate=${filterModal.startDate}&endDate=${filterModal.endDate}&pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`;
    return this.commonService.getAll(this.getPatientAlertsURL + queryParams, {});
  }

  //Programs
  getPatientDiseaseManagementProgramList(filterModal: any) {
    let url = `${this.getPatientDiseaseManagementProgramListURL}?patientId=${filterModal.patientId}&pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`
    return this.commonService.getAll(url, {})
  }
  getDiseaseManagementProgramList(filterModal: any) {
    return this.commonService.getAll(`${this.getDiseaseManagementProgramListURL}?pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`, {});
  }

  getDiseaseManagementProgramDetails(patientDiseaseManagementProgramId: number) {
    let url = `${this.getProgramDetailsURL}?Id=${patientDiseaseManagementProgramId}`
    return this.commonService.getById(url, {});
  }
  deleteDiseaseManagementProgram(patientDiseaseManagementProgramId: number) {
    let url = `${this.deleteProgramURL}?Id=${patientDiseaseManagementProgramId}`
    return this.commonService.getById(url, {});
  }

  terminateActivity(patientDiseaseManagementProgramId: number, enrollmentDate: Date, isEnrolled: boolean) {
    let url = `${this.terminateActivityURL}?patientDiseaseManagementProgramId=${patientDiseaseManagementProgramId}&enrollmentDate=${enrollmentDate}&isEnrolled=${isEnrolled}`
    return this.commonService.patch(url, {});
  }
  getStaffAndPatientByLocation(locationId: number, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
    const queryParams = `?locationIds=${locationId}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }
  savePrograms(postData: string) {
    return this.commonService.post(this.saveProgramsURL, postData);
  }

  //for Assessments
  getAllPatientDocuments(filterModal: any) {
    let url = this.getPatientDocumentURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&patientId=' + filterModal.patientId + '&DocumentId=' + filterModal.documentId + '&Status=' + filterModal.statusId +'&searchText=' + filterModal.searchText;
    return this.commonService.getAll(url, {});
  }
  getPatientDocumentAnswer(documentId: number, patientId: number, patientDocumentId: number): Observable<any> {
    let url = `${this.getPatientDocumentAnswerURL}?DocumentId=${documentId}&PatientId=${patientId}&patientDocumentId=${patientDocumentId}`;
    return this.commonService.getById(url, {})
  }
  getPatientsByLocation(searchText: string, locationId: number): Observable<any> {
    const queryParams = `?searchKey=${searchText}&locationIDs=${locationId}&pageSize=5&isActive=true`;
    return this.commonService.getAll(this.getPatientsURL + queryParams, {}, false);
  }
  assignDocumentToPatient(modalData: PatientDocumentModel): Observable<PatientDocumentModel> {
    return this.commonService.post(this.assignDocumentToPatientURL, modalData)
      .pipe(map((response: any) => {
        let data = response;
        return data;
      }))
  }

  discardEncounterChanges(encounterId: number): Observable<any> {
    return this.commonService.getAll(this.discardEncounterChangesURL + `?encounterId=${encounterId}`, {});
  }
}

