import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "../auth.service";
import { CommonService } from "../../core/services";
import { MatDialog } from "@angular/material";
import { TermsConditionModalComponent } from "src/app/front/terms-conditions/terms-conditions.component";

@Component({
  selector: "app-agency-login",
  templateUrl: "./agency-login.component.html",
  styleUrls: ["./agency-login.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class AgencyLoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  subDomainInfo: any;
  errorMessage: string = null;
  ipAddress: string;
  isShowPassword= false;
  
  // @ViewChild(AuthComponent) alert: AuthComponent;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private dialogModal: MatDialog,
  ) {
      
  }


 
  ngOnInit() {
    localStorage.removeItem("forgot-password-last-page");
    this.authenticationService.updateSideScreenImgSrc("../../../../../assets/login-doc.png");
    this.commonService.sytemInfo.subscribe(obj => {
      this.ipAddress = obj.ipAddress;
    });
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    // reset login status
    this.commonService.logout();

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = "web/dashboard";
   
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
          } else if (response.access_token) {
            if (
              response.patientData != null &&
              response.openDefaultClient == true
            ) {
              this.router.navigate(["web/client"], {
                queryParams: {
                  id:
                    response.patientData.id != null
                      ? this.commonService.encryptValue(
                          response.patientData.id,
                          true
                        )
                      : null
                }
              });
            } else {
              this.router.navigate([this.returnUrl]);
            }
          } else {
            this.router.navigate(["/web/security-question"]);
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
 
  forgetPassword() { 
    localStorage.setItem("forgot-password-last-page","/web/login");
    this.router.navigateByUrl("/web/forgot-password");
  }
}
