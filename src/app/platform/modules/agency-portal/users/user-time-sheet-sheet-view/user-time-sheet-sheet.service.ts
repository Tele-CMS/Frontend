import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { FilterModel } from '../../../core/modals/common-model';

@Injectable({
    providedIn: 'root'
})
export class UserTimeSheetViewService {
    getAllUserTimeSheetViewURL = 'StaffTimesheet/GetStaffTimesheetDataSheetView';
    constructor(private commonService: CommonService) { }

    getAllUserTimeSheetViewData(staffId: number, weekValue: number) {
        let url = this.getAllUserTimeSheetViewURL + '?staffIds=' + staffId + '&weekValue=' + weekValue;
        return this.commonService.getAll(url, {});
    }
}
