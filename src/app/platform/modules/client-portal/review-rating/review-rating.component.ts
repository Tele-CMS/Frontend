import { Component, OnInit, EventEmitter, Output, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClientsService } from "../clients.service";
import { ResponseModel } from "../../core/modals/common-model";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ReviewRatingModel } from "./review-rating.model";

@Component({
  selector: "app-review-rating",
  templateUrl: "./review-rating.component.html",
  styleUrls: ["./review-rating.component.css"]
})
export class ReviewRatingComponent implements OnInit {
  reviewRatingForm: FormGroup;
  reviewModel: ReviewRatingModel;
  reviewRatingId: number;
  appointmentId: number;
  
  staffId:number;
  headerText: string = "";

  submitted: boolean = false;
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private activatedRoute: ActivatedRoute,
    private notifierService: NotifierService,
    private route: Router,
    private dialogModalRef: MatDialogRef<ReviewRatingComponent>
  ) {
    this.reviewModel =
      this.data.reviewRatingModel == null
        ? new ReviewRatingModel()
        : this.data.reviewRatingModel;
    if (this.reviewModel.id != null && this.reviewModel.id > 0)
      this.headerText = "Add Review/Rating";
    else this.headerText = "Update Review/Rating";
  }

  ngOnInit() {
    this.reviewRatingForm = this.formBuilder.group(
      {
        rating: [
          "",
          [
            Validators.required,
            Validators.minLength(1),
            Validators.min(1),
            Validators.maxLength
          ]
        ],
        review: []
      },
      { validator: this.validateForm.bind(this) }
    );

    console.log(this.reviewModel);
    this.reviewRatingForm.patchValue({
      rating: this.reviewModel.rating,
      review: this.reviewModel.review
    });

    this.reviewRatingId = this.reviewModel.id;
    this.appointmentId = this.reviewModel.patientAppointmentId;
    this.staffId=this.reviewModel.staffId;
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.appointmentId =
    //     params.apptId == undefined ? 0 : parseInt(params.apptId);
    //     this.reviewRatingId = params.revId == undefined ? 0 : parseInt(params.revId);
    // });

    // if (this.reviewModel.id >0)
    // this.getReviewRatings();
  }
  get formControls() {
    return this.reviewRatingForm.controls;
  }
  validateForm(formGroup: FormGroup) {
    return null;
  }
  getReviewRatings() {
    this.clientService
      .getReviewRatingById(this.reviewRatingId)
      .subscribe((response: any) => {
        if (response != null) {
          this.reviewModel = response.data;
          //this.reviewModel.tag = this.reviewModel.patientTags != null ? this.reviewModel.patientTags.map(({ tagID }) => tagID) : [];
          this.reviewRatingForm.patchValue(this.reviewModel);
        }
      });
  }
  onRate(event: any) {
    // this.reviewModel.rating =  event.newValue
    this.reviewRatingForm.patchValue({
      rating: event.newValue
    });
  }

  onSubmit() {
    if (!this.reviewRatingForm.invalid) {
      this.reviewModel = this.reviewRatingForm.value;
      this.reviewModel.id = this.reviewRatingId;
      this.reviewModel.patientAppointmentId = this.appointmentId;
      this.reviewModel.staffId=this.staffId;

      this.submitted = true;
      this.clientService
        .saveUpdateReviewRating(this.reviewModel)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.reviewRatingId = response.data.id;
            // this.commonService.initializeAuthData();
            //  this.route.navigate(["web/client/dashboard"], {});
            this.notifierService.notify("success", response.message);
            this.closeDialog("save");

            // this.handleTabChange.next({ tab: "{PAST APPOINTMENTS}" });
          } else {
            this.notifierService.notify("error", response.message);
          }
        });
    }
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
}
