import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PasswordValidator } from "src/app/shared/password-validator";
import { first } from "rxjs/operators";
import { AuthenticationService } from "../auth.service";

import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialog } from "@angular/material";
import { TermsConditionModalComponent } from "src/app/front/terms-conditions/terms-conditions.component";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: any;
  loading = false;
  submitted = false;
  errorMessage: string = null;
  successMessage: string = null;
  matcher = new MyErrorStateMatcher();
  isShowPassword: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialogModal: MatDialog
  ) {}

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ["", [Validators.required, PasswordValidator.strong]],
        confirmPassword: ["", Validators.required]
      },
      { validator: this.checkPasswords }
    );
    this.route.queryParams.subscribe(params => {
      this.token = params["id"];
    });
    this.resetPasswordForm.get("password").setValue("");
    this.resetPasswordForm.get("confirmPassword").setValue("");
  }
  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }
  // convenience getter for easy access to form fields
  get formControls() {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.errorMessage = null;
    this.successMessage = null;

    const webUrl = window.location.origin;
    const postData = {
      newPassword: this.formControls.password.value,
      ConfirmNewPassword: this.formControls.confirmPassword.value,
      token: this.token
    };
    this.authenticationService
      .resetPassword(postData)
      .pipe(first())
      .subscribe(
        response => {
          this.submitted = false;
          if (
            response.statusCode >= 400 &&
            response.statusCode < 500 &&
            response.message
          ) {
            this.errorMessage = response.message;
          } else {
            this.successMessage = response.message;
          }
        },
        error => {
          console.log(error);
          this.errorMessage = error;
          this.submitted = false;
        }
      );
  }

  opentermconditionmodal() {
    // let dbModal;
    // dbModal = this.dialogModal.open(TermsConditionModalComponent, {
    //   hasBackdrop: true,
    //   width:'70%'
    // });
    // dbModal.afterClosed().subscribe((result: string) => {
    //   if (result != null && result != "close") {
        
    //   }
    // });
  }
}
