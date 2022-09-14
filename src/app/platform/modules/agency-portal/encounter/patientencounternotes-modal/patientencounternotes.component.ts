//import { DiagnosisService } from "./../diagnosis.service";
import { Component, OnInit, EventEmitter, Output, Inject } from "@angular/core";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { DiagnosisModel, PatientEncounterNotesModel } from "src/app/platform/modules/agency-portal/clients/diagnosis/diagnosis.model";
import { EncounterService } from "../encounter.service";

@Component({
  selector: "app-patientencounternotes-modal",
  templateUrl: "./patientencounternotes.component.html",
  styleUrls: ["./patientencounternotes.component.css"]
})
export class PatientEncounterNotesModalComponent implements OnInit {

  patientencounternotesModel: PatientEncounterNotesModel;
  patientencounternotesForm: FormGroup;
  submitted: boolean = false;
  headerText: string = "Add Notes";

  patientId: number;

  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private formBuilder: FormBuilder,
    private patientencounternotesModalRef: MatDialogRef<PatientEncounterNotesModalComponent>,
    private encounterService: EncounterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {

    this.patientencounternotesModel = data.patientencounternote;
    //this.refreshGrid.subscribe(data.refreshGrid);

    // if (this.patientencounternotesModel.id != null && this.patientencounternotesModel.id > 0)
    //   this.headerText = "Edit Diagnosis";
    // else
    this.headerText = "Add Notes";

    this.patientId = this.patientencounternotesModel.patientID;


  }

  ngOnInit() {
    this.patientencounternotesForm = this.formBuilder.group({
      //id: [this.patientencounternotesModel.id],
      encounternotes: [this.patientencounternotesModel.encounterNotes]

    });

  }

  get formControls() {
    return this.patientencounternotesForm.controls;
  }
  onSubmit(event: any) {
    if (!this.patientencounternotesForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.patientencounternotesModel.encounterNotes = this.patientencounternotesForm.get('encounternotes').value;
      this.closeDialog(this.patientencounternotesModel.encounterNotes);
      // this.encounterService
      //   .savePatientEncounterNotes(this.patientencounternotesModel)
      //   .subscribe((response: any) => {
      //     this.submitted = false;
      //     if (response.statusCode == 200) {
      //       this.notifier.notify("success", response.message);
      //       if (clickType == "Save") this.closeDialog("save");
      //       else if (clickType == "SaveAddMore") {
      //         //this.refreshGrid.next();
      //         //this.diagnosisForm.reset();
      //       }
      //     } else {
      //       this.notifier.notify("error", response.message);
      //     }
      //   });
    }
  }


  closeDialog(action: any): void {
    this.patientencounternotesModalRef.close(action);
  }

}
