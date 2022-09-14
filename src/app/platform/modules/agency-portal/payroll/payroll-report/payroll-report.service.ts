import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';
import { PayrollReportModel } from './payroll-report.model';

@Injectable({
    providedIn: 'root'
})
export class PayrollReportService {
    getPayrollGroupDropDownURL = 'PayrollGroup/GetPayrollGroupListForDropdown';
    getUsersForPayrollGroupURL = 'Payroll/GetUsersByPayrollGroup';
    getPayrollReportDataURL = 'Payroll/GetPayrollReport';
    constructor(private commonService: CommonService) { }

    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post('api/MasterData/MasterDataByName', masterData);
    }
    getUsersForPayrollGroup(id: number): Observable<PayrollReportModel> {
        let url = `${this.getUsersForPayrollGroupURL}/${id}`;
        return this.commonService.getById(url, {})
            .pipe(map((response: any) => {
                let data = new PayrollReportModel();
                if (response.statusCode >= 200 && response.statusCode < 300 && response.statusCode !== 204) {
                    data = response.data;
                }
                return data;
            }))
    }
    getPayrollGroupDropDown() {
        let url = this.getPayrollGroupDropDownURL;
        return this.commonService.getAll(url, {});
    }
    getPayrollReportData(staffId,payrollGroupId,fromDate,toDate) {
        let url = `${this.getPayrollReportDataURL}?staffIds=${staffId}&payrollGroupId=${payrollGroupId}&fromDate=${fromDate}&toDate=${toDate}`;
        return this.commonService.getAll(url, {});
    }
}
