import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterModel } from '../../core/modals/common-model';
import { AgencyRegistrationService } from './agency-registration.service';
@Injectable({
    providedIn: 'root'
})
export class ManageAgencyService {
    getAllURL = 'api/Organization/GetOrganizations';
    getByIdURL = "api/Organization/GetOrganizationById";
    createURL = "api/Organization/RegisterOrganization";
    getMasterDataURL = 'api/MasterData/MasterDataByName';

    constructor(private agencyRegistrationService: AgencyRegistrationService) { }

    getAll(filterModal: FilterModel) {
        let url = this.getAllURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&orgName=' + filterModal.searchText;
        return this.agencyRegistrationService.getAll(url, {});
    }
    getById(id: number) {
        return this.agencyRegistrationService.getById(this.getByIdURL + "?Id=" + id, {});
    }
    getMasterData(masterData: any): Observable<any> {
        return this.agencyRegistrationService.post(this.getMasterDataURL, masterData);
    }
    save(agencyModel: any) {
        return this.agencyRegistrationService.post(this.createURL, agencyModel);
    }
}
