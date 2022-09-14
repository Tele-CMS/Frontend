import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { ICDCodesModel } from './icd-codes.model';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';

@Injectable({
    providedIn: 'root'
})

export class ICDCodeService {
    createURL = 'MasterICDs/SaveMasterICDCodes';
    updateURL = 'MasterICDs/SaveMasterICDCodes';
    deleteURL = 'MasterICDs/DeleteMasterICDCodes';
    getByIdURL = 'MasterICDs/GetMasterICDCodesById';
    getAllURL = 'MasterICDs/GetMasterICDCodes';
    checkIfExistUrl= '/CheckIfRecordExists';

    data: ICDCodesModel;
    constructor(private commonService: CommonService) {
    }

    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }

    create(icdModel: ICDCodesModel): Observable<ICDCodesModel> {
        return this.commonService.post(this.createURL, icdModel);
        // .pipe(map((response: any) => {
        //     this.data = response.data;
        //     return this.data;
        // }));
    }
    update() {

    }
    delete(id:number) {
        return this.commonService.patch(this.deleteURL+'/'+id, {});
    }
    getById(id: number) {
        return this.commonService.getById(this.getByIdURL + '/' + id, {});
    }
    getAll(filterModel:FilterModel)
    {
        let url=this.getAllURL+'?pageNumber='+filterModel.pageNumber+'&pageSize='+filterModel.pageSize+'&sortColumn='+filterModel.sortColumn+'&sortOrder='+filterModel.sortOrder+'&searchText='+filterModel.searchText;
        return this.commonService.getAll(url, {});
    }

    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }
}