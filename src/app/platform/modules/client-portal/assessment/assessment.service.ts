import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
 // assessments
 private getPatientDocumentURL = 'Questionnaire/GetPatientDocuments';
 private getPatientDocumentAnswerURL = 'Questionnaire/GetPatientDocumentAnswer';
 constructor(private commonService: CommonService) { }


  getAllPatientDocuments(filterModal: any) {
    let url = this.getPatientDocumentURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&patientId=' + filterModal.patientId;
    return this.commonService.getAll(url, {});
  }

  // assign questionaire api
  getPatientDocumentAnswer(documentId: number, patientId: number, patientDocumentId:number): Observable<any> {
    let urlParams = `?DocumentId=${documentId}&PatientId=${patientId}&patientDocumentId=${patientDocumentId}`;
    return this.commonService.getById(this.getPatientDocumentAnswerURL + urlParams, {})
}
}
