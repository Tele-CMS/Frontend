import { FilterModel } from "./../../super-admin-portal/core/modals/common-model";
import { CommonService } from "src/app/platform/modules/core/services";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class EncounterGraphService {
  private getMasterDataURL = "api/MasterData/MasterDataByName"; 
  private getStaffAndPatientByLocationURL = "api/PatientAppointments/GetStaffAndPatientByLocation"; 
  private getLineChartDataForEncounterURL = "AdminDashboard/GetEncounterDataForGraph"

  constructor(private commonService: CommonService) {}

  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }
  getStaffAndPatientByLocation(locationIds: string, permissionKey: string = 'SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES'): Observable<any> {
    const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }
  getLineChartDataForEncounters(filterParamsForEncounter: any) {
    let url = this.getLineChartDataForEncounterURL
    + "?EncounterTypeIds=" + (filterParamsForEncounter.encounterTypeIds || []).join() + "&EncounterTimeIntervalId=" + filterParamsForEncounter.encounterTimeIntervalId + '&CareManagerIds=' + filterParamsForEncounter.CareManagerIds + '&EnrollmentId=' + filterParamsForEncounter.EnrollmentId + '&NextAppointmentPresent=' + filterParamsForEncounter.nextAppointmentPresent;
    return this.commonService.getAll(url, {});
  }
}
