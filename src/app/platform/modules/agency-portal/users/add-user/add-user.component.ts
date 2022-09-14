import { StaffCareCategoryModel, StaffServices } from "./../users.model";
import {
  Component,
  OnInit,
  ComponentRef,
  Output,
  EventEmitter,
  ElementRef
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import {
  UserModel,
  StaffLocation,
  StaffTags,
  StaffTeam,
  StaffSpeciality,
  StaffTaxonomy
} from "../users.model";
import { UsersService } from "../users.service";
import { NotifierService } from "angular-notifier";
import { ResponseModel } from "../../../core/modals/common-model";
import { UserComponent } from "../user/user.component";
import { createComponent } from "@angular/compiler/src/core";
import { CommonService } from "../../../core/services";
import { Router } from "@angular/router";
import { PasswordValidator } from "../../../../../shared/password-validator";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { format } from "date-fns";
import { RegisterService } from "src/app/front/register/register.service";
import { takeUntil } from "rxjs/operators";
import { ValueSansProvider } from "@angular/core/src/di/provider";
import { AppService } from "src/app/app-service.service";

// export function AgeValidator(
//   control: AbstractControl
// ): { [key: string]: boolean } | null {
//   var selectedDate = new Date(control.value);
//   var today = new Date();
//   var year = today.getFullYear();
//   var month = today.getMonth() + 1;
//   var day = today.getDate();
//   var yy = selectedDate.getFullYear();
//   var mm = selectedDate.getMonth() + 1;
//   var dd = selectedDate.getDate();
//   var years, months, days;
//   // months
//   months = month - mm;
//   if (day < dd) {
//     months = months - 1;
//   }
//   // years
//   years = year - yy;
//   if (month * 100 + day < mm * 100 + dd) {
//     years = years - 1;
//     months = months + 12;
//   }
//   // days
//   days = Math.floor(
//     (today.getTime() - new Date(yy + years, mm + months - 1, dd).getTime()) /
//       (24 * 60 * 60 * 1000)
//   );
//   if (years >= 18) return { age: false };
//   else return { age: true };
//   //
//   //return { years: years, months: months, days: days };
// }
@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"]
})
export class AddUserComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  customPatterns = { "0": { pattern: new RegExp("[a-zA-Z]") } };
  masterStaff: any = [];
  masterLocation: any = [];
  masterRoles: any = [];
  masterCountry: any = [];
  masterGender: any = [];
  masterState: any = [];
  masterDegree: any = [];
  masterTagsForStaff: any = [];
  masterStaffSpecialities: any = [];
  //public masterStaffSpecialities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public testingspeciality: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public duplicatemasterStaffSpecialities: any = [];
  masterProviderCareCategory: any = [];
  masterStaffTaxonomies: any = [];
  masterServices: any = [];
  payrollGroup: any = [];
  defaultLocationList: any = [];
  previousTeam: any = [];
  previousTags: any = [];
  previousSpeciality: Array<StaffSpeciality> = [];
  prvSpeciality:any[]=[];
  previoushealthcareCategory: Array<StaffCareCategoryModel> = [];
  previousTaxonomy: Array<StaffTaxonomy> = [];
  previousServices: Array<StaffServices> = [];
  staffId: number;
  maxDate = new Date();
  userForm: FormGroup;
  userModel: UserModel;
  staffLocation: StaffLocation;
  public searching: boolean = false;
  staffTeam: StaffTeam;
  staffTag: StaffTags;
  staffSpeciality: StaffSpeciality;
  StaffhealthcareCategory:StaffCareCategoryModel;
  staffTaxonomy: StaffTaxonomy;
  staffService: StaffServices;
  submitted: boolean = false;
  dataURL: any;
  imagePreview: any;
  userRoleName: string;
  addEditRolePermission: boolean;
  filterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private route: Router,
    private el: ElementRef,
    private registerService: RegisterService,
    private appService: AppService
  ) {
    if (this.userModel == null) this.userModel = new UserModel();
  }
  ngOnInit() { 
    this.getStaffById();
    this.userForm = this.formBuilder.group(
      {
        firstName: [this.userModel.firstName],
        lastName: [this.userModel.lastName],
        middleName: [this.userModel.middleName],
        address: [this.userModel.address],
        apartmentNumber: [this.userModel.apartmentNumber],
        countryID: [this.userModel.countryID],
        city: [this.userModel.city],
        stateID: [this.userModel.stateID],
        zip: [this.userModel.zip],
        latitude: [this.userModel.latitude],
        longitude: [this.userModel.longitude],
        phoneNumber: [this.userModel.phoneNumber],
        npiNumber: [this.userModel.npiNumber],
        taxId: [this.userModel.taxId],
        dob: [
          this.userModel.dob,
          {
            asyncValidators: [this.validateAge.bind(this)]
          }
        ],
        doj: [this.userModel.doj],
        roleID: [this.userModel.roleID],
        email: [this.userModel.email, [Validators.required, Validators.email]],
        gender: [this.userModel.gender],
        caqhid: [this.userModel.caqhid],
        language: [this.userModel.language],
        degreeID: [this.userModel.degreeID],
        employeeID: [this.userModel.employeeID],
        // payRate: [
        //   this.userModel.payRate,
        //   {
        //     asyncValidators: [this.validatePayRate.bind(this)]
        //   }
        // ],
        // ftFpayRate: [
        //   this.userModel.ftFpayRate,
        //   {
        //     asyncValidators: [this.validatePayRate.bind(this)]
        //   }
        // ],
        payrollGroupID: [this.userModel.payrollGroupID],
        userName: [
          this.userModel.userName,
          {
            validators: [Validators.required],
            asyncValidators: [this.validateUsername.bind(this)],
            updateOn: "blur"
          }
        ],
        password: [
          this.userModel.password,
          [Validators.required, PasswordValidator.strong]
        ],
        confirmPassword: [this.userModel.confirmPassword],
        isRenderingProvider: [this.userModel.isRenderingProvider],
        isUrgentCare: [this.userModel.isUrgentCare],

        // locationIds: [this.userModel.locationIds],
        locationIds: [101],
        staffTeamKeys: [this.userModel.staffTeamKeys],
        staffTagsKeys: [this.userModel.staffTagsKeys],
        staffSpecialityKeys: [this.userModel.staffSpecialityKeys],
        staffCarecategoryKeys: [this.userModel.staffCarecategoryKeys],
        staffTaxonomyKeys: [this.userModel.staffTaxonomyKeys],
        servicesKeys: [this.userModel.servicesKeys],
        // defaultLocation: [this.userModel.defaultLocation],
        defaultLocation: [101],
        aboutMe: [this.userModel.aboutMe],
        userImg: []
      },
      { validator: this.validateForm.bind(this) }





    );

    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {

        this.filterspeciality();
      });

    this.getUserPermissions();
  }
  get formControls() {
    return this.userForm.controls;
  }
  validateUsername(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
    return new Promise(resolve => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve();
      } else {
      if(this.userModel.userName==ctrl.value)
      {
        resolve();
      }
      else{
        let userName = ctrl.value;
        this.registerService
          .checkUserNameExistance(userName)
          .subscribe((response: any) => {
            if (response.statusCode != 200) resolve({ uniqueName: true });
            else resolve();
          });
      }
      }
    });
  }
  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls.password.value;
    let confirmPass = formGroup.controls.confirmPassword.value;

    if (!confirmPass.length) return null;

    return pass && confirmPass && pass === confirmPass
      ? null
      : formGroup.controls.confirmPassword.setErrors({ notSame: true });
  }
  validateAge(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
    return new Promise(resolve => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve();
      } else {
        var selectedDate = new Date(ctrl.value);
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
          (today.getTime() -
            new Date(yy + years, mm + months - 1, dd).getTime()) /
            (24 * 60 * 60 * 1000)
        );
        if (years < 18) resolve({ age: true });
        else resolve();
      }
    });
  }
  // validatePayRate(
  //   ctrl: AbstractControl
  // ): Promise<ValidationErrors | void> | Observable<ValidationErrors | null> {
  //   return new Promise(resolve => {
  //     if (!ctrl.dirty && !ctrl.untouched) {
  //       resolve();
  //     } else {
  //       var payRate = ctrl.value;

  //       if (payRate <= 0) resolve({ rate: true });
  //       else resolve();
  //     }
  //   });
  // }
  getMasterData(value:any,type:any=0) {

    this.prvSpeciality=[];

    if (value && value.length > 0 ) {
      if (type== 0) {
        for (var i = 0; i < value.length; i++)

          this.prvSpeciality.push(value[i].specialityId);
      }
      else {

        for (var i = 0; i < value[0].length; i++)

          this.prvSpeciality.push(value[0][i]);

      }
    }


    this.usersService
      .getMasterData(
        "masterStaff,masterLocation,MASTERROLES,masterCountry,masterGender,masterState,masterDegree,MASTERTAGSFORSTAFF,PAYROLLGROUP,MASTERSPECIALITY,MASTERPROVIDERCARECATEGORY,MASTERTAXONOMY,MASTERSTAFFSERVICE",true,this.prvSpeciality
      )
      .subscribe((response: any) => {
        if (response != null) {
          this.masterStaff = response.staffs != null ? response.staffs : [];
          this.masterLocation =
            response.masterLocation != null ? response.masterLocation : [];
          this.userModel.locationIds.forEach(element => {
            this.defaultLocationList.push(
              this.masterLocation.find(x => x.id == element)
            );
          });
          this.masterRoles =
            response.masterRoles != null ? response.masterRoles : [];
          this.masterCountry =
            response.masterCountry != null ? response.masterCountry : [];
          this.masterGender =
            response.masterGender != null ? response.masterGender : [];
          this.masterState =
            response.masterState != null ? response.masterState : [];
          this.masterDegree =
            response.masterDegree != null ? response.masterDegree : [];
          this.masterTagsForStaff =
            response.masterTagsforStaff != null
              ? response.masterTagsforStaff
              : [];
          this.masterStaffSpecialities =
            response.masterSpeciality != null ? response.masterSpeciality : [];
            this.duplicatemasterStaffSpecialities=this.masterStaffSpecialities
            //this.testingspeciality=this.masterStaffSpecialities

            this.masterProviderCareCategory =
            response.masterprovidercarecategory != null ? response.masterprovidercarecategory : [];
          this.masterStaffTaxonomies =
            response.masterTaxonomy != null ? response.masterTaxonomy : [];
          this.payrollGroup =
            response.payrollGroup != null ? response.payrollGroup : [];
          this.masterServices =
            response.masterStaffServices != null
              ? response.masterStaffServices
              : [];
        }
      });
  }
  updateLocationList() {
    this.defaultLocationList = [];
    if (this.masterLocation != null && this.masterLocation.length > 0) {
      this.userForm.controls.locationIds.value.forEach(element => {
        this.defaultLocationList.push(
          this.masterLocation.find(x => x.id == element)
        );
      });
    }
    if (
      !this.userForm.controls.locationIds.value.includes(
        this.userForm.controls.defaultLocation.value
      )
    ) {
      this.userForm.patchValue({ defaultLocation: null });
    }
  }

  getStaffById() { 

    this.usersService
      .getStaffById(this.staffId)
      .subscribe((response: ResponseModel) => { 
        
        if (response != null && response.statusCode == 200) {
          this.userModel = response.data;
          this.previousTeam = response.data.staffTeamList;
          this.previousTags = response.data.staffTagsModel;
          this.previousSpeciality = response.data.staffSpecialityModel;
          this.previoushealthcareCategory=response.data.staffCareCategoryModel; 
          
          this.previousTaxonomy = response.data.staffTaxonomyModel;
          this.previousServices = response.data.staffServicesModels;
          //this.getMasterData(response.data.staffSpecialityModel);
          this.userModel.locationIds =
            response.data.staffLocationList != null &&
            response.data.staffLocationList.length > 0
              ? response.data.staffLocationList.map(({ id }) => id)
              : [];
          this.userModel.defaultLocation =
            response.data.staffLocationList != null &&
            response.data.staffLocationList.length > 0
              ? response.data.staffLocationList.find(z => z.isDefault == true)
                  .id
              : null;
          this.userModel.staffTeamKeys =
            response.data.staffTeamList != null &&
            response.data.staffTeamList.length > 0
              ? response.data.staffTeamList.map(
                  ({ staffteamid }) => staffteamid
                )
              : [];
          this.userModel.staffTagsKeys =
            response.data.staffTagsModel != null &&
            response.data.staffTagsModel.length > 0
              ? response.data.staffTagsModel.map(({ tagID }) => tagID)
              : [];
          this.userModel.staffSpecialityKeys =
            response.data.staffSpecialityModel != null &&
            response.data.staffSpecialityModel.length > 0
              ? response.data.staffSpecialityModel.map(
                  ({ specialityId }) => specialityId
                )
              : [];

              this.userModel.staffCarecategoryKeys =
            response.data.staffCareCategoryModel != null &&
            response.data.staffCareCategoryModel.length > 0
              ? response.data.staffCareCategoryModel.map(
                  ({ healthcarecategoryID }) => healthcarecategoryID
                )
              : [];

          this.userModel.staffTaxonomyKeys =
            response.data.staffTaxonomyModel != null &&
            response.data.staffTaxonomyModel.length > 0
              ? response.data.staffTaxonomyModel.map(
                  ({ taxonomyId }) => taxonomyId
                )
              : [];

          this.userModel.servicesKeys =
            response.data.staffServicesModels != null &&
            response.data.staffServicesModels.length > 0
              ? response.data.staffServicesModels.map(
                  ({ serviceId }) => +serviceId
                )
              : [];
          this.userModel.confirmPassword = response.data.password;
          this.imagePreview = this.userModel.photoThumbnailPath;
          this.userRoleName = this.userModel.roleName;
          this.userForm.patchValue(this.userModel);

          this.getMasterData(response.data.staffSpecialityModel);
        }
        else
        {
          this.getMasterData(null);
        }
      });
  }
  selectChange(evt:any)
  {
   this.prvSpeciality=[];
    this.prvSpeciality.push(evt);
    this.getMasterData(this.prvSpeciality,1)
  }


  handleImageChange(e) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.imagePreview = this.dataURL;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
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
    this.userForm.patchValue(pObJ);
    // Do some stuff
  }
  onSubmit(event: any) {  
    for (const key of Object.keys(this.userForm.controls)) {
      if (this.userForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        if (invalidControl != null) {
          invalidControl.focus();
          break;
        }
      }
    }
    if (!this.userForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      let formValues = this.userForm.value;
      this.userModel = formValues;
      this.userModel.id = this.staffId;
      this.userModel.photoBase64 = this.dataURL;
      this.userModel.staffTeamList = new Array<StaffTeam>();
      this.userModel.staffLocationList = new Array<StaffLocation>();
      this.userModel.staffTagsModel = new Array<StaffTags>();
      this.userModel.staffSpecialityModel = new Array<StaffSpeciality>();
      this.userModel.StaffCareCategoryModel = new Array<StaffCareCategoryModel>();
      this.userModel.staffTaxonomyModel = new Array<StaffTaxonomy>();
      this.userModel.staffServicesModels = new Array<StaffServices>();
      this.userModel.dob = format(this.userModel.dob, "YYYY-MM-DDTHH:mm:ss"); //new Date(this.userModel.dob);
      this.userModel.doj = format(this.userModel.doj, "YYYY-MM-DDTHH:mm:ss"); //new Date(this.userModel.dob);

      // formValues.locationIds != undefined &&
      //   formValues.locationIds.forEach(element => {
      //     this.staffLocation = new StaffLocation();
      //     this.staffLocation.id = element;
      //     this.staffLocation.isDefault =
      //       formValues.defaultLocation == element ? true : false;
      //     this.userModel.staffLocationList.push(this.staffLocation);
      //   });

      if(formValues.locationIds != undefined && formValues.locationIds != null)
      {
      if (this.staffId == null || this.staffId == 0 ) {
        this.staffLocation = new StaffLocation();
        this.staffLocation.id = formValues.locationIds;
        this.staffLocation.isDefault =
          formValues.defaultLocation == formValues.locationIds ? true : false;
        this.userModel.staffLocationList.push(this.staffLocation);
      }
      else {
        formValues.locationIds.forEach(element => {
            this.staffLocation = new StaffLocation();
            this.staffLocation.id = element;
            this.staffLocation.isDefault =
              formValues.defaultLocation == element ? true : false;
            this.userModel.staffLocationList.push(this.staffLocation);
          });
      }
      }

      formValues.staffTeamKeys != null &&
        formValues.staffTeamKeys.forEach(element => {
          this.staffTeam = new StaffTeam();
          this.staffTeam.staffteamid = element;
          this.userModel.staffTeamList.push(this.staffTeam);
        });
      formValues.staffTagsKeys != null &&
        formValues.staffTagsKeys.forEach(element => {
          let pStaffTag =
            this.previousTags != null &&
            this.previousTags.find(x => x.tagID == element);
          this.staffTag = new StaffTags();
          this.staffTag.tagID = element;
          this.staffTag.id =
            pStaffTag != null && pStaffTag.id > 0 ? pStaffTag.id : null;
          this.staffTag.staffID =
            pStaffTag != null && pStaffTag.staffID > 0
              ? pStaffTag.staffID
              : this.staffId;
          this.userModel.staffTagsModel.push(this.staffTag);
        });
      this.previousTags != null &&
        this.previousTags.forEach(x => {
          if (
            this.userModel.staffTagsModel.findIndex(y => y.tagID == x.tagID) ==
            -1
          ) {
            x.isDeleted = true;
            this.userModel.staffTagsModel.push(x);
          }
        });
      this.previousTeam != null &&
        this.previousTeam.forEach(x => {
          if (
            this.userModel.staffLocationList.findIndex(y => y.id == x.id) == -1
          ) {
            x.isDeleted = true;
            this.userModel.staffTeamList.push(x);
          }
        });

      formValues.staffSpecialityKeys != null &&
        formValues.staffSpecialityKeys.forEach(element => {
          this.staffSpeciality = new StaffSpeciality();
          this.staffSpeciality.specialityID = element;
          this.userModel.staffSpecialityModel.push(this.staffSpeciality);
        });
        
      this.previousSpeciality != null &&
        this.previousSpeciality.forEach(x => {
          //let i=this.userModel.staffSpecialityModel.findIndex(y => (y.specialityID == x.specialityID));
          if (
            this.userModel.staffSpecialityModel.findIndex(
              y => +y.specialityID == +x.specialityID
            ) == -1
          ) {
            x.isDeleted = true;
            this.userModel.staffSpecialityModel.push(x);
          }
        });

        formValues.staffCarecategoryKeys != null &&
        formValues.staffCarecategoryKeys.forEach(element => {
          this.StaffhealthcareCategory = new StaffCareCategoryModel();
          this.StaffhealthcareCategory.healthcarecategoryID = element;
          this.userModel.StaffCareCategoryModel.push(this.StaffhealthcareCategory);
        });
      this.previoushealthcareCategory != null &&
        this.previoushealthcareCategory.forEach(x => {
          //let i=this.userModel.staffSpecialityModel.findIndex(y => (y.specialityID == x.specialityID));
          if (
            this.userModel.StaffCareCategoryModel.findIndex(
              y => +y.healthcarecategoryID == +x.healthcarecategoryID
            ) == -1
          ) {
            x.isDeleted = true;
            this.userModel.StaffCareCategoryModel.push(x);
          }
        });
 
      formValues.staffTaxonomyKeys != null &&
        formValues.staffTaxonomyKeys.forEach(element => {
          this.staffTaxonomy = new StaffTaxonomy();
          this.staffTaxonomy.taxonomyID = element;
          this.userModel.staffTaxonomyModel.push(this.staffTaxonomy);
        });
      this.previousTaxonomy != null &&
        this.previousTaxonomy.forEach(x => {
          //let i=this.userModel.staffSpecialityModel.findIndex(y => (y.specialityID == x.specialityID));
          if (
            this.userModel.staffTaxonomyModel.findIndex(
              y => +y.taxonomyID == +x.taxonomyID
            ) == -1
          ) {
            x.isDeleted = true;
            this.userModel.staffTaxonomyModel.push(x);
          }
        });
      formValues.servicesKeys != null &&
        formValues.servicesKeys.forEach(element => {
          this.staffService = new StaffServices();
          this.staffService.serviceId = element;
          this.userModel.staffServicesModels.push(this.staffService);
        });
      this.previousServices != null &&
        this.previousServices.forEach(x => {
          //let i=this.userModel.staffSpecialityModel.findIndex(y => (y.specialityID == x.specialityID));
          if (
            this.userModel.servicesKeys.findIndex(
              y => +y.serviceId == +x.serviceId
            ) == -1
          ) {
            x.isDeleted = true;
            this.userModel.staffServicesModels.push(x);
          }
        });
      this.submitted = true; 
      this.usersService.create(this.userModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.staffId = response.data.id;
          // this.commonService.initializeAuthData();
          this.route.navigate(["web/manage-users/user"], {
            queryParams: {
              id: this.commonService.encryptValue(this.staffId, true)
            }
          });
          this.notifier.notify("success", response.message);
          this.getStaffById();
          this.commonService.isProfileUpdated(this.staffId);
          if (clickType == "SaveContinue")
            this.handleTabChange.next({
              tab: "Availability",    //"Custom Fields",
              id: response.data.id
            });
        } else {
          this.notifier.notify("error", response.message);
        }
      });
    }
  }

  getUserPermissions() {
    const actionPermissions = this.usersService.getUserScreenActionPermissions(
      "USER",
      "USER_ADD"
    );
    const { USER_ADD_EDIT_USER_ROLE } = actionPermissions;

    this.addEditRolePermission = USER_ADD_EDIT_USER_ROLE || false;
  }

  normalizeMobile(value, previousValue): any {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!previousValue || value.length > previousValue.length) {
      // typing forward
      if (onlyNums.length === 3) {
        return onlyNums + " ";
      }
      if (onlyNums.length === 6) {
        return "(" + onlyNums.slice(0, 3) + ") " + onlyNums.slice(3) + "-";
      }
    }
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    if (onlyNums.length <= 6) {
      return "(" + onlyNums.slice(0, 3) + ") " + onlyNums.slice(3);
    }
    return (
      "(" +
      onlyNums.slice(0, 3) +
      ") " +
      onlyNums.slice(3, 6) +
      "-" +
      onlyNums.slice(6, 10)
    );
  }

  normalizeSSN(value, previousValue): any {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!previousValue || value.length > previousValue.length) {
      // typing forward
      if (onlyNums.length === 3) {
        return onlyNums + "-";
      }
      if (onlyNums.length === 6) {
        return onlyNums.slice(0, 3) + "-" + onlyNums.slice(3) + "-";
      }
    }
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    if (onlyNums.length <= 6) {
      return onlyNums.slice(0, 3) + "-" + onlyNums.slice(3);
    }
    return (
      onlyNums.slice(0, 3) +
      "-" +
      onlyNums.slice(3, 5) +
      "-" +
      onlyNums.slice(5, 9)
    );
  }

  normalizeFax(value, previousValue): any {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!previousValue || value.length > previousValue.length) {
      // typing forward
      if (onlyNums.length === 3) {
        return onlyNums + " ";
      }
      if (onlyNums.length === 6) {
        return "(" + onlyNums.slice(0, 3) + ") " + onlyNums.slice(3) + "-";
      }
    }
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    if (onlyNums.length <= 6) {
      return "(" + onlyNums.slice(0, 3) + ") " + onlyNums.slice(3);
    }
    return (
      "(" +
      onlyNums.slice(0, 3) +
      ") " +
      onlyNums.slice(3, 6) +
      "-" +
      onlyNums.slice(6, 13)
    );
  }

  normalizeZipCode(value, previousValue): any {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!previousValue || value.length > previousValue.length) {
      // typing forward 12345-1234
      if (onlyNums.length < 5) {
        return onlyNums;
      }
      if (onlyNums.length === 5) {
        return onlyNums.slice(0, 5);
      }
      if (onlyNums.length > 5) {
        return onlyNums.slice(0, 5) + "-" + onlyNums.slice(5);
      }
    }
    if (onlyNums.length < 5) {
      return onlyNums;
    }
    if (onlyNums.length > 5) {
      return onlyNums.slice(0, 5) + "-" + onlyNums.slice(5);
    }
    if (onlyNums.length === 5) {
      return onlyNums.slice(0, 5);
    }
  }

  normalizeRate(value, previousValue): any {
    if (!value) {
      return value;
    }
    if (parseFloat(value) === 0) {
      return "";
    }
    const onlyNums = value.replace(/[^\d]/g, "");

    if (!previousValue || value.length > previousValue.length) {
      // typing forward 12345-1234
      if (onlyNums.length > 0) {
        if (onlyNums.length === 2) {
          if (value.indexOf(".") === onlyNums.length - 1) {
            return "00." + onlyNums.slice(1) + "0";
          }
          return onlyNums + ".00";
        } else if (onlyNums.length === 1) {
          return "00.0" + onlyNums;
        } else if (onlyNums.length === 3) {
          if (previousValue.length > value.length) {
            return onlyNums.slice(0, 2) + "." + onlyNums.slice(2);
          } else if (onlyNums[onlyNums.length - 1] === "0") {
            return "00." + onlyNums.slice(0, 2);
          }
          return (
            "0" +
            onlyNums.slice(0, onlyNums.length - 2) +
            "." +
            onlyNums.slice(onlyNums.length - 2)
          );
        } else if (onlyNums.length === 4) {
          return (
            onlyNums.slice(0, onlyNums.length - 2) +
            "." +
            onlyNums.slice(onlyNums.length - 2)
          );
        } else if (onlyNums.length === 5) {
          if (onlyNums[0] === "0") {
            return (
              onlyNums.slice(1, onlyNums.length - 2) +
              "." +
              onlyNums.slice(onlyNums.length - 2)
            );
          } else
            return (
              onlyNums.slice(0, onlyNums.length - 2) +
              "." +
              onlyNums.slice(onlyNums.length - 2)
            );
        } else if (onlyNums.length > 5) {
          return (
            onlyNums.slice(0, onlyNums.length - 2) +
            "." +
            onlyNums.slice(onlyNums.length - 2)
          );
        }
      } else {
        return null;
      }
    } else {
      // tabbing backspace

      if (onlyNums.length > 0) {
        if (onlyNums.length === 2) {
          if (value.indexOf(".") === onlyNums.length - 1) {
            return "00." + onlyNums.slice(1) + "0";
          }
          if (value.indexOf(".") === onlyNums.length) {
            return "00." + onlyNums;
          }
          return onlyNums + ".00";
        } else if (onlyNums.length === 1) {
          return "0" + onlyNums + ".00";
        } else if (onlyNums.length === 3) {
          if (value.indexOf(".") === onlyNums.length - 1) {
            if (previousValue.length > value.length) {
              return onlyNums.slice(0, 2) + "." + onlyNums.slice(2);
            } else if (onlyNums[onlyNums.length - 1] === "0") {
              return "00." + onlyNums.slice(0, 2);
            } else {
              return onlyNums.slice(0, 2) + "." + onlyNums.slice(2) + "0";
            }
          } else
            return (
              "0" +
              onlyNums.slice(0, onlyNums.length - 2) +
              "." +
              onlyNums.slice(onlyNums.length - 2)
            );
        } else if (onlyNums.length === 4) {
          if (value.indexOf(".") === -1) {
            return onlyNums + ".00";
          }
          return (
            onlyNums.slice(0, onlyNums.length - 2) +
            "." +
            onlyNums.slice(onlyNums.length - 2)
          );
        } else if (onlyNums.length > 4) {
          if (value.indexOf(".") !== -1) {
            if (value.indexOf(".") === onlyNums.length - 1) {
              if (previousValue.length > value.length) {
                return (
                  onlyNums.slice(0, value.indexOf(".") - 1) +
                  "." +
                  onlyNums.slice(value.indexOf(".") - 1)
                );
              } else
                return (
                  onlyNums.slice(0, value.indexOf(".")) +
                  "." +
                  onlyNums.slice(value.indexOf(".")) +
                  "0"
                );
            } else
              return (
                onlyNums.slice(0, value.indexOf(".")) +
                "." +
                onlyNums.slice(value.indexOf("."))
              );
          } else {
            return onlyNums + ".00";
          }
        }
      } else {
        return null;
      }
    }

    // return onlyNums.slice(0, 5) + '-' + onlyNums.slice(5);
  }


  protected filterspeciality() {

    // if (!this.banks) {
    //   return;
    // }
    // get the search keyword
    let search = this.filterCtrl.value;
    if(search.length>2)
    {
      search = search.toLowerCase();

    // if (!search) {
    //   this.filteredBanksMulti.next(this.banks.slice());
    //   return;
    // } else {
    //   search = search.toLowerCase();
    // }
    // filter the banks
    this.testingspeciality.next(
      this.duplicatemasterStaffSpecialities.filter(bank => bank.value.toLowerCase().indexOf(search) > -1)
    );
    }

  }

  goBack(event:any){
    event.preventDefault();
    this.route.navigateByUrl('/web/manage-users/users');
  }
}
