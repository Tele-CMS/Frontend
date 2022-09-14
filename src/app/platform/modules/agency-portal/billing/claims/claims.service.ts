import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';

const getQueryParamsFromObject = (filterModal: object): string => {
  let queryParams = '';
  let index = 0;
  for (const key of Object.keys(filterModal)) {
    if (filterModal[key] != null && filterModal[key] != '') {
      if (index === 0)
        queryParams += `?${key}=${filterModal[key]}`;
      else
        queryParams += `&${key}=${filterModal[key]}`;
      index++;
    }
  }
  return queryParams;
}


@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  getMasterDataURL = 'api/MasterData/MasterDataByName';
  getAllClaimsURL = 'Claim/GetAllClaimsWithServiceLines';
  getProcessedClaimsURL = 'EDIParser/GetProcessedClaims'
  getStaffAndPatientByLocationURL = 'api/PatientAppointments/GetStaffAndPatientByLocation';
  getPatientPayersURL = 'GetPayerByPatient';
  generatePaperClaimURL = 'api/PaperClaim/PaperClaim';
  getDataForSchedulerURL = 'api/PatientAppointments/GetDataForSchedulerByPatient';
  downloadBatchEDIURL = 'EDI/DownloadBatchEDI837';
  getPatientPayerServiceCodesAndModifiersURL = 'patients/GetPatientPayerServiceCodesAndModifiers';
  getClaimServiceLineDetailURL = 'Claim/GetClaimServiceLineDetail';
  getPayerServiceCodeByIdURL = 'api/PayerServiceCodes/GetPayerServiceCodeById';
  saveClaimServiceLineURL = 'Claim/SaveClaimServiceLine';
  deleteClaimServiceLineURL = 'Claim/DeleteClaimServiceLine';
  getOpenChargesForPatientURL = 'Claim/GetOpenChargesForPatient';
  submitEOBPaymentsURL = 'api/Payment/EOBPayement';
  submitClaimsForNonEDIURL = 'EDI/SubmitClaimsForNonEDI';
  batchPaperClaimURL = 'api/PaperClaim/BatchPaperClaim';
  paperClaim_SecondaryURL = 'api/PaperClaim/PaperClaim_Secondary';
  resubmitClaimURL = 'EDI/ResubmitClaim';
  resubmitBatchEDI837URL = 'EDI/ResubmitBatchEDI837';
  updateClaimDetailsURL = 'Claim/UpdateClaimDetails';
  getPatientGuarantorURL = 'patients/GetPatientGuarantor';
  applyPaymentGetAllClaimsURL = 'api/Payment/GetAllClaimsWithServiceLinesForPayer';
  applyPaymentURL = 'api/Payment/ApplyPayment';
  generateBatchEDI837_SecondaryURL = 'EDI/GenerateBatchEDI837_Secondary';
  generateSingleEDI837_SecondaryURL = 'EDI/GenerateSingleEDI837_Secondary';
  getSubmittedClaimsBatchURL = 'EDI/GetSubmittedClaimsBatch';
  getSubmittedClaimsBatchDetailsURL = 'EDI/GetSubmittedClaimsBatchDetails';
  getClaimHistoryURL = 'Claim/GetClaimHistory';

  getPatientEncounterDetailsURL = 'patient-encounter/GetPatientEncounterDetails';
  constructor(private commonService: CommonService) { }

  downLoadFile(blob: Blob, filetype: string, filename: string) {
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

  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }

  getAllClaimsWithServiceLines(filterModal: any): Observable<any> {
    // ?pageNumber=1&pageSize=5&fromDate=2018-06-18&toDate=2018-11-30&claimStatusId=1&sortColumn=claimid&sortOrder=desc
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(this.getAllClaimsURL + queryParams, {});
  }

  getProcessedClaims(filterModal: any): Observable<any> {
    // ?pageNumber=1&pageSize=5&fromDate=2018-12-20&toDate=2018-12-27&claimStatusId=1&sortColumn=claimId&sortOrder=desc
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(this.getProcessedClaimsURL + queryParams, {});
  }

  getStaffAndPatientByLocation(locationIds: string, permissionKey: string = ''): Observable<any> {
    const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=NO`;
    return this.commonService.getAll(this.getStaffAndPatientByLocationURL + queryParams, {});
  }

  getPatientPayers(PatientID: number, Key: string) {
    const queryParams = `?PatientID=${PatientID}&Key=${Key}`;
    return this.commonService.getAll(this.getPatientPayersURL + queryParams, {});
  }

  generatePaperClaim(claimId: number, patientInsuranceId: number, markSubmitted: boolean, printFormat: number): Observable<any> {
    const queryParams = `?claimId=${claimId}&patientInsuranceId=${patientInsuranceId}&markSubmitted=${markSubmitted}&printFormat=${printFormat}`;
    // return this.commonService.getAll(this.generatePaperClaimURL + queryParams, {});
    return this.commonService.download(this.generatePaperClaimURL + queryParams, {});
  }

  downloadBatchEDIClaims(claimIds: string) {
    const queryParams = `?claimIds=${claimIds}`;
    return this.commonService.download(this.downloadBatchEDIURL + queryParams, {});
  }

  getDataForScheduler(filterModal: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(this.getDataForSchedulerURL + queryParams, {});
  }

  getPatientPayerServiceCodesAndModifiers(filterModal: any): Observable<any> {
    // ?patientId=720&PayerPreference=primary&date=null&payerId=199&patientInsuranceId=368
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(this.getPatientPayerServiceCodesAndModifiersURL + queryParams, {});
  }

  getClaimServiceLineDetail(filterModal: any): Observable<any> {
    // ?claimId=476&serviceLineId=null
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(this.getClaimServiceLineDetailURL + queryParams, {});
  }

  getPayerServiceCodeById(payerServiceCodeId: number) {
    const queryParams = `?payerServiceCodeId=${payerServiceCodeId}`;
    return this.commonService.getAll(this.getPayerServiceCodeByIdURL + queryParams, {});
  }

  saveClaimServiceLine(postData: any, claimId: number) {
    const queryParams = `?claimId=${claimId}`;
    return this.commonService.patch(this.saveClaimServiceLineURL + queryParams, postData);
  }

  deleteClaimServiceLine(serviceLineId: number) {
    const queryParams = `?serviceLineId=${serviceLineId}`;
    return this.commonService.patch(this.deleteClaimServiceLineURL + queryParams, null);
  }

  getOpenChargesForPatient(patientId: number, payerId: number) {
    const queryParams = `?patientId=${patientId}&payerId=${payerId}`;
    return this.commonService.getAll(this.getOpenChargesForPatientURL + queryParams, {});
  }

  submitEOBPayments(postData: any) {
    return this.commonService.post(this.submitEOBPaymentsURL, postData);
  }

  submitClaimsForNonEDI(claimIds: string) {
    const queryParams = `?claimIds=${claimIds}`;
    return this.commonService.getAll(this.submitClaimsForNonEDIURL + queryParams, {});
  }

  downloadBatchEDI837(claimIds: string) {
    const queryParams = `?claimIds=${claimIds}`;
    return this.commonService.download(this.downloadBatchEDIURL + queryParams, {});
  }

  batchPaperClaimGenerate(claimIds: string, payerPreference: string, markSubmitted: boolean, printFormat: number) {
    const queryParams = `?claimIds=${claimIds}&payerPreference=${payerPreference}&markSubmitted=${markSubmitted}&printFormat=${printFormat}`;
    return this.commonService.download(this.batchPaperClaimURL + queryParams, {});
  }

  generatePaperClaim_Secondary(claimId: number, patientInsuranceId: number, printFormat: number) {
    const queryParams = `?claimId=${claimId}&patientInsuranceId=${patientInsuranceId}&printFormat=${printFormat}`;
    return this.commonService.download(this.paperClaim_SecondaryURL + queryParams, {});
  }

  resubmitClaim(claimId: number, patientInsuranceId: number, resubmissionReason: string, payerControlReferenceNumber: string) {
    const queryParams = `?claimId=${claimId}&patientInsuranceId=${patientInsuranceId}&resubmissionReason=${resubmissionReason}&payerControlReferenceNumber=${payerControlReferenceNumber}`;
    return this.commonService.getAll(this.resubmitClaimURL + queryParams, {});
  }

  resubmitBatchEDI837(postData: any) {
    return this.commonService.post(this.resubmitBatchEDI837URL, postData);
  }

  updateClaimDetails(postData: any) {
    return this.commonService.patch(this.updateClaimDetailsURL, postData);
  }


  // apply payment api's

  getPatientGuarantor(patientId: number) {
    const queryParams = `?patientId=${patientId}`;
    return this.commonService.getAll(this.getPatientGuarantorURL + queryParams, {});
  }

  applyPaymentGetAllClaims(filters: any) {
    const queryParams = getQueryParamsFromObject(filters);
    return this.commonService.getAll(this.applyPaymentGetAllClaimsURL + queryParams, {});
  }

  applyPayment(postData: any) {
    return this.commonService.post(this.applyPaymentURL, postData);
  }



  // edi 837 batch claim history

  getSubmittedClaimsBatch(filterModal: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(this.getSubmittedClaimsBatchURL + queryParams, {});
  }

  getSubmittedClaimsBatchDetails(claimId: number) {
    const queryParams = `?claim837ClaimIds=${claimId}`
    return this.commonService.getAll(this.getSubmittedClaimsBatchDetailsURL + queryParams, {});
  }

  generateBatchEDI837_Secondary(claimIds: string) {
    const queryParams = `?claimIds=${claimIds}`
    return this.commonService.getAll(this.generateBatchEDI837_SecondaryURL + queryParams, {});
  }

  generateSingleEDI837_Secondary(claimId: number, patientInsuranceId: number) {
    const queryParams = `?claimId=${claimId}&patientInsuranceId=${patientInsuranceId}`;
    return this.commonService.getAll(this.generateSingleEDI837_SecondaryURL + queryParams, {});
  }

  getPatientEncounterDetails(patientEncounterId: number) {
    const queryParams = `/0/${patientEncounterId}`;
    return this.commonService.getAll(this.getPatientEncounterDetailsURL + queryParams, {});
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
  }
  getClaimHistory(filterModal: any, claimId: number): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(this.getClaimHistoryURL + `${queryParams}&ClaimId=${claimId}`, {});
  }
}
