import { ServiceModel } from "./service.model";
import { CommonService } from "src/app/platform/modules/core/services";
import { Injectable } from "@angular/core";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class MasterService {
  getAllURL: string = "api/MasterData/GetMasterServices";
  getByIdURL: string = "api/MasterData/GetMasterServicesById?Id=";
  checkServiceNameExistsURL: string = "api/MasterData/CheckServiceNameExistance?name=";
  createURL: string = "api/MasterData/SaveMasterService";
  deleteURL: string = "api/MasterData/DeleteMasterService";
  getMasterDataURL = 'api/MasterData/MasterDataByName';
  constructor(private commonService: CommonService) {}
  getAll(filterModel: FilterModel): any {
    let url =
      this.getAllURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder +
      "&searchText=" +
      filterModel.searchText;
    return this.commonService.getAll(url, {});
  }
  getById(id: string) {
    return this.commonService.getById(this.getByIdURL + id, {});
  }
  validate(name: string) {
    return this.commonService.getById(
      this.checkServiceNameExistsURL + name,
      {}
    );
  }
  create(serviceModel: ServiceModel): Observable<ServiceModel> {
    return this.commonService.post(this.createURL, serviceModel);
  }
  delete(id: number) {
    return this.commonService.patch(this.deleteURL + "/" + id, {});
  }
  getMasterData(value: string = '') {
    return this.commonService.post(this.getMasterDataURL, { masterdata: value });
}
}
