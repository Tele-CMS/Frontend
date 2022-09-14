import { PaymentHistoryComponent } from "./Payments/payment-history/payment-history.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AgencyPermissionGuard } from "./agency_routing_permission.guard";
import { ClientSelectComponent } from "./client-select/client-select.component";

const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "/web/dashboard"
  // },
  {
    path: "dashboard",
    canActivate: [AgencyPermissionGuard],
    component: DashboardComponent
  },
  {
    path: "Masters",
    loadChildren: "./masters/masters.module#MastersModule"
  },
  {
    path: "manage-users",
    loadChildren: "./users/users.module#UsersModule"
  },
  {
    path: "scheduling",
    canActivate: [AgencyPermissionGuard],
    loadChildren: "../scheduling/scheduling.module#SchedulingModule"
  },
  {
    path: "appointment",
    //canActivate: [AgencyPermissionGuard],
    loadChildren: "./encounter/encounter.module#EncounterModule"
  },
  {
    path: 'encounter',
    loadChildren: './client-encounter/client-encounter.module#ClientEncounterModule',
  },
  {
    path: 'programs-enrollment',
    loadChildren: './clients-program-enroll/clients-program-enroll.module#ClientsProgramEnrollModule',
  },
  {
    path: "clearing-house",
    canActivate: [AgencyPermissionGuard],
    loadChildren: "./clearing-house/clearing-house.module#ClearingHouseModule"
  },
  {
    path: "client",
    loadChildren: "./clients/clients.module#ClientsModule"
  },
  {
    path: "Logs",
    loadChildren: "./logs/logs.module#LogsModule"
  },
  {
    path: "Billing",
    loadChildren: "./billing/billing.module#BillingModule"
  },
  {
    path: "payers",
    loadChildren: "./payers/payers.module#PayersModule"
  },
  {
    path: "payroll",
    loadChildren: "./payroll/payroll.module#PayrollModule"
  },
  {
    path: "mailbox",
    canActivate: [AgencyPermissionGuard],
    loadChildren: "../mailing/mailing.module#MailingModule"
  },
  {
    path: "app-config",
    canActivate: [AgencyPermissionGuard],
    loadChildren: "./app-config/app-config.module#AppConfigModule"
  },
  {
    path: "questionnaire",
    //path: "questionnairess",
    canActivate: [AgencyPermissionGuard],
    loadChildren: "./questionnaire/questionnaire.module#QuestionnaireModule"
  },
  {
    path: "assign-questionnaire",
   // canActivate: [AgencyPermissionGuard],
    loadChildren: "./providerquestionnaire/providerquestionnaire.module#ProviderquestionnaireModule"
  },
  // {
  //   path: "add-keyword",
  //   canActivate: [AgencyPermissionGuard],
  //   loadChildren: "./keyword/keyword.module#KeywordModule"
  // },
  {
    path: "payment",
    canActivate: [AgencyPermissionGuard],
    loadChildren: "./Payments/payment.module#PaymentModule"
  },
  {
    path: "educational-content",
    canActivate: [AgencyPermissionGuard],
    loadChildren: "./provider-documents/provider-documents.module#ProviderDocumentModule"
  },
  {
    path: "waiting-room/:id",
    loadChildren: "../waiting-room/waiting-room.module#WaitingRoomModule"
  },
  {
    path: "waiting-room",
    loadChildren: "../waiting-room/waiting-room.module#WaitingRoomModule"
  },
  {
    path: 'reports',
    loadChildren: './reporting/reporting.module#ReportingModule',
  },
  {
    path: 'member-hra',
    canActivate: [AgencyPermissionGuard],
    loadChildren: './member-hra/member-hra.module#MemberHraModule'
  },
  {
    path: 'alerts',
    canActivate: [AgencyPermissionGuard],
    loadChildren: './masters/client-alerts/client-alerts.module#ClientAlertsModule',
  },
  {
    path: 'selection',
    //canActivate: [AgencyPermissionGuard],
    //loadChildren: './masters/client-alerts/client-alerts.module#ClientAlertsModule',
    component: ClientSelectComponent
  },
  {
    path: 'onboarding',
    canActivate: [AgencyPermissionGuard],
    loadChildren: './onboarding/onboarding.module#OnboardingModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyRoutingModule {}
