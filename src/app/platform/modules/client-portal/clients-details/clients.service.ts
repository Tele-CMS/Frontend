import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "../../core/services";
import {
  ClientModel,
  AddUserDocumentModel,
  SocialHistoryModel
} from "./client.model";

export interface AuthToken {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
  scope: Array<string>
}

@Injectable({
  providedIn: "root"
})
export class ClientsService {
  private getMasterDataByNameURL = "api/MasterData/MasterDataByName";
  //private createURL = "Patients/CreateUpdatePatient";
  private createURL = "Patients/CreateUpdateClient";
  private getClientByIdURL = "Patients/GetPatientById";
  private getClientHeaderInfoURL = "Patients/GetPatientHeaderInfo";
  private getClientProfileInfoURL = "Patients/GetPatientsDetails";

  private updateClientStatusURL = "patients/UpdatePatientActiveStatus";
  private updateUserStatusURL = "user/UpdateUserStatus";
  private getPatientCCDAURL = "patients/GetPatientCCDA";
  private updatePatientPortalVisibilityURL = "patients/UpdatePatientPortalVisibility";
  //private getBlueButtonTokenURL = ""


  //Address URL
  private getAddressAndPhoneNumbersURL = "PatientsAddress/GetPatientPhoneAddress";
  private saveAddressAndPhoneNumbersURL = "PatientsAddress/SavePhoneAddress";

  //Blue button
  private getPatientDetailsBBURL = "Patients/GetPatientDetailsBB";
  private checkBlueButtonStatusURL = "Patients/CheckBlueButtonStatus";

    constructor(private commonService: CommonService, private http: HttpClient) {}
  create(data: ClientModel) {
    return this.commonService.post(this.createURL, data);
  }
  getMasterData(value: string = "") {
    return this.commonService.post(this.getMasterDataByNameURL, {
      masterdata: value
    });
  }
  updateClientNavigations(id: number, userId: number = null) {
    this.commonService.updateClientNaviagations(id, userId);
  }
  getClientById(id: number) {
    return this.commonService.getById(
      this.getClientByIdURL + "?patientId=" + id,
      {}
    );
  }
  getClientHeaderInfo(id: number) {
    return this.commonService.getById(
      this.getClientHeaderInfoURL + "?id=" + id,
      {}
    );
  }
  getClientProfileInfo(id: number) {
    return this.commonService.getById(
      this.getClientProfileInfoURL + "?id=" + id,
      {}
    );
  }
  updateClientStatus(patientId: number, isActive: boolean) {
    return this.commonService.patch(
      this.updateClientStatusURL +
        "?patientID=" +
        patientId +
        "&isActive=" +
        isActive,
      {}
    );
  }

  updateUserStatus(patientId: number, isActive: boolean) {
    return this.commonService.patch(
      this.updateUserStatusURL + "/" + patientId + "/" + isActive,
      {}
    );
  }
  getPatientCCDA(patientId: number) {
    return this.commonService.download(
      this.getPatientCCDAURL + "?id=" + patientId,
      {}
    );
  }
  updatePatientPortalVisibility(
    patientId: number,
    userId: number,
    value: boolean
  ) {
    let url =
      this.updatePatientPortalVisibilityURL +
      "?patientID=" +
      patientId +
      "&userID=" +
      userId +
      "&isPortalActive=" +
      value;
    return this.commonService.patch(url, {});
  }



  //Address Method  -- Remove all if not needed
  getPatientAddressesAndPhoneNumbers(clientId: number) {
    return this.commonService.getById(
      this.getAddressAndPhoneNumbersURL + "?patientId=" + clientId,
      {}
    );
  }


