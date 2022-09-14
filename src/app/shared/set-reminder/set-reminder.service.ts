import { CommonService } from "./../../platform/modules/core/services/common.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SetReminderService {
  private getStaffDetailsByNameUrl = "Staffs/GetStaffsByName?name=";
  private getOTSessionByAppointmentIdUrl = "api/Telehealth/GetOTSessionByApptId?appointmentId=";
  private inviteNewPersonUrl = "GroupSession/SaveInvitation";
  constructor(private commonService: CommonService) {}
  getStaffDetailsByName(name: string = ""): Observable<any> {
    return this.commonService.getAll(
      `${this.getStaffDetailsByNameUrl}${name}`,
      {}
    );
  }
  getOTSessionByAppointmentId(apptId: number = 0): Observable<any> {
    return this.commonService.getAll(
      `${this.getOTSessionByAppointmentIdUrl}${apptId}`,
      {}
    );
  }
  inviteNewPerson(data: any): Observable<any> {
    return this.commonService.post(`${this.inviteNewPersonUrl}`, data);
  }
}
