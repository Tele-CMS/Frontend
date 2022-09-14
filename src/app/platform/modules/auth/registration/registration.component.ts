import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { first, timeout } from 'rxjs/operators';
import { RegisterService } from 'src/app/front/register/register.service';
import { TermsConditionModalComponent } from 'src/app/front/terms-conditions/terms-conditions.component';
import { PasswordValidator } from 'src/app/shared/password-validator';
import { SubDomainService } from 'src/app/subDomain.service';
import { UserModel } from '../../agency-portal/users/users.model';
import { ResponseModel } from '../../core/modals/common-model';
import { CommonService } from '../../core/services';
import { AuthenticationService } from '../auth.service';

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
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {
//export class RegistrationComponent  {
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  subDomainInfo: any;
  errorMessage: string = null;
  ipAddress: string;
  isPatient= false;
  isProvider=false;
  userModel: UserModel;
  maxDate = new Date();
  
  masterGender: any = [];
  masterRoles: any = [];
  masterLocation: any = [];
  isTokenValid: boolean = true;
  isUsernameExisted: boolean = false;
  Message: any;
  logoUrl: string = null;
  userType: string = "";
  private dobValidation = [Validators.required];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private registerService: RegisterService,
    private subDomainService: SubDomainService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private dialogModal: MatDialog) { 
        if(this.route.snapshot.url[0].path == "client-signup"){
            this.isPatient = true;
        } else if(this.route.snapshot.url[0].path == "provider-signup") {
            this.isProvider = true;
            this.maxDate.setFullYear(this.maxDate.getFullYear() -18)
        }
        this.userModel = new UserModel();
    }

  ngOnInit() {

    this.commonService.sytemInfo.subscribe((obj) => {
        this.ipAddress = obj.ipAddress;
      });

     if(this.isPatient)
      this.authenticationService.updateSideScreenImgSrc("../../../../../assets/signup-patient.jpg");
      else if(this.isProvider)
      this.authenticationService.updateSideScreenImgSrc("../../../../../assets/signup-doc.jpg")

      this.registrationForm = this.formBuilder.group(
        {
        firstName: [this.userModel.firstName],
        lastName: [this.userModel.lastName],
        phone: [this.userModel.phoneNumber],
        dob: [this.userModel.dob, this.dobValidation],
        email: [this.userModel.email, [Validators.required, Validators.email]],
        gender: [this.userModel.gender, [Validators.required]],
        roleId: [this.userModel.roleID, [Validators.required]],
        locationId: [101],
        username: [ this.userModel.userName],
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

    this.getMasterData();
    
    // if(this.isPatient){
    //   this.registrationForm.removeControl("resume");
    //   this.registrationForm.updateValueAndValidity();
    // }



      // reset login status
      this.commonService.logout();
  
      // get return url from route parameters or default to '/'
      // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.returnUrl = 'web/client/dashboard';

  }

  

  getMasterData(){
    
    this.registerService
    .getMasterData("MASTERGENDER,MASTERROLESALL,MASTERLOCATION")
    .subscribe((response) => {
      this.masterGender =
        response.masterGender != null ? response.masterGender : [];
      this.masterRoles =
        response.masterRoles != null ? response.masterRoles : [];
      this.masterLocation =
        response.masterLocation != null ? response.masterLocation : [];

        if(this.isPatient){
          const patientRoleId = response.masterRoles.find(x => x.userType == "CLIENT").id; 
          this.userModel.roleID = patientRoleId;
          this.f.roleId.setValue(patientRoleId);
       } else if(this.isProvider) {
        const provinderRoleId = response.masterRoles.find(x => x.userType == "PROVIDER").id; 
        this.userModel.roleID = provinderRoleId;
        this.f.roleId.setValue(provinderRoleId);
        
        this.f.dob.setValidators([Validators.required, AgeValidator.bind(this)]);
        this.f.dob.updateValueAndValidity();
       }
       

    });
  this.subDomainService.getSubDomainInfo().subscribe((domainInfo) => {
    if (domainInfo)
      this.logoUrl =
        "data:image/png;base64," + domainInfo.organization.logoBase64;
  });
  
  }

  get f() {
    return this.registrationForm.controls;
  }

  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls.password.value;
    let confirmPass = formGroup.controls.confirmPassword.value;

    if (!confirmPass.length) return null;
    return pass && confirmPass && pass === confirmPass
      ? null
      : formGroup.controls.confirmPassword.setErrors({ notSame: true });
  }

  toSignInpage(){
    
    if(this.isPatient){
        this.redirect('/web/client-login');
    } else if(this.isProvider){
            this.redirect('/web/login');
    }
  }

  onSubmit(){
    
    this.submitted = true;
    this.f.email.setValue(this.f.username.value);
    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }

      this.registerService
        .registerNewUserWithoutToken(this.registrationForm.value)
        .subscribe((response: ResponseModel) => {
          
          this.submitted = false;
          if (response != null) {
            if (response.statusCode == 200) {
           
              this.isTokenValid = false;
              this.notifier.notify('success',"Thank you, Your account has been successfully created with us, please contact administation for further assistance.");
              // this.Message = {
              //   title: "Success!",
              //   message:
              //     "Thank you, Your account has been successfully created with us, please contact administation for further assistance.",
              //   imgSrc: "../assets/img/user-success-icon.png",
              // };
              setTimeout(() => {
                this.toSignInpage();
              }, 3000);
             
            } else {
              this.notifier.notify("error", response.message);
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });



    this.loading = true;
    this.errorMessage = null;
  }

  redirect(path){
      this.router.navigate([path]);
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
