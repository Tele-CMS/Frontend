import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionairePreviewService {
  // Patient Document Answer
  savePatientDocumentAnswerURL = 'Questionnaire/SavePatientDocumentAnswer';
  getPatientDocumentAnswerURL = 'Questionnaire/GetPatientDocumentAnswer';
  generateAssessmentFormPDFURL = 'PatientHRA/PrintHRAAssessment'

  constructor(private commonService: CommonService) { }

  //document answer
  savePatientDocumentAnswer(modalData: any): Observable<any> {
    return this.commonService.post(this.savePatientDocumentAnswerURL, modalData)
      .pipe(map((response: any) => {
        let data = response;
        return data;
      }))
  }
  getPatientDocumentAnswer(documentId: number, patientId: number, patientDocumentId: number): Observable<any> {
    let url = `${this.getPatientDocumentAnswerURL}?DocumentId=${documentId}&PatientId=${patientId}&patientDocumentId=${patientDocumentId}`;
    return this.commonService.getById(url, {})
  }
  generateAssessmentFormPDF(patientDocId: number, patientId: number, documentId: number) {
    const url = this.generateAssessmentFormPDFURL + '?patientDocumentId=' + patientDocId + '&patientId=' + patientId + '&documentId=' + documentId;
    return this.commonService.download(url, {});
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
