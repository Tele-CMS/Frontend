import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { TagModal } from './tag.modal';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';

@Injectable({
    providedIn: 'root'
})
export class TagsService {
    createURL = '/MasterTag/SaveMasterTag';
    deleteURL = '/MasterTag/DeleteMasterTag';
    getURL = '/MasterTag/GetMasterTagById';
    getAllURL = '/MasterTag/GetMasterTag';
    checkIfExistUrl = '/CheckIfRecordExists';

    constructor(private commonService: CommonService) { }

    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post('api/MasterData/MasterDataByName', masterData);
    }
    
    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }
    create(modalData: TagModal): Observable<TagModal> {
        return this.commonService.post(this.createURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    delete(id: number) {
        return this.commonService.patch(`${this.deleteURL}?id=${id}`, {})
    }
    get(id: number): Observable<TagModal> {
        let url = `${this.getURL}?id=${id}`;
        return this.commonService.getById(url, {})
            .pipe(map((response: any) => {
                let data = new TagModal();
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
