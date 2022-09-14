import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { FilterModel } from '../../../core/modals/common-model';
import { InsuranceTypeModel } from './insurance-type.model';

@Injectable({
    providedIn: 'root'
})

export class InsuranceTypeService {
    createURL = 'MasterInsuranceTypes/SaveInsuranceType';
    updateURL = 'MasterInsuranceTypes/SaveInsuranceType';
    deleteURL = 'MasterInsuranceTypes/DeleteInsuranceType';
    getByIdURL = 'MasterInsuranceTypes/GetInsuranceTypeById';
    getAllURL = 'MasterInsuranceTypes/GetInsuranceTypes';
    checkIfExistUrl= '/CheckIfRecordExists';

    data: InsuranceTypeModel;
    constructor(private commonService: CommonService) {
    }

    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }

    create(insuranceTypeModel: InsuranceTypeModel): Observable<InsuranceTypeModel> {
        return this.commonService.post(this.createURL, insuranceTypeModel);
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