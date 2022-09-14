import { StaffExperience } from "./../../../../front/doctor-profile/doctor-profile.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { FilterModel } from "../../core/modals/common-model";
import { debug } from "util";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import {  Subject, BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import {
  UserModel,
  StaffPayrollRateModel,
  AddUserDocumentModel,
  StaffLeaveModel,
  AddProviderEducationalDocumentModel
} from "./users.model";
import { StaffCustomLabel } from "./staff-custom-label.model";
import { StaffAvailabilityModel } from "./staff-availability.model";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  private loginSubject = new BehaviorSubject<boolean>(false);
  loginState = this.loginSubject.asObservable();
  private loadingStateSubject = new Subject<boolean>();
  public loadingState = this.loadingStateSubject.asObservable();
  private getMasterDataURL = "api/MasterData/MasterDataByName";
  private getMasterDataByNameURL = "Home/MasterDataByName";
  private createURL = "Staffs/CreateUpdateStaff";
  private deleteURL = "Staffs/DeleteStaff";
  private getStaffByIdURL = "Staffs/GetStaffById";
  private getAllURL = "Staffs/GetStaffs";
  private getStaffHeaderInfoURL = "Staffs/GetStaffHeaderData";
  private getStaffLeavesURL = "StaffLeave/GetStaffLeaveList";
  private updateLeaveStatusURL = "StaffLeave/UpdateLeaveStatus";
  private getStaffLeaveByIdURL = "StaffLeave/GetAppliedStaffLeaveById";
  private deleteStaffLeaveByIdURL = "StaffLeave/DeleteAppliedLeave";
  private saveStaffLeaveURL = "StaffLeave/SaveStaffAppliedLeave";

  private getStaffCustomLabelsURL = "StaffCustomLabel/GetStaffCustomLabels";
  private saveStaffCustomLabelsURL = "StaffCustomLabel/SaveCustomLabels";

  private getStaffLocationURL = "Staffs/GetAssignedLocationsById";
  private getStaffAvailabilityByLocationURL = "AvailabilityTemplates/GetStaffAvailabilityWithLocation";
  private saveStaffAvailabilityByLocationURL = "AvailabilityTemplates/SaveUpdateAvailabilityWithLocation";

  private getStaffPayrollRateURL = "StaffPayrollRateForActivity/GetStaffPayRateOfActivity";
  private saveUpdatePayrollRateURL = "StaffPayrollRateForActivity/SaveUpdateStaffPayrollRateForActivity";

  private getUserDocumentsURL = "userDocument/GetUserDocuments";
  private getUserByLocationURL = "api/PatientAppointments/GetStaffAndPatientByLocation";
  private getUserDocumentURL = "userDocument/GetUserDocument";
  private deleteUserDocumentURL = "userDocument/DeleteUserDocument";
  private updateDocumentStatusURL = "userDocument/UpdateProviderEducationalDocumentStatus";
  private uploadUserDocumentURL = "userDocument/UploadUserDocuments";

  private getStaffProfileURL = "Staffs/GetStaffProfileData";

  private updateUserStatusURL = "user/UpdateUserStatus";
  private updateUserActiveStatusURL = "staffs/UpdateStaffActiveStatus";

  private getStaffExperienceURL = "Staffs/GetStaffExperience?id=";
  private saveStaffExperienceURL = "Staffs/SaveUpdateStaffExperience";

  private getStaffQualificationURL = "Staffs/GetStaffQualifications?id=";
  private saveStaffQualificationURL = "Staffs/SaveUpdateStaffQualifications";

  private getStaffAwardURL = "Staffs/GetStaffAwards?id=";
  private saveStaffAwardURL = "Staffs/SaveUpdateStaffAwards";
  private updateProviderTimeIntervalURL = "Staffs/UpdateProviderTimeInterval/";
  private getprovidereductaionalDocumentsURL = "userDocument/GetProviderEducationalDocuments";
  private getprovidereductaionalDocumentsForPatientCheckinURL="userDocument/GetprovidereductaionalDocumentsForPatientCheckin";

  constructor(private http: HttpClient,private commonService: CommonService) {}
  create(data: UserModel) {
    return this.commonService.post(this.createURL, data);
  }

  delete(id: number) {
    return this.commonService.patch(this.deleteURL + "/" + id, {});
  }
  deleteStaff(id: number) {
    return this.commonService.post(this.deleteURL + "?id=" + id, {});
  }

  getStaffLeaves(filterModel: FilterModel, staffId: number) {
    let url =
      this.getStaffLeavesURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder +
      "&staffId=" +
      staffId +
      "&fromDate=" +
      "1990-01-01" +
      "&toDate=" +
      "2018-11-28";
    return this.commonService.getAll(url, {});
  }
  deleteStaffLeave(id: number) {
    return this.commonService.patch(
      this.deleteStaffLeaveByIdURL + "?StaffLeaveId=" + id,
      {}
    );
  }
  getStaffLeaveById(id: number) {
    return this.commonService.getById(
      this.getStaffLeaveByIdURL + "?StaffLeaveId=" + id,
      {}
    );
  }
  saveStaffLeave(data: StaffLeaveModel) {
    return this.commonService.post(this.saveStaffLeaveURL, data);
  }
  getAll(
    filterModel: FilterModel,
    tags: any,
    roleIds: any,
    locationId: number
  ) {
    let url =
      this.getAllURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder +
      "&LocationIDs=" +
      locationId +
      "&searchKey=" +
      (filterModel.searchText || "") +
      "&RoleIds=" +
      roleIds +
      "&Tags=" +
      tags;
    return this.commonService.getAll(url, {});
  }
  // getMasterData(value: string = "") {
  //   return this.commonService.post(this.getMasterDataURL, {
  //     masterdata: value
  //   });
  // }

  getMasterData(
    value: string = "",
    isLoading: boolean = true,
    globalCodeId: any[]=[]

  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token"),
    });

    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getMasterDataByNameURL+'?globalCodeId='+globalCodeId}`,
        { masterdata: value },
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getStaffCustomLabels(staffId: number) {
    let url = this.getStaffCustomLabelsURL + "?staffId=" + staffId;
    return this.commonService.getAll(url, {});
  }
  getStaffById(id: number) {
    return this.commonService.getById(this.getStaffByIdURL + "?id=" + id, {});
  }

  getStaffHeaderInfo(id: number) {
    return this.commonService.getById(
      this.getStaffHeaderInfoURL + "?id=" + id,
      {}
    );
  }

  saveCustomLabels(data: StaffCustomLabel[]) {
    return this.commonService.post(this.saveStaffCustomLabelsURL, data);
  }
  getStaffLocations(staffId: number) {
    return this.commonService.getById(
      this.getStaffLocationURL + "?Id=" + staffId,
      {}
    );
  }
  getStaffAvailabilityByLocation(staffId: number, locationId: number) {
    return this.commonService.getById(
      this.getStaffAvailabilityByLocationURL +
        "?staffId=" +
        staffId +
        "&locationId=" +
        locationId +
        "&isLeaveNeeded=false",
      {}
    );
  }
  saveStaffAvailability(data: any) {
    return this.commonService.post(
      this.saveStaffAvailabilityByLocationURL,
      data
    );
  }
  updateLeaveStatus(data: any) {
    return this.commonService.post(this.updateLeaveStatusURL, data);
  }

  getStaffPayrollRate(staffId: number) {
    return this.commonService.getById(
      this.getStaffPayrollRateURL + "?staffId=" + staffId,
      {}
    );
  }

  saveStaffPayrollRate(data: StaffPayrollRateModel[]) {
    return this.commonService.post(this.saveUpdatePayrollRateURL, data);
  }
  getUserDocuments(userId: number, from: string, toDate: string) {
    return this.commonService.getAll(
      this.getUserDocumentsURL +
        "?userId=" +
        userId +
        "&from=" +
        from +
        "&to=" +
        toDate,
      {}
    );
  }

  getUserByLocation(locationId: number) {
    let url =
      this.getUserByLocationURL +
      "?locationIds=" +
      locationId +
      "&permissionKey=SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES&isActiveCheckRequired=YES";
    return this.commonService.getAll(url, {});
  }
  getUserDocument(id: number) {
    return this.commonService.download(
      this.getUserDocumentURL + "?id=" + id,
      {}
    );
  }
  deleteUserDocument(id: number) {
    return this.commonService.patch(
      this.deleteUserDocumentURL + "?id=" + id,
      {}
    );
  }

  updateDocumentStatus(id: number,documentstatus:boolean) {

    return this.commonService.patch(
      //this.updateDocumentStatusURL + "?id=" + id +"&documentstatus"+documentstatus,
      this.updateDocumentStatusURL + "/" + id + "/" + documentstatus,
      {}
    );
  }

  uploadUserDocuments(data: AddUserDocumentModel) {

    return this.commonService.post(this.uploadUserDocumentURL, data);
  }


  getStaffProfileData(id: number) {
    return this.commonService.getById(this.getStaffProfileURL + "/" + id, {});
  }
  downloadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(function() {
      // For Firefox it is necessary to delay revoking the ObjectURL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(data);
    }, 100);
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(
      moduleName,
      screenName
    );
  }

  updateUserStatus(userId: number, status: boolean) {
    return this.commonService.patch(
      this.updateUserStatusURL + "/" + userId + "/" + status,
      {}
    );
  }

  updateUserActiveStatus(staffId: number, status: boolean) {
    return this.commonService.patch(
      this.updateUserActiveStatusURL +
        "?staffId=" +
        staffId +
        "&isActive=" +
        status,
      {}
    );
  }

  getUserExperience(id: string): Observable<any> {
    return this.commonService.getById(this.getStaffExperienceURL + id, {});
  }

  saveStaffExperience(data: any) {
    return this.commonService.post(this.saveStaffExperienceURL, data);
  }

  getUserQualification(id: string): Observable<any> {
    return this.commonService.getById(this.getStaffQualificationURL + id, {});
  }

  saveStaffQualification(data: any) {
    return this.commonService.post(this.saveStaffQualificationURL, data);
  }

  getUserAward(id: string): Observable<any> {
    return this.commonService.getById(this.getStaffAwardURL + id, {});
  }

  saveStaffAward(data: any) {
    return this.commonService.post(this.saveStaffAwardURL, data);
  }
  updateProviderTimeInterval(id: string) {
    return this.commonService.put(this.updateProviderTimeIntervalURL  + id, {});
  }

  getprovidereductaionalDocuments(userId: number, from: string, toDate: string) {
    return this.commonService.getAll(
      this.getprovidereductaionalDocumentsURL +
        "?userId=" +
        userId +
        "&from=" +
        from +
        "&to=" +
        toDate,
      {}
    );
  }

  getprovidereductaionalDocumentsForPatientCheckin(staffid: number) {
    return this.commonService.getAll(
      this.getprovidereductaionalDocumentsForPatientCheckinURL +
        "?staffid=" +
        staffid,

      {}
    );
  }

  uploadProviderEducationalDocuments(data: AddProviderEducationalDocumentModel) {

    return this.commonService.post(this.uploadUserDocumentURL, data);
  }
}
