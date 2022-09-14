import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { ManageAgencyModel } from "src/app/super-admin-portal/manage-agency/manage-agency.model";
import { AgencyRegistrationService } from "./agency-registration.service";
import { ManageAgencyService } from "./manage-agency.service";
import { NPINUmberVerificationModel } from "./agency-registration.model";
import { CommonService } from "../../core/services";
import { UsersService } from "../../agency-portal/users/users.service";

@Component({
  selector: "app-agency-registration",
  templateUrl: "./agency-registration.component.html",
  styleUrls: ["./agency-registration.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AgencyRegistrationComponent implements OnInit {
  //export class RegistrationComponent  {
  loading = false;
  submitted = false;
  userType: string = "";
  isNPIVerified: boolean = false;
  isAccountTypeSelected: boolean = false;
  isBusinessDetailsSelected: boolean = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  isLinear = true;
  activeIndex = null;
  isPersonalAccount: boolean = null;
  teamSize: any = [];
  teamSizeSelected: any = null;
  FaviconBase64: any;
  LogoBase64: any;
  agencyModel: ManageAgencyModel;
  isSubmitted: boolean = false;
  ipAddress: any;
  npiNumberVerificationModel: NPINUmberVerificationModel;
  currentOrganizationDetails: any;
  accountType: any = [];
  previousNPI: any;
  nPINumber: any;
  masterCountry: any = [];
  masterState: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private notifier: NotifierService,
    private agencyRegistrationService: AgencyRegistrationService,
    private agencyService: ManageAgencyService,
    private commonService: CommonService,
    private usersService: UsersService
  ) {
    // if(this.route.snapshot.url[0].path == "client-signup"){
    //     this.isPatient = true;
    // } else if(this.route.snapshot.url[0].path == "provider-signup") {
    //     this.isProvider = true;
    //     this.maxDate.setFullYear(this.maxDate.getFullYear() -18)
    // }
    // //this.userModel = new UserModel();

    this.teamSize = ["1-1", "2-10", "10-50", "50+"];
    this.accountType = [
      // {imagePath: "../../../../../assets/img/personal-account.png", heading: 'Personal Account', content: 'If you need for info, please check it out', isPersonal: true},
      // {imagePath: "../../../../../assets/img/corporate-account.png", heading: 'Corporate Account', content: 'Create corporate account to mane user', isPersonal: false}
      {imagePath: "../../../../../assets/img/patient-default-user.svg", heading: 'Personal Account', content: 'If you need for info, please check it out', isPersonal: true},
      {imagePath: "../../../../../assets/img/provider-default-user.svg", heading: 'Corporate Account', content: 'Create corporate account to mane user', isPersonal: false}
    ];
    this.agencyModel = new ManageAgencyModel();
  }

  ngOnInit() {
    this.getMasterData()
    this.agencyRegistrationService.sytemInfo.subscribe((obj) => {
      this.ipAddress = obj.ipAddress;
    });

    //  if(this.isPatient)
    //   this.authenticationService.updateSideScreenImgSrc("../../../../../assets/signup-patient.jpg");
    //   else if(this.isProvider)
    //   this.authenticationService.updateSideScreenImgSrc("../../../../../assets/signup-doc.jpg")

    // this.firstFormGroup = this.formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    // this.secondFormGroup = this.formBuilder.group({
    //   organizationName: ['', Validators.required]
    // });
    this.firstFormGroup = this.formBuilder.group({
      npiNumber: ["", Validators.required],
    });
    this.thirdFormGroup = this.formBuilder.group({
      organizationName: ["", Validators.required],
      description: ["", Validators.required],
      address: ["", Validators.required],
      apartmentNumber: ["", Validators.required],
      countryID: ["", Validators.required],
      stateID: ["", Validators.required],
      latitude: [""],
      longitude: [""],
      city: ["", Validators.required],
      zip: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", [Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$')]],
      fax: ["", Validators.required],
    });

    this.fourthFormGroup = this.formBuilder.group({
      contactPersonFirstName: ["", Validators.required],
      contactPersonMiddleName: [""],
      contactPersonLastName: ["", Validators.required],
      contactPersonPhoneNumber: ["", Validators.required],
      contactPersonEmail: ["", [Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$')]]
    });

    if(this.thirdFormGroup.valid){
      this.isBusinessDetailsSelected = true;
    }
  }

  onUserAccountTypeSelected(index: any, isPersonalAccount: any) {
    this.isAccountTypeSelected = true;
    this.activeIndex = index;
    this.isPersonalAccount = isPersonalAccount;
  }

  // onTeamSizeSelected(index: any, teamSize: any) {
  //   this.activeIndex = index;
  //   this.teamSizeSelected = teamSize;
  // }

  get f() {
    return this.fourthFormGroup.controls;
  }

  get formControls() {
    return this.thirdFormGroup.controls;
  }

  get formControl() {
    return this.firstFormGroup.controls;
  }

  // validateForm(formGroup: FormGroup) {
  //   let pass = formGroup.controls.password.value;
  //   let confirmPass = formGroup.controls.confirmPassword.value;

  //   if (!confirmPass.length) return null;
  //   return pass && confirmPass && pass === confirmPass
  //     ? null
  //     : formGroup.controls.confirmPassword.setErrors({ notSame: true });
  // }

  toSignInpage() {
    this.redirect("/web/login");

    // if(this.isPatient){
    //     this.redirect('/web/client-login');
    // } else if(this.isProvider){
    //         this.redirect('/web/login');
    // }
    // else{

    // }
  }

  // onSubmit(){

  //   this.submitted = true;
  //   this.f.email.setValue(this.f.username.value);
  //   // stop here if form is invalid
  //   if (this.registrationForm.invalid) {
  //     return;
  //   }

  //     this.registerService
  //       .registerNewUserWithoutToken(this.registrationForm.value)
  //       .subscribe((response: ResponseModel) => {

  //         this.submitted = false;
  //         if (response != null) {
  //           if (response.statusCode == 200) {

  //             this.isTokenValid = false;
  //             this.notifier.notify('success',"Thank you, Your account has been successfully created with us, please contact administation for further assistance.");
  //             // this.Message = {
  //             //   title: "Success!",
  //             //   message:
  //             //     "Thank you, Your account has been successfully created with us, please contact administation for further assistance.",
  //             //   imgSrc: "../assets/img/user-success-icon.png",
  //             // };
  //             setTimeout(() => {
  //               this.toSignInpage();
  //             }, 3000);

  //           } else {
  //             this.notifier.notify("error", response.message);
  //           }
  //         } else {
  //           this.notifier.notify("error", response.message);
  //         }
  //       });

  //   this.loading = true;
  //   this.errorMessage = null;
  // }

  redirect(path) {
    this.router.navigate([path]);
  }
  // opentermconditionmodal() {
  //   let dbModal;
  //   dbModal = this.dialogModal.open(TermsConditionModalComponent, {
  //     hasBackdrop: true,
  //     width:'70%'
  //   });
  //   dbModal.afterClosed().subscribe((result: string) => {
  //     if (result != null && result != "close") {

  //     }
  //   });
  // }

  //verifyNPINumber(){
  // this.isNPIVerified = true;
  //}

  onSubmit() {
    if (
      this.firstFormGroup.invalid ||
      this.thirdFormGroup.invalid ||
      this.fourthFormGroup.invalid
    ) {
      return;
    }

    if(this.isNPIVerified && this.previousNPI.trim() !== this.nPINumber.trim()){
      this.notifier.notify("error", "Please verify your NPI number first");
      return;
    }

    this.submitted = true;
    this.agencyModel = this.thirdFormGroup.value;
    this.agencyModel.address1 =
      this.thirdFormGroup.value.address;
    this.agencyModel.contactPersonFirstName =
      this.fourthFormGroup.value.contactPersonFirstName;
    this.agencyModel.contactPersonMiddleName =
      this.fourthFormGroup.value.contactPersonMiddleName;
    this.agencyModel.contactPersonLastName =
      this.fourthFormGroup.value.contactPersonLastName;
    this.agencyModel.contactPersonPhoneNumber =
      this.fourthFormGroup.value.contactPersonPhoneNumber;
    this.agencyModel.contactPersonEmail =
      this.fourthFormGroup.value.contactPersonEmail;
      this.agencyModel.businessName =
      this.currentOrganizationDetails.businessName;
      this.agencyModel.databaseDetailId = this.currentOrganizationDetails.databaseDetailId;
      this.agencyModel.isPersonalAccount = this.isPersonalAccount;
      this.agencyModel.organizationSMTPDetail = this.currentOrganizationDetails.organizationSMTPDetail;
      this.agencyModel.preOrganizationID = this.currentOrganizationDetails.preOrganizationID;
      this.agencyModel.nPINumber = this.firstFormGroup.value.npiNumber;

    const formData = {
      ...this.agencyModel,
      FaviconBase64: this.FaviconBase64,
      LogoBase64: this.LogoBase64,
    };

    this.agencyService.save(formData).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify("success", response.message);
        this.router.navigateByUrl("web/signup-selection");
      } else {
        this.notifier.notify("error", response.message);
      }
    });
  }
  handleImageChange(e, type: string) {
    if (
      this.agencyRegistrationService.isValidFileType(
        e.target.files[0].name,
        "image"
      )
    ) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        if (type == "logo") {
          this.LogoBase64 = reader.result;
        } else {
          this.FaviconBase64 = reader.result;
        }
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
  }
  getMasterData() {
    this.usersService
      .getMasterData(
        "masterStaff,masterLocation,MASTERROLES,masterCountry,masterGender,masterState,masterDegree,MASTERTAGSFORSTAFF,PAYROLLGROUP,MASTERSPECIALITY,MASTERPROVIDERCARECATEGORY,MASTERTAXONOMY,MASTERSTAFFSERVICE",true
      )
      .subscribe((response: any) => {
        if (response != null) {
          this.masterCountry =
            response.masterCountry != null ? response.masterCountry : [];

          this.masterState =
            response.masterState != null ? response.masterState : [];

        }
      });
  }
  public handleAddressChange(addressObj: any) {
    const pObJ = {
      address: addressObj.address1,
      countryID:
        this.masterCountry.find(
          x => x.value.toUpperCase() == (addressObj.country || "").toUpperCase()
        ) == null
          ? null
          : this.masterCountry.find(
              x =>
                x.value.toUpperCase() ==
                (addressObj.country || "").toUpperCase()
            ).id,
      city: addressObj.city,
      stateID:
        this.masterState.find(
          y =>
            (y.stateAbbr || "").toUpperCase() ==
            (addressObj.state || "").toUpperCase()
        ) == null
          ? null
          : this.masterState.find(
              y =>
                (y.stateAbbr || "").toUpperCase() ==
                (addressObj.state || "").toUpperCase()
            ).id,
      zip: addressObj.zip,
      latitude: addressObj.latitude,
      longitude: addressObj.longitude
    };
    this.thirdFormGroup.patchValue(pObJ);
    // Do some stuff
  }
  validateNPI(){
    if(this.firstFormGroup.value.npiNumber.length == 10){
      this.nPINumber = this.firstFormGroup.value.npiNumber;
      if(this.isNPIVerified && this.previousNPI != this.nPINumber){
        this.isNPIVerified = false;
      }
    }
  }

  verifyNPINUmbers() {
    var sjWT = this.agencyRegistrationService.createJWTToken();
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.submitted = true;
    this.commonService.loadingStateSubject.next(true);
    this.nPINumber = this.firstFormGroup.value.npiNumber;
    const data = {
      jwtToken: sjWT,
      nPINumber: this.firstFormGroup.value.npiNumber,
    };
    if(!this.isNPIVerified){
      this.previousNPI = this.nPINumber;
    }
    // this.npiNumberVerificationModel.jwt_token = sjWT;
    // this.npiNumberVerificationModel.npi_number = this.firstFormGroup.value.organizationName;
    console.log("this ", data);
    this.agencyRegistrationService
      .verifyNpiMuber(data)
      .subscribe((response: any) => {
        this.submitted = false;
        this.commonService.loadingStateSubject.next(false);
        if (response && response.data) {
          if (response.statusCode == 200) {
            this.isNPIVerified = true;
            this.notifier.notify("success", response.message);
            this.currentOrganizationDetails = response.data;
          } else {
            this.notifier.notify("error", response.message);
          }
        }
      });
  }

  goBackTOSignupSelection(event: any) {
    event.preventDefault();
    this.router.navigateByUrl("web/login");
  }
}
