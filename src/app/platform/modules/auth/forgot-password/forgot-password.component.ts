import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AuthenticationService } from "../auth.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  subDomainInfo: any;
  errorMessage: string = null;
  successMessage: string = null;
  backToLogin: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.backToLogin = localStorage.getItem("forgot-password-last-page");
    this.forgotPasswordForm = this.formBuilder.group({
      username: ["", Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const webUrl = window.location.origin;
    const postData = {
      username: this.f.username.value,
      resetPasswordURL: `${webUrl}/web/reset-password`
    };
    this.authenticationService
      .forgotPassword(postData)
      .pipe(first())
      .subscribe(
        response => {
          if (
            response.statusCode >= 400 &&
            response.statusCode < 500 &&
            response.message
          ) {
            this.errorMessage = response.message;
            this.loading = false;
          } else {
            // this.router.navigate(['/web'])
            this.successMessage = response.message;
            this.loading = false;
          }
        },
        error => {
          console.log(error);
          // this.alertService.error(error);
          this.errorMessage = error;
          this.loading = false;
        }
      );
  }
}
