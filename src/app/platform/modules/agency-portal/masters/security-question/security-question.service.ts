import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { SecurityQuestionModel } from './security-question.model';
import { FilterModel } from '../../../core/modals/common-model';

@Injectable({
    providedIn: 'root'
})

export class SecurityQuestionService {
    createURL = 'SecurityQuestions/SaveSecurityQuestions';
    updateURL = 'SecurityQuestions/SaveSecurityQuestions';
    deleteURL = 'SecurityQuestions/DeleteSecurityQuestions';
    getByIdURL = 'SecurityQuestions/GetSecurityQuestionsById';
    getAllURL = 'SecurityQuestions/GetSecurityQuestions';
    checkIfExistUrl= '/CheckIfRecordExists';

    data: SecurityQuestionModel;
    constructor(private commonService: CommonService) {
    }
    
    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }
    create(securityQuestionModel: SecurityQuestionModel): Observable<SecurityQuestionModel> {
        return this.commonService.post(this.createURL, securityQuestionModel);
    }
    update() {

    }
    delete(id: number) {
        return this.commonService.patch(this.deleteURL + '/' + id, {});
    }
    getById(id: number) {
        return this.commonService.getById(this.getByIdURL + '/' + id, {});
    }
    getAll(filterModel: FilterModel) {
        let url = this.getAllURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + '&searchText=' + filterModel.searchText;
        return this.commonService.getAll(url, {});
    }

    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }
}