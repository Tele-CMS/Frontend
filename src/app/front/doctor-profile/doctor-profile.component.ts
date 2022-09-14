import { MatDialog } from "@angular/material";
import {
  StaffAward,
  StaffQualification,
  StaffExperience
} from "./doctor-profile.model";
import { CommonService } from "src/app/platform/modules/core/services";
import { DataTableComponent } from "./../../shared/data-table/data-table.component";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from "@angular/core";
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation
} from "ngx-gallery";
import { HomeService } from "src/app/front/home/home.service";
import { MouseEvent } from "@agm/core";
import { BookAppointmentComponent } from "src/app/front/book-appointment/book-appointment.component";
import { HomeHeaderComponent } from "src/app/front/home-header/home-header.component";
import { LoginModelComponent } from "src/app/shared/login-model/login-model.component";
import {
  FilterModel,
  Metadata
} from "src/app/platform/modules/core/modals/common-model";

//import { HomeContainerComponent } from "src/app/front/home-container/home-container.component";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-doctor-profile",
  templateUrl: "./doctor-profile.component.html",
  styleUrls: ["./doctor-profile.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class DoctorProfileComponent implements OnInit {
  staffId: string = "";
  locationId: number = 0;
  userInfo: any;
  fullname: string;
  staffAwards: Array<StaffAward> = [];
  staffQualifications: Array<StaffQualification> = [];
  staffExperiences: Array<StaffExperience> = [];
  staffTaxonomy: any[] = [];
  tabs: any = [];
  staffSpecialities: any[] = [];
  staffServices: any[] = [];
  reviewRatingDisplayedColumns: Array<any>;
  reviewRatingMeta: Metadata;
  reviewRatingfilterModel: FilterModel;
  averageRating: any;

  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private headerComp: HomeHeaderComponent,
    private router: Router
  ) {
    this.reviewRatingDisplayedColumns = [
      {
        displayName: "Rating",
        key: "rating",
        class: "",
        width: "240px",
        sticky: true,
        type: "rating"
      },
      {
        displayName: "Review",
        key: "review",
        width: "140px"
      },
      { displayName: "Date", key: "createdDate", width: "250px", type: "date" },
      {
        displayName: "Reviewed BY",
        key: "patientName",
        width: "250px",
        type: "50",
        isInfo: true
      }
    ];
    this.reviewRatingfilterModel = new FilterModel();
  }

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      this.staffId = param["id"];
      if (
        param["loc"] != "" &&
        param["loc"] != null &&
        param["loc"] != undefined
      )
        this.locationId = this.commonService.encryptValue(param["loc"], false);
    });
    this.getStaffDetail();
    this.getAverageRating();
    this.galleryOptions = [
      {
        width: "100px",
        height: "50px",
        thumbnailsColumns: 2,
        image: false,
        thumbnailsRemainingCount: true,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: "100%",
        height: "600px",
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.galleryImages = [
      {
        small: "assets/img/doctor-3big.jpg",
        big: "assets/img/doctor-3big.jpg"
      },
      {
        small: "assets/img/dentistroom.jpg",
        big: "assets/img/dentistroom.jpg"
      },
      {
        small: "assets/img/dentistroom1.jpg",
        big: "assets/img/dentistroom1.jpg"
      }
    ];
    this.tabs = [
      {
        tabName: "Overview"
      },
      {
        tabName: "Location"
      },
      {
        tabName: "Reviews"
      }
    ];
  }

  loadChild(event: any) {
    switch (event.tab.textLabel) {
      case this.tabs[0].tabName:
        this.getStaffDetail();
        break;
      case this.tabs[1].tabName:
        this.getLocationAvailability();
        break;
      case this.tabs[2].tabName:
        this.getReviewRating();
        break;
    }
  }
  getStaffDetail() {
    if (this.staffId != "") {
      this.homeService.getProviderDetail(this.staffId).subscribe(res => {
        if (res.statusCode == 200) {
          this.userInfo = res.data;
          this.staffAwards = this.userInfo.staffAwardModels;
          this.staffExperiences = this.userInfo.staffExperienceModels;
          this.staffQualifications = this.userInfo.staffQualificationModels;
          this.staffTaxonomy = this.userInfo.staffTaxonomyModel;
          this.staffSpecialities = this.userInfo.staffSpecialityModel;
          this.staffServices = this.userInfo.staffServicesModels;
          this.fullname = this.commonService.getFullName(
            this.userInfo.firstName,
            this.userInfo.middleName,
            this.userInfo.lastName
          );
        }
      });
    }
  }
  getAverageRating() {
    if (this.staffId != "") {
      this.homeService.getAverageRating(this.staffId).subscribe(res => {
        if (res.statusCode == 200) {
          this.averageRating = res.data;
        }
      });
    }
  }
  StaffLocationAvailabilities: any[] = [];
  getLocationAvailability() {
    if (this.staffId != "") {
      this.homeService
        .getProviderLocationAndAvailibilityDetail(this.staffId)
        .subscribe(res => {
          if (res.statusCode == 200) {
            this.StaffLocationAvailabilities = res.data;
            this.markers = [];
            this.StaffLocationAvailabilities.forEach(loc => {
              this.markers.push({
                lat: loc.assignedLocationsModel.latitude,
                lng: loc.assignedLocationsModel.longitude,
                label: loc.assignedLocationsModel.location,
                draggable: true
              });
            });
          }
        });
    }
  }
  reviewRatingList: any[] = [];
  getReviewRating(pageNumber: number = 1, pageSize: number = 5) {
    if (this.staffId != "") {
      this.homeService
        .getRatingReviews(this.staffId, true, pageNumber, pageSize)
        .subscribe(res => {
          if (res.statusCode == 200) {
            this.reviewRatingList = res.data;
            this.reviewRatingMeta = res.meta;
          }
        });
    }
  }

  onReviewRatingPageOrSortChange(changeState?: any) {
    this.setReviewRatingtPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getReviewRating(changeState.pageNumber, 5);
  }

  setReviewRatingtPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.reviewRatingfilterModel.pageNumber = pageNumber;
    this.reviewRatingfilterModel.pageSize = pageSize;
    this.reviewRatingfilterModel.sortOrder = sortOrder;
    this.reviewRatingfilterModel.sortColumn = sortColumn;
  }

  /*
  Google Map
  */
  // google maps zoom level
  zoom: number = 2;

  // initial center position for the map
  lat: number = 30.6767304;
  lng: number = 76.70975070431633;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log("dragEnd", m, $event);
  }

  markers: marker[] = [
    {
      lat: 30.6767304,
      lng: 76.70975070431633,
      label: "A",
      draggable: true
    }
  ];
  openDialogBookAppointment() {
    let dbModal;
    if (!localStorage.getItem("access_token")) {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        data: { selectedIndex: 1 }
      });
      dbModal.afterClosed().subscribe((result: any) => {
        let response = result.response;
        if (
          response.statusCode >= 400 &&
          response.statusCode < 500 &&
          response.message
        ) {
          //this.errorMessage = response.message;
          this.headerComp.loading = false;
        } else if (response.statusCode === 205) {
          //this.errorMessage = response.message;
          this.headerComp.loading = false;
        } else if (response.access_token) {
          // this.headerComp.isPatient = result.isPatient;
          // if (result.isPatient == false) {
          //   this.headerComp.redirectToDashboard("/web");
          // } else {

          //this.headerComp.IsLogin = true;
          //this.headerComp.checkUserLogin();
          location.reload();
          //}
        } else {
          this.headerComp.openDialogSecurityQuestion();
        }
        // if (result != null && result.response.access_token != "") {

        //     this.headerComp.IsLogin == true;
        //     this.headerComp.checkUserLogin();
        // }
      });
    } else {
      this.createDailogForBookAppoitment();
    }
  }

  createDailogForBookAppoitment() {
    let dbModal;
    dbModal = this.dialogModal.open(BookAppointmentComponent, {
      hasBackdrop: true,
      data: {
        staffId: this.userInfo.id,
        userInfo: this.userInfo,
        providerId: "",
        locationId: this.locationId
      }
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      }
    });
  }
  backToListing() {
    location.href = "/doctor-list";
    //this.router.navigateByUrl("/doctor-list");
  }
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
