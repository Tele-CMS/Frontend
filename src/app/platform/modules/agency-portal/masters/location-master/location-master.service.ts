import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';
import { LocationModel } from './location-master.model';

@Injectable({
    providedIn: 'root'
})

export class LocationService {
    createURL = 'MasterLocations/SaveLocation';
    updateURL = 'MasterLocations/SaveLocation';
    deleteURL = 'MasterLocations/DeleteLocation';
    getByIdURL = 'MasterLocations/GetLocationById';
    getAllURL = 'MasterLocations/GetLocations';
    checkIfExistUrl= '/CheckIfRecordExists';

    data: LocationModel;
    constructor(private commonService: CommonService) {
    }

    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }
    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post('api/MasterData/MasterDataByName', masterData);
    }
    create(locationModel: LocationModel): Observable<LocationModel> {
        return this.commonService.post(this.createURL, locationModel);
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