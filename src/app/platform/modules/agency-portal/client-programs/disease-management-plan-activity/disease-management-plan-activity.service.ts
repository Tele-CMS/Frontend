import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientDiseaseManagementProgramActivity } from './disease-management-plan-activity.model';
import { CommonService } from '../../../core/services';
import { FilterModel } from '../../../core/modals/common-model';

@Injectable({
    providedIn: 'root'
})

export class DMPActivityService {
    getByIdURL = 'PatientDiseaseManagementProgramActivity/GetPatientDiseaseManagementProgramActivityList';
    createURL = 'PatientDiseaseManagementProgramActivity/SavePatientDiseaseManagementProgramActivityList';
    getDailyDiaryDataURL = "PatientDiseaseManagementProgramActivityDiary/GetDMPPatientActivityDiary";
    private getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
    constructor(private commonService: CommonService) {
    }
    getMasterData(value: string = '') {
        return this.commonService.post(this.getMasterDataByNameURL, { masterdata: value });
    }
    getDailyDiaryData(dmpPatientActivityId: number, filterModel: FilterModel) {
        return this.commonService.getById(this.getDailyDiaryDataURL + '?dmpPatientActivityId=' + dmpPatientActivityId + '&pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + '&searchText=' + filterModel.searchText, {});

    }
    getById(patientId: number, diseaseManagmentProgramId: number, patientQuestionnaireId: number) {
        return this.commonService.getById(this.getByIdURL + '?patientId=' + patientId + '&diseaseManagmentProgramId=' + diseaseManagmentProgramId + '&patientQuestionnaireId=' + patientQuestionnaireId, {});
    }
    create(dmpActivityModel: PatientDiseaseManagementProgramActivity[], patientId: number, diseaseManagementPlanId: number): Observable<PatientDiseaseManagementProgramActivity> {
        return this.commonService.patch(this.createURL + '?patientId=' + patientId + '&diseaseManagementPlanId=' + diseaseManagementPlanId, dmpActivityModel);
    }
    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
        return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    }
}