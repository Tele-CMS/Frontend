import { element } from "protractor";
import { CommonService } from "src/app/platform/modules/core/services";
import { ActivatedRoute } from "@angular/router";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";

import { Organization } from "./../../clients/client-profile.model";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { StaffExperience } from "src/app/front/doctor-profile/doctor-profile.model";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";

@Component({
  selector: "app-user-experience",
  templateUrl: "./user-experience.component.html",
  styleUrls: ["./user-experience.component.css"],
})
export class UserExperienceComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  experienceForm: FormGroup;
  existingStaffExperience: Array<StaffExperience> = [];
  staffId: string = "";
  submitted: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private commonService: CommonService
  ) {
    this.activatedRoute.queryParams.subscribe((param) => {
      this.staffId = param["id"];
    });
  }

  ngOnInit() {
    const configContols = {
      experience: this.formBuilder.array([]),
    };
    this.experienceForm = this.formBuilder.group(configContols);
    if (this.staffId != "") this.getStaffExperience(this.staffId);
    else this.addExperience();
  }
  get formControls() {
    return this.experienceForm.value;
  }

  get experience() {
    return this.experienceForm.get("experience") as FormArray;
  }
  addExperience() {
    this.addExperienceItem(this.initializeExperienceObject());
  }
  getStaffExperience(id: string) {
    this.usersService.getUserExperience(id).subscribe((response) => {
      this.clearFormControls();
      if (response.data != null && response.data.length > 0) {
        this.existingStaffExperience = response.data;
        response.data.forEach((element) => {
          this.addExperienceItem(element);
        });
      } else {
        this.addExperienceItem(this.initializeExperienceObject());
      }
    });
  }
  initializeExperienceObject(): StaffExperience {
    let exp = new StaffExperience();
    exp.id = "0";
    exp.organizationName = "";
    exp.startDate = null;
    exp.endDate = null;
    exp.isDeleted = false;
    exp.totalExperience = "0";
    return exp;
  }
  addExperienceItem(obj: StaffExperience) {
    // var sDate = ; // format(obj.startDate, "MM/DD/YYYY");
    // var eDate = ; // format(obj.endDate, "MM/DD/YYYY");
    //const control = <FormArray>this.experienceForm.controls["experience"];
    this.experience.push(
      this.formBuilder.group({
        id: obj.id,
        organizationName: obj.organizationName,
        startDate: obj.startDate != null ? new Date(obj.startDate) : null,
        endDate: obj.endDate != null ? new Date(obj.endDate) : null,
        isDeleted: obj.isDeleted,
      })
    );
  }
  removeExperience(index: number) {
    this.experience.removeAt(index);
  }
  clearFormControls() {
    while (this.experience.length !== 0) {
      this.experience.removeAt(0);
    }
  }
  onSubmit() {
    let exp: Array<StaffExperience> = [];
    this.experienceForm.value.experience
      .filter(
        (x) =>
          x.organizationName != null && x.startDate != null && x.endDate != null
      )
      .forEach((element) => {
        if (
          element.organizationName != null &&
          element.startDate != null &&
          element.endDate != null
        ) {
          element.startDate = format(element.startDate, "YYYY-MM-DDTHH:mm:ss"); //new Date(element.startDate);
          element.endDate = format(element.endDate, "YYYY-MM-DDTHH:mm:ss"); // new Date(element.endDate);
          exp.push(element);
        }
      });
    if (this.existingStaffExperience) {
      this.existingStaffExperience.filter((x: StaffExperience) => {
        if (exp.findIndex((y) => y.id == x.id) == -1) {
          x.isDeleted = true;
          exp.push(x);
        }
      });
    }
    let data = {
      staffId: this.staffId,
      staffExperiences: exp,
    };
    this.submitted = true;
    this.usersService
      .saveStaffExperience(data)
      .subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null) {
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            this.clearFormControls();
            this.getStaffExperience(this.staffId);
            this.commonService.isProfileUpdated(Number(this.staffId));
          } else {
            this.notifier.notify("error", response.message);
          }
        }
      });
  }
}
