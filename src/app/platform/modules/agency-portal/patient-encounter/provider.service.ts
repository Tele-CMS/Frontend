import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
 
//import { EnvironmentUrlService } from 'src/app/environment-url.service';
 
@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  constructor(
    // private _envUrl: EnvironmentUrlService,
    private _http: HttpClient
  ) { }

  // baseUrl = this._envUrl.urlAddress;
  baseUrl =  "dd"

  // API Urls
  AssignmnetApiUrl = '/api/PatientsForAssignment/GetPatientsForAssignment';
  PostProviderAvailabilityAddressApiUrl =
    '/api/UserAvailability/UserToAvailableAddress';

  getMemberRosterAppoinmentUrl = '/api/MemberRoster/GetMemberRoster';

  PostProviderAvailabilityApiUrl =
    '/api/UserAvailability/InsertUserToAvailablity';

  GetTimezoneListApiUrl = '/api/MasterData/GetTimeZoneList';
  GetAddressDataListApiUrl =
    '/api/UserAvailability/GetUserToAvailableAddress?user_id=';
  GetBookingDataListApiUrl = '/api/UserAvailability/GetUserToAvailablity';

  UpdateUserAddressApiUrl = '/api/UserAvailability/UpdateActiveFlag';
  UpdateUserAvailabilityApiUrl =
    '/api/UserAvailability/UpdateActiveFlagOfBooking';
  getMasterDataApiUrl = '/api/MasterData/GetMasterDataDetails';
  getUsers = '/api/User/GetAllUsers';
  fetchAppointmentType = '/api/Scheduler/GetAppointmentType';
  PostClinicalDatagridProviderApiUrl =
    '/api/ClinicalDatagridsProviders/SaveClinicalDatagridsProviders';
  PostSectionColorIndicatorApiUrl =
    '/api/ClinicalDatagridsProviders/SaveSectionColorIndicator';
  GetClinicalProviderListApiUrl =
    '/api/ClinicalDatagridsProviders/GetClinicalDatagridsProviders';

  GetAsHealthPlanDataApiUrl =
    '/api/ClinicalDatagridsProviders/GetPCPAddressDetails?patient_empi=';

  GetMemberProviderByIdApiUrl =
    '/api/ClinicalDatagridsProviders/GetClinicalDatagridsProvidersById?id=';

  GetEncounterForPatient = '/api/ProviderSchedule/GetEncounterForPatient?empi=';
  AddNewEncounter = '/api/ProviderSchedule/AddNewEncounter';

  private addNewCity = '/api/MasterData/CreateCity';

  getComplatintsDataApiUrl =
    '/api/ClinicalDatagridsComplaints/GetClinicalDatagridsComplaints';
  getComplaintListUrl =
    '/api/ClinicalDatagridsComplaints/GetClinicalComplaintsList';
  saveComplaintsUrl =
    '/api/ClinicalDatagridsComplaints/SaveClinicalDatagridsComplaints';
  getClinicalAssesmentListUrl =
    '/api/Assessments/GetAssessmentsData?assessment_id=';

  GetCoderFeedbackList = "/api/CoderFeedback/GetCoderFeedbackList";
  deleteComplainttUrl =
    '/api/ClinicalDatagridsComplaints/DeleteClinicalDatagridsComplaints?id=';

  private saveElectronicSignatureApiUrl =
    '/api/ElectronicSignature/SaveSignature';
  private getSignatureDataApiUrl = '/api/ElectronicSignature/GetSignatureById';

  private getScreeningListApiUrl = '/api/Screening/GetScreeningMasterList';

  private saveClinicalDatagridScreeningsUrl =
    '/api/ClinicalDatagridsProviders/SaveClinicalDatagridScreening';

  private saveClinicalDatagridLabssUrl =
    '/api/ClinicalDatagridsProviders/SaveClinicalDatagridLabs';

  private getClinicalDatagridScreeningDetailsUrl =
    '/api/Screening/GetClinicalDatagridScreeningDetail';

  private getClinicalDatagridScreeningDetailsUrl1 =
    '/api/ClinicalDatagridsProviders/GetClinicalDatagridScreeningDetail';
  private getClinicalLabsListUrl =
    '/api/ClinicalDatagridsProviders/GetClinicalDatagridLabsList';
  private getClinicalDatagridLabsDetailsUrl =
    '/api/ClinicalDatagridsProviders/GetClinicalDatagridLabsDetail';

  private getDispositionCategoryDataUrl = '/api/Disposition/GetCategoryList';

  private getDispositionFollowupUrl = '/api/Disposition/GetCategoryListById';

  saveMedicalManagmentUrl = '/api/Disposition/SaveDisposition';
  //disposition all list
  getDispositionDataApiUrl = '/api/Disposition/GetDispositionSectionList';

  private GetClinicalDatagridsVitals =
    '/api/ClinicalDatagridsVitals/GetClinicalDatagridsVitals';
  private saveVitalsUrl =
    '/api/ClinicalDatagridsVitals/SaveClinicalDatagridsVitals';

  private copyEncounterUrl =
    '/api/Assessments/InsertDataToDatagridsAssessments';

  private getReviewSystem = '/api/ReviewSystem/GetReviewSystem';

  private saveSystemReviewData = '/api/ReviewSystem/SaveReviewSystem';

  private getCodesofLabsResultUrl =
    '/api/ClinicalDatagridsProviders/GetCodesofLabsResult';

  private getCodesofScreeningResultUrl =
    '/api/Screening/GetScreeningBasedOnResult';

  private updateCallStatusUrl = '/api/Scheduler/UpdatePatientCallStatus';
  private resendLinkBySms = '/api/TwilioApp/ResendSmsLink';
  private deleteDispositionUrl = '/api/Disposition/DeleteDisposition?id=';

  // This GET HTTP API is used to get the list of member assignment.
  getAssignmentList(reqModel: any): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.AssignmnetApiUrl +
      `?pageNumber=${reqModel.pageNumber}&pageSize=${reqModel.pageSize}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  // This POST HTTP API is used to save the address of user.
  saveProviderAvailableAddress(reqModel: any) {
    const url = this.baseUrl + this.PostProviderAvailabilityAddressApiUrl;
    return this._http.post<any>(url, reqModel).pipe();
  }

  saveProviderAvailability(reqModel: any) {
    const url = this.baseUrl + this.PostProviderAvailabilityApiUrl;
    return this._http.post<any>(url, reqModel).pipe();
  }

  getTimezoneList() {
    return this._http.get<any>(this.baseUrl + this.GetTimezoneListApiUrl);
  }

  getAddressListData(userId: number) {
    return this._http.get<any>(
      this.baseUrl + this.GetAddressDataListApiUrl + userId
    );
  }

  getBookingListData() {
    return this._http.get<any>(this.baseUrl + this.GetBookingDataListApiUrl);
  }

  updateUserAddress(request: any) {
    const url = this.baseUrl + this.UpdateUserAddressApiUrl;
    return this._http.patch<any>(url, request).pipe();
  }

  updateUserAvailability(request: any) {
    const url = this.baseUrl + this.UpdateUserAvailabilityApiUrl;
    return this._http.patch<any>(url, request).pipe();
  }

  getMasterData(
    category_key: any,
    searchText: string
  ): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.getMasterDataApiUrl +
      `?category_key=${category_key}&search_text=${searchText}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getAllUsers() {
    return this._http.get<any>(this.baseUrl + this.getUsers);
  }

  getAppointmentType() {
    return this._http.get<any>(this.baseUrl + this.fetchAppointmentType);
  }

  getMemberRosterAppoinmnetList(
    reqModel: any
  ): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.getMemberRosterAppoinmentUrl +
      `?pageNumber=${reqModel.pageNumber}&pageSize=${reqModel.pageSize}&searchText=${reqModel.searchText}&clients=${reqModel.clients}&projects=${reqModel.projects}&sortColumn=${reqModel.sortColumn}&sortOrder=${reqModel.sortOrder}`;

    return this._http.get<any[]>(url, { observe: 'response' });
  }

  saveClinicalDatagridProvider(reqModel: any) {
    const url = this.baseUrl + this.PostClinicalDatagridProviderApiUrl;
    return this._http.post<any>(url, reqModel).pipe();
  }

  saveSectionColorIndicator(reqModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Token ' + localStorage.getItem('token'),
      }),
    };
    const url = this.baseUrl + this.PostSectionColorIndicatorApiUrl;
    return this._http.post<any>(url, reqModel, httpOptions).pipe();
  }

  getClinicalProviderListData(
    encounter_id: number,
    patient_empi: number
  ): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.GetClinicalProviderListApiUrl +
      `?encounter_id=${encounter_id}&patient_empi=${patient_empi}`;

    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getAsHealthPlanData(empi: number) {
    return this._http.get<any>(
      this.baseUrl + this.GetAsHealthPlanDataApiUrl + empi
    );
  }

  getMemberProviderById(id: number) {
    return this._http.get<any>(
      this.baseUrl + this.GetMemberProviderByIdApiUrl + id
    );
  }
  getEncounterForPatient(empi) {
    return this._http.get<any>(
      this.baseUrl + this.GetEncounterForPatient + empi
    );
  }

  addEncounter(body) {
    const url = this.baseUrl + this.AddNewEncounter;
    return this._http.post<any>(url, body);
  }

  addCity = (body) => {
    return this._http.post<any>(this.baseUrl + this.addNewCity, body);
  };
  //Complaints data
  getComplaintData(encounter: any): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.getComplatintsDataApiUrl +
      `?encounter_id=${encounter}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getComplaintList(): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getComplaintListUrl;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  saveComplaints(reqModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Token ' + localStorage.getItem('token'),
      }),
    };
    const url = this.baseUrl + this.saveComplaintsUrl;
    return this._http.post<any>(url, reqModel, httpOptions).pipe();

    // const url = this.baseUrl + this.saveComplaintsUrl;
    // return this._http.post<any>(url, reqModel).pipe();
  }

  getClinicalAssesmentData(id: number) {
    //Assessments
    const url = this.baseUrl + this.getClinicalAssesmentListUrl + id;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  deleteComplaint(id: number) {

    const url = this.baseUrl + this.deleteComplainttUrl + id;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  saveElectronicSignature(reqModel: any) {
    const url = this.baseUrl + this.saveElectronicSignatureApiUrl;
    return this._http.post<any>(url, reqModel).pipe();
  }

  getSignatureData(id: number) {
    const url = this.baseUrl + this.getSignatureDataApiUrl + `?id=${id}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getScreeningData() {
    const url = this.baseUrl + this.getScreeningListApiUrl;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  saveScreeningDetails(reqModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Token ' + localStorage.getItem('token'),
      }),
    };
    const url = this.baseUrl + this.saveClinicalDatagridScreeningsUrl;
    return this._http.post<any>(url, reqModel, httpOptions).pipe();

    // const url = this.baseUrl + this.saveComplaintsUrl;
    // return this._http.post<any>(url, reqModel).pipe();
  }

  getScreeningsByEncounterId(
    patient_empi,
    encounter_id
  ): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.getClinicalDatagridScreeningDetailsUrl +
      `?patient_empi=${patient_empi}&encounter_id=${encounter_id}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getDispositionCategoryData(): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getDispositionCategoryDataUrl;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getDispositionFollowupData(id: number) {
    const url =
      this.baseUrl + this.getDispositionFollowupUrl + `?category_id=${id}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getDispositionData(encounter: any): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.getDispositionDataApiUrl +
      `?encounter_id=${encounter}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  saveMedicalManagment(reqModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Token ' + localStorage.getItem('token'),
      }),
    };
    const url = this.baseUrl + this.saveMedicalManagmentUrl;
    return this._http.post<any>(url, reqModel, httpOptions).pipe();
  }

  getClinicalLabsList(): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getClinicalLabsListUrl;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  saveLabsDetails(reqModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Token ' + localStorage.getItem('token'),
      }),
    };
    const url = this.baseUrl + this.saveClinicalDatagridLabssUrl;
    return this._http.post<any>(url, reqModel, httpOptions).pipe();
  }

  //to get labsimaging data from encounter table
  getDatagreidLabsByEncounterId(
    patient_empi,
    encounter_id
  ): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.getClinicalDatagridLabsDetailsUrl +
      `?patient_empi=${patient_empi}&encounter_id=${encounter_id}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getVitalsData(patient_empi: any, encounter_id: any) {
    return this._http.get<any>(
      this.baseUrl +
      this.GetClinicalDatagridsVitals +
      `?patient_empi=${patient_empi}&encounter_id=${encounter_id}`
    );
  }

  saveVitals(reqModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Token ' + localStorage.getItem('token'),
      }),
    };
    const url = this.baseUrl + this.saveVitalsUrl;
    return this._http.post<any>(url, reqModel, httpOptions).pipe();
  }
  copyEncounter(
    old_encounter_id: number,
    new_encounter_id: number
  ): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.copyEncounterUrl +
      `?old_encounter_id=${old_encounter_id}&new_encounter_id=${new_encounter_id}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getReviewSystemData(data) {
    return this._http.post<any>(this.baseUrl + this.getReviewSystem, data);
  }

  saveSystemReview(data: any) {
    return this._http.post<any>(this.baseUrl + this.saveSystemReviewData, data);
  }

  getCodesofLabsDatagrids(value: number, loinc_code: string, type: string) {
    // assign value for type here
    type = 'labs';
    return this._http.get<any>(
      this.baseUrl +
      this.getCodesofLabsResultUrl +
      `?value=${value}&loinc_code=${loinc_code}&type=${type}`
    );
  }

  getCodesofScreeningDatagrids(value: number) {
    return this._http.get<any>(
      this.baseUrl +
      this.getCodesofScreeningResultUrl +
      `?screening_result_id=${value}`
    );
  }

  updateCallStatus(callStatusReq: any) {
    return this._http.post<any>(
      this.baseUrl + this.updateCallStatusUrl,
      callStatusReq
    );
  }

  resendLink(callStatusReq: any) {
    return this._http.post<any>(
      this.baseUrl + this.resendLinkBySms,
      callStatusReq
    );
  }
  getCoderFeedback(reqModel: any): Observable<HttpResponse<any[]>> {
    const url =
      this.baseUrl +
      this.GetCoderFeedbackList +
      `?pageNumber=${reqModel.pageNumber}&pageSize=${reqModel.pageSize}&searchText=${reqModel.searchText}
      &sortColumn=${reqModel.sortColumn}
      &sortOrder=${reqModel.sortOrder}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  deleteDisposition(id: number) {
    const url = this.baseUrl + this.deleteDispositionUrl + id;
    return this._http.get<any[]>(url, { observe: 'response' });
  }
}
