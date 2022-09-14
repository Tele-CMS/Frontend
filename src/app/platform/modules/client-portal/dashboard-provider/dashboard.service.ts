import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { isatty } from "tty";
import { FilterModel } from "../../../../super-admin-portal/core/modals/common-model";
import { Observable } from "rxjs";
import { format } from "date-fns";
@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    private getMasterDataURL = 'api/MasterData/MasterDataByName';
    private getEncounterListForDashboardURL = 'AdminDashboard/GetOrganizationEncounter';
    private getAuthListForDashboardURL = 'AdminDashboard/GetOrganizationAuthorization';
    private getAdminDashboardDataURL = "AdminDashboard/GetAdminDashboardData";
    private getClientStatusChartURL = "AdminDashboard/GetClientStatusChart";
    private getDashboardBasicInfoURL = "AdminDashboard/GetDashboardBasicInfo";
    private getDashboardGapsCountURL = "AdminDashboard/GetDashboardGapsCount";
    private getPatientDocumentURL = 'Questionnaire/GetPatientDocuments';
    private GetOrganizationAppointmentsURL = 'AdminDashboard/GetOrganizationAppointments';
    private getCareGapDataURL = 'CareGaps/GetPatientCareGaps';
    private getComplianceGapDataURL = 'ComplianceGaps/GetPatientComplianceGaps';
    private getPendingPatientAppointmentURL = 'api/PatientAppointments/GetPendingAppointmentList';
    private getCancelledPatientAppointmentURL = 'api/PatientAppointments/GetCancelledAppointmentList';
    private getTentativePatientAppointmentURL = 'api/PatientAppointments/GetTentativeAppointmentList';
    private getAcceptedOrApprovedAppointmentURL = 'api/PatientAppointments/GetAcceptedOrApprovedAppointmentList';
    private updateAppointmentStatusURL = 'api/PatientAppointments/UpdateAppointmentStatus';
    private getTasksListURL = "Tasks/GetTasksList";
    private updateTaskStatusURL = "Tasks/UpdateTaskStatus";
    private cancelAppointmentURL = 'api/PatientAppointments/CancelAppointments';
    private getTaskDetailsURL = "Tasks/GetTaskDetails";
    private updateTaskURL = "Tasks/UpdateTask"
    private deleteTaskDetailsURL = "Tasks/DeleteTaskDetails";
    private getPieChartDataURL = "AdminDashboard/GetCareManagerDashboardData"
    private getLineChartDataForProgramEnrolleesURL = "AdminDashboard/GetDMPEnrolleesDataForGraph"
    private getLineChartDataForAppointmentsURL = "AdminDashboard/GetAppointmentsDataForGraph"
    private getLineChartDataForEncounterURL = "AdminDashboard/GetEncounterDataForGraph"
    private getDiseaseManagementProgramListURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramList';
    private getDiseaseProgramsWithEnrollmentsListURL = 'DiseaseManagementProgram/GetDiseaseProgramsListWithEnrollments';
    private getDiseaseConditionsFromProgramIdsURL = 'DiseaseManagementProgram/GetDiseaseConditionsFromProgramIds';
    private getPieChartDataForCarePlanURL = 'AdminDashboard/GetCareGapChartData';
    private getAlertsDataForGraphURL = 'AdminDashboard/GetAlertsDataForGraph';
    private getCareGapsListURL = 'CareGaps/GetCareGapsList';
    private getTaskDDURL = "MasterTask/GetMasterTaskForDD";
    private getDashboardTasksChartDataURL = "AdminDashboard/GetDashboardTasksChartData";
    private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';
    private getRiskDataForGraphURL = 'AdminDashboard/GetDashboardRiskGraphCount';
    private getBarChartDataForHRAURL = 'AdminDashboard/GetAssessmentDataForDashboardGraph'
    private getBarChartDataForComorbidConditionURL = 'AdminDashboard/GetComorbiditiesConditionDataForGraph'
    private getPieChartDataForTheraClassURL = 'AdminDashboard/GetDataForTheraClassesGraph'
    private getLineChartDataForHugsMessageURL = "AdminDashboard/GetHugsMessageDataForGraph"

    constructor(private commonService: CommonService) {
    }
    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }
    getEncounterListForDashboard(filterModel: FilterModel) {
        let url = this.getEncounterListForDashboardURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize;
        return this.commonService.getAll(url, {});
    }
    // GetOrganizationAppointments(filterModal: any) {
    //     let url = `${this.GetOrganizationAppointmentsURL}?locationIds=${filterModal.locationIds}&staffIds=${filterModal.staffIds}&fromDate=${filterModal.fromDate}&toDate=${filterModal.toDate}&status=${filterModal.status}&pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}`;
    //     return this.commonService.getAll(url, {});
    // }
    getPieChartDataForTheraClass(filterParamsForTheraClass:any){
      let url = this.getPieChartDataForTheraClassURL + '?GraphViewId=' + filterParamsForTheraClass.ChartView + '&StartDate=' + filterParamsForTheraClass.StartDate + '&EndDate=' + filterParamsForTheraClass.EndDate + '&MaxAmount=' + filterParamsForTheraClass.MaxAmount + '&MinAmount=' + filterParamsForTheraClass.MinAmount + "&NextAppointmentPresent=" + filterParamsForTheraClass.nextAppointmentPresent;
        return this.commonService.getAll(url, {});
    }
    getAllPatientDocuments(filterModal: FilterModel) {
        let url = this.getPatientDocumentURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }
    getCareGapData(filterModal: FilterModel) {
        let url = this.getCareGapDataURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }
    getComplianceGapData(filterModal: FilterModel) {
        let url = this.getComplianceGapDataURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }
    getAuthListForDashboard(filterModel: FilterModel) {
        let url = this.getAuthListForDashboardURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize;
        return this.commonService.getAll(url, {});
    }
    getAdminDashboardData() {
        return this.commonService.getAll(this.getAdminDashboardDataURL, {});
    }
    getClientStatusChart() {
        return this.commonService.getAll(this.getClientStatusChartURL, {});
    }
    getDashboardBasicInfo(isAdmin: boolean) {
        const URL = isAdmin ? this.getDashboardBasicInfoURL : this.getDashboardGapsCountURL;
        return this.commonService.getAll(URL, {});
    }

    getPendingPatientAppointment(filterModel: FilterModel) {
        const URL = this.getPendingPatientAppointmentURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize;
        return this.commonService.getAll(URL, {});
    }
    getCancelledPatientAppointment(filterModel: FilterModel) {
        const URL = this.getCancelledPatientAppointmentURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize+ '&sortOrder=' + filterModel.sortOrder+ '&sortColumn=' + filterModel.sortColumn;
        return this.commonService.getAll(URL, {});
    }
    getTentativePatientAppointmentList(filterModel: FilterModel) {
        const URL = this.getTentativePatientAppointmentURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize;
        return this.commonService.getAll(URL, {});
    }
    getAcceptedOrApprovedAppointmentList(filterModel: any) {
        const queryParams = `?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}&showPastAppointments=${filterModel.showPastAppointments}`;
        return this.commonService.getAll(this.getAcceptedOrApprovedAppointmentURL + queryParams, {});
    }
    getTaskDetails(id: number): Observable<any> {
        return this.commonService.getById(this.getTaskDetailsURL + `?id=${id}`, {});
    }
    GetTasksList(filterModel: FilterModel, patientId: number = 0): Observable<any> {
        const params = `?patientId=${patientId || ''}&searchText=${filterModel.searchText}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&SortColumn=${filterModel.sortColumn}&SortOrder=${filterModel.sortOrder}`;
        return this.commonService.getById(this.getTasksListURL + params, {});
    }

    updateTaskStatus(id: number, status: string): Observable<any> {
        return this.commonService.patch(this.updateTaskStatusURL + `?id=${id}&statusName=${status}`, {});
    }

    // appointments
    updateAppointmentStatus(appointmentData: any): Observable<any> {
        return this.commonService.post(this.updateAppointmentStatusURL, appointmentData);
    }
    cancelAppointment(appointmentData: any): Observable<any> {
        return this.commonService.post(this.cancelAppointmentURL, appointmentData);
    }
    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post(this.getMasterDataURL, masterData);
    }
    updateTask(id: number, key: string): Observable<any> {
        return this.commonService.patch(this.updateTaskURL + `?id=${id}&keyName=${key}`, {});
    }
    deleteTaskDetails(id: number): Observable<any> {
        return this.commonService.patch(this.deleteTaskDetailsURL + `?id=${id}`, {});
    }
    getPieChartData(filterAgeGroupGraph: any) {
        let currentDate = format(new Date(), 'YYYY-MM-DD')
      let url = `${this.getPieChartDataURL}?CurrentDate=${currentDate}&CareManagerIds=${filterAgeGroupGraph.CareManagerIds}&EnrollmentId=${filterAgeGroupGraph.EnrollmentId}&NextAppointmentPresent=${filterAgeGroupGraph.nextAppointmentPresent}`
        return this.commonService.getAll(url, {});
    }
    getLineChartDataForProgramEnrollees(filterParams: any) {
        let url = this.getLineChartDataForProgramEnrolleesURL
            + "?ProgramIds=" + (filterParams.programIds || []).join() + "&TimeIntervalFilterId=" + filterParams.timeIntervalFilterId + "&IsCheckTotalEnrollments=" + filterParams.isCheckTotalEnrollments
            + "&ConditionIds=" + filterParams.conditionIds + "&isCheckEnrolled=" + filterParams.isCheckEnrolled + "&isCheckNotEnrolled=" + filterParams.isCheckNotEnrolled
          + "&CareManagerIds=" + filterParams.CareManagerIds + "&EnrollmentId=" + filterParams.EnrollmentId + "&NextAppointmentPresent=" + filterParams.nextAppointmentPresent
        // let url = this.getLineChartDataForProgramEnrolleesURL
        //     + "?ProgramIds=" + (filterParams.programIds || []).join() + "&TimeIntervalFilterId=" + filterParams.timeIntervalFilterId + "&EnrollmentId=" + filterParams.EnrollmentId
        return this.commonService.getAll(url, {});
    }
    getLineChartDataForAppointments(filterParamsForAppointent: any) {
        let url = this.getLineChartDataForAppointmentsURL
          + "?StatusIds=" + (filterParamsForAppointent.statusIds || []).join() + "&AppointmentTimeIntervalId=" + filterParamsForAppointent.appointmentTimeIntervalId + '&CareManagerIds=' + (filterParamsForAppointent.CareManagerIds || []).join() + "&NextAppointmentPresent=" + filterParamsForAppointent.nextAppointmentPresent;
        return this.commonService.getAll(url, {});
   }
    getLineChartDataForHugsMessage(filterParamsForHugsMessage: any) {
      let url = this.getLineChartDataForHugsMessageURL
        + "?StatusIds=" + (filterParamsForHugsMessage.statusIds || []).join() + "&HugsMessageTimeIntervalId=" + filterParamsForHugsMessage.hugsMessageTimeIntervalId + '&CareManagerIds=' + (filterParamsForHugsMessage.CareManagerIds || []).join() + "&POCHugsTypeId=" + filterParamsForHugsMessage.pocHugsTypeId;
    return this.commonService.getAll(url, {});
    }
    getLineChartDataForEncounters(filterParamsForEncounter: any) {
        let url = this.getLineChartDataForEncounterURL
        + "?EncounterTypeIds=" + (filterParamsForEncounter.encounterTypeIds || []).join() + "&EncounterTimeIntervalId=" + filterParamsForEncounter.encounterTimeIntervalId + '&CareManagerIds=' + filterParamsForEncounter.CareManagerIds + '&EnrollmentId=' + filterParamsForEncounter.EnrollmentId + '&NextAppointmentPresent=' + filterParamsForEncounter.nextAppointmentPresent;
        return this.commonService.getAll(url, {});
    }
    getDiseaseManagementProgramList(filterModal: any) {
        return this.commonService.getAll(`${this.getDiseaseManagementProgramListURL}?pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`, {});
    }

  //Pie chart for care plan
  getPieChartDataForCarePlan(CareGapIds: string, StatusIds: string, CareManagerIds: string, EnrollmentId: number, TimeIntervalId: number, CareGapsViewId: number, nextAppointmentPresent: boolean) {
      let url = `${this.getPieChartDataForCarePlanURL}?CareGapIds=${CareGapIds}&StatusIds=${StatusIds}&CareManagerIds=${CareManagerIds}&EnrollmentId=${EnrollmentId}&TimeIntervalId=${TimeIntervalId}&CareGapsViewId=${CareGapsViewId}&NextAppointmentPresent=${nextAppointmentPresent}`
        return this.commonService.getAll(url, {});
    }

  GetAlertsDataForGraph(CareManagerIds: string, EnrollmentId: number, nextAppointmentPresent: boolean) {
    let url = `${this.getAlertsDataForGraphURL}?CareManagerIds=${CareManagerIds}&EnrollmentId=${EnrollmentId}&NextAppointmentPresent=${nextAppointmentPresent}`;
        return this.commonService.getAll(url, {});
    }

    GetRiskDataForGraph(filters: any) {
      let url = `${this.getRiskDataForGraphURL}?CareManagerIds=${filters.careManagerIds}&EnrollmentId=${filters.EnrollmentId}&NextAppointmentPresent=${filters.nextAppointmentPresent}`
        return this.commonService.getAll(url, {});
    }

    getCareGapsList(filterModal: FilterModel) {
        let url = this.getCareGapsListURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }

    getTaskDD(taskKey: string) {
        return this.commonService.getById(this.getTaskDDURL + '?taskKey=' + taskKey, {});
    }

    getDashboardTasksChartData(filters: any) {
        let url = `${this.getDashboardTasksChartDataURL}?TaskTypeIds=${(filters.taskTypeIds || []).join()}&TimeIntervalFilterId=${filters.timeIntervalFilterId}&careManagerIds=${filters.careManagerIds}&AllTasks=${filters.AllTasks}`;
        return this.commonService.getAll(url, {});
    }

    getDiseaseProgramsWithEnrollmentsList() {
        return this.commonService.getById(this.getDiseaseProgramsWithEnrollmentsListURL, {});
    }

    getDiseaseConditionsFromProgramIds(ProgramIds: string) {
        const queryParams = `?ProgramIds=${ProgramIds}`;
        return this.commonService.getById(this.getDiseaseConditionsFromProgramIdsURL + queryParams, {});
    }
    getStaffAndPatientByLocation(locationIds: string, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
        const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
        return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
    }
    getBarChartDataForHRA(filterParamsForHRA: any) {
        let url = this.getBarChartDataForHRAURL
          + "?CareManagerIds=" + (filterParamsForHRA.careManagerIds || '') + '&EnrollmentId=' + filterParamsForHRA.EnrollmentId + '&NextAppointmentPresent=' + filterParamsForHRA.nextAppointmentPresent
        return this.commonService.getAll(url, {});
    }
    getComorbiditiesConditionData(filterParams: any) {
      const queryParams = `?PrimaryConditionId=${filterParams.PrimaryConditionId}&ComorbidConditionIds=${filterParams.ComorbidConditionIds}&EnrollmentId=${filterParams.EnrollmentId}&NextAppointmentPresent=${filterParams.nextAppointmentPresent}`;
        return this.commonService.getAll(this.getBarChartDataForComorbidConditionURL + queryParams, {});
    }
}
