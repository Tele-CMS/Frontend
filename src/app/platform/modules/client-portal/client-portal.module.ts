import { DocumentsComponent } from "./documents/documents.component";
import { VitalsComponent } from "./vitals/vitals.component";
//import { SocialHistoryComponent } from "./social-history/social-history.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
//import { FamilyHistoryModelComponent } from "src/app/platform/modules/client-portal/family-history/family-history-model/family-history-model.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientDashboardComponent } from "./dashboard/dashboard.component";
import { ClientRoutingModule } from "./client-routing.module";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { ClientsService } from "./clients.service";
import { SharedModule } from "../../../shared/shared.module";
import { PlatformMaterialModule } from "../../platform.material.module";
import { MailingModule } from "../mailing/mailing.module";
import { ClientPermissionGuard } from "./client_routing_permission.guard";
import { QuestionnaireModule } from "../agency-portal/questionnaire/questionnaire.module";
//import { FamilyHistoryComponent } from "src/app/platform/modules/client-portal/family-history/family-history.component";
import { VitalModelComponent } from "./vitals/vital-model/vital-model.component";
import { DocumentModalComponent } from "./documents/document-modal/document-modal.component";
import { PaymentHistoryComponent } from "./Payments/payment-history/payment-history.component";
import { RefundHistoryComponent } from "./Payments/refund-history/refund-history.component";
import { ScrollbarModule } from "ngx-scrollbar";
import { ClientDashboardService } from "./dashboard/dashboard.service";
import { SoapNoteComponent } from "./soap-note/soap-note.component";
import { FormioModule } from "angular-formio";
import { RatingModule } from 'ng-starrating';
import { ReviewRatingComponent } from './review-rating/review-rating.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { UpcomingappointmentdialogComponent } from './upcomingappointmentdialog/upcomingappointmentdialog.component';
import { FamilyHistoryModelComponent } from "./history/family-history/family-history-model/family-history-model.component";
import { SocialHistoryComponent } from "./history/social-history/social-history.component";
import { FamilyHistoryComponent } from "./history/family-history/family-history.component";
import { PaymentContainerComponent } from "./Payments/payment-container/payment-container.component";
import { HistoryContainerComponent } from "./history/history-container/history-container.component";
import { AssessmentComponent } from "./assessment/assessment/assessment.component";
import { FrontModule } from "src/app/front/front.module";
import { DiagnosisComponent } from "./diagnosis/diagnosis.component";
// import { DashboardComponent } from "./dashboard/dashboard.component";
//import { TasksDialogComponent } from "./tasks-dialog/tasks-dialog/tasks-dialog.component";
import { AssignedHealtheScoreComponent } from "./assigned-health-e-score-list/assigned-health-e-score-list.component";
import { TasksDialogModule } from "./tasks-dialog/tasks-dialog.module";
import { DiagnosisModalComponent } from "./diagnosis/diagnosis-modal/diagnosis-modal.component";
import { PreviewHealtheScoreReportComponent } from "./assigned-health-e-score-list/preview-health-e-score-report/preview-health-e-score-report.component";
import { CancelAppointmentDialogComponent } from "./dashboard-provider/cancel-appointment-dialog/cancel-appointment-dialog.component";
import { ApproveAppointmentDialogComponent } from "./dashboard-provider/approve-appointment-dialog/approve-appointment-dialog.component";
import { DashboardComponent } from "./dashboard-provider/dashboard.component";
import { AuthListComponent } from "./dashboard-provider/auth-list/auth-list.component";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    PlatformMaterialModule,
    MailingModule,
    QuestionnaireModule,
    ReactiveFormsModule,
    ScrollbarModule,
    FormioModule,
   RatingModule,
   FrontModule,
   FormsModule,
   TasksDialogModule,
   NgxMatSelectSearchModule
  ],
  entryComponents: [
    FamilyHistoryModelComponent,
    VitalModelComponent,
    DocumentModalComponent,
    ReviewRatingComponent,
    UpcomingappointmentdialogComponent,
    PaymentContainerComponent,
    HistoryContainerComponent,
    DiagnosisModalComponent
  ],
  declarations: [
    ClientDashboardComponent,
    MyProfileComponent,
    //FamilyHistoryComponent,
    FamilyHistoryModelComponent,
    //SocialHistoryComponent,
    VitalsComponent,
    VitalModelComponent,
    DocumentModalComponent,
    DocumentsComponent,
    //PaymentHistoryComponent,
    //RefundHistoryComponent,
    SoapNoteComponent,
    ReviewRatingComponent,
    WaitingRoomComponent,
    UpcomingappointmentdialogComponent,
    PaymentContainerComponent,
    HistoryContainerComponent,
    DiagnosisComponent,
    // DashboardComponent,
    //TasksDialogComponent,
    AssignedHealtheScoreComponent,
    DiagnosisModalComponent,
    PreviewHealtheScoreReportComponent,
    CancelAppointmentDialogComponent,
    ApproveAppointmentDialogComponent,
    DashboardComponent,
    AuthListComponent

  ],
  providers: [ClientPermissionGuard, ClientsService, ClientDashboardService]
})
export class ClientPortalModule {}
