import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { UserInvitationService } from "../user-invitation.service";
import { ResponseModel } from "../../../../core/modals/common-model";
import { SendUserInvitationModel } from "../user-invitation.model";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
@Component({
  selector: "app-send-user-invitation",
  templateUrl: "./send-user-invitation.component.html",
  styleUrls: ["./send-user-invitation.component.css"]
})
export class SendUserInvitationComponent implements OnInit {
  headerText: string = "";
  sendUserInvitationForm: FormGroup;
  submitted: boolean = false;
  private sendInvitationModel: SendUserInvitationModel;
  masterRoles: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<SendUserInvitationComponent>,
    private notifier: NotifierService,
    private userInvitationService: UserInvitationService,
    private formBuilder: FormBuilder,
    private usersService: UsersService
  ) {
    this.sendInvitationModel =
      this.data.sendUserInvitationModel == null
        ? new SendUserInvitationModel()
        : this.data.sendUserInvitationModel;
    if (
      this.sendInvitationModel.invitationId != null &&
      this.sendInvitationModel.invitationId > 0
    )
      this.headerText = "Resend Invitation";
    else this.headerText = "Send New Invitation";
  }

  ngOnInit() {
    this.getMasterData();
    this.sendUserInvitationForm = this.formBuilder.group(
      {
        invitationId: [this.sendInvitationModel.invitationId],
        firstName: [
          this.sendInvitationModel.firstName,
          [Validators.required, Validators.minLength, Validators.maxLength]
        ],
        middleName: [this.sendInvitationModel.middleName],
        lastName: [
          this.sendInvitationModel.lastName,
          [Validators.required, Validators.minLength, Validators.maxLength]
        ],
        email: [
          this.sendInvitationModel.email,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$')]
        ],
        phone: [this.sendInvitationModel.phone],
        roleID: [this.sendInvitationModel.roleId]
      },
      { validator: this.validateForm.bind(this) }
    );
  }
  get formControls() {
    return this.sendUserInvitationForm.controls;
  }
  validateForm(formGroup: FormGroup) {
    return null;
  }
  getMasterData() {
    this.usersService
      .getMasterData("MASTERROLES")
      .subscribe((response: any) => {
        if (response != null) {
          this.masterRoles =
            response.masterRoles != null ? response.masterRoles : [];
        }
      });
  }
  onSubmit() {
    if (!this.sendUserInvitationForm.invalid) {
      this.submitted = true;
      this.userInvitationService
        .send(this.sendUserInvitationForm.value)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response != null) {
            if (response.statusCode == 200) {
              this.notifier.notify("success", "Appointment sent successfully");
              this.closeDialog("save");
            } else {
              this.notifier.notify("error", response.message);
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
}
