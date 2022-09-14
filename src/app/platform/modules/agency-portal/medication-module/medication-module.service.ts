import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services';
import { FilterModel } from '../../core/modals/common-model';
import { MedicationDataModel } from './medication/medication.model';
import { CurrentMedicationModel } from './current-medication/current-medication.model';

@Injectable({
  providedIn: 'root'
})
export class MedicationModuleService {

  private getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
  //Current Medication URL 
  private createCurrentMedicationURL = "PatientsCurrentMedication/SaveCurrentMedication";
  private getCurrentMedicationListURL = "PatientsCurrentMedication/GetCurrentMedication";
  private getCurrentMedicationByIdURL = "PatientsCurrentMedication/GetCurrentMedicationById";
  private deleteCurrentMedicationURL = "PatientsCurrentMedication/DeleteCurrentMedication";
  private getPatientCurrentMedicationStrengthDataURL = "PatientsCurrentMedication/GetCurrentMedicationStength";
  private getPatientCurrentMedicationUnitDataURL = "PatientsCurrentMedication/GetCurrentMedicationUnit";
  private getPatientCurrentMedicationformDoseDataURL = "PatientsCurrentMedication/GetCurrentMedicationForm";
  //private searchMasterMedicationURL = "SpringBData/GetMasterMedicationAutoComplete";
  private addClaimMedToCurrentURL = "SpringBData/AddClaimsMedToCurrent"
  //Claim Medication URL 
  private createMedicationURL = "SpringBData/SavePatientMedication";
  private getMedicationListURL = "SpringBData/GetSpringBPatientMedication";
  private getMedicationByIdURL = "SpringBData/GetPatientMedicationDetail";
  private deleteMedicationURL = "SpringBData/DeletePatientMedication";
  private searchMasterMedicationURL = "SpringBData/GetMasterMedicationAutoComplete";
  private getPatientPhysicianDataURL = "PatientPhysician/GetPatientPhysicianById";
  private printPatientCurrentMedicationUrl="PatientsCurrentMedication/PrintPatientCurrentMedication";


  constructor(private commonService: CommonService) { }
  getPatientPhysicianData(patientId: number) {
    const params = `?patientId=${patientId}&pageNumber=1&pageSize=100&SortColumn=''&SortOrder=''`;
    return this.commonService.getById(this.getPatientPhysicianDataURL + params, {});

  }
  getMasterData(value: string = '') {
    return this.commonService.post(this.getMasterDataByNameURL, { masterdata: value });
  }
  //Claims Medication Method
  createMedication(data: MedicationDataModel) {
    return this.commonService.post(this.createMedicationURL, data);
  }
  getMedicationList(clientId: number, filterModal: FilterModel, isShowAlert?:boolean) {
    let url = this.getMedicationListURL + `?patientId=${clientId}&searchText=${filterModal.searchText}&pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}&isShowAlert=${isShowAlert}`;
    return this.commonService.getAll(url, {});
  }
  getmedicationById(id: number) {
    return this.commonService.getById(this.getMedicationByIdURL + "?PatientMedicationID=" + id, {});
  }
  deleteMedication(id: number, linkedEncounterId: number) {
    return this.commonService.patch(this.deleteMedicationURL + "?PatientMedicationID=" + id + "&linkedEncounterId=" + linkedEncounterId, {});
  }
  getMasterMedicationByFilter(searchText: string) {
    const params = `?SearchText=${searchText}&pageNumber=1&pageSize=10`
    return this.commonService.getAll(this.searchMasterMedicationURL + params, {}, false);
  }
  addClaimMedToCurrent(data: any) {
    return this.commonService.post(this.addClaimMedToCurrentURL, data);
  }
  //Current Medication Method
  createCurrentMedication(data: CurrentMedicationModel) {
    return this.commonService.post(this.createCurrentMedicationURL, data);
  }
  getCurrentMedicationList(clientId: number, filterModal: FilterModel,   isShowAlert:boolean) {
    let url = this.getCurrentMedicationListURL + `?patientId=${clientId}&pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&SortColumn=${filterModal.sortColumn}&SortOrder=${filterModal.sortOrder}&isShowAlert=${isShowAlert}`;
    return this.commonService.getAll(url, {});
  }
  getCurrentmedicationById(id: number) {
    return this.commonService.getById(this.getCurrentMedicationByIdURL + "?id=" + id, {});
  }
  deleteCurrentMedication(id: number, linkedEncounterId: number) {
    return this.commonService.patch(this.deleteCurrentMedicationURL + "?id=" + id + "&linkedEncounterId=" + linkedEncounterId, {});
  }
  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
  }
 
  printPatientCurrentMedication(clientId:number){

    const url = this.printPatientCurrentMedicationUrl +'?patientId='+ clientId;
    return this.commonService.download( url, {});
  }

  getPatientCurrentMedicationStrengthData(medicationName: string) {
    return this.commonService.getAll(this.getPatientCurrentMedicationStrengthDataURL + '?medicationName=' + encodeURIComponent(medicationName), {});
  }
  getPatientCurrentMedicationUnitData(medicationName: string) {
    return this.commonService.getAll(this.getPatientCurrentMedicationUnitDataURL + '?medicationName=' + encodeURIComponent(medicationName), {});
  }
  getPatientCurrentMedicationformDoseData(medicationName: string) {
    return this.commonService.getAll(this.getPatientCurrentMedicationformDoseDataURL + '?medicationName=' + encodeURIComponent(medicationName) , {});
  }

  downLoadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob, filename);
      return;
    }
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    document.body.appendChild(link);
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(data);
    }, 100);
  }
}
