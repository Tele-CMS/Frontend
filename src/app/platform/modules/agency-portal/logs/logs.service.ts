import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { FilterModel } from "../../core/modals/common-model";

@Injectable({
    providedIn: 'root'
})

export class LogsService {
    private getAuditLogs = "api/AuditLog/GetAuditLogsList";
    private getLoginLogs = "api/AuditLog/GetLoginLogsList";
    // private getHRAEmailAndMessageReportLogURL = "BulkMessaging/GetHRAEmailAndMessageReportLog";
    private getHRAEmailAndMessageReportLogURL = "PatientDiseaseManagementProgram/GetAllReportsHRAPrograms";
    private downloadHRAEmailAndMessageReportLogURL = "BulkMessaging/DownloadHRAEmailAndMessageReportLog";
    deleteURL = 'api/AuditLog/DeleteAuditLog';
    constructor(private commonService: CommonService) {
    }

    getAuditLogListing(filterModel: FilterModel) {
        let url = this.getAuditLogs + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + '&searchText=' + filterModel.searchText;
        return this.commonService.getAll(url, {});
    }
    getLoginLogListing(filterModel: FilterModel) {
        let url = this.getLoginLogs + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + '&searchText=' + filterModel.searchText;
        return this.commonService.getAll(url, {});
    }
    getHRAEmailAndMessageReportLog(filterModel: any,reportTypeId:number,providerId:number) {
        let url = this.getHRAEmailAndMessageReportLogURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + '&searchText=' + filterModel.searchText + '&reportTypeID=' + reportTypeId + '&providerId=' + providerId;
        return this.commonService.getAll(url, {});
    }
    downloadHRAEmailAndMessageReportLog(filterModel: string) {
        let url = this.downloadHRAEmailAndMessageReportLogURL + '?fileName=' + filterModel;
        return this.commonService.download(url, {});
    } 
    delete(id: number) {
        return this.commonService.patch(this.deleteURL + '?id=' + id, {});
    }
    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }
}