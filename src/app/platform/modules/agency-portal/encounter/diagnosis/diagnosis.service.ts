import { CommonService } from "src/app/platform/modules/core/services";
import { DiagnosisModel } from "./../../clients/diagnosis/diagnosis.model";
import { Injectable } from "@angular/core";
import { FilterModel } from "../../../core/modals/common-model";

@Injectable({
  providedIn: "root"
})
export class DiagnosisService {
  private createDiagnosisURL = "PatientsDiagnosis/SavePatientDiagnosis";
  private getMasterDataByNameURL = "api/MasterData/MasterDataByName";
  private getSoapNotePatientDiagnosisListURL = "patient-encounter/GetPatientDiagnosisDetails";
  private getDiagnosisByIdURL = "PatientsDiagnosis/GetDiagnosisById";
  private deleteDiagnosisURL = "PatientsDiagnosis/DeleteDiagnosis";
  constructor(private commonService: CommonService) {}
  createDiagnosis(data: DiagnosisModel) {
    return this.commonService.post(this.createDiagnosisURL, data);
  }
  getMasterData(value: string = "") {
    return this.commonService.post(this.getMasterDataByNameURL, {
      masterdata: value
    });
  }
  getSoapNoteDiagnosisList(clientId: number, filterModel: FilterModel) {
    // let url=this.getDiagnosisListURL+"?PatientId="+clientId;
    return this.commonService.getAll(
      // this.getSoapNotePatientDiagnosisListURL + clientId,
      this.getSoapNotePatientDiagnosisListURL + "?patientId=" + clientId + "&pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize,
      {}
    );
  }
  getDiagnosisById(id: number) {
    return this.commonService.getById(
      this.getDiagnosisByIdURL + "?id=" + id,
      {}
    );
  }
  deleteDiagnosis(id: number) {
    return this.commonService.patch(this.deleteDiagnosisURL + "?id=" + id, {});
  }
}
