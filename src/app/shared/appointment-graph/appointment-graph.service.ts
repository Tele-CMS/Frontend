import { FilterModel } from "./../../super-admin-portal/core/modals/common-model";
import { CommonService } from "src/app/platform/modules/core/services";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class AppointmentGraphService {
  private getMasterDataURL = "api/MasterData/MasterDataByName";
  private getLineChartDataForAppointmentsURL = "AdminDashboard/GetAppointmentsDataForGraph";
  private getAcceptedOrApprovedAppointmentURL = "api/PatientAppointments/GetAcceptedOrApprovedAppointmentList";
  private getPendingPatientAppointmentURL = "api/PatientAppointments/GetPendingAppointmentList";
  private getCancelledPatientAppointmentURL = "api/PatientAppointments/GetCancelledAppointmentList";
  private getTentativePatientAppointmentURL = "api/PatientAppointments/GetTentativeAppointmentList";
  private getStaffAndPatientByLocationURL = "api/PatientAppointments/GetStaffAndPatientByLocation";
  private updateAppointmentStatusURL = "api/PatientAppointments/UpdateAppointmentStatus";
  private cancelAppointmentURL = "api/PatientAppointments/CancelAppointments";
  private getPendingInvitedPatientAppointmentURL = "api/PatientAppointments/GetPendingInvitationAppointmentList";
  private getAcceptedInvitedPatientAppointmentURL = "api/PatientAppointments/GetAcceptedInvitationAppointmentList";
  private getRejectedInvitedPatientAppointmentURL = "api/PatientAppointments/GetRejectedInvitationAppointmentList";
  private getUrgentcareAppointmentListURL = "api/PatientAppointments/GetUrgentCareAppointmentList";


  constructor(private commonService: CommonService) {}
  getLineChartDataForAppointments(filterParamsForAppointent: any) {
    let url =
      this.getLineChartDataForAppointmentsURL +
      "?StatusIds=" +
      (filterParamsForAppointent.statusIds || []).join() +
      "&AppointmentTimeIntervalId=" +
      filterParamsForAppointent.appointmentTimeIntervalId +
      "&CareManagerIds=" +
      (filterParamsForAppointent.CareManagerIds || []).join();
    return this.commonService.getAll(url, {});
  }
  getAcceptedOrApprovedAppointmentList(filterModel: any) {
    const queryParams = `?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`;
    return this.commonService.getAll(
      this.getAcceptedOrApprovedAppointmentURL + queryParams,
      {}
    );
  }
  getPendingPatientAppointment(filterModel: FilterModel) {
    const URL =
      this.getPendingPatientAppointmentURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(URL, {});
  }
  getCancelledPatientAppointment(filterModel: FilterModel) {
    const URL =
      this.getCancelledPatientAppointmentURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(URL, {});
  }
  getTentativePatientAppointmentList(filterModel: FilterModel) {
    const URL =
      this.getTentativePatientAppointmentURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(URL, {});
  }
  getStaffAndPatientByLocation(
    locationIds: string,
    permissionKey: string = "SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES"
  ): Observable<any> {
    const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(
      this.getStaffAndPatientByLocationURL + queryParams,
      {}
    );
  }
  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }
  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(
      moduleName,
      screenName
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
  getPendingInvitedPatientAppointment(filterModel: FilterModel) {
    const URL =
      this.getPendingInvitedPatientAppointmentURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(URL, {});
  }
  getRejectedInvitedPatientAppointment(filterModel: FilterModel) {
    const URL =
      this.getRejectedInvitedPatientAppointmentURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(URL, {});
  }
  getAcceptedInvitedPatientAppointment(filterModel: FilterModel) {
    const URL =
      this.getAcceptedInvitedPatientAppointmentURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(URL, {});
  }
  getUrgentcareAppointmentList(filterModel: any) {
    const queryParams = `?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`;
    return this.commonService.getAll(
      this.getUrgentcareAppointmentListURL + queryParams,
      {}
    );
  }
}
