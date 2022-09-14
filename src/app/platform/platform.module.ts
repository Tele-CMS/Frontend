//import { TextChatService } from "./../shared/text-chat/text-chat.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { PlatformRoutingModule } from "./platform-routing.module";
import { SharedModule } from "../shared/shared.module";
import { MainContainerComponent } from "./modules/main-container/main-container.component";
import { PlatformMaterialModule } from "./platform.material.module";
import { ClientListingComponent } from "./modules/agency-portal/client-listing/client-listing.component";
import { ScrollbarModule } from "ngx-scrollbar";
import { HttpTokenInterceptor } from "./modules/core/interceptors";
import { AgencyAuthGuard } from "./auth.guard";
import { AgencyNoAuthGuard } from "./noAuth.guard";
import { AuthenticationService } from "./modules/auth/auth.service";
import { CommonService, LayoutService } from "./modules/core/services";
import { ClientListingService } from "./modules/agency-portal/client-listing/client-listing.service";
import { DashboardService } from "./modules/agency-portal/dashboard/dashboard.service";
import { ChangePasswordComponent } from "./modules/agency-portal/change-password/change-password.component";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material";
import { ChangePasswordService } from "./modules/agency-portal/change-password/change-password.service";
import { PageNotAllowedComponent } from "./modules/page-not-allowed/page-not-allowed.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PlatformRoutingModule,
    PlatformMaterialModule,
    SharedModule,
    ScrollbarModule
  ],
  declarations: [
    MainContainerComponent,
    ClientListingComponent,
    ChangePasswordComponent,
    PageNotAllowedComponent
  ],
  entryComponents: [ChangePasswordComponent],
  providers: [
    AgencyAuthGuard,
    AgencyNoAuthGuard,
    AuthenticationService,
    CommonService,
    LayoutService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ClientListingService,
    DashboardService,
    ChangePasswordService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true, disableClose: true, width: "700px" }
    }
  ]
})
export class PlatformModule {
  constructor(commonService: CommonService) {
    commonService.initializeAuthData();
  }
}
