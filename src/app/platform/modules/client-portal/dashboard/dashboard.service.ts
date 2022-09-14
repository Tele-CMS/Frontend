import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { isatty } from "tty";
import { FilterModel } from "../../../../super-admin-portal/core/modals/common-model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { url } from "inspector";
@Injectable({
  providedIn: "root"
})
export class ClientDashboardService {
  private getMasterDataURL = "api/MasterData/MasterDataByName";
  private getEncounterListForDashboardURL = "AdminDashboard/GetOrganizationEncounter";
  private getAuthListForDashboardURL = "AdminDashboard/GetOrganizationAuthorization";
  private getAdminDashboardDataURL = "AdminDashboard/GetAdminDashboardData";
  private getClientStatusChartURL = "AdminDashboard/GetClientStatusChart";
  private getDashboardBasicInfoURL = "AdminDashboard/GetDashboardBasicInfo";
  private getDashboardGapsCountURL = "AdminDashboard/GetDashboardGapsCount";
  private GetOrganizationAppointmentsURL = "AdminDashboard/GetOrganizationAppointments";
  private getCareGapDataURL = "CareGaps/GetPatientCareGaps";
  private getComplianceGapDataURL = "ComplianceGaps/GetPatientComplianceGaps";
  private getPendingPatientAppointmentURL = "api/PatientAppointments/GetPendingAppointmentList";
  //private getTodayPatientAppointmentURL = 'api/PatientAppointments/GetPendingAppointmentList';
  private getCancelledPatientAppointmentURL = "api/PatientAppointments/GetCancelledAppointmentList";
  private updateAppointmentStatusURL = "api/PatientAppointments/UpdateAppointmentStatus";
  private getTasksListURL = "Tasks/GetTasksList";
  private updateTaskStatusURL = "Tasks/UpdateTaskStatus";
  private cancelAppointmentURL = "api/PatientAppointments/CancelAppointments";
  private getTaskDetailsURL = "Tasks/GetTaskDetails";
  private updateTaskURL = "Tasks/UpdateTask";
  private deleteTaskDetailsURL = "Tasks/DeleteTaskDetails";
  private getPatientDocumentAnswerURL = "Questionnaire/GetPatientDocumentAnswer";
  private GetSymptomateReportListingURl="Payers/GetSymptomateReportListing"
  private  GetPastUpcomingAppointmentURL="AppointmentPayment/GetPastUpcomingAppointment";
  private getLineChartDataForAppointmentsURL = "AdminDashboard/GetAppointmentsDataForGraph"
  private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';
  private getLineChartDataForEncounterURL = "AdminDashboard/GetEncounterDataForGraph"

