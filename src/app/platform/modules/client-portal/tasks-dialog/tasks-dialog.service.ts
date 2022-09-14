import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksDialogService {
  private saveTaskURL = "Tasks/SaveTask";
  private getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
  private getPatientsURL = 'Patients/GetPatients';
  private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';
  private getPatientCareGapForDDURL = "PatientCareGaps/GetPatientCareGapsForDD"
  private getTaskDDURL = "MasterTask/GetMasterTaskForDD"
  constructor(private commonService: CommonService) { }

  getMasterData(masterData: any) {
    return this.commonService.post(this.getMasterDataByNameURL, masterData);
  }
  getTaskDD(taskKey: string) {
    return this.commonService.getById(this.getTaskDDURL + '?taskKey=' + taskKey, {});
  }
  saveTask(postData: any): Observable<any> {
    return this.commonService.post(this.saveTaskURL, postData);
  }

  getPatientsByLocation(searchText: string, locationId: number): Observable<any> {
    const queryParams = `?searchKey=${searchText}&locationIDs=${locationId}&pageSize=5&isActive=true`;
    return this.commonService.getAll(this.getPatientsURL + queryParams, {}, false);
  }

  getStaffsByLocation(locationId: number, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
    const queryParams = `?locationIds=${locationId}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }
  getPatientCareGapForDD(patientId: number): Observable<any> {
    const params = `?patientId=${patientId || ''}`;
    return this.commonService.getById(this.getPatientCareGapForDDURL + params, {});
  }
}
