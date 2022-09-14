import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../../core/services';
import { MemberHRAModel } from './member-hra-listing/member-hra.model';
import { PatientDocumentModel } from '../questionnaire/documents/document.model';

const getQueryParamsFromObject = (filterModal: object): string => {
  let queryParams = '';
  let index = 0;
  for (const key of Object.keys(filterModal)) {
    if (index === 0)
      queryParams += `?${key}=${filterModal[key]}`;
    else
      queryParams += `&${key}=${filterModal[key]}`;

    index++;
  }
  return queryParams;
}

@Injectable({
  providedIn: 'root'
})
export class MemberHRAService {
  private getPatientPayerHealthPlanURL = 'PatientHRA/GetMemberHealthPlanForHRA'
  private getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
  private getMemberHRAListURL = 'PatientHRA/GetMemberHRAListing';
  private assignDocumentToPatientURL = 'Questionnaire/AssignDocumentToMultiplePatient';
  private getPatientDocumentAnswerURL = 'Questionnaire/GetPatientDocumentAnswer';
  private getBulkHRADataURL = 'PatientHRA/GetPatientHRAData';
  private updateHRADataURL = 'PatientHRA/UpdatePatientHRAData';
  private updateBulkHRADataURL = 'PatientHRA/BulkUpdateHRA';
  private generateIndividualSummaryPDFURL = "PatientHRA/PrintIndividualSummaryReport";
  private generateExecutiveSummaryPDFURL = "PatientHRA/PrintExecutiveSummaryReport";
  private getDiseaseManagementProgramListURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramList';
  private assignBulkHRADataURL = "PatientHRA/BulkAssignHRA"
  private sendBulkEmailURL = "BulkMessaging/SendBulkEmail";
  private sendBulkMessageURL = "BulkMessaging/SendBulkMessage";
  private getEmailTemplatesURL = "PatientHRA/GetEmailTemplatesForDD";
  private exportMemberHRAAssessmentToExcelUrl = 'PatientHRA/ExportMemberHRAassessmentToExcel';
  private printMemberHRAReportPDFlUrl ='PatientHRA/PrintMemberHRAPDF'
  private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';

  constructor(private commonService: CommonService) { }
  getMasterData(value: any) {
    return this.commonService.post(this.getMasterDataByNameURL, { masterdata: value });
  }
  getMemberHRAListing(filterModel: any) {
    let url = this.getMemberHRAListURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&searchText=' + filterModel.searchText + '&statusId=' + filterModel.statusId + '&documentId=' + filterModel.documentId + '&healthPlanId=' + filterModel.healthPlanId + '&programTypeId=' + filterModel.programTypeId + '&completionStartDate=' + filterModel.completionStartDate + '&completionEndDate=' + filterModel.completionEndDate + '&expirationStartDate=' + filterModel.expirationStartDate + '&expirationEndDate=' + filterModel.expirationEndDate + '&assignedStartDate=' + filterModel.assignedStartDate + '&assignedEndDate=' + filterModel.assignedEndDate + '&eligibilityEndDate=' + filterModel.eligibilityEndDate + '&eligibilityStartDate=' + filterModel.eligibilityStartDate + '&relationship=' + filterModel.relationship + '&conditionId=' + filterModel.conditionId + '&isEligible=' + filterModel.isEligible + '&careManagerIds=' + filterModel.careManagerIds + '&enrollmentId=' + filterModel.enrollmentId + "&nextAppointmentPresent=" + filterModel.nextAppointmentPresent;
      + "&nextAppointmentPresent=" + filterModel.nextAppointmentPresent;
    return this.commonService.getAll(url, {});
  }

  getPatientPayerHealthPlan(searchText: string) {
    let urlParams = `?searchText=${searchText}`;
    return this.commonService.getAll(this.getPatientPayerHealthPlanURL + urlParams, {});
  }
  assignDocumentToPatient(modalData: Array<MemberHRAModel>): Observable<MemberHRAModel> {
    return this.commonService.post(this.assignDocumentToPatientURL, modalData)
      .pipe(map((response: any) => {
        let data = response;
        return data;
      }))
  }
  assignBulkHRAData(filterModel: any) {
    return this.commonService.post(this.assignBulkHRADataURL, filterModel)
      .pipe(map((response: any) => {
        let data = response;
        return data;
      }))
  }
  updateBulkHRAData(filterModel: any) {
    return this.commonService.post(this.updateBulkHRADataURL, filterModel)
      .pipe(map((response: any) => {
        let data = response;
        return data;
      }))
  }
  // sendBulkEmail(filterModel: any) {
  //   return this.commonService.downloadWithPostRequest(this.sendBulkEmailURL, {}, filterModel);
  // }

