import { DiagnosisModalComponent } from "./clients/diagnosis/diagnosis-modal/diagnosis-modal.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AgencyRoutingModule } from "./agency-routing.module";
import { SharedModule } from "../../../shared/shared.module";
import { MatMenuModule, MatSelectModule } from "@angular/material";
import { AuthListComponent } from "./dashboard/auth-list/auth-list.component";
import { AgencyPermissionGuard } from "./agency_routing_permission.guard";
import { ScrollbarModule } from "ngx-scrollbar";
import { RatingModule } from 'ng-starrating';
import { ClientSelectComponent } from "./client-select/client-select.component";
import { BrowserModule } from "@angular/platform-browser";
import {MatListModule, MatListOption} from '@angular/material/list';
import { FormsModule } from "@angular/forms";
import { DataPaginationComponent } from "./data-pagination/data-pagination.component";
import { AddHeaderModalComponent } from "./onboarding/modals/add-header-modal/add-header-modal.component";
import { OnboardingModule } from "./onboarding/onboarding.module";
import { DropdownModule } from "primeng/dropdown";
import { IconsModule } from "src/app/shared/icons/icons.module";
//import { KeywordModule } from "./Keyword/keyword.module";
@NgModule({
  imports: [
    CommonModule,
    AgencyRoutingModule,
    SharedModule,
    MatMenuModule,
    ScrollbarModule,
    RatingModule,
    FormsModule,
    OnboardingModule,
    DropdownModule,
  ],
  providers: [AgencyPermissionGuard],
  declarations: [
    DashboardComponent,
    AuthListComponent,
    ClientSelectComponent,
    //DataPaginationComponent
    //DiagnosisModalComponent
  ],
 // exports: [DataPaginationComponent],
  entryComponents: [AddHeaderModalComponent]
})
export class AgencyPortalModule {}