  savePatientAddressesAndPhoneNumbers(data: any) {
    return this.commonService.post(this.saveAddressAndPhoneNumbersURL, data);
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

  getPatientDetailsBB(data: any){
    return this.commonService.post(this.getPatientDetailsBBURL, data);
  }

  checkBlueButtonStatus(clientId: any){
    const queryParams = '?clientId=' + clientId;
    return this.commonService.get(this.checkBlueButtonStatusURL + queryParams);
  }

//    getBlueButtonToken(returnURL: any){
//     var headers = new HttpHeaders()
//     .set('Content-Type', 'application/x-www-form-urlencoded');

//  let urlSearchParams = new URLSearchParams();
//  //urlSearchParams.set('grant_type', 'authorization_code');
//  urlSearchParams.set('response_type', 'code');
//  urlSearchParams.set('state', 'testvv');
//   urlSearchParams.set('redirect_uri', 'https://localhost:4200/web/client/client-profile?id=NQ%3D%3D');
//  urlSearchParams.set('client_id', 'D5gj1ilrpy0mM4D6e0yOoLl5j6EL4QOvZAslgdK2');
//   //urlSearchParams.set('client_secret', 'Dp7cBy0o0hyMou5sv9zjnoKqHW4Bc8wXgYMs54uoKJ4NNqvjns5SFFiYKTFHMtAgQ8qYboVO7YCLSdBUHkhaziH2pxoctFOoNdQnlpD50S3IH4oWSaMGu9fMoeMXObPi');
//   //urlSearchParams.set('code', code);

//   let body = urlSearchParams.toString();

//     // https://sandbox.bluebutton.cms.gov/v1/o/authorize/?client_id=<Client Id>&redirect_uri=http://localhost:8082/login&response_type=code&state=test1
//     // return this.commonService.get(this.getBlueButtonTokenURL, true);
//     return this.http.get<any>('https://sandbox.bluebutton.cms.gov/v1/o/authorize/?' + body,
//           // {
//           //   headers, HttpHeaders
//           //    },
//           ).subscribe(
//              data => {
//                debugger;
//                console.log("data from token post request", data);
//              //localStorage.setItem('currentUser', JSON.stringify({ username, token: data.access_token}));
//              //retrieveFHIRDa
//             });
//   }

  // getBlueButtonToken(code: string) {
  //   debugger;
  //   var headers = new HttpHeaders()
  //       .set('Content-Type', 'application/x-www-form-urlencoded');

  //    let urlSearchParams = new URLSearchParams();
  //    urlSearchParams.set('grant_type', 'authorization_code');
  //    urlSearchParams.set('redirect_uri', 'https://localhost:4200/web/client/client-profile?id=NQ%3D%3D');
  //    urlSearchParams.set('client_id', 'D5gj1ilrpy0mM4D6e0yOoLl5j6EL4QOvZAslgdK2');
  //     urlSearchParams.set('client_secret', 'Dp7cBy0o0hyMou5sv9zjnoKqHW4Bc8wXgYMs54uoKJ4NNqvjns5SFFiYKTFHMtAgQ8qYboVO7YCLSdBUHkhaziH2pxoctFOoNdQnlpD50S3IH4oWSaMGu9fMoeMXObPi');
  //     urlSearchParams.set('code', code);

  //    let body = urlSearchParams.toString();


  //    return this.http.post<any>('https://sandbox.bluebutton.cms.gov/v1/o/token/?' + body,
  //         {
  //           headers, HttpHeaders
  //            },
  //         ).subscribe(
  //            data => {
  //              debugger;
  //              console.log("data from token post request", data);
  //            //localStorage.setItem('currentUser', JSON.stringify({ username, token: data.access_token}));
  //            //retrieveFHIRData

  //           //var headers = new HttpHeaders()
  //             //  .set('Content-Type', 'application/json');

  //            //const eobparams = new HttpParams({fromString: 'patient=20140000010000'});

  //           // return this.http.get<any>('https://sandbox.bluebutton.cms.gov/v1/fhir/ExplanationOfBenefit/').subscribe(eobReturneddata => {
  //           //           // store EOB data
  //           //           debugger;
  //           //           console.log("data from toekn post request", eobReturneddata);
  //           //          //localStorage.setItem('eobJSONData', JSON.stringify(eobReturneddata));
  //           //          return this.http.get<any>('https://sandbox.bluebutton.cms.gov/v1/fhir/Patient/').subscribe(patientReturnedData => {
  //           //              // store Patient data
  //           //                 //localStorage.setItem('patientJSONData', JSON.stringify(patientReturnedData));
  //           //                 //router.navigate(['/home']);
  //           //                 console.log("patient data", patientReturnedData);
  //           //             })
  //           //       })
  //                  },
  //            err => {

  //            })

  //    }


}
