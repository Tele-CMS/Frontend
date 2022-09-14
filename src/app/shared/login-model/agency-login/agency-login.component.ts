import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/platform/modules/auth/auth.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { RegisterModelComponent } from "src/app/shared/register-model/register.component";

@Component({
  selector: "app-agency-login",
  templateUrl: "./agency-login.component.html",
  styleUrls: ["./agency-login.component.css"]
})
export class AgencyLoginModelComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  subDomainInfo: any;
  errorMessage: string = null;
  ipAddress: string;
  loginResponse: any = null;
  constructor(
    private dialogModalRef: MatDialogRef<AgencyLoginModelComponent>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private dialogModal: MatDialog
  ) {
    dialogModalRef.disableClose = true;
  }

  ngOnInit() {
    // localStorage.removeItem("forgot-password-last-page");
    this.commonService.sytemInfo.subscribe(obj => {
      this.ipAddress = obj.ipAddress;
    });
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    // reset login status
    //this.commonService.logout();

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    //this.returnUrl = "web/dashboard";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const postData = {
      username: this.f.username.value,
      password: this.f.password.value,
      ipaddress: this.ipAddress,
      macaddress: "ec:aa:a0:2d:dc:67"
    };
    this.authenticationService
      .login(postData)
      .pipe(first())
      .subscribe(
        response => {
          this.loginResponse = response;
          if (
            response.statusCode >= 400 &&
            response.statusCode < 500 &&
            response.message
          ) {
            this.errorMessage = response.message;
            this.loading = false;
          } else if (response.statusCode === 205) {
            this.errorMessage = response.message;
            this.loading = false;
          } else {
            this.commonService.setIsPatient(true);
            this.closeDialog({
              response: this.loginResponse,
              isPatient: false
            });
          }
          // else {
          //   this.router.navigate(["/web/security-question"]);
          // }
        },
        error => {
          console.log(error);
          // this.alertService.error(error);
          this.errorMessage = error;
          this.loading = false;
        }
      );
  }
  openDialogRegister() {
    this.closeDialog(null);
    let dbModal;
    dbModal = this.dialogModal.open(RegisterModelComponent, { data: {} });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
      }
    });
  }
  closeDialog(action: any): void {
    this.dialogModalRef.close(action);
  }
  forgetPassword() { 
    this.closeDialog("");
    localStorage.setItem("forgot-password-last-page","web/dashboard");
    this.router.navigateByUrl("/web/forgot-password");
  }
}
