import { Injectable } from '@angular/core';
import { AppointmentTypeModal } from './appointment-type.model';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';
import { AbstractControl, ValidationErrors, AsyncValidator } from '@angular/forms';


@Injectable()
export class AppointmentTypeService implements AsyncValidator {
    createURL = '/AppointmentTypes/SaveAppointmentType';
    deleteURL = '/AppointmentTypes/DeleteAppointmentType';
    getURL = '/AppointmentTypes/GetAppointmentTypeById';
    getAllURL = 'AppointmentTypes/GetAppointmentType';
    checkIfExistUrl= '/CheckIfRecordExists';

    constructor(private commonService: CommonService) { }

    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }

    create(modalData: AppointmentTypeModal) {
        return this.commonService.post(this.createURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                // if (response.statusCode >= 200 && response.statusCode < 300 && response.statusCode !== 204) {
                //     data = response;
                // }
                return data;
            }))
    }
    delete(id: number) {
        return this.commonService.patch(`${this.deleteURL}?id=${id}`, {})
    }
    get(id: number): Observable<AppointmentTypeModal> {
        let url = `${this.getURL}?id=${id}`;
        return this.commonService.getById(url, {})
            .pipe(map((response: any) => {
                let data = new AppointmentTypeModal();
                if (response.statusCode >= 200 && response.statusCode < 300 && response.statusCode !== 204) {
                    data = response.data;
                }
                return data;
            }))
    }
    getAll(filterModal: FilterModel) {
        let url = this.getAllURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&searchText=' + filterModal.searchText;
        return this.commonService.getAll(url, {});
    }

    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }

}
