import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';
import { CustomFieldModel } from './custom-fields.model';

@Injectable({
    providedIn: 'root'
})

export class CustomFieldsService {
    createURL = 'MasterCustomLabels/SaveCustomLabel';
    updateURL = 'MasterCustomLabels/SaveCustomLabel';
    deleteURL = 'MasterCustomLabels/DeleteCustomLabel';
    getByIdURL = 'MasterCustomLabels/GetCustomLabelById';
    getAllURL = 'MasterCustomLabels/GetCustomLabel';
    checkIfExistUrl= '/CheckIfRecordExists';

    data: CustomFieldModel;
    constructor(private commonService: CommonService) {
    }

    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post('api/MasterData/MasterDataByName', masterData);
    }

    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }
    create(customFieldModel: CustomFieldModel): Observable<CustomFieldModel> {
        return this.commonService.post(this.createURL, customFieldModel);
    }
    update() {

    }
    delete(id: number) {
        return this.commonService.patch(this.deleteURL + '?id=' + id, {});
    }
    getById(id: number) {
        return this.commonService.getById(this.getByIdURL + '?id=' + id, {});
    }
    getAll(filterModel: FilterModel) {
        let url = this.getAllURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + '&searchText=' + filterModel.searchText;
        return this.commonService.getAll(url, {});
    }

    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }
}