import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { ClientAlerts } from './client-alerts-listing/client-alerts.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientAlertsService {
  private getProfileInfoAlertsRedIndicatorURL = "Patients/GetRedAlertsInfo";
  private getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
  private getExportPatientAlertsInfoURL = "Patients/ExportPatientsAlertsInfo";
  private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';
  private sendBulkMessageURL = 'PatientsAlert/SendBulkMessage';
  private sendEmailMessagesURL = 'PatientsAlert/SendBulkEmail';
  private generateAlertDataPDFURL = "Patients/GetAlertsDataForPDF";
  private getDiseaseProgramsWithEnrollmentsListURL = 'DiseaseManagementProgram/GetDiseaseProgramsListWithEnrollments';
  private createReminderURL = 'PatientsAlert/SaveAlertsReminder';

  constructor(private commonService: CommonService) { }

  getDataLoadAlerts(filterModel: ClientAlerts): Observable<any> {
    let queryParams = `?searchText=${filterModel.searchText}&AlertTypeIds=${filterModel.AlertTypeIds}&StartDate=${filterModel.StartDate}&EndDate=${filterModel.EndDate}&CareManagerIds=${(filterModel.CareManagerIds || []).join(',')}&EnrollmentId=${filterModel.EnrollmentId}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&dob=${filterModel.dob}&medicalID=${filterModel.medicalID}&eligibilityStatus=${filterModel.eligibilityStatus}&StartAge=${filterModel.startAge}&EndAge=${filterModel.endAge}&RiskIds=${filterModel.riskIds}&EnrollmentId=${filterModel.EnrollmentId}&ProgramIds=${(filterModel.ProgramIds || []).join(',')}&GenderIds=${filterModel.GenderIds}&RelationshipIds=${filterModel.RelationshipIds}&PrimaryConditionId=${filterModel.PrimaryConditionId}&ComorbidConditionIds=${filterModel.ComorbidConditionIds}&nextAppointmentPresent=${(filterModel.nextAppointmentPresent)}`
    return this.commonService.getAll(this.getProfileInfoAlertsRedIndicatorURL + queryParams, {}, true)
  }
  getMasterData(value: string = '') {
    return this.commonService.post(this.getMasterDataByNameURL, { masterdata: value });
  }
  // sendBulkMessage(filterModel: any) {
  //   return this.commonService.downloadWithPostRequest(this.sendBulkMessageURL, {}, filterModel);
  // }
  // sendBulkEmail(filterModal: any) {
  //   return this.commonService.downloadWithPostRequest(this.sendEmailMessagesURL, {}, filterModal);
  // }
  getExportPatientAlerts(filterModel: any): Observable<any> {
    let url = this.getExportPatientAlertsInfoURL + "?searchText=" + filterModel.searchText + "&AlertTypeIds=" + filterModel.AlertTypeIds + "&StartDate=" + filterModel.StartDate + "&EndDate=" + filterModel.EndDate + "&CareManagerIds=" + (filterModel.CareManagerIds || []).join(',') + "&EnrollmentId=" + filterModel.EnrollmentId + "&pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&sortColumn=" + filterModel.sortColumn + "&sortOrder=" + filterModel.sortOrder + "&dob=" + filterModel.dob + "&medicalID=" + filterModel.medicalID + "&eligibilityStatus=" + filterModel.eligibilityStatus
      + "&StartAge=" + filterModel.startAge + "&EndAge=" + filterModel.endAge + "&RiskIds=" + filterModel.riskIds + "&ProgramIds=" + filterModel.ProgramIds
      + "&GenderIds=" + filterModel.GenderIds + "&RelationshipIds=" + filterModel.RelationshipIds
      + "&PrimaryConditionId=" + filterModel.PrimaryConditionId + "&ComorbidConditionIds=" + filterModel.ComorbidConditionIds;
      + "&nextAppointmentPresent=" + filterModel.nextAppointmentPresent;
    return this.commonService.download(url, {})
  }
  // getUserScreenActionPermissions(moduleName: string, screenName: string): any {
  //   return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
  // }

  getStaffAndPatientByLocation(locationIds: string, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
    const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }
  generateAlertDataPDF(filterModel: any) {
    let url = this.generateAlertDataPDFURL + "?searchText=" + filterModel.searchText + "&AlertTypeIds=" + filterModel.AlertTypeIds + "&StartDate=" + filterModel.StartDate + "&EndDate=" + filterModel.EndDate + "&CareManagerIds=" + (filterModel.CareManagerIds || []).join(',') + "&EnrollmentId=" + filterModel.EnrollmentId + "&pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&sortColumn=" + filterModel.sortColumn + "&sortOrder=" + filterModel.sortOrder + "&dob=" + filterModel.dob + "&medicalID=" + filterModel.medicalID + "&eligibilityStatus=" + filterModel.eligibilityStatus + "&StartAge=" + filterModel.startAge + "&EndAge=" + filterModel.endAge + "&RiskIds=" + filterModel.riskIds + "&ProgramIds=" + filterModel.ProgramIds
      + "&GenderIds=" + filterModel.GenderIds + "&RelationshipIds=" + filterModel.RelationshipIds
      + "&PrimaryConditionId=" + filterModel.PrimaryConditionId + "&ComorbidConditionIds=" + filterModel.ComorbidConditionIds
      + "&nextAppointmentPresent=" + filterModel.nextAppointmentPresent;
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
  getDiseaseProgramsWithEnrollmentsList() {
    return this.commonService.getById(this.getDiseaseProgramsWithEnrollmentsListURL, {});
  }
  createReminder(modalData: any) {
    let url = this.createReminderURL;
    return this.commonService.post(url, modalData)
      .pipe(map((response: any) => {
        let data = response;
        return data;
      }))
  }
}
