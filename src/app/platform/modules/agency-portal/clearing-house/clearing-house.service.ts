import { Injectable } from '@angular/core';
import { FilterModel } from '../../core/modals/common-model';
import { CommonService } from '../../core/services';
import { ClearingHouseModel } from './clearing-house-model';
@Injectable({
  providedIn: 'root'
})
export class ClearingHouseService {
  createURL = 'EDIGateways/SaveUpdate';
  deleteURL = 'EDIGateways/DeleteEDIGateway';
  getByIdURL = "EDIGateways/GetEDIGateWayById";
  getAllURL = "EDIGateways/GetEDIGateways";

  constructor(private commonService: CommonService) { }

  getAll(filterModal: FilterModel) {
    let url = this.getAllURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&searchText=' + filterModal.searchText;
    return this.commonService.getAll(url, {});
  }
  getById(id: number) {
    return this.commonService.getById(this.getByIdURL + "?id=" + id, {});
  }

  save(clearingHouseModel: ClearingHouseModel) {
    return this.commonService.post(this.createURL, clearingHouseModel);
  }
  delete(id:number)
  {
    return this.commonService.patch(this.deleteURL + "?id=" + id, {});
  }
}
