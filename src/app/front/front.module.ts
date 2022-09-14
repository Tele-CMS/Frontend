import { UniquePipe } from "./../shared/pipes/unique.pipe";
import { PaymentFailureComponent } from "./payment-failure/payment-failure.component";
import { PaymentSuccessComponent } from "./payment-success/payment-success.component";
import { BookAppointmentComponent } from "./book-appointment/book-appointment.component";
import { HomeFooterComponent } from "./home-footer/home-footer.component";
import { HomeHeaderComponent } from "./home-header/home-header.component";
import { HomeContainerComponent } from "./home-container/home-container.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./register/register.component";
import { AppMaterialModule } from "src/app/app.material.module";
import { FrontRoutingModule } from "src/app/front/front-routing.module";
import { FrontMaterialModule } from "src/app/front/front.material.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CommonService } from "src/app/platform/modules/core/services";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RejectInvitationComponent } from "src/app/front/reject-invitation/reject-invitation.component";
import { CarouselModule } from "ngx-owl-carousel-o";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgDatepickerModule } from "ng2-datepicker";
import { DoctorListComponent } from "./doctor-list/doctor-list.component";
import { ScrollbarModule } from "ngx-scrollbar";
import { DoctorProfileComponent } from "./doctor-profile/doctor-profile.component";
import "hammerjs";
import { NgxGalleryModule } from "ngx-gallery";
import { DatePipe } from "@angular/common";
import { AgencyLoginModelComponent } from "src/app/shared/login-model/agency-login/agency-login.component";
import { ClientLoginModelComponent } from "src/app/shared/login-model/client-login/client-login.component";
import { RegisterModelComponent } from "src/app/shared/register-model/register.component";
import { HttpTokenInterceptor } from "src/app/platform/modules/core/interceptors";
import { LoginModelComponent } from "src/app/shared/login-model/login-model.component";
import { SecurityQuestionModelComponent } from "src/app/shared/security-question-model/security-question-model.component";
import { AgmCoreModule } from "@agm/core";
import { MatNativeDateModule, MatStepperModule, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material";
import { OverlayModule } from "@angular/cdk/overlay";
//import { StripeModule } from "stripe-angular";
//import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
//import { NgxMaterialTimepickerEventService } from "ngx-material-timepicker/src/app/material-timepicker/services/ngx-material-timepicker-event.service";
//import { ChangePasswordComponent } from "src/app/platform/modules/agency-portal/change-password/change-password.component";

//import { NgxUploaderModule } from 'ngx-uploader';
import { RatingModule } from 'ng-starrating';
import { BookFreeAppointmentComponent } from "./book-freeappointment/book-freeappointment.component";
import { WhatWeDoComponent } from "./what-we-do/what-we-do.component";
import { OurDoctorsComponent } from "./our-doctors/our-doctors.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { TermsConditionModalComponent } from "./terms-conditions/terms-conditions.component";
import { FaqComponent } from "./faq/faq.component";
import { ProviderProfileModalComponent } from "./provider-profile/provider-profile.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { AddUserDocumentComponent } from "../platform/modules/agency-portal/users/user-documents/add-user-document/add-user-document.component";
import { SaveDocumentComponent } from "./save-document/save-document.component";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { ProviderFeeSettingsComponent } from "./provider-fee-settings/provider-fee-settings.component";
import { UrgentCareProviderListComponent } from "./urgentcareprovider-list/urgentcareprovider-list.component";
import { UrgentCareAppointmentComponent } from "./urgentcare-appointment/urgentcare-appointment.component";

@NgModule({
  imports: [
    CommonModule,
    FrontMaterialModule,
    FrontRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CarouselModule,
    NgSelectModule,
    NgDatepickerModule,
    ScrollbarModule,
    MatStepperModule,
    NgxGalleryModule,
    NgxSliderModule,
    MatDatepickerModule,
        MatNativeDateModule,
    //NgxUploaderModule,
    RatingModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyD9WPa4_81AAXVhPJdQm1tZU5cp-NvrrR4"
      //"AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw"
      /* apiKey is required, unless you are a
      premium customer, in which case you can
      use clientId
      */
      //libraries: ["places"]
    }),
    //StripeModule.forRoot("pk_test_eDyXvdOe0IkSPxG2dQBNGlk600XXmL8M1q"),
    OverlayModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  exports:[
    DoctorListComponent
    // NgxMaterialTimepickerModule
  ],
  declarations: [
    RegisterComponent,
    RejectInvitationComponent,
    HomeComponent,
    DoctorListComponent,
    DoctorProfileComponent,
    HomeContainerComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    BookAppointmentComponent,
    BookFreeAppointmentComponent,
    PaymentSuccessComponent,
    PaymentFailureComponent,
    WhatWeDoComponent,
    OurDoctorsComponent,
    ContactUsComponent,
    TermsConditionModalComponent,
    FaqComponent,
    ProviderProfileModalComponent,
    //AddUserDocumentComponent
    SaveDocumentComponent,
    ProviderFeeSettingsComponent,
    UrgentCareProviderListComponent,
    UrgentCareAppointmentComponent

    //ChangePasswordComponent
  ],
  entryComponents: [
    AgencyLoginModelComponent,
    ClientLoginModelComponent,
    RegisterModelComponent,
    LoginModelComponent,
    SecurityQuestionModelComponent,
    BookAppointmentComponent,
    BookFreeAppointmentComponent,
    TermsConditionModalComponent,
    ProviderProfileModalComponent,
    SaveDocumentComponent,
    ProviderFeeSettingsComponent,
    UrgentCareProviderListComponent,
    UrgentCareAppointmentComponent
    //AddUserDocumentComponent
    //ChangePasswordComponent
  ],
  providers: [
    CommonService,
    DatePipe,
    UniquePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: MAT_DIALOG_DATA,  
      useValue: {
      hasBackdrop: true,
      disableClose: true,
      minWidth: "55%",
      maxWidth: "90%"
    } 
  },
    //{ provide: MdDialogRef, useValue: {} }
  ]
})
export class FrontModule {
  constructor(commonService: CommonService) {
    commonService.initializeAuthData();
  }
}
