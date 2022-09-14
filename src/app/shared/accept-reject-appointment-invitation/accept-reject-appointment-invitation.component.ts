import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { AppointmentGraphService } from "src/app/shared/appointment-graph/appointment-graph.service";

@Component({
  selector: "app-accept-reject-appointment-invitation",
  templateUrl: "./accept-reject-appointment-invitation.component.html",
  styleUrls: ["./accept-reject-appointment-invitation.component.css"]
})
export class AcceptRejectAppointmentInvitationComponent implements OnInit {
  approveAppointmentForm: FormGroup;
  submitted: boolean = false;
  title: string = "";
  appointmentId: number = 0;
  status: string = "";
  constructor(
    private formBuilder: FormBuilder,
    private appointmentGraphService: AppointmentGraphService,
    public dialogPopup: MatDialogRef<
      AcceptRejectAppointmentInvitationComponent
    >,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    if (data) {
      this.title = data.title;
      this.appointmentId = data.appointmentId;
      this.status = data.status;
    }
  }

  ngOnInit() {
    this.initializeFormFields();
  }

  initializeFormFields() {
    const configControls = {
      notes: [""],
      id: [this.appointmentId],
      status: [this.status]
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
    // this.appointmentData["NotesToMember"] = NotesToMember;

    this.appointmentGraphService
      .updateAppointmentStatus(this.approveAppointmentForm.value)
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