  // sendBulkMessage(filterModel: any) {
  //   return this.commonService.downloadWithPostRequest(this.sendBulkMessageURL, {}, filterModel);
  // }

  getPatientDocumentAnswer(documentId: number, patientId: number, patientDocumentId: number): Observable<PatientDocumentModel> {
    let url = `${this.getPatientDocumentAnswerURL}?DocumentId=${documentId}&PatientId=${patientId}&patientDocumentId=${patientDocumentId}`;
    return this.commonService.getById(url, {})
  }
  getBulkHRAData(patientDocIds: any) {
    return this.commonService.getById(`${this.getBulkHRADataURL}?patDocIdArray=${patientDocIds}`, {})
      .pipe(map((response: any) => {
        let data = response;
        return data;
      }))
  }
  updateHRAData(data: any) {
    return this.commonService.post(this.updateHRADataURL, data)
      .pipe(map((response: any) => {
        let data = response;
        return data;
      }))
  }
  generateIndividualSummaryPDF(patientDocId: number, patientId: number) {
    const url = this.generateIndividualSummaryPDFURL + '?patientDocumentId=' + patientDocId + '&patientId=' + patientId;
    return this.commonService.download(url, {});
  }
  generateExecutiveSummaryPDF(documentId: number, fromDate: any, toDate: any) {
    const url = this.generateExecutiveSummaryPDFURL + '?documentId=' + documentId + '&fromDate=' + fromDate + '&toDate=' + toDate;
    return this.commonService.download(url, {});
  }
  downLoadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      return window.navigator.msSaveBlob(newBlob, filename);
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
  getDiseaseManagementProgramList(filterModal: any) {
    return this.commonService.getAll(`${this.getDiseaseManagementProgramListURL}?pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`, {});
  }
  getEmailTemplates() {
    return this.commonService.getAll(`${this.getEmailTemplatesURL}`, {});
  }

  exportMemberHRAReportToExcel(filterModel: any, pageSize: number): Observable<any> {
    //const queryParams = getQueryParamsFromObject(filterModal);
    let queryParams = '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + pageSize + '&searchText=' + filterModel.searchText + '&statusId=' + filterModel.statusId + '&documentId=' + filterModel.documentId + '&healthPlanId=' + filterModel.healthPlanId + '&programTypeId=' + filterModel.programTypeId + '&completionStartDate=' + filterModel.completionStartDate + '&completionEndDate=' + filterModel.completionEndDate + '&expirationStartDate=' + filterModel.expirationStartDate + '&expirationEndDate=' + filterModel.expirationEndDate + '&assignedStartDate=' + filterModel.assignedStartDate + '&assignedEndDate=' + filterModel.assignedEndDate + '&eligibilityEndDate=' + filterModel.eligibilityEndDate + '&eligibilityStartDate=' + filterModel.eligibilityStartDate + '&relationship=' + filterModel.relationship + '&conditionId=' + filterModel.conditionId + '&isEligible=' + filterModel.isEligible + "&nextAppointmentPresent=" + filterModel.nextAppointmentPresent;
    // let queryParams = `?ruleId=${filterModel.ruleId}&isEligible=${false}&isBiometricsComplete=${filterModel.isBiometricsComplete}&isEncountersCompliant=${filterModel.isEncountersCompliant}&pageNumber=${filterModel.pageNumber}&pageSize=${pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}`
    return this.commonService.download(this.exportMemberHRAAssessmentToExcelUrl + queryParams, {})
  }
  getStaffAndPatientByLocation(locationIds: string, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
    const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }
  printMemberHRAReportPDF(filterModel: any, pageSize: number): Observable<any> {
    //const queryParams = getQueryParamsFromObject(filterModal);
    let queryParams = '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + pageSize + '&searchText=' + filterModel.searchText + '&statusId=' + filterModel.statusId + '&documentId=' + filterModel.documentId + '&healthPlanId=' + filterModel.healthPlanId + '&programTypeId=' + filterModel.programTypeId + '&completionStartDate=' + filterModel.completionStartDate + '&completionEndDate=' + filterModel.completionEndDate + '&expirationStartDate=' + filterModel.expirationStartDate + '&expirationEndDate=' + filterModel.expirationEndDate + '&assignedStartDate=' + filterModel.assignedStartDate + '&assignedEndDate=' + filterModel.assignedEndDate + '&eligibilityEndDate=' + filterModel.eligibilityEndDate + '&eligibilityStartDate=' + filterModel.eligibilityStartDate + '&relationship=' + filterModel.relationship + '&conditionId=' + filterModel.conditionId + '&isEligible=' + filterModel.isEligible + "&nextAppointmentPresent=" + filterModel.nextAppointmentPresent;
    return this.commonService.download(this.printMemberHRAReportPDFlUrl + queryParams, {})
  }
}
