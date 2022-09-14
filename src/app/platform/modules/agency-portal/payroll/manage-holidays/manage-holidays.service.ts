import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';
import { ManageHolidayModel } from './manage-holidays.model';

@Injectable({
    providedIn: 'root'
})
export class ManageHolidayService {
    saveHolidayURL = 'AgencyHolidays/SaveAgencyHolidays';
    deleteHolidayURL = 'AgencyHolidays/DeleteAgencyHolidays';
    getHolidayByIdURL = 'AgencyHolidays/GetAgencyHolidaysById';
    getHolidayURL = 'AgencyHolidays/GetHolidayList';

    constructor(private commonService: CommonService) { }
    saveHoliday(modalData: ManageHolidayModel): Observable<ManageHolidayModel> {
        return this.commonService.post(this.saveHolidayURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    deleteHoliday(id: number) {
        return this.commonService.patch(`${this.deleteHolidayURL}/${id}`, {})
    }
    getHolidayById(id: number): Observable<ManageHolidayModel> {
        let url = `${this.getHolidayByIdURL}/${id}`;
        return this.commonService.getById(url, {})
            .pipe(map((response: any) => {
                let data = new ManageHolidayModel();
                if (response.statusCode >= 200 && response.statusCode < 300 && response.statusCode !== 204) {
                    data = response.data;
                }
                return data;
            }))
    }
    getAllHoliday(filterModal: FilterModel) {
        let url = this.getHolidayURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }

    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }
}
