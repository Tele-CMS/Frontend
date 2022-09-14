import { Injectable } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { FilterModel } from '../core/modals/common-model';
import { ManageAgencyModel } from './manage-agency.model';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ManageAgencyService {
    getAllURL = 'api/Organization/GetOrganizations';
    getByIdURL = "api/Organization/GetOrganizationById";
    createURL = "api/Organization/SaveOrganization";
    getMasterDataURL = 'api/MasterData/MasterDataByName';

    constructor(private commonService: CommonService) { }

    getAll(filterModal: FilterModel) {
        let url = this.getAllURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&orgName=' + filterModal.searchText;
        return this.commonService.getAll(url, {});
    }
    getById(id: number) {
        return this.commonService.getById(this.getByIdURL + "?Id=" + id, {});
    }
    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post(this.getMasterDataURL, masterData);
    }
    save(agencyModel: any) {
        return this.commonService.post(this.createURL, agencyModel);
    }
}
