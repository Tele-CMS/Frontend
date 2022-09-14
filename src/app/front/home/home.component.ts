import { SubDomainService } from "src/app/subDomain.service";
import { debounceTime } from "rxjs/operators";
import { HomeService } from "./home.service";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { OwlOptions } from "ngx-owl-carousel-o";
import { DatepickerOptions } from "ng2-datepicker";
import * as enLocale from "date-fns/locale/en";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { CommonService } from "src/app/platform/modules/core/services";
import { ProviderSearchFilterModel } from "src/app/platform/modules/core/modals/common-model";
import { MatDialog } from "@angular/material";
import { LoginModelComponent } from "src/app/shared/login-model/login-model.component";
import { HomeHeaderComponent } from "../home-header/home-header.component";
import { SpecialityService } from "src/app/platform/modules/agency-portal/masters/speciality/speciality.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  selectedSpeciality: any;
  selectedService: any;
  selectedLocation: any;
  selectedDate: any;
  filterModel: ProviderSearchFilterModel;
  providers: any = [];
  totalRecords: number = 0;
  metaData: any;
  options: DatepickerOptions;
  taxonomies: any[] = [];
  speciality: any[] = [];
  services: any[] = [];
  location: any[] = [];
  specialityIconName: any;
  responseSpecialityIconName: any;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 30,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],

    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  };
  carouselSlide: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,

    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 3
      },
      740: {
        items: 5
      },
      940: {
        items: 5
      }
    }
  };
  constructor(
    private usersService: UsersService,
    private domSanitizer: DomSanitizer,
    private homeService: HomeService,
    private router: Router,
    private datepipe: DatePipe,
    private commonService: CommonService,
    private subDomainService: SubDomainService,
    private dialogModal: MatDialog,
    private headerComp: HomeHeaderComponent,
    private specialityService: SpecialityService
  ) {
    this.taxonomies = [];
    this.speciality = [];
    this.location = [];
    let dte = new Date();
    dte.setDate(dte.getDate() - 1);
    this.options = {
      minYear: 1970,
      maxYear: 2030,
      displayFormat: "MMM D[,] YYYY",
      barTitleFormat: "MMMM YYYY",
      dayNamesFormat: "dd",
      firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
      locale: enLocale,
      minDate: dte, // Minimal selectable date
      //maxDate: new Date(Date.now()),  // Maximal selectable date
      barTitleIfEmpty: "Click to select a date",
      placeholder: "Select Date", // HTML input placeholder attribute (default: '')
      fieldId: "my-date-picker", // ID to assign to the input field. Defaults to datepicker-<counter>
      useEmptyBarTitle: false // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
    };
    this.filterModel = new ProviderSearchFilterModel();
  }

  ngOnInit() {
    this.applyFilter();
    this.getSpeciality();
  }
  ngAfterViewInit() {

    if (localStorage.getItem("business_token")) this.getMasterData(null);
    else {
      const subDomainUrl = this.subDomainService.getSubDomainUrl();
      if (subDomainUrl) {
        this.subDomainService.verifyBusinessName(subDomainUrl).subscribe();
        this.subDomainService.getSubDomainInfo().subscribe(domainInfo => {
          if (domainInfo) {
            this.subDomainService.updateFavicon(
              "data:image/png;base64," + domainInfo.organization.faviconBase64
            );
            this.getMasterData(null);
          }
        });
      }
    }
  }
  Speciality(sin) {
    this.router.navigate(['/doctor-list'], { queryParams: { 'searchTerm': sin.globalCodeName } });
  }
  changeSpeciality(evt) {

    this.getMasterData(this.selectedSpeciality);
  }
  getMasterData(globalCodeId: any) {
    this.homeService
      .getMasterData("masterLocation,MASTERTAXONOMY,MASTERSPECIALITY,MASTERSTAFFSERVICE", true, globalCodeId)
      .subscribe((response: any) => {
        if (response != null) {
          this.taxonomies =
            response.masterTaxonomy != null ? response.masterTaxonomy : [];
          this.speciality =
            response.masterSpeciality != null ? response.masterSpeciality : [];
          this.location =
            response.masterLocation != null ? response.masterLocation : [];
          this.services =
            response.masterStaffServices != null
              ? response.masterStaffServices
              : [];

          this.speciality.push({ id: 0, value: "More specialties can be populated on request", disabled: true });
          this.services.push({ id: 0, value: "More services can be populated on request", disabled: true });
        }
      });
  }
  doctorListingRedirection() {
    let spl = this.commonService.encryptValue(this.selectedSpeciality, true);
    let srvc = this.commonService.encryptValue(this.selectedService, true);

    // let srvc= this.commonService.encryptValue(this.selectedService, true);
    // let location = this.commonService.encryptValue(this.selectedLocation, true);   //agencyremove
    let location = this.commonService.encryptValue(101, true);
    let date = this.datepipe.transform(this.selectedDate, "yyyy-MM-dd");
    this.router.navigate(["/doctor-list"], {
      queryParams: { sp: spl, loc: location, d: date, srvc: srvc }
    });
  }

  openDialogLogin() {
    this.router.navigate(["/web/login-selection"]);
  }



  applyFilter() {

    this.setPaginatorModel(
      this.filterModel.pageNumber,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder
    );
    this.getProviderList(this.filterModel);
  }

  getProviderList(
    filterModel: ProviderSearchFilterModel,

  ) {

    this.filterModel.Rates = "";
    this.filterModel.ReviewRating = "";
    this.homeService.getProviderList(filterModel).subscribe((response: any) => {

      this.providers = [];
      this.metaData = [];
      this.totalRecords = 0;
      if (response != null && response.statusCode == 200) {

        this.providers = response.data;
        this.metaData = response.meta;
        this.totalRecords = this.metaData.totalRecords;
      } else {
        //this.userInvitationModel = []; this.metaData = new Metadata();
      }
      // this.showLoader = false;

    });
  }

  openSymptomChecker() {
    let dbModal;
    if (!localStorage.getItem("access_token")) {
      dbModal = this.dialogModal.open(LoginModelComponent, {
        hasBackdrop: true,
        data: { selectedIndex: 1 }
      });
      dbModal.afterClosed().subscribe((result: any) => {

        if (localStorage.getItem("access_token")) {
          this.router.navigate(['/symptom-checker']);
          return false;
        }
      });
    }
    else {
      this.router.navigate(['/symptom-checker']);
      return false;
    }
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {

    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;

    //this.filterModel.Genders.push("0");
    //this.filterModel.Specialities.push(this.selectedSpeciality);
  }

  redirectToProfilePage(providerId: string) {

    this.router.navigate(["/doctor-profile"], {
      queryParams: {
        id: providerId
      }
    });
  }

  redirectToListing(providerId: string) {

    this.router.navigate(["/doctor-list"], {
      queryParams: {
        providerId: providerId
      }
    });
  }

  bookAppointment(staffId: number, providerId: string) {

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
      //this.openDialogBookAppointment(staffId, providerId);
    }
    //let staffId = this.commonService.encryptValue(id);
  }

  getSpeciality() {

    this.specialityService.getSpecialityIconName().subscribe((response: any) => {
      if (response != null) {

        this.responseSpecialityIconName = response.data;
        this.responseSpecialityIconName.forEach(app => {

          app.specialityIcon = this.domSanitizer.bypassSecurityTrustUrl(app.specialityIcon);
        });

        this.specialityIconName = this.responseSpecialityIconName;

        console.log(this.specialityIconName);

        // this.imagePreview = this.specialityModel.photoThumbnailPath;
      }
    });
  }
}
