import { SoapNoteComponent } from "./soap-note/soap-note.component";
import { RefundHistoryComponent } from "./Payments/refund-history/refund-history.component";
import { PaymentHistoryComponent } from "./Payments/payment-history/payment-history.component";
//import { SocialHistoryComponent } from "./social-history/social-history.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClientDashboardComponent } from "./dashboard/dashboard.component";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { MailboxComponent } from "../mailing/mailbox/mailbox.component";
import { ClientPermissionGuard } from "./client_routing_permission.guard";
import { AssignQuestionnaireComponent } from "../agency-portal/questionnaire/assign-questionnaire/assign-questionnaire.component";
//import { FamilyHistoryComponent } from "src/app/platform/modules/client-portal/family-history/family-history.component";
import { VitalsComponent } from "src/app/platform/modules/client-portal/vitals/vitals.component";
import { DocumentsComponent } from "src/app/platform/modules/client-portal/documents/documents.component";
import { ReviewRatingComponent } from "./review-rating/review-rating.component";
import { WaitingRoomComponent } from "./waiting-room/waiting-room.component";
import { SymptomCheckerComponent } from "./../../../shared/symptom-checker/symptom-checker.component"
import { FamilyHistoryComponent } from "./history/family-history/family-history.component";
import { SocialHistoryComponent } from "./history/social-history/social-history.component";
import { PaymentContainerComponent } from "./Payments/payment-container/payment-container.component";
import { HistoryContainerComponent } from "./history/history-container/history-container.component";
import { AssessmentComponent } from "./assessment/assessment/assessment.component";
import { DoctorListComponent } from "src/app/front/doctor-list/doctor-list.component";
import { DiagnosisComponent } from "./diagnosis/diagnosis.component"; 
// import { DashboardComponent } from "./dashboard/dashboard.component";
import { AssignedHealtheScoreComponent } from "./assigned-health-e-score-list/assigned-health-e-score-list.component";
import { CurrentMedicationComponent } from "../agency-portal/medication-module/current-medication/current-medication.component";

const routes: Routes = [
  {
    path: "dashboard",
    canActivate: [ClientPermissionGuard],
    component: ClientDashboardComponent
  },
  {
    path: "my-scheduling",
    canActivate: [ClientPermissionGuard],
    loadChildren: "../scheduling/scheduling.module#SchedulingModule"
  },
  {
    path: "my-profile",
    canActivate: [ClientPermissionGuard],
    component: MyProfileComponent
  },
  {
    path: "waiting-room",
    canActivate: [ClientPermissionGuard],
    component: WaitingRoomComponent
  },
  // {
  //   path: "my-family-history",
  //   canActivate: [ClientPermissionGuard],
  //   component: FamilyHistoryComponent
  // },
  // {
  //   path: "my-social-history",
  //   canActivate: [ClientPermissionGuard],
  //   component: SocialHistoryComponent
  //   //loadChildren: "../agency-portal/clients/clients.module#ClientsModule"
  // },
  {
    path:"history",
    canActivate: [ClientPermissionGuard],
    component: HistoryContainerComponent,
    loadChildren: './history/history.module#HistoryModule'
  },
  {
    path: "payment",
    canActivate: [ClientPermissionGuard],
    component: PaymentContainerComponent,
    loadChildren: './Payments/client-payment.module#ClientPaymentModule'
  },
  // {
  //   path: "payment-history",
  //   canActivate: [ClientPermissionGuard],
  //   component: PaymentHistoryComponent
  // },
  // {
  //   path: "refund-history",
  //   canActivate: [ClientPermissionGuard],
  //   component: RefundHistoryComponent
  //   //loadChildren: "../agency-portal/clients/clients.module#ClientsModule"
  // },
  {
    path: "my-vitals",
    canActivate: [ClientPermissionGuard],
    component: VitalsComponent
    //loadChildren: "../agency-portal/clients/clients.module#ClientsModule"
  },
  {
    path: "my-documents",
    canActivate: [ClientPermissionGuard],
    component: DocumentsComponent
    //loadChildren: "../agency-portal/clients/clients.module#ClientsModule"
  },
  {
    path: "mailbox",
    canActivate: [ClientPermissionGuard],
    component: MailboxComponent
  },
  // {
  //   path: "encounter",
  //   // canActivate: [ClientPermissionGuard],
  //   loadChildren: "../agency-portal/patient-encounter/encounter.module#EncounterModule"
  // },
  {
    path: "assigned-documents",
    canActivate: [ClientPermissionGuard],
    component: AssignQuestionnaireComponent
  },
  {
    path: "soap-note",
    canActivate: [ClientPermissionGuard],
    component: SoapNoteComponent
  },
  // {
  //   path:"client-profile",
  //    canActivate:[ClientPermissionGuard],
  //   component:clientProfileComponent

  // },
  {
    path: "client-profile",
    loadChildren: "./clients-details/clients.module#ClientsModule"
  },
  {
    path: "review-rating",
    canActivate: [ClientPermissionGuard],
    component: ReviewRatingComponent
  },
  {
    path: "symptom-checker",
    canActivate: [ClientPermissionGuard],
    component: SymptomCheckerComponent
  },
  {
    path: "my-assessments",
    canActivate: [ClientPermissionGuard],
    loadChildren: './assessment/assessment.module#AssessmentModule'
  },
  // {
  //   path: "health-e-score",
  //   canActivate: [ClientPermissionGuard],
  //   component: AssignedHealtheScoreComponent
  // },
  {
    path: "my-encounters", 
    canActivate: [ClientPermissionGuard],
    loadChildren: "../agency-portal/patient-encounter/encounter.module#EncounterModule"
  },
  {
    path: 'my-programs', 
    canActivate: [ClientPermissionGuard],
    loadChildren: '../agency-portal/client-programs/client-programs.module#ClientProgramsModule',
  },
  // {
  //   path: 'my-medications', 
  //   canActivate: [ClientPermissionGuard],
  //   loadChildren: '../agency-portal/medication-module/medication-module.module#MedicationModuleModule',
  // },
  {
    path: 'my-medications', 
    canActivate: [ClientPermissionGuard],
    loadChildren: '../agency-portal/medication-module/medication-module.module#MedicationModuleModule',
  },
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule',
  },
  {
    path: 'my-diagnosis',
    canActivate: [ClientPermissionGuard],
    component: DiagnosisComponent,
  },
  {
    path: 'onboarding',
    canActivate: [ClientPermissionGuard],
    loadChildren: '../agency-portal/onboarding/onboarding.module#OnboardingModule'
  },
  
  { path: "**", redirectTo: "/web" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
