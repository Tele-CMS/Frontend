import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommonService } from "./../../platform/modules/core/services";

@Injectable({
  providedIn: 'root'
})
export class ViewReportService {
  private GetSymptomateReportByIdURl = "payers/GetSymptomateReportById";





  constructor(private commonService: CommonService) { }
  getReport(id: any) {
    let url = `${this.GetSymptomateReportByIdURl}/${id}`;
    return this.commonService.getAll(url, {})
      .pipe(map(x => {
        return x.data;
      }));
  }
  
}
