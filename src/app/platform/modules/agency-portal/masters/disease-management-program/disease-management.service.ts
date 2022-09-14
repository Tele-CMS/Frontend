import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { FilterModel } from '../../../core/modals/common-model';
import { DiseaseMangementProgramModel } from './disease-management.model';

@Injectable({
    providedIn: 'root'
})

export class DiseaseManagementProgramService {
    getDiseaseManagementProgramListURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramList';
    getDiseaseManagementProgramListByIDURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramListById';
    getDiseaseManagementProgramActivityListURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramActivityList';
    createURL = 'DiseaseManagementProgram/SaveDiseaseManagementProgram';
    constructor(private commonService: CommonService) {
    }
    getDiseaseManagementProgramList(filterModel: FilterModel) {
        let url = this.getDiseaseManagementProgramListURL + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder;
        return this.commonService.getAll(url, {});
    }

    getDiseaseManagementProgramListById(id: number) {
        let url = `${this.getDiseaseManagementProgramListByIDURL}?id=${id}`;
        return this.commonService.getById(url, {})
      }
    getDiseaseManagementProgramActivityList(diseaseManagementProgramId:number, filterModel: FilterModel) {
        let url = this.getDiseaseManagementProgramActivityListURL + '?diseaseManagementProgramId=' + diseaseManagementProgramId + '&pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize+ '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder;
        return this.commonService.getAll(url,{}, false);
    }
    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }

    create(diseaseMangementProgramModel: DiseaseMangementProgramModel): Observable<DiseaseMangementProgramModel> {
        return this.commonService.post(this.createURL, diseaseMangementProgramModel);
    }
}