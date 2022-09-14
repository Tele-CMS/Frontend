import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';
import { PayrollGroupModel } from './payroll-group.model';

@Injectable({
    providedIn: 'root'
})
export class PayrollGroupService {
    savePayrollGroupURL = 'PayrollGroup/SavePayrollGroup';
    deletePayrollGroupURL = 'PayrollGroup/DeletePayrollGroup';
    getPayrollGroupByIdURL = 'PayrollGroup/GetPayrollGroupById';
    getAllPayrollGroupURL = 'PayrollGroup/GetPayrollGroupList';

    constructor(private commonService: CommonService) { }

    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post('api/MasterData/MasterDataByName', masterData);
    }
    savePayrollGroup(modalData: PayrollGroupModel): Observable<PayrollGroupModel> {
        return this.commonService.post(this.savePayrollGroupURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    deletePayrollGroup(id: number) {
        return this.commonService.patch(`${this.deletePayrollGroupURL}?id=${id}`, {})
    }
    getPayrollGroupById(id: number): Observable<PayrollGroupModel> {
        let url = `${this.getPayrollGroupByIdURL}/${id}`;
        return this.commonService.getById(url, {})
            .pipe(map((response: any) => {
                let data = new PayrollGroupModel();
                if (response.statusCode >= 200 && response.statusCode < 300 && response.statusCode !== 204) {
                    data = response.data;
                }
                return data;
            }))
    }
    getAllPayrollGroup(filterModal: FilterModel) {
        let url = this.getAllPayrollGroupURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }
}
