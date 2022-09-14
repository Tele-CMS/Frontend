import { Injectable } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { FilterModel } from '../core/modals/common-model';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ManageDatabaseService {
    getAllURL = 'OrganizationDatabaseDetail';
    createURL = "OrganizationDatabaseDetail";

    constructor(private commonService: CommonService) { }

    getAll(filterModal: FilterModel) {
        let url = this.getAllURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&databaseName=' + filterModal.searchText;
        return this.commonService.getAll(url, {});
    }

    save(data: any) {
        if (data.databaseDetailID != undefined && data.databaseDetailID > 0)
            return this.commonService.patch(this.createURL + "/" + data.databaseDetailID, data);
        else
            return this.commonService.post(this.createURL, data);
    }
}
