import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { AppointmentGraphService } from "src/app/shared/appointment-graph/appointment-graph.service";

@Component({
  selector: "app-approve-appointment-dialog",
  templateUrl: "./approve-appointment-dialog.component.html",
  styleUrls: ["./approve-appointment-dialog.component.css"]
})
export class ApproveAppointmentDialogComponent implements OnInit {
  approveAppointmentForm: FormGroup;
  appointmentData: number;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentGraphService: AppointmentGraphService,
    public dialogPopup: MatDialogRef<ApproveAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.appointmentData = data;
  }

  ngOnInit() {
    this.initializeFormFields();
  }

  initializeFormFields() {
    const configControls = {
      NotesToMember: [""]
    };
    this.approveAppointmentForm = this.formBuilder.group(configControls);
  }

  get formControls() {
    return this.approveAppointmentForm.controls;
  }

  onClose(): void {
    this.dialogPopup.close();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.approveAppointmentForm.invalid) {
      this.submitted = false;
      return;
    }

    const { NotesToMember } = this.approveAppointmentForm.value;
    this.appointmentData["NotesToMember"] = NotesToMember;

    this.appointmentGraphService
      .updateAppointmentStatus(this.appointmentData)
      .subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode === 200) {
          this.notifier.notify("success", response.message);
          this.dialogPopup.close("SAVE");
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
}
