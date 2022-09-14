import { DiagnosisService } from "./../diagnosis.service";
import { Component, OnInit, EventEmitter, Output, Inject } from "@angular/core";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { DiagnosisModel } from "src/app/platform/modules/agency-portal/clients/diagnosis/diagnosis.model";

@Component({
  selector: "app-diagnosis-modal",
  templateUrl: "./diagnosis-modal.component.html",
  styleUrls: ["./diagnosis-modal.component.css"]
})
export class DiagnosisModalComponent implements OnInit {
  statusList: any[];
  diagnosisModel: DiagnosisModel;
  diagnosisForm: FormGroup;
  submitted: boolean = false;
  headerText: string = "Add Diagnosis";
  masterICD: any[];
  patientId: number;
  maxDate = new Date();
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private formBuilder: FormBuilder,
    private diagnosisDialogModalRef: MatDialogRef<DiagnosisModalComponent>,
    private diagnosisService: DiagnosisService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.diagnosisModel = data.diagnosis;
    this.refreshGrid.subscribe(data.refreshGrid);

    if (this.diagnosisModel.id != null && this.diagnosisModel.id > 0)
      this.headerText = "Edit Diagnosis";
    else this.headerText = "Add Diagnosis";

    this.patientId = this.diagnosisModel.patientID;

    this.statusList = [
      { id: true, value: "Active" },
      { id: false, value: "Inactive" }
    ];
  }

  ngOnInit() {
    this.diagnosisForm = this.formBuilder.group({
      id: [this.diagnosisModel.id],
      icdid: [this.diagnosisModel.icdid],
      isActive: [this.diagnosisModel.isActive],
      diagnosisDate: [this.diagnosisModel.diagnosisDate],
      resolveDate: [this.diagnosisModel.resolveDate]
    });
    this.getMasterData();
    this.formControlValueChanged();
  }

  get formControls() {
    return this.diagnosisForm.controls;
  }
  onSubmit(event: any) {
    if (!this.diagnosisForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.diagnosisModel = this.diagnosisForm.value;
      this.diagnosisModel.patientID = this.patientId;
      this.diagnosisModel.resolveDate = this.diagnosisModel.isActive
        ? null
        : this.diagnosisModel.resolveDate;
      this.diagnosisService
        .createDiagnosis(this.diagnosisModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            if (clickType == "Save") this.closeDialog("save");
            else if (clickType == "SaveAddMore") {
              this.refreshGrid.next();
              this.diagnosisForm.reset();
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  formControlValueChanged() {
    const resolveDateControl = this.diagnosisForm.get("resolveDate");
    this.diagnosisForm.get("isActive").valueChanges.subscribe((mode: any) => {
      if (mode == false) {
        resolveDateControl.setValidators([Validators.required]);
      } else {
        resolveDateControl.clearValidators();
      }
      resolveDateControl.updateValueAndValidity();
    });
  }
  closeDialog(action: string): void {
    this.diagnosisDialogModalRef.close(action);
  }

  getMasterData() {
    let data = "MASTERICD";
    this.diagnosisService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterICD = response.masterICD != null ? response.masterICD : [];
      }
    });
  }
}
