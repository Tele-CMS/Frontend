import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommonService } from "./../../platform/modules/core/services";

@Injectable({
  providedIn: 'root'
})
export class SymptomCheckerService {
  private getSymptomsURL = "patients/GetPatientSymptoms";
  private getQuestionsURL = "patients/GetSymptomQuestions";
  private getObservationsURL = "patients/getObservations";
  private getSummaryURL = "patients/getSummary";
  private getCovidQuestionsURL = "patients/GetCovidQuestions";
  private getCovidSummaryURL = "patients/getCovidSummary";
  private GetPatientsDetailedInfoURL = "Patients/GetPatientsDetailedInfo";
  private AddSymptomateReportURL="Payers/AddSymptomateReport"




  constructor(private commonService: CommonService) { }

  getPatientSymptoms(searchText: string = '') {
    return this.commonService.getAll(this.getSymptomsURL + "?search=" + searchText, {})
      .pipe(map(x => {
        return x.data;
      }));
  }
  getSymptomQuestions(symptom: any,age:any,gender:any) {
    return this.commonService.post(this.getQuestionsURL+"?age="+age+"&gender="+gender, symptom)
      .pipe(map(x => {
        return x.data;
      }));
  }
  getCovidQuestions(symptom: any) {
    return this.commonService.post(this.getCovidQuestionsURL, symptom)
      .pipe(map(x => {
        return x.data;
      }));
  }
  getObservations(symptom: any,age:any,gender:any) {
    return this.commonService.post(this.getObservationsURL+"?age="+age+"&gender="+gender, symptom)
      .pipe(map(x => {
        return x.data;
      }));
  }
getCovidSummary(symptom: any,age:any,gender:any) {
    return this.commonService.post(this.getCovidSummaryURL+"?age="+age+"&gender="+gender, symptom)
      .pipe(map(x => {
        return x.data;
      }));
  }
  getSummary(type: any) {
    return this.commonService.getAll(this.getSummaryURL+"?type="+type, {})
      .pipe(map(x => {
        return x.data;
      }));
  }
  GetPatientsDetailedInfo(id: number) {
    return this.commonService.getById(
      this.GetPatientsDetailedInfoURL + "?patientId=" + id,
      {}
    );
  }
  AddSymptomateReport(data:any){
    return this.commonService.post(this.AddSymptomateReportURL,data)
  }
}
