import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services';
import { Observable } from 'rxjs';
import { FilterModel } from '../../core/modals/common-model';
import { CustomReportFilter, CustomReportEmailandMessageFilter } from './custom-report/custom-report.model';

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
export class ReportingService {
  private getMasterDataURL = 'api/MasterData/MasterDataByName';
  private getDiseaseManagementProgramListURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramList';
  private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';
  private GetFilteredAppointmentsForReportingURL = 'api/PatientAppointments/GetFilteredAppointmentsForReporting'
  private sendEmailMessagesURL = 'BulkMessaging/SendEmailMessagesForAppointmentReporting'
  private sendMessagesForAppointmentReportingUrl = 'BulkMessaging/SendMessagesForAppointmentReporting'
  //Custom Report
  private geRuleDataURL = 'QueryBuilder/GetRulesDropdown'
  private getReportDataByRuleIdURL = "QueryBuilder/GetDataFromComplianceQuery"
  private exportDataFromComplianceQueryToExcelUrl = "QueryBuilder/ExportDataFromComplianceQueryToExcel"
  private exportPatientAppointmentToExcelUrl = "api/PatientAppointments/ExportAppointmentsReportingToExcel"
  private generateApptReportPDFURL = "api/PatientAppointments/GetAppointmentReportingDataForPDF"
  private sendEmailMessagesQBURL = 'QueryBuilder/SendBulkEmailQB'
  private sendMessagesQBURL = 'QueryBuilder/SendBulkMessageQB'
  constructor(private commonService: CommonService) {

  }

  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }

  getDiseaseManagementProgramList(): Observable<any> {
    let filterModal = new FilterModel();
    filterModal.pageSize = 200;
    let queryParams = `?pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`
    return this.commonService.getAll(this.getDiseaseManagementProgramListURL + queryParams, {}, false);
  }

  getStaffAndPatientByLocation(locationIds: string, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
    const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }

  getFilteredAppointments(filterModal: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(this.GetFilteredAppointmentsForReportingURL + queryParams, {});
  }

  sendBulkEmail(filterModal: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.download(this.sendEmailMessagesURL + queryParams, {});
  }
   sendBulkMessage(filterModal: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.download(this.sendMessagesForAppointmentReportingUrl + queryParams, {});
  }
  getRuleData(): Observable<any> {
    return this.commonService.getAll(this.geRuleDataURL, {})
  }
  getReportDataByRuleId(filterModel:CustomReportFilter): Observable<any> {
    let queryParams = `?ruleId=${filterModel.ruleId}&isEligible=${false}&isBiometricsComplete=${filterModel.isBiometricsComplete}&isEncountersCompliant=${filterModel.isEncountersCompliant}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}`
    return this.commonService.getAll(this.getReportDataByRuleIdURL + queryParams, {})
  }

  exportDataFromComplianceQueryToExcel(filterModel:CustomReportFilter): Observable<any> {
    let queryParams = `?ruleId=${filterModel.ruleId}&isEligible=${false}&isBiometricsComplete=${filterModel.isBiometricsComplete}&isEncountersCompliant=${filterModel.isEncountersCompliant}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}`
    return this.commonService.download(this.exportDataFromComplianceQueryToExcelUrl + queryParams, {})
  }
  exportAppointmentReportToExcel(filterModal:any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    //let queryParams = `?ruleId=${filterModel.ruleId}&isEligible=${false}&isBiometricsComplete=${filterModel.isBiometricsComplete}&isEncountersCompliant=${filterModel.isEncountersCompliant}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}`
    return this.commonService.download(this.exportPatientAppointmentToExcelUrl + queryParams, {})
  }
  generateApptReportPDF(filterModal: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    
    return this.commonService.download(this.generateApptReportPDFURL + queryParams, {});
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
  //sendBulkEmailQB Query Builder
  sendBulkEmailQB(filterModel: CustomReportEmailandMessageFilter): Observable<any> {
   // const queryParams = getQueryParamsFromObject(filterModel);
    let queryParams = `?ruleId=${filterModel.ruleId}&isEligible=${false}&isBiometricsComplete=${filterModel.isBiometricsComplete}&isEncountersCompliant=${filterModel.isEncountersCompliant}&message=${filterModel.message}&subject=${filterModel.subject}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}`
    return this.commonService.download(this.sendEmailMessagesQBURL + queryParams, {});
  }
  //sendBulkMessageQB Query Builder
  sendBulkMessageQB(filterModel: CustomReportEmailandMessageFilter): Observable<any> {
    // const queryParams = getQueryParamsFromObject(filterModel);
    let queryParams = `?ruleId=${filterModel.ruleId}&isEligible=${false}&isBiometricsComplete=${filterModel.isBiometricsComplete}&isEncountersCompliant=${filterModel.isEncountersCompliant}&message=${filterModel.message}&subject=${filterModel.subject}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}`
    return this.commonService.download(this.sendMessagesQBURL + queryParams, {});
  }
}
