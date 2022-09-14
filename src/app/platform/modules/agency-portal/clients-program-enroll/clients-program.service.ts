import { Injectable } from '@angular/core';
import { ProgramsFilterModel } from './programs-listing/program.model';
import { CommonService } from '../../core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsProgramService {
  private getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
  private getDiseaseProgramsWithEnrollmentsListURL = 'DiseaseManagementProgram/GetDiseaseProgramsListWithEnrollments';
  private getAllPatientDiseaseManagementProgramsListURL = 'PatientDiseaseManagementProgram/GetAllPatientDiseaseManagementProgramsList';
  private sendBulkMessageURL = 'PatientDiseaseManagementProgram/SendBulkMessage';
  private sendEmailMessagesURL = 'PatientDiseaseManagementProgram/SendBulkEmail';
  private getPatientDiseaseManagementDataExportURL = 'PatientDiseaseManagementProgram/ExportPatientDiseaseManagementData';
  private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';
  private generateDMPEnrollPatientsPDFURL = "PatientDiseaseManagementProgram/GetProgramsEnrollPatientsForPDF"

  constructor(private commonService: CommonService) { }

  getMasterData(value: string = '') {
    return this.commonService.post(this.getMasterDataByNameURL, { masterdata: value });
  }

  getDiseaseProgramsWithEnrollmentsList() {
    return this.commonService.getById(this.getDiseaseProgramsWithEnrollmentsListURL, {});
  }

  getAllPatientDiseaseManagementProgramsList(filterModal: ProgramsFilterModel) {
    let queryParams = `?pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}&ProgramIds=${filterModal.ProgramIds}&CareManagerIds=${(filterModal.CareManagerIds || []).join()}&Status=${filterModal.Status}&StartDate=${filterModal.StartDate}&EndDate=${filterModal.EndDate}&EnrollmentId=${filterModal.EnrollmentId}&ConditionIds=${filterModal.conditionId}&IsEligible=${filterModal.isEligible}&StartAgeRange=${filterModal.startAge}&EndAgeRange=${filterModal.endAge}&Relationships=${filterModal.relationship || ''}&GenderIds=${filterModal.genderId || ''}&SearchText=${filterModal.searchText}&nextAppointmentPresent=${filterModal.nextAppointmentPresent}`;
    return this.commonService.getAll(this.getAllPatientDiseaseManagementProgramsListURL + queryParams, {});
  }

  // sendBulkMessage(filterModel: any) {
  //   return this.commonService.downloadWithPostRequest(this.sendBulkMessageURL, {}, filterModel);
  // }

  // sendBulkEmail(filterModal: any) {
  //   return this.commonService.downloadWithPostRequest(this.sendEmailMessagesURL, {}, filterModal);
  // }

  getPatientDiseaseManagementDataExport(filterModal: ProgramsFilterModel, pageSize: number) {
    let queryParams = `?pageNumber=${filterModal.pageNumber}&pageSize=${pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}&ProgramIds=${filterModal.ProgramIds}&CareManagerIds=${(filterModal.CareManagerIds || []).join()}&Status=${filterModal.Status}&StartDate=${filterModal.StartDate}&EndDate=${filterModal.EndDate}&EnrollmentId=${filterModal.EnrollmentId}&conditionIds=${filterModal.conditionId}&IsEligible=${filterModal.isEligible}&StartAgeRange=${filterModal.startAge}&EndAgeRange=${filterModal.endAge}&Relationships=${filterModal.relationship || ''}&GenderIds=${filterModal.genderId || ''}&SearchText=${filterModal.searchText}&nextAppointmentPresent=${filterModal.nextAppointmentPresent}`;
    return this.commonService.download(this.getPatientDiseaseManagementDataExportURL + queryParams, {});
  }
  getStaffAndPatientByLocation(locationIds: string, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
    const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }
  generateDMPEnrollPatientsPDF(filterModal: ProgramsFilterModel, pageSize: number) {
    let queryParams = `?pageNumber=${filterModal.pageNumber}&pageSize=${pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}&ProgramIds=${filterModal.ProgramIds}&CareManagerIds=${(filterModal.CareManagerIds || []).join()}&Status=${filterModal.Status}&StartDate=${filterModal.StartDate}&EndDate=${filterModal.EndDate}&EnrollmentId=${filterModal.EnrollmentId}&conditionIds=${filterModal.conditionId}&IsEligible=${filterModal.isEligible}&StartAgeRange=${filterModal.startAge}&EndAgeRange=${filterModal.endAge}&Relationships=${filterModal.relationship || ''}&GenderIds=${filterModal.genderId || ''}&SearchText=${filterModal.searchText}&nextAppointmentPresent=${filterModal.nextAppointmentPresent}`;
    return this.commonService.download(this.generateDMPEnrollPatientsPDFURL + queryParams, {});
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
