import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { isatty } from "tty";
import { FilterModel } from "../../../../super-admin-portal/core/modals/common-model";
@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    private getEncounterListForDashboardURL = 'AdminDashboard/GetOrganizationEncounter';
    private getAuthListForDashboardURL = 'AdminDashboard/GetOrganizationAuthorization';
    private getAdminDashboardDataURL="AdminDashboard/GetAdminDashboardData";
    private getClientStatusChartURL="AdminDashboard/GetClientStatusChart";
    private getDashboardBasicInfoURL="AdminDashboard/GetDashboardBasicInfo";
    private getPendingPatientAppointmentURL = 'api/PatientAppointments/GetPendingAppointmentList';
    private getCancelledPatientAppointmentURL = 'api/PatientAppointments/GetCancelledAppointmentList';
    
    constructor(private commonService: CommonService) {
    }

    getEncounterListForDashboard(filterModel:FilterModel)
    {
        let url=this.getEncounterListForDashboardURL+"?pageNumber="+filterModel.pageNumber+"&pageSize="+filterModel.pageSize;
        return this.commonService.getAll(url,{});
    }

    getAuthListForDashboard(filterModel:FilterModel)
    {
        let url=this.getAuthListForDashboardURL+"?pageNumber="+filterModel.pageNumber+"&pageSize="+filterModel.pageSize;
        return this.commonService.getAll(url,{});
    }
    getAdminDashboardData()
    {
        return this.commonService.getAll(this.getAdminDashboardDataURL,{});
    }
    getClientStatusChart()
    {
        return this.commonService.getAll(this.getClientStatusChartURL,{});
    }
    getDashboardBasicInfo()
    {
        return this.commonService.getAll(this.getDashboardBasicInfoURL,{});
    }
    getPendingPatientAppointment(filterModel: FilterModel) {
        const URL = this.getPendingPatientAppointmentURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize;
        return this.commonService.getAll(URL, {});
    }
    getCancelledPatientAppointment(filterModel: FilterModel) {
        const URL = this.getCancelledPatientAppointmentURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize;
        return this.commonService.getAll(URL, {});
    }
}