import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgencyLoginComponent } from "./agency-login/agency-login.component";
import { ClientLoginComponent } from "./client-login/client-login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SecurityQuestionComponent } from "./security-question/security-question.component";
import { ResetPasswordComponent } from "src/app/platform/modules/auth/reset-password/reset-password.component";
import { LoginSelectionComponent } from "./login-selection/login-selection.component";
import { RegistrationComponent } from "./registration/registration.component";
import { NewPaymentComponent } from "./NewPayment/NewPayment.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    //redirectTo: "/web/login"
    redirectTo: "/web/login-selection"
  },
  {
    path: "login",
    component: AgencyLoginComponent
  },
  {
    path: "client-login",
    component: ClientLoginComponent
  },
  {
    path: "security-question",
    component: SecurityQuestionComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent
  },
  {
    path: "login-selection",
    component: LoginSelectionComponent
  },
  {
    path: "signup-selection",
    component: LoginSelectionComponent
  },
  {
    path: "client-signup",
    component: RegistrationComponent
  },
  {
    path: "provider-signup",
    //component: RegistrationComponent
    //component: ProviderRegistrationComponent
    loadChildren: "./agency-registration/agency-registration.module#AgencyRegistrationModule"
  },
  {
    path: "new-payment",
    component: NewPaymentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
