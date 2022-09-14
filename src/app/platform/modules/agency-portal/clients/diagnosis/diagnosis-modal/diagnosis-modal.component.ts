import { Component, OnInit, EventEmitter, Output, Inject } from "@angular/core";
import { DiagnosisModel } from "../diagnosis.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ClientsService } from "../../clients.service";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { LayoutService } from "src/app/platform/modules/core/services";

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
  linkedEncounterId: number;
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private formBuilder: FormBuilder,
    private diagnosisDialogModalRef: MatDialogRef<DiagnosisModalComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private layoutService: LayoutService
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

    this.layoutService.clientDrawerData.subscribe(({ encounterId }) => {
      this.linkedEncounterId = encounterId;
    });
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
      this.diagnosisModel.linkedEncounterId = this.linkedEncounterId;
      this.clientService
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
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterICD = response.masterICD != null ? response.masterICD : [];
      }
    });
  }
}
