import { Injectable } from '@angular/core';
import { CommonService } from '../core/services';
import { Observable } from 'rxjs';

const getQueryParamsFromObject = (filterModal: object): string => {
  let queryParams = '';
  let index = 0;
  for (const key of Object.keys(filterModal)) {
    if (index === 0)
      queryParams += `?${key}=${filterModal[key]}`;
    else
      queryParams += `&${key}=${filterModal[key]}`;

    index++;
  }
  return queryParams;
}


@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  getMasterDataURL = 'api/MasterData/MasterDataByName';
  GetMasterTemplatesURL = 'MasterTemplates/GetMasterTemplates';
  GetTemplateByIdURL = 'MasterTemplates/GetMasterTemplateById';
  SaveTemplateURL = 'MasterTemplates/SaveMasterTemplate';
  DeleteTemplateByIdURL = 'MasterTemplates/DeleteMasterTemplate';
  getMasterCategoryTemplateForDDURL = 'MasterTemplates/GetMasterTemplatesCategoryForDD';
  getMasterSubCategoryTemplateForDDURL = 'MasterTemplates/GetMasterTemplatesSubCategoryForDD';

  constructor(private commonService: CommonService) { }
  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }

  getMasterTemplates(filters: any) {
    const queryParams = getQueryParamsFromObject(filters);
    return this.commonService.getAll(this.GetMasterTemplatesURL + queryParams, {});
  }
  getMasterCategoryTemplateForDD() {
    return this.commonService.getAll(this.getMasterCategoryTemplateForDDURL, {});
  }

  getMasterSubCategoryTemplateForDD(masterCategoryId: any) {
    const queryParams = `?masterTemplateCategoryId=${masterCategoryId}`;
    return this.commonService.getAll(this.getMasterSubCategoryTemplateForDDURL + queryParams, {});
  }


  saveTemplateForm(JsonForm: any) {
    return this.commonService.post(this.SaveTemplateURL, JsonForm);
  }

  getTemplateForm(id: number) {
    const queryParams = `?id=${id}`;
    return this.commonService.getById(this.GetTemplateByIdURL + queryParams, {});
  }

  deleteTemplate(id: number) {
    const queryParams = `?id=${id}`;
    return this.commonService.patch(this.DeleteTemplateByIdURL + queryParams, {});
  }

}
