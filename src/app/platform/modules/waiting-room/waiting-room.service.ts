import { Injectable } from "@angular/core";
import { CommonService } from "../core/services";
import { Observable } from "rxjs";
import { SaveQuestionAsnwerRequestModel } from "src/app/shared/dynamic-form/dynamic-form-models";
import { AddUserDocumentModel, AddUserDocumentPatientModel } from "../agency-portal/users/users.model";
//import { PayerModel, PayerServiceCodeModel, PayerServiceCodeModifierModel, PayerServiceCodeWithModifierModel, PayerActivityServiceCodeModel, ActivityCodeModifierUpdateModel } from "./payers.model";

@Injectable({
    providedIn: 'root'
})

export class WaitingRoomService {
 
    private getProvidersQuestionnaireControlsByTypeURL = 'Questionnaire/GetProvidersQuestionnaireControlsByAppointment';
    private getMasterDataURL = 'api/MasterData/MasterDataByName';
    private saveAppointmentQuestionnaireAsnwersURL = 'Questionnaire/SaveAppointmentQuestionnaireAsnwers';
    private  getAppointmentDetailURL = "api/PatientAppointments/GetAppointmentDetails";
    private getUserDocumentsURL = "userDocument/GetUserDocuments";
    private getUserByLocationURL = "api/PatientAppointments/GetStaffAndPatientByLocation";
    private getUserDocumentURL = "userDocument/GetUserDocument";
    private deleteUserDocumentURL = "userDocument/DeleteUserDocument";
    private uploadUserDocumentURL = "userDocument/UploadUserDocuments";
    private getPateintApptDocumentsURL = "userDocument/GetPateintAppointmenttDocuments";
    
    constructor(private commonService: CommonService) {

    }

    getUserScreenActionPermissions(moduleName: string, screenName: string): any {
      return this.commonService.getUserScreenActionPermissions(
        moduleName,
        screenName
      );
    }

    getProvidersQuestionnaireControlsByType(typeId:number, staffId: number,appointmentId: number =0) :Observable<any> {
        return this.commonService.get(this.getProvidersQuestionnaireControlsByTypeURL+"?typeId="+typeId+"&staffId="+staffId+"&appointmentId="+appointmentId);
    }

    getMasterData(value) {
        return this.commonService.post(this.getMasterDataURL, { masterdata: value });
    }

    saveAnswers(model:SaveQuestionAsnwerRequestModel) :Observable<any>{
        return this.commonService.post(this.saveAppointmentQuestionnaireAsnwersURL,model);
    }

    getAppointmentDetails(appointmentId: number): Observable<any> {
        const queryParams = `?appointmentId=${appointmentId}`;
        return this.commonService.getById(
          this.getAppointmentDetailURL + queryParams,
          {}
        );
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
    
      getPateintApptDocuments(apptId: number) {
        return this.commonService.getAll(
          this.getPateintApptDocumentsURL +
          "?apptId=" +
          apptId,
          {}
        );
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
    
      uploadUserDocuments(data: AddUserDocumentPatientModel) {
        return this.commonService.post(this.uploadUserDocumentURL, data);
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
        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          document.body.removeChild(link);
          window.URL.revokeObjectURL(data);
        }, 100);
      }
      
      
}