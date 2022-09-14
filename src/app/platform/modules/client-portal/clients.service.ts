import {
  PaymentFilterModel,
  RefundFilterModel
} from "./../core/modals/common-model";
import { Injectable } from "@angular/core";
import { CommonService } from "../core/services/common.service";
import { FilterModel } from "../core/modals/common-model";
import { Observable } from "rxjs";
import { DiagnosisDataModel } from "./diagnosis/diagnosis.model";

@Injectable({
  providedIn: "root"
})
export class ClientsService {
  private getMasterDataByNameURL = "api/MasterData/MasterDataByName";
  private getClientProfileInfoURL = "Patients/GetPatientsDetails";
  private getPatientCCDAURL = "patients/GetPatientCCDA";
  private getAllergyListURL = "PatientsAllergy/GetAllergies";
  private getAllAuthorizationsForPatientURL = "Authorizations/GetAllAuthorizationsForPatient";
  private getImmunizationListURL = "PatientsImmunization/GetImmunization";
  private getPatientMedicalFamilyHistoryListURL = "PatientMedicalFamilyHistory/GetPatientMedicalFamilyHistoryById";
  private getPatientInsurances = "PatientsInsurance/GetPatientInsurances";
  private getPatientAppointment = "api/PatientAppointments/GetPatientAppointmentList";
  private getMedicationListURL = "PatientsMedication/GetMedication";
  //chat
  private getChatHistoryURL = "Chat/GetChatHistory";
  private getPaymentUrl = "AppointmentPayment/ClientPayments";
  private getRefundUrl = "AppointmentPayment/ClientRefunds";
  //review/ratings
  private getAllReviewRatingURL = "ReviewRatings/GetAllReviewRatings";
  private getReviewRatingURL = "ReviewRatings/GetReviewRatingById";
  private saveReviewRatingURL = "ReviewRatings/SaveUpdateReviewRating";
  private getClientNetAppointmentPaymentUrl = "AppointmentPayment/ClientNetAppointmentPayment";
  private getPatientsDashboardDetailsURL = "Patients/GetPatientsDashboardDetails";
  //Diagnosis URL
  // private getDiagnosisListURL = "SpringBData/GetSpringBPatientDiagnosis";
  private getDiagnosisListURL = "PatientsDiagnosis/GetDiagnosis";
  private getDiagnosisByIdURL = "PatientsDiagnosis/GetDiagnosisById";
  private createDiagnosisURL = "PatientsDiagnosis/SavePatientDiagnosis";
  private deleteDiagnosisURL = "PatientsDiagnosis/DeleteDiagnosis";
  private searchMasterICDCodesURL = "MasterICDs/GetMasterICDCodes";
    //Health-e Score
    private generateeHealthScorePDFURL = 'eHealthScore/PrinteHealthScoreReport'
    private getHealtheScoreListDataURL = "eHealthScore/GetAssignedHealtheScore"  
  constructor(private commonService: CommonService) {}
  getMasterData(value: string = "") {
    return this.commonService.post(this.getMasterDataByNameURL, {
      masterdata: value
    });
  }
  getPatientAppointmentList(locationId: number, id: number) {
    let url = `?locationIds=${locationId}&patientIds=${id}`;
    return this.commonService.getById(this.getPatientAppointment + url, {});
  }
  getClientProfileInfo(id: number) {
    return this.commonService.getById(
      this.getClientProfileInfoURL + "?id=" + id,
      {}
    );
  }
  getClientProfileDashboardInfo(id: number) {
    return this.commonService.getById(
      this.getPatientsDashboardDetailsURL + "?id=" + id,
      {}
    );
  }
  getPatientCCDA(patientId: number) {
    return this.commonService.download(
      this.getPatientCCDAURL + "?id=" + patientId,
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
  getPatientInsurancePaginator(filterModel:any,clientId: number) { 
    return this.commonService.getById(
      this.getPatientInsurances + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + "&patientId=" + clientId,
      {}
    );
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
    setTimeout(function() {
      // For Firefox it is necessary to delay revoking the ObjectURL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(data);
    }, 100);
  }
  getImmunizationList(clientId: number) {
    let url = this.getImmunizationListURL + "?patientId=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getImmunizationListPaginator(filterModel:any,clientId: number) { 
    let url = this.getImmunizationListURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + "&patientId=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getPatientMedicalFamilyHistoryList(clientId: number) {
    let url =
      this.getPatientMedicalFamilyHistoryListURL + "?patientid=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getAllergyList(clientId: number) {
    let url = this.getAllergyListURL + "?patientid=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getAllergyListPaginator(filterModel:any,clientId: number) {
    let url = this.getAllergyListURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + "&patientId=" + clientId; 
    return this.commonService.getAll(url, {});
  }
  getMedicationList(clientId: number) {
    let url = this.getMedicationListURL + "?patientid=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getMedicationListPaginator(filterModel:any,clientId: number) {
    let url = this.getMedicationListURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + "&patientId=" + clientId; 
    return this.commonService.getAll(url, {});
  }
  getAllAuthorization(clientId: number) {
    let url = this.getAllAuthorizationsForPatientURL + "?patientId=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getAllAuthorizationPaginator(filterModel:any,clientId: number) {
    let url = this.getAllAuthorizationsForPatientURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + "&patientId=" + clientId;  
    return this.commonService.getAll(url, {});
  }
  //chat
  getChatHistory(fromUserId: number, toUserId: number) {
    return this.commonService.getAll(
      `${this.getChatHistoryURL}?FromUserId=${fromUserId}&ToUserId=${toUserId}`,
      {}
    );
  }
  getAppointmentPayments(postData: PaymentFilterModel): Observable<any> {
    return this.commonService.post(this.getPaymentUrl, postData, true);
  }
  getClientNetAppointmentPayment(clientId: any): Observable<any> {
    return this.commonService.getAll(`${this.getClientNetAppointmentPaymentUrl}?clientId=${clientId}`, {});
  }
  getAppointmentRefunds(postData: RefundFilterModel): Observable<any> {
    return this.commonService.post(this.getRefundUrl, postData, true);
  }
  getReviewRatingById(id:number){
    return this.commonService.getById(this.getReviewRatingURL + "?id=" + id,  {})
  }
  saveUpdateReviewRating(data:any){
    return this.commonService.post(this.saveReviewRatingURL,data)
  }
  getReviewRatings(){
    return this.commonService.getAll(this.getAllReviewRatingURL,{})
  }
  //Diagnosis
  getDiagnosisList(clientId: number, filterModel: FilterModel,isShowAlert:boolean) {
    const urlParams = `?PatientId=${clientId}&searchText=${filterModel.searchText}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&isShowAlert=${isShowAlert}`
    return this.commonService.getAll(this.getDiagnosisListURL + urlParams, {});
  }
  getDiagnosisById(id: number) {
    return this.commonService.getById(this.getDiagnosisByIdURL + "?id=" + id, {});
  }
  createDiagnosis(data: DiagnosisDataModel) {
    return this.commonService.post(this.createDiagnosisURL, data);
  }
  deleteDiagnosis(id: number) {
    return this.commonService.patch(this.deleteDiagnosisURL + "?id=" + id, {});
  }
  getMasterICDCodesByFilter(searchText: string) {
    const params = `?searchText=${searchText}&pageNumber=1&pageSize=200`
    return this.commonService.getAll(this.searchMasterICDCodesURL + params, {}, false);
  }
  // health-e score
generateeHealthScorePDF(patientHealtheScoreId: number, patientId: number) {
  const url = this.generateeHealthScorePDFURL + '?patientId=' + patientId + '&patientHealtheScoreId=' + patientHealtheScoreId;
  return this.commonService.download(url, {});
}
downLoadFile(blob: Blob, filetype: string, filename: string) {
  var newBlob = new Blob([blob], { type: filetype });
  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob, filename);
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
getHealtheScoreListData(filterModel: any) {
  let url = this.getHealtheScoreListDataURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + '&patientId=' + filterModel.patientId;
  return this.commonService.getAll(url, {});
}
}
