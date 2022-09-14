import { Injectable } from '@angular/core';  
import { Observable } from 'rxjs';
import { CommonService } from '../../core/services';
import { FilterModel } from '../../core/modals/common-model';

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
export class EncounterService {
  getMasterDataURL = 'api/MasterData/MasterDataByName';
  getPatientEncounterDetailsURL = 'patient-encounter/GetPatientEncounterDetails';
  getNonBillableEncounterDetailsURL = 'patient-encounter/GetPatientNonBillableEncounterDetails';
  getAppConfigurationsURL = 'AppConfigurations/GetAppConfigurations';
  savePatientEncounterURL = 'patient-encounter/SavePatientEncounter';
  saveNonBillableEncounterURL = 'patient-encounter/SavePatientNonBillableEncounter';
  saveEncounterSignatureURL = 'patient-encounter/SaveEncounterSignature';
  private getClientHeaderInfoURL = "Patients/GetPatientHeaderInfo";
  getTelehealthSessionURL = "api/Telehealth/GetTelehealthSession";
  getMasterTemplatesURL = "MasterTemplates/GetMasterTemplates";
  GetTemplateByIdURL = 'patient-encounter/GetPatientEncounterTemplateData';
  SaveTemplateDataURL = 'patient-encounter/SaveEncounterTemplateData';
  generateEncounterSummaryPDFURL = "patient-encounter/PrintEncounterSummaryDetails";
  private getDiseaseManagementProgramListURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramList';
  emailEncounterSummaryPDFURL = 'patient-encounter/EmailEncounterSummary';
  getEncounterSummaryPDFURL = 'patient-encounter/GetEncounterSummaryDetailsForPDF';
  getLocationByServiceId = 'MasterLocations/GetLocationByServiceLocationID';
  private saveEncounterLogsOnAddClickURL = "patient-encounter/TrackEncounterAddUpdateClicks";
  private saveEncounterNotesURL = 'patient-encounter/SavePatientEncounterNotes';

  //Patient Encounters
  private getPatientEncountersListURL = "patient-encounter/GetPatientEncounter";
  getTelehealthSessionForInvitedAppointmentIdURL = "api/Telehealth/GetTelehealthSessionByInvitedAppointmentId?appointmentId=";

  //for ros
  private getReviewSystemURL = 'ReviewSystem/GetReviewSystem';
  private saveSystemReviewDataURL = 'ReviewSystem/SaveReviewSystem';
  private PostSectionColorIndicatorApiUrl = 'ClinicalDatagridsProviders/SaveSectionColorIndicator';

