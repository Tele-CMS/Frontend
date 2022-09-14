import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatStepperModule
} from "@angular/material";
import { SharedModule } from "src/app/shared/shared.module";
import { AgencyRegistrationRoutingModule } from "./agency-registration.routing";
import { AgencyRegistrationComponent } from "./agency-registration.component";
import { AgencyRegistrationService } from "./agency-registration.service";
import { CommonService } from "../../core/services";
import { ManageAgencyService } from "./manage-agency.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    SharedModule,
    MatStepperModule,
    MatCardModule,
    AgencyRegistrationRoutingModule
  ],
  declarations: [
    AgencyRegistrationComponent
  ],
  providers: [AgencyRegistrationService, ManageAgencyService]
})
export class AgencyRegistrationModule {}
