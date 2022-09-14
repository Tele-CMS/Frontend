import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { FilterModel } from '../../../core/modals/common-model';
import { LocationService } from '../../masters/location-master/location-master.service'

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private getPatientEncounterDetailsURL = 'patient-encounter/GetPatientEncounterDetails';
  private savePatientEncounterURL = 'patient-encounter/SavePatientEncounter';
  private getPatientEncountersListURL = "patient-encounter/GetPatientEncounter";
  private deleteEncounterURL = "patient-encounter/DeleteEncounter";
  private getDiseaseManagementProgramListURL = 'DiseaseManagementProgram/GetDiseaseManagementProgramList';
  private getMasterDataURL = 'api/MasterData/MasterDataByName';
  private discardEncounterChangesURL = 'patient-encounter/DiscardEncounterChanges';
  private getAllLocationsByOrganizationIdURL = 'MasterLocations/GetAllLocationsByOrganizationId';
  private checkPatientEligibilityURL = 'patient-encounter/CheckPatientEligibility';
  private sendBBIntructionsMailURL = 'patient-encounter/SendBBIntructionsMail';
  createClaimURL = "Claim/CreateClaim";

  constructor(private commonService: CommonService) { }

  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }
  SavePatientEncounter(postData: any, isAdmin: boolean) {
    const queryParams = `?isAdmin=${isAdmin}`;
    return this.commonService.post(this.savePatientEncounterURL + queryParams, postData);
  }

  GetPatientEncounterDetails(apptId: number, encId: number, isAdmin: boolean) {
    const queryParams = `/${apptId}/${encId}?isAdmin=${isAdmin}`;
    return this.commonService.getAll(this.getPatientEncounterDetailsURL + queryParams, {}, false);
  }

  getClientEncounters(clientId: number) {
    let url = this.getPatientEncountersListURL + `?pageNumber=1&pageSize=10&patientId=${clientId}&SortColumn=&SortOrder=&fromDate=&toDate=&status=Pending`;
    return this.commonService.getAll(url, {}, false);
  }

  deleteEncounter(encounterId: number) {
    let url = this.deleteEncounterURL + `?encounterId=${encounterId}`;
    return this.commonService.patch(url, {});
  }

  getDiseaseManagementProgramList(): Observable<any> {
    let filterModal = new FilterModel();
    filterModal.pageSize = 200;
    let queryParams = `?pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}`
    return this.commonService.getAll(this.getDiseaseManagementProgramListURL + queryParams, {}, false);
  }

  discardEncounterChanges(encounterId: number): Observable<any> {
    return this.commonService.getAll(this.discardEncounterChangesURL + `?encounterId=${encounterId}`, {});
  }

  getAll() {
    let url = this.getAllLocationsByOrganizationIdURL;
    return this.commonService.getAll(url, {});
  }

  checkPatientEligibility(data: any){
    //const queryParams = `?apiId=${apiId}&pId=${pId}&AuthToken=${sjWT}`;
    return this.commonService.post(this.checkPatientEligibilityURL, data, false);
  }

  sendBBIntructionsMail(postData: any){
    return this.commonService.post(this.sendBBIntructionsMailURL, postData, false);
  }

  createClaim(encounterId: number, isAdmin: boolean) {
    const queryParams = `?patientEncounterId=${encounterId}&isAdmin=${isAdmin}`;
    return this.commonService.post(this.createClaimURL + queryParams, {});
  }
}