  constructor(private commonService: CommonService) { }

  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }
  // saveEncounterLogsOnAddClick(postData: any): Observable<any> {
  //   return this.commonService.post(this.saveEncounterLogsOnAddClickURL, postData);
  // }
  saveEncounterLogsOnAddClick(data: any): Observable<any> {
    // return this.commonService.post(this.saveEncounterLogsOnAddClickURL, data);
    return this.commonService.post(this.saveEncounterLogsOnAddClickURL, data);

  }
  GetPatientEncounterDetails(apptId: number, encId: number, isAdmin: boolean) {
    const queryParams = `/${apptId}/${encId}?isAdmin=${isAdmin}`;
    return this.commonService.getAll(this.getPatientEncounterDetailsURL + queryParams, {});
  }

  getNonBillableEncounterDetails(apptId: number, encId: number, isAdmin: boolean) {
    const queryParams = `/${apptId}/${encId}?isAdmin=${isAdmin}`;
    return this.commonService.getAll(this.getNonBillableEncounterDetailsURL + queryParams, {});
  }

  getAppConfigurations() {
    return this.commonService.getAll(this.getAppConfigurationsURL, {});
  }

  SavePatientEncounter(postData: any, isAdmin: boolean) {
    const queryParams = `?isAdmin=${isAdmin}`;
    return this.commonService.post(this.savePatientEncounterURL + queryParams, postData);
  }

  saveNonBillableEncounter(postData: any, isAdmin: boolean) {
    const queryParams = `?isAdmin=${isAdmin}`;
    return this.commonService.post(this.saveNonBillableEncounterURL + queryParams, postData);
  }

  saveEncounterSignature(postData: any) {
    return this.commonService.post(this.saveEncounterSignatureURL, postData);
  }

  saveEncounterNotes(postData: any) {
    return this.commonService.post(this.saveEncounterNotesURL, postData);
  }

  getClientHeaderInfo(id: number) {
    return this.commonService.getById(this.getClientHeaderInfoURL + '?id=' + id, {});
  }

  getTelehealthSession(filters: any) {
    const queryParams = getQueryParamsFromObject(filters);
    return this.commonService.getAll(this.getTelehealthSessionURL + queryParams, {});
  }
  getTelehealthSessionForInvitedAppointmentId(appointmentId: number) {
    //const queryParams = getQueryParamsFromObject(filters);
    return this.commonService.getAll(
      `${this.getTelehealthSessionForInvitedAppointmentIdURL}${appointmentId}`,
      {}
    );
  }
  getMasterTemplates() {
    return this.commonService.getAll(this.getMasterTemplatesURL, {});
  }

  getTemplateForm(patientEncounterId: number, templateId: number) {
    const queryParams = `?patientEncounterId=${patientEncounterId}&masterTemplateId=${templateId}`;
    return this.commonService.getById(this.GetTemplateByIdURL + queryParams, {});
  }

  saveTemplateData(postData: any) {
    return this.commonService.post(this.SaveTemplateDataURL, postData);
  }

  getDiseaseManagementProgramList(): Observable<any> {
    let filterModal = new FilterModel();
    filterModal.pageSize = 200;
    let queryParams = `?pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`
    return this.commonService.getAll(this.getDiseaseManagementProgramListURL + queryParams, {}, false);
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
  }

  //client encounter Methods
  getClientEncounters(filterModel: any, clientId: number, appointmentType: number, staffName: string, status: string, fromDate: string, toDate: string): Observable<any> {
    let url = this.getPatientEncountersListURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&patientId=" + clientId + "&SortColumn=" + filterModel.sortColumn + "&SortOrder=" + filterModel.sortOrder;
    if (appointmentType && appointmentType > 0)
      url = url + "&appointmentType=" + appointmentType;
    if (staffName && staffName != "")
      url = url + "&staffName=" + staffName;
    if (status && status != "")
      url = url + "&status=" + status;
    if (fromDate && fromDate != "")
      url = url + "&fromDate=" + fromDate;
    if (toDate && toDate != "")
      url = url + "&toDate=" + toDate;
    return this.commonService.getAll(url, {});
  }
  generateEncounterSummaryPDF(encounterId: number, checkListIds: string[], portalKey: string) {
    const url = this.generateEncounterSummaryPDFURL + '?encounterId=' + encounterId + '&checkListIds=' + checkListIds + '&portalKey=' + portalKey;
    return this.commonService.download(url, {});
  }
  emailEncounterSummaryPDF(encounterId: number, checkListIds: string[]) {
    const url = this.emailEncounterSummaryPDFURL + '?encounterId=' + encounterId + '&checkListIds=' + checkListIds;
    return this.commonService.getAll(url, {});
  }
  getEncounterSummaryPDF(encounterId: number) {
    const queryParams = `?encounterId=${encounterId}`;
    return this.commonService.getById(this.getEncounterSummaryPDFURL + queryParams, {});
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

  getLocation(Id: number) {
    let url = this.getLocationByServiceId + '?id=' + Id;
    return this.commonService.getAll(url, {});
  }

  //for review of systems
  getReviewSystemData(data) {
    return this.commonService.post(this.getReviewSystemURL, data); 
  }

  saveSystemReview(data: any) {
    return this.commonService.post(this.saveSystemReviewDataURL, data);  
  }

  saveSectionColorIndicator(reqModel: any) {
    return this.commonService.post(this.PostSectionColorIndicatorApiUrl, reqModel);   
  }

}
