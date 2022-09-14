import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientProgramsService {
  private getPatientDiseaseManagementProgramListURL = 'PatientDiseaseManagementProgram/GetPatientDiseaseManagementProgramList';
  private getDiseaseManagementProgramListURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramList';
  private saveProgramsURL = 'PatientDiseaseManagementProgram/AssignNewPrograms';
  private terminateActivityURL = 'PatientDiseaseManagementProgram/EnrollmentPatientInDiseaseManagementProgram'
  private getProgramDetailsURL = 'PatientDiseaseManagementProgram/GetPatientDiseaseManagementProgramDetails'
  private deleteProgramURL = 'PatientDiseaseManagementProgram/deleteDiseaseManagementProgram'
  private getMasterDataURL = 'api/MasterData/MasterDataByName';
  private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';
  constructor(private commonService: CommonService) { }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
  }
  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }
  getPatientDiseaseManagementProgramList(filterModal: any) {
    let url = `${this.getPatientDiseaseManagementProgramListURL}?patientId=${filterModal.patientId}&pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`
    return this.commonService.getAll(url, {})
  }
  getDiseaseManagementProgramList(filterModal: any) {
    return this.commonService.getAll(`${this.getDiseaseManagementProgramListURL}?pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`, {});
  }
  savePrograms(postData: string) {
    return this.commonService.post(this.saveProgramsURL, postData);
  }
  terminateActivity(patientDiseaseManagementProgramId: number, enrollmentDate: Date, isEnrolled: boolean) {
    let url = `${this.terminateActivityURL}?patientDiseaseManagementProgramId=${patientDiseaseManagementProgramId}&enrollmentDate=${enrollmentDate}&isEnrolled=${isEnrolled}`
    return this.commonService.patch(url, {});
  }
  getDiseaseManagementProgramDetails(patientDiseaseManagementProgramId: number) {
    let url = `${this.getProgramDetailsURL}?Id=${patientDiseaseManagementProgramId}`
    return this.commonService.getById(url, {});
  }
  deleteDiseaseManagementProgram(patientDiseaseManagementProgramId: number) {
    let url = `${this.deleteProgramURL}?Id=${patientDiseaseManagementProgramId}`
    return this.commonService.getById(url, {});
  }

  getStaffAndPatientByLocation(locationId: number, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
    const queryParams = `?locationIds=${locationId}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }
}