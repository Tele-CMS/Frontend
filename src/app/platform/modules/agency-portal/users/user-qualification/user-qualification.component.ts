import { CommonService } from "src/app/platform/modules/core/services";
import { StaffQualification } from "./../../../../../front/doctor-profile/doctor-profile.model";
import { ActivatedRoute } from "@angular/router";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { Organization } from "./../../clients/client-profile.model";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";

@Component({
  selector: "app-user-qualification",
  templateUrl: "./user-qualification.component.html",
  styleUrls: ["./user-qualification.component.css"]
})
export class UserQualificationComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  qualificationForm: FormGroup;
  existingStaffQualificationForm: Array<StaffQualification> = [];
  staffId: string = "";
  submitted: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private commonService: CommonService
  ) {
    this.activatedRoute.queryParams.subscribe(param => {
      this.staffId = param["id"];
    });
  }

  ngOnInit() {
    const configContols = {
      qualification: this.formBuilder.array([])
    };
    this.qualificationForm = this.formBuilder.group(configContols);
    if (this.staffId != "") this.getStaffQualification(this.staffId);
    else this.addQualification();
  }
  get formControls() {
    return this.qualificationForm.value;
  }

  get qualification() {
    return this.qualificationForm.get("qualification") as FormArray;
  }
  addQualification() {
    this.addQualificationItem(this.initializeQualificationObject());
  }
  getStaffQualification(id: string) {
    this.usersService.getUserQualification(id).subscribe(response => {
      this.clearFormControls();
      if (response.data != null && response.data.length > 0) {
        this.existingStaffQualificationForm = response.data;
        response.data.forEach(element => {
          this.addQualificationItem(element);
        });
      } else {
        this.addQualificationItem(this.initializeQualificationObject());
      }
    });
  }
  initializeQualificationObject(): StaffQualification {
    let qualification = new StaffQualification();
    qualification.id = "0";
    qualification.course = "";
    qualification.university = "";
    qualification.startDate = null;
    qualification.endDate = null;
    qualification.isDeleted = false;
    return qualification;
  }
  addQualificationItem(obj: StaffQualification) {
    this.qualification.push(
      this.formBuilder.group({
        id: obj.id,
        course: obj.course,
        university: obj.university,
        startDate: obj.startDate != null ? new Date(obj.startDate) : null,
        endDate: obj.endDate != null ? new Date(obj.endDate) : null,
        isDeleted: obj.isDeleted
      })
    );
  }
  removeQualification(index: number) {
    this.qualification.removeAt(index);
  }
  clearFormControls() {
    while (this.qualification.length !== 0) {
      this.qualification.removeAt(0);
    }
  }
  onSubmit() {
    let qual: Array<StaffQualification> = [];
    this.qualificationForm.value.qualification
      .filter(
        x =>
          x.course != null &&
          x.university != null &&
          x.startDate != null &&
          x.endDate != null
      )
      .forEach(element => {
        if (
          element.course != null &&
          element.university != null &&
          element.startDate != null &&
          element.endDate != null
        ) {
          element.startDate = format(element.startDate, "YYYY-MM-DDTHH:mm:ss"); // new Date(element.startDate);
          element.endDate = format(element.endDate, "YYYY-MM-DDTHH:mm:ss"); // new Date(element.endDate);
          qual.push(element);
        }
      });
    if (this.existingStaffQualificationForm) {
      this.existingStaffQualificationForm.filter((x: StaffQualification) => {
        if (qual.findIndex(y => y.id == x.id) == -1) {
          x.isDeleted = true;
          qual.push(x);
        }
      });
    }
    let data = {
      staffId: this.staffId,
      staffQualification: qual
    };
    this.submitted = true;
    this.usersService
      .saveStaffQualification(data)
      .subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null) {
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            this.clearFormControls();
            this.getStaffQualification(this.staffId);

            this.commonService.isProfileUpdated(Number(this.staffId));
          } else {
            this.notifier.notify("error", response.message);
          }
        }
      });
  }
}
