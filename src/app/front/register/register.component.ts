import {
  Component,
  OnInit,
  ComponentRef,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { RegisterService } from "src/app/front/register/register.service";
import { UserModel } from "src/app/platform/modules/agency-portal/users/users.model";
import { PasswordValidator } from "src/app/shared/password-validator";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { InvitationRegisterModel } from "src/app/front/register/register.model";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormGroupDirective } from "@angular/forms";
import { NgForm } from "@angular/forms";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { NotifierService } from "angular-notifier";
import { SubDomainService } from "src/app/subDomain.service";

export function AgeValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  var selectedDate = new Date(control.value);
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var yy = selectedDate.getFullYear();
  var mm = selectedDate.getMonth() + 1;
  var dd = selectedDate.getDate();
  var years, months, days;
  // months
  months = month - mm;
  if (day < dd) {
    months = months - 1;
  }
  // years
  years = year - yy;
  if (month * 100 + day < mm * 100 + dd) {
    years = years - 1;
    months = months + 12;
  }
  // days
  days = Math.floor(
    (today.getTime() - new Date(yy + years, mm + months - 1, dd).getTime()) /
      (24 * 60 * 60 * 1000)
  );
  if (years < 18) return { age: true };
  else return null;
  //
  //return { years: years, months: months, days: days };
}
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  invitationId: string = "";
  userForm: FormGroup;
  userModel: UserModel;
  registerInvitationModel: InvitationRegisterModel;
  submitted: boolean = false;
  masterGender: any = [];
  isTokenValid: boolean = true;
  isUsernameExisted: boolean = false;
  Message: any;
  logoUrl: string = null;
  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private subDomainService: SubDomainService
  ) {
    if (this.userModel == null) this.userModel = new UserModel();
    if (this.registerInvitationModel == null)
      this.registerInvitationModel = new InvitationRegisterModel();
  }
  ngOnInit() {
    this.Message = {
      title: "Oops",
      message:
        "Either token isn't legitimate or lapsed or patient previously enrolled with this token id, it would be ideal if you contact organization for additional help.",
      imgSrc: "../assets/img/user-register-icon.png",
    };
    this.activatedRoute.queryParams.subscribe((params) => {
      if (
        (params["token"]! =
          undefined && params["token"] != null && params["token"] != "")
      )
        this.invitationId = params["token"];
    });
    let unamePattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$";
    this.userForm = this.formBuilder.group(
      {
        invitationId: this.invitationId,
        firstName: [this.userModel.firstName],
        lastName: [this.userModel.lastName],
        middleName: [this.userModel.middleName],
        phone: [this.userModel.phoneNumber],
        dob: [this.userModel.dob, [AgeValidator.bind(this)]],
        email: [this.userModel.email, [Validators.required, Validators.email]],
        gender: [this.userModel.gender, [Validators.required]],
        userName: [
          this.userModel.userName,
          {
            validators: [Validators.required],
            asyncValidators: [this.validateUsername.bind(this)],
            updateOn: "blur",
          },
        ],
        password: [
          this.userModel.password,
          [Validators.required, PasswordValidator.strong],
        ],
        confirmPassword: [this.userModel.confirmPassword],
      },
      {
        validator: this.validateForm.bind(this),
      }
    );

    if (this.invitationId != "") {
      this.registerService
        .checkTokenAccessibility(this.invitationId)
        .subscribe((res) => {
          if (res.statusCode != 200) {
            this.isTokenValid = false;
          } else {
            this.userModel = res.data;
            this.userForm.patchValue(this.userModel);
            this.isTokenValid = true;
          }
        });
    }
    this.registerService.getMasterData("MASTERGENDER").subscribe((response) => {
      this.masterGender =
        response.masterGender != null ? response.masterGender : [];
    });
    this.subDomainService.getSubDomainInfo().subscribe((domainInfo) => {
      if (domainInfo)
        this.logoUrl =
          "data:image/png;base64," + domainInfo.organization.logoBase64;
    });
  }
  get formControls() {
    return this.userForm.controls;
  }

  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls.password.value;
    let confirmPass = formGroup.controls.confirmPassword.value;

    if (!confirmPass.length) return null;
    return pass && confirmPass && pass === confirmPass
      ? null
      : formGroup.controls.confirmPassword.setErrors({ notSame: true });
  }
  validateUsername(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve();
      } else {
        let userName = ctrl.value;
        this.registerService
          .checkUserNameExistance(userName)
          .subscribe((response: any) => {
            if (response.statusCode != 200) resolve({ uniqueName: true });
            else resolve();
          });
      }
    });
  }
  onSubmit() {
    if (!this.userForm.invalid) {
      this.submitted = true;
      this.registerService
        .registerNewUser(this.userForm.value)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response != null) {
            if (response.statusCode == 200) {
              this.isTokenValid = false;
              this.Message = {
                title: "Success!",
                message:
                  "Thank you, Your account has been successfully created with us, please contact administation for further assistance.",
                imgSrc: "../assets/img/user-success-icon.png",
              };
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
}