  constructor(private commonService: CommonService) {}
  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(
      moduleName,
      screenName
    );
  }
  getEncounterListForDashboard(filterModel: FilterModel) {
    let url =
      this.getEncounterListForDashboardURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(url, {});
  }
  GetOrganizationAppointments(filterModal: any) {
    let url = `${this
      .GetOrganizationAppointmentsURL}?locationIds=${filterModal.locationIds}&staffIds=${filterModal.staffIds}&patientIds=${filterModal.patientIds}&fromDate=${filterModal.fromDate}&toDate=${filterModal.toDate}&status=${filterModal.status}&pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}`;
    return this.commonService.getAll(url, {});
  }
  GetPastUpcomingAppointment(filterModal: any) {
    let url = `${this
      .GetPastUpcomingAppointmentURL}?locationIds=${filterModal.locationIds}&staffIds=${filterModal.staffIds}&patientIds=${filterModal.patientIds}`;
    return this.commonService.getAll(url, {});
  }

  getCareGapData(filterModal: FilterModel) {
    let url =
      this.getCareGapDataURL +
      "?pageNumber=" +
      filterModal.pageNumber +
      "&pageSize=" +
      filterModal.pageSize +
      "&sortColumn=" +
      filterModal.sortColumn +
      "&sortOrder=" +
      filterModal.sortOrder;
    return this.commonService.getAll(url, {});
  }
  getComplianceGapData(filterModal: FilterModel) {
    let url =
      this.getComplianceGapDataURL +
      "?pageNumber=" +
      filterModal.pageNumber +
      "&pageSize=" +
      filterModal.pageSize +
      "&sortColumn=" +
      filterModal.sortColumn +
      "&sortOrder=" +
      filterModal.sortOrder;
    return this.commonService.getAll(url, {});
  }
  getAuthListForDashboard(filterModel: FilterModel) {
    let url =
      this.getAuthListForDashboardURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(url, {});
  }
  getAdminDashboardData() {
    return this.commonService.getAll(this.getAdminDashboardDataURL, {});
  }
  getClientStatusChart() {
    return this.commonService.getAll(this.getClientStatusChartURL, {});
  }
  getDashboardBasicInfo(isAdmin: boolean) {
    const URL = isAdmin
      ? this.getDashboardBasicInfoURL
      : this.getDashboardGapsCountURL;
    return this.commonService.getAll(URL, {});
  }

  getPendingPatientAppointment(
    filterModel: FilterModel,
    fromDate: string,
    toDate: string
  ) {
    const URL =
      this.getPendingPatientAppointmentURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&fromDate=" +
      fromDate +
      "&toDate=" +
      toDate;
    return this.commonService.getAll(URL, {});
  }

  getCancelledPatientAppointment(
    filterModel: FilterModel,
    fromDate: string,
    toDate: string
  ) {
    const URL =
      this.getCancelledPatientAppointmentURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&fromDate=" +
      fromDate +
      "&toDate=" +
      toDate;
    return this.commonService.getAll(URL, {});
  }
  getTaskDetails(id: number): Observable<any> {
    return this.commonService.getById(this.getTaskDetailsURL + `?id=${id}`, {});
  }
  GetTasksList(
    filterModel: FilterModel,
    patientId: number = 0
  ): Observable<any> {
    const params = `?patientId=${patientId ||
      ""}&searchText=${filterModel.searchText}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&SortColumn=${filterModel.sortColumn}&SortOrder=${filterModel.sortOrder}`;
    return this.commonService.getById(this.getTasksListURL + params, {});
  }

  updateTaskStatus(id: number, status: string): Observable<any> {
    return this.commonService.patch(
      this.updateTaskStatusURL + `?id=${id}&statusName=${status}`,
      {}
    );
  }

  // appointments
  updateAppointmentStatus(appointmentData: any): Observable<any> {
    return this.commonService.post(
      this.updateAppointmentStatusURL,
      appointmentData
    );
  }
  cancelAppointment(appointmentData: any): Observable<any> {
    return this.commonService.post(this.cancelAppointmentURL, appointmentData);
  }
  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }
  updateTask(id: number, key: string): Observable<any> {
    return this.commonService.patch(
      this.updateTaskURL + `?id=${id}&keyName=${key}`,
      {}
    );
  }
  deleteTaskDetails(id: number): Observable<any> {
    return this.commonService.patch(
      this.deleteTaskDetailsURL + `?id=${id}`,
      {}
    );
  }
  getReport( filterModel: FilterModel,
    fromDate: string,
    toDate: string,
    patientId:number

  ) {
    const URL =
      this.GetSymptomateReportListingURl +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&fromDate=" +
      fromDate +
      "&toDate=" +
      toDate+ "&patientId=" +
      patientId;

    return this.commonService.getAll(URL, {})
    .pipe(map(x => {
      return x;
    }));

  }
  // assign questionaire api
  getPatientDocumentAnswer(
    documentId: number,
    patientId: number,
    patientDocumentId: number
  ): Observable<any> {
    let urlParams = `?DocumentId=${documentId}&PatientId=${patientId}&patientDocumentId=${patientDocumentId}`;
    return this.commonService.getById(
      this.getPatientDocumentAnswerURL + urlParams,
      {}
    );
  }

  //for appointment graph
  getLineChartDataForAppointments(filterParamsForAppointent: any) {
    let url = this.getLineChartDataForAppointmentsURL
      + "?StatusIds=" + (filterParamsForAppointent.statusIds || []).join() + "&AppointmentTimeIntervalId=" + filterParamsForAppointent.appointmentTimeIntervalId + '&CareManagerIds=' + (filterParamsForAppointent.CareManagerIds || []).join() + "&NextAppointmentPresent=" + filterParamsForAppointent.nextAppointmentPresent + "&PatientId=" + filterParamsForAppointent.patientId;
    return this.commonService.getAll(url, {});
}
getStaffAndPatientByLocation(locationIds: string, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
  const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
  return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
}
//for encounter graph
getLineChartDataForEncounters(filterParamsForEncounter: any) {
  let url = this.getLineChartDataForEncounterURL
  + "?EncounterTypeIds=" + (filterParamsForEncounter.encounterTypeIds || []).join() + "&EncounterTimeIntervalId=" + filterParamsForEncounter.encounterTimeIntervalId + '&CareManagerIds=' + filterParamsForEncounter.CareManagerIds + '&EnrollmentId=' + filterParamsForEncounter.EnrollmentId + '&NextAppointmentPresent=' + filterParamsForEncounter.nextAppointmentPresent;
  return this.commonService.getAll(url, {});
}
}
