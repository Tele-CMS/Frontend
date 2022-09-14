import { NotifierService } from "angular-notifier";
import { MatDialogRef, MatDialog } from "@angular/material";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/platform/modules/auth/auth.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { RegisterModelComponent } from "src/app/shared/register-model/register.component";

@Component({
  selector: "app-client-login",
  templateUrl: "./client-login.component.html",
  styleUrls: ["./client-login.component.css"]
})
export class ClientLoginModelComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  subDomainInfo: any;
  errorMessage: string = null;
  ipAddress: string;

  constructor(
    private dialogModalRef: MatDialogRef<ClientLoginModelComponent>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private notifier: NotifierService
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
    this.returnUrl = "web/client/dashboard";
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
      .clientLogin(postData)
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
          } else if (response.statusCode === 205) {
            this.errorMessage = response.message;
            this.loading = false;
          } else {
            this.commonService.setIsPatient(true);
            
            this.notifier.notify(
              "success",
              "Login successfully, You have other menu choices soon after clicking picture"
            );
            this.closeDialog({
              response: response,
              isPatient: true
            });
            //this.router.navigate(["/doctor-list"]);
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
    console.log("clicked here");
    
    this.closeDialog("");
    localStorage.setItem("forgot-password-last-page","web/client/dashboard");
    this.router.navigateByUrl("/web/forgot-password");
  }
}
