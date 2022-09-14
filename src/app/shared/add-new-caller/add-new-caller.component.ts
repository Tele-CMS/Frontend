import { CommonService } from "./../../platform/modules/core/services/common.service";
import { Observable } from "rxjs";
import { debug } from "util";
import { AddNewCallerService } from "./add-new-caller.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { AddNewCallerModel } from "./add-new-caller.model";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
@Component({
  selector: "app-add-new-caller",
  templateUrl: "./add-new-caller.component.html",
  styleUrls: ["./add-new-caller.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class AddNewCallerComponent implements OnInit {
  headerText: string = "";
  sendUserInvitationForm: FormGroup;
  submitted: boolean = false;
  private addNewCallerModel: AddNewCallerModel;
  masterRoles: any;
  userList: Array<any> = [];
  userExisted: boolean = false;
  public userType: any;
  userTypes = [{ value: 1, key: "Internal" }, { value: 2, key: "External" }];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<AddNewCallerComponent>,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private addNewCallerService: AddNewCallerService,
    private commonService: CommonService
  ) {
    this.addNewCallerModel = new AddNewCallerModel();
    this.userType = this.userTypes.find(x => x.value == 1);
    if (
      data &&
      data.appointmentId &&
      +data.appointmentId > 0 &&
      data.sessionId &&
      +data.sessionId > 0
    ) {
      this.addNewCallerModel.appointmentId = data.appointmentId;
      this.addNewCallerModel.sessionId = data.sessionId;
    } else {
      if (
        localStorage.getItem("otSession") &&
        localStorage.getItem("otSession") != ""
      ) {
        var response = JSON.parse(
          this.commonService.encryptValue(
            localStorage.getItem("otSession"),
            false
          )
        );
        this.addNewCallerModel.appointmentId = +response.appointmentId;
        this.addNewCallerModel.sessionId = +response.id;
      }
    }
    const webUrl = window.location.origin;
    this.addNewCallerModel.webRootUrl = `${webUrl}`;
  }

  ngOnInit() {
    this.sendUserInvitationForm = this.formBuilder.group(
      {
        staffId: [this.addNewCallerModel.staffId],
        sessionId: [this.addNewCallerModel.sessionId],
        appointmentId: [this.addNewCallerModel.appointmentId],
        webRootUrl: [this.addNewCallerModel.webRootUrl],
        name: [
          this.addNewCallerModel.name,
          [Validators.required, Validators.minLength, Validators.maxLength]
        ],
        email: [
          this.addNewCallerModel.email,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$')]
        ]
      },
      { validator: this.validateForm.bind(this) }
    );

    this.getMasterData();
    //this.getAllUserListing();
  }
  get formControls() {
    return this.sendUserInvitationForm.controls;
  }
  validateForm(formGroup: FormGroup) {
    return null;
  }
  getMasterData() {
    // this.usersService
    //   .getMasterData("MASTERROLES")
    //   .subscribe((response: any) => {
    //     if (response != null) {
    //       this.masterRoles =
    //         response.masterRoles != null ? response.masterRoles : [];
    //     }
    //   });
  }
  onSubmit() {
    if (!this.sendUserInvitationForm.invalid) {
      this.submitted = true;
      this.addNewCallerService
        .inviteNewPerson(this.sendUserInvitationForm.value)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response != null) {
            if (response.statusCode == 200) {
              this.notifier.notify("success", "Invitation sent successfully");
              this.closeDialog("save");
            } else if (response.statusCode == 201) {
              this.notifier.notify("info", response.message);
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
  applyFilter(event: any) {
    var name = event.target.value;
    if (name.length > 3 && this.userType.value == 1) {
      this.getAllUserListing(name);
    } else {
      this.userList = [];
      this.userExisted = false;
    }
  }
  getAllUserListing(name: string = "") {
    this.addNewCallerService
      .getStaffDetailsByName(name)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.userList = response.data;
          this.userExisted = true;
        } else {
          this.userList = [];
          this.userExisted = false;
        }
      });
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

  getUserDetail(user: any) {
    this.userExisted = false;
    this.formControls.name.setValue(user.fullName);
    this.formControls.email.setValue(user.email);
    this.formControls.staffId.setValue(user.staffID);
  }
  changeUserType(event: any, type: any) {
    this.userType = type;
    var name = this.formControls.name.value;
    if (name.length > 3 && this.userType.value == 1) {
      this.getAllUserListing(name);
    } else {
      this.userList = [];
      this.userExisted = false;
    }
  }
}
