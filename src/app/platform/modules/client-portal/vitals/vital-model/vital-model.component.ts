import { Component, OnInit, Inject, Output, EventEmitter } from "@angular/core";

import { NotifierService } from "angular-notifier";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup } from "@angular/forms";
import { VitalModel } from "src/app/platform/modules/agency-portal/clients/vitals/vitals.model";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";

@Component({
  selector: "app-vital-model",
  templateUrl: "./vital-model.component.html",
  styleUrls: ["./vital-model.component.css"]
})
export class VitalModelComponent implements OnInit {
  maxDate = new Date();
  patientId: number;
  vitalModel: VitalModel;
  vitalForm: FormGroup;
  submitted: boolean = false;
  headerText: string = "Add Patient Vital";
  error: string = "Please fill atleast one more vital other than date";

  //////////////////
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private vitalDialogModalRef: MatDialogRef<VitalModelComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    //assign data
    this.vitalModel = data.vital;
    this.refreshGrid.subscribe(data.refreshGrid);
    this.patientId = this.vitalModel.patientID;
    //update header text
    if (this.vitalModel.id != null && this.vitalModel.id > 0)
      this.headerText = "Edit Patient Vital";
    else this.headerText = "Add Patient Vital";
  }

  ngOnInit() {
    this.vitalForm = this.formBuilder.group({
      id: [this.vitalModel.id],
      patientID: [this.vitalModel.patientID],
      bmi: [this.vitalModel.bmi],
      bpDiastolic: [this.vitalModel.bpDiastolic],
      bpSystolic: [this.vitalModel.bpSystolic],
      heartRate: [this.vitalModel.heartRate],
      heightIn: [this.vitalModel.heightIn],
      pulse: [this.vitalModel.pulse],
      respiration: [this.vitalModel.respiration],
      temperature: [this.vitalModel.temperature],
      vitalDate: [this.vitalModel.vitalDate],
      weightLbs: [this.vitalModel.weightLbs]
    });
  }

  //get the form controls on html page
  get formControls() {
    return this.vitalForm.controls;
  }

  //submit for create update of vitals
  onSubmit(event: any) {
    if (!this.vitalForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.vitalModel = this.vitalForm.value;
      this.vitalModel.patientID = this.patientId;
      this.clientService
        .createVital(this.vitalModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            if (clickType == "Save") this.closeDialog("save");
            else if (clickType == "SaveAddMore") {
              this.refreshGrid.next();
              this.vitalForm.reset();
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  get vitalValidation() {
    return (
      !this.formControls.heightIn.value &&
      !this.formControls.weightLbs.value &&
      !this.formControls.heartRate.value &&
      !this.formControls.bpSystolic.value &&
      !this.formControls.bpDiastolic.value &&
      !this.formControls.pulse.value &&
      !this.formControls.respiration.value &&
      !this.formControls.temperature.value
    );
  }
  //close popup
  closeDialog(action: string): void {
    this.vitalDialogModalRef.close(action);
  }
}
