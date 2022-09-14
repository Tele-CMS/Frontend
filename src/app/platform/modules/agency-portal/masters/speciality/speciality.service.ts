import { SpecialityModel } from "./speciality.model";
import { CommonService } from "src/app/platform/modules/core/services";
import { Injectable } from "@angular/core";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class SpecialityService {
  getAllURL: string = "api/GlobalCode/GetGlobalCodes";
  getByIdURL: string = "api/GlobalCode/GetGlobalCodeById?Id=";
  checkServiceNameExistsURL: string = "api/GlobalCode/CheckGlobalCodeExistance?name=";
  createURL: string = "api/GlobalCode/SaveGlobalCode";
  deleteURL: string = "api/GlobalCode/DeleteGlobalCode";
  getMasterDataURL = 'api/MasterData/MasterDataByName';
  getSpecialityUrl:string = "api/GlobalCode/GetGlobalServiceIconName";
  sizeInMB :any;
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
  create(serviceModel: SpecialityModel): Observable<SpecialityModel> {
    return this.commonService.post(this.createURL, serviceModel);
  }
  delete(id: number) {
    
    return this.commonService.patch(this.deleteURL + "?id=" + id, {});
  }
  getMasterData(value: string = '') {
    return this.commonService.post(this.getMasterDataURL, { masterdata: value });
  }
  isValidFileType(fileName, fileType): boolean {
    // Create an object for all extension lists
    
    // if(fileName.type== 'image/svg+xml'){
    //   fileName.type =fileName.type.slice('+').pop();
    // }
    let extentionLists = { video: [], image: [], pdf: [], excel: [], xml: [] };
    let isValidType = false;
    extentionLists.video = ["m4v", "avi", "mpg", "mp4"];
    extentionLists.image = ["png", "svg"];
    extentionLists.pdf = ["pdf"];
    extentionLists.excel = ["excel"];
    extentionLists.xml = ["xml"];
    //get the extension of the selected file.
    let fileExtension = fileName.name.split(".").pop().toLowerCase();
    isValidType = extentionLists[fileType].indexOf(fileExtension) > -1;
    if (isValidType) {
      this.sizeInMB = (fileName.size / (1024 * 1024)).toFixed(2);
      if (this.sizeInMB > 2) {
        isValidType = false;
      }
      else{
        isValidType = true;
      }
    }
    return isValidType;
  }
  getSpecialityIconName(){
    return this.commonService.getAll(this.getSpecialityUrl, {});
  }
}
