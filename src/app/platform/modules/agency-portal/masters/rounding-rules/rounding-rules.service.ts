import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { RoundingRuleModel } from './rounding-rules.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';

@Injectable({
    providedIn: 'root'
})
export class RoundingRulesService {
    createURL = 'api/MasterData/SaveRoundingRule';
    deleteURL = 'api/MasterData/DeleteRoundingRule';
    getURL = 'api/MasterData/GetRoundingRuleById';
    getAllURL = 'api/MasterData/GetRoundingRulesList';
    checkIfExistUrl= 'CheckIfRecordExists';

    constructor(private commonService: CommonService) { }

    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }
    create(modalData: RoundingRuleModel): Observable<RoundingRuleModel> {
        return this.commonService.post(this.createURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    delete(id: number) {
        return this.commonService.patch(this.deleteURL + '?Id=' + id, {});
    }
    get(id: number): Observable<RoundingRuleModel> {
        let url = `${this.getURL}?id=${id}`;
        return this.commonService.getById(url, {})
            .pipe(map((response: any) => {
                let data = new RoundingRuleModel();
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
