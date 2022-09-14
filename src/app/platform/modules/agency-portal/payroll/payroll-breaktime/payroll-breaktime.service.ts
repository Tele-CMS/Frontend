import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';
import { PayrollBreakTimeModel } from './payroll-breaktime.model';

@Injectable({
    providedIn: 'root'
})
export class PayrollBreaktimeService {
    getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
    savePayrollBreaktimeURL = 'PayrollBreakTime/SavePayrollBreakTime';
    deletePayrollBreaktimeURL = 'PayrollBreakTime/DeletePayrollBreakTime';
    getPayrollBreaktimeByIdURL = 'PayrollBreakTime/GetPayrollBreakTimeById';
    getAllPayrollBreaktimeURL = 'PayrollBreakTime/GetPayrollBreakTimeList';
    checkIfExistUrl = '/CheckIfRecordExists';

    constructor(private commonService: CommonService) { }

    getMasterData(value: string = '') {
        return this.commonService.post(this.getMasterDataByNameURL, { masterdata: value });
    }
    savePayrollBreaktime(modalData: PayrollBreakTimeModel): Observable<PayrollBreakTimeModel> {
        return this.commonService.post(this.savePayrollBreaktimeURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    deletePayrollBreaktime(id: number) {
        return this.commonService.patch(`${this.deletePayrollBreaktimeURL}?id=${id}`, {})
    }
    getPayrollBreaktimeById(id: number): Observable<PayrollBreakTimeModel> {
        let url = `${this.getPayrollBreaktimeByIdURL}/${id}`;
        return this.commonService.getById(url, {})
            .pipe(map((response: any) => {
                let data = new PayrollBreakTimeModel();
                if (response.statusCode >= 200 && response.statusCode < 300 && response.statusCode !== 204) {
                    data = response.data;
                }
                return data;
            }))
    }
    getAllPayrollBreaktime(filterModal: FilterModel) {
        let url = this.getAllPayrollBreaktimeURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }
    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }

    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }
}
