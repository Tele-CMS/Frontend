import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgencyLoginComponent } from "./agency-login/agency-login.component";
import { AuthComponent } from "./auth/auth.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AuthRoutingModule } from "./auth.routing";
import { AuthenticationService } from "./auth.service";
import { ClientLoginComponent } from "./client-login/client-login.component";
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatStepperModule
} from "@angular/material";
import { SecurityQuestionComponent } from "./security-question/security-question.component";
import { ResetPasswordComponent } from "src/app/platform/modules/auth/reset-password/reset-password.component";
import { LoginSelectionComponent } from "./login-selection/login-selection.component";
import { RegistrationComponent } from "./registration/registration.component";
import { SharedModule } from "src/app/shared/shared.module";
import { NewPaymentComponent } from "./NewPayment/NewPayment.component";
import { AgencyRegistrationModule } from "./agency-registration/agency-registration.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    SharedModule,
    MatStepperModule,
    MatCardModule,
    AgencyRegistrationModule
  ],
  declarations: [
    AgencyLoginComponent,
    AuthComponent,
    AgencyLoginComponent,
    ClientLoginComponent,
    ForgotPasswordComponent,
    SecurityQuestionComponent,
    ResetPasswordComponent,
    LoginSelectionComponent,
    RegistrationComponent,
    NewPaymentComponent
  ],
  providers: [AuthenticationService]
})
export class AuthModule {}
