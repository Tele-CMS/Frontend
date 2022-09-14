import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services';
import { Observable } from 'rxjs';
import { ClientEncounterFilterModel } from './client-encounter-listing/client-encounter.model';

@Injectable({
  providedIn: 'root'
})
export class ClientEncounterService {
  private getAllPatientEncountersListURL = "patient-encounter/GetAllPatientEncounter";
  private getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';
  private getMasterDataURL = 'api/MasterData/MasterDataByName';
  private sendBulkMessageURL = 'patient-encounter/SendBulkMessage';
  private sendEmailMessagesURL = 'patient-encounter/SendBulkEmail';
  private exportEncounterURL = 'patient-encounter/ExportEncounters'
  private printEncounterListDataURL = "patient-encounter/PrintEncountersPDF"
  constructor(private commonService: CommonService) { }


  // getClientEncounters(filterModel: any,fromDate: string, toDate: string) {
  //   let url = this.getAllPatientEncountersListURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&StaffId=" + filterModel.careManagerId + "&EncounterTypeId=" + filterModel.encounterTypeId  ;
  //   // if (appointmentType && appointmentType > 0)
  //   //   url = url + "&appointmentType=" + appointmentType;
  //   // if (filterzzzzzzzzzzzzzzzzz && staffName != "")
  //   //   url = url + "&staffName=" + staffName;
  //   // if (status && status != "")
  //   //   url = url + "&status=" + status;
  //   if (fromDate && fromDate != "")
  //     url = url + "&fromDate=" + fromDate;
  //   if (toDate && toDate != "")
  //     url = url + "&toDate=" + toDate;
  //   return this.commonService.getAll(url, {});
  // }
  getClientEncounters(filterModal: ClientEncounterFilterModel) {
    let urlParams = `?fromDate=${filterModal.fromDate}&toDate=${filterModal.toDate}&CareManagerIds=${filterModal.CareManagerIds}&EnrollmentId=${filterModal.EnrollmentId}&EncounterTypeIds=${filterModal.encounterTypeIds}&Status=${filterModal.status}&pageNumber=${filterModal.pageNumber}&pageSize=${filterModal.pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}&nextAppointmentPresent=${filterModal.nextAppointmentPresent}`;
    return this.commonService.getAll(this.getAllPatientEncountersListURL + urlParams, {});
  }
  getStaffAndPatientByLocation(locationIds: string, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
    const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }

  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }
  // sendBulkMessage(filterModel: any) {
  //   return this.commonService.downloadWithPostRequest(this.sendBulkMessageURL, {}, filterModel);
  // }
  // sendBulkEmail(filterModal: any) {
  //   return this.commonService.downloadWithPostRequest(this.sendEmailMessagesURL, {}, filterModal);
  // }

  exportEncounters(filterModal: ClientEncounterFilterModel,pageSize:number): Observable<any> {
    let urlParams = `?fromDate=${filterModal.fromDate}&toDate=${filterModal.toDate}&CareManagerIds=${filterModal.CareManagerIds}&EnrollmentId=${filterModal.EnrollmentId}&EncounterTypeIds=${filterModal.encounterTypeIds}&pageNumber=${filterModal.pageNumber}&pageSize=${pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}&nextAppointmentPresent=${filterModal.nextAppointmentPresent}`;
    return this.commonService.download(this.exportEncounterURL + urlParams, {})
  }
  printEncounterListData(filterModal: ClientEncounterFilterModel,pageSize:number): Observable<any>  {
    let urlParams = `?&fromDate=${filterModal.fromDate}&toDate=${filterModal.toDate}&CareManagerIds=${filterModal.CareManagerIds}&EnrollmentId=${filterModal.EnrollmentId}&EncounterTypeIds=${filterModal.encounterTypeIds}&pageNumber=${filterModal.pageNumber}&pageSize=${pageSize}&sortColumn=${filterModal.sortColumn}&sortOrder=${filterModal.sortOrder}&nextAppointmentPresent=${filterModal.nextAppointmentPresent}`;
    return this.commonService.download(this.printEncounterListDataURL + urlParams, {})
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
