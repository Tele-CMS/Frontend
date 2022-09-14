import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserTimesheetTabularViewModel } from '../user-time-sheet-sheet-view/timesheet-sheet-view.model';

@Injectable({
    providedIn: 'root'
})
export class UserTimeSheetTabularViewService {
    getAllUserTimeSheetTabularViewURL = 'StaffTimesheet/GetStaffTimesheetDataTabularView';
    submitTimeSheetStatusURL = 'StaffTimesheet/SubmitUserTimesheet';
    saveUserTimeSheetDataURL = 'StaffTimesheet/SaveUserTimesheetDetails';
    getUserTimeSheetDataByIdURL = 'StaffTimesheet/GetUserTimesheetDetails';
    deleteUserTimeSheetDataByIdURL = 'StaffTimesheet/DeleteUserTimesheetDetails'
    constructor(private commonService: CommonService) { }
    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post('api/MasterData/MasterDataByName', masterData);
    }
    getAllUserTimeSheetTabularViewData(staffId: number, weekValue: number) {
        let url = this.getAllUserTimeSheetTabularViewURL + '?staffIds=' + staffId + '&weekValue=' + weekValue;
        return this.commonService.getAll(url, {});
    }
    submitTimeSheetStatus(statusIdArray: any) {
        return this.commonService.patch(`${this.submitTimeSheetStatusURL}?Ids=${statusIdArray}`, {});
    }
    deleteUserTimeSheet(id: number) {
        return this.commonService.patch(`${this.deleteUserTimeSheetDataByIdURL}?id=${id}`, {})
    }
    saveUserTimeSheet(modalData: UserTimesheetTabularViewModel): Observable<UserTimesheetTabularViewModel> {
        return this.commonService.post(this.saveUserTimeSheetDataURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    getUserTimeSheetDataById(id: number): Observable<UserTimesheetTabularViewModel> {
        let url = `${this.getUserTimeSheetDataByIdURL}/${id}`;
        return this.commonService.getById(url, {})
            .pipe(map((response: any) => {
                let data = new UserTimesheetTabularViewModel();
                if (response.statusCode >= 200 && response.statusCode < 300 && response.statusCode !== 204) {
                    data = response.data;
                }
                return data;
            }))
    }
}
