import { CommonService } from "src/app/platform/modules/core/services";
import { StaffAward } from "src/app/front/doctor-profile/doctor-profile.model";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { Organization } from "./../../clients/client-profile.model";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
// import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
// import {
//   AppDateAdapter,
//   APP_DATE_FORMATS
// } from "src/app/shared/adapter/date.adapter";

@Component({
  selector: "app-user-award",
  templateUrl: "./user-award.component.html",
  styleUrls: ["./user-award.component.css"],
})
export class UserAwardComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  awardForm: FormGroup;
  existingStaffAward: Array<StaffAward> = [];
  staffId: string = "";
  submitted: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe((param) => {
      this.staffId = param["id"];
    });
  }

  ngOnInit() {
    const configContols = {
      award: this.formBuilder.array([]),
    };
    this.awardForm = this.formBuilder.group(configContols);
    if (this.staffId != "") this.getStaffAward(this.staffId);
    else this.addAward();
  }
  get formControls() {
    return this.awardForm.value;
  }

  get award() {
    return this.awardForm.get("award") as FormArray;
  }
  addAward() {
    this.addAwardItem(this.initializeAwardObject());
  }
  getStaffAward(id: string) {
    this.usersService.getUserAward(id).subscribe((response) => {
      this.clearFormControls();
      if (response.data != null && response.data.length > 0) {
        this.existingStaffAward = response.data;
        response.data.forEach((element) => {
          this.addAwardItem(element);
        });
      } else {
        this.addAwardItem(this.initializeAwardObject());
      }
    });
  }
  initializeAwardObject(): StaffAward {
    let exp = new StaffAward();
    exp.id = "0";
    exp.awardType = null;
    exp.description = null;
    exp.awardDate = null;
    exp.isDeleted = false;
    return exp;
  }
  addAwardItem(obj: StaffAward) {
    this.award.push(
      this.formBuilder.group({
        id: obj.id,
        awardType: obj.awardType,
        description: obj.description,
        awardDate: obj.awardDate != null ? new Date(obj.awardDate) : null,
        isDeleted: obj.isDeleted,
      })
    );
  }
  removeAward(index: number) {
    this.award.removeAt(index);
  }
  clearFormControls() {
    while (this.award.length !== 0) {
      this.award.removeAt(0);
    }
  }
  onSubmit() {
    let awd: Array<StaffAward> = [];
    this.awardForm.value.award
      .filter(
        (x) =>
          x.awardType != null && x.description != null && x.awardDate != null
      )
      .forEach((element) => {
        if (
          element.awardType != null &&
          element.description != null &&
          element.awardDate != null
        ) {
          element.awardDate = format(element.awardDate, "YYYY-MM-DDTHH:mm:ss");
          awd.push(element);
        }
      });
    if (this.existingStaffAward) {
      this.existingStaffAward.filter((x: StaffAward) => {
        if (awd.findIndex((y) => y.id == x.id) == -1) {
          x.isDeleted = true;
          awd.push(x);
        }
      });
    }
    let data = {
      staffId: this.staffId,
      staffAward: awd,
    };
    this.submitted = true;
    this.usersService
      .saveStaffAward(data)
      .subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null) {
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            this.clearFormControls();
            this.getStaffAward(this.staffId);

            this.commonService.isProfileUpdated(Number(this.staffId));
            this.router.navigate(["/"]);
          } else {
            this.notifier.notify("error", response.message);
          }
        }
      });
  }
}
