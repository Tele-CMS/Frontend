import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientComponent } from "./client/client.component";
import { ClientsRoutingModule } from "./clients.module.routing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "../../../../shared/shared.module";
import { PlatformMaterialModule } from "../../../platform.material.module";
import { DemographicInfoComponent } from "./demographic-info/demographic-info.component";
import { GuardianComponent } from "./guardian/guardian.component";
import { AddressComponent } from "./address/address.component";
import { InsuranceComponent } from "./insurance/insurance.component";
import { CustomFieldsComponent } from "./custom-fields/custom-fields.component";
import { ClientsService } from "./clients.service";
import { GuardianModalComponent } from "./guardian/guardian-modal/guardian-modal.component";
import { ClientHeaderComponent } from "./client-header/client-header.component";
import { ProfileComponent } from "./profile/profile.component";
import { SocialHistoryComponent } from "./social-history/social-history.component";
import { FamilyHistoryComponent } from "./family-history/family-history.component";
import { ImmunizationComponent } from "./immunization/immunization.component";
import { DiagnosisComponent } from "./diagnosis/diagnosis.component";
import { VitalsComponent } from "./vitals/vitals.component";
import { AllergiesComponent } from "./allergies/allergies.component";
import { AuthorizationComponent } from "./authorization/authorization.component";
import { MedicationComponent } from "./medication/medication.component";
//import { EncounterComponent } from "./encounter/encounter/encounter.component";
import { ClientLedgerComponent } from "./client-ledger/client-ledger.component";
import { DocumentsComponent } from "./documents/documents.component";
import { LabOrdersComponent } from "./lab-orders/lab-orders.component";
import { DiagnosisModalComponent } from "./diagnosis/diagnosis-modal/diagnosis-modal.component";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material";
import { FamilyHistoryModelComponent } from "./family-history/family-history-model/family-history-model.component";
import { EligibilityEnquiryComponent } from "./eligibility-enquiry/eligibility-enquiry.component";
import { ImmunizationModalComponent } from "./immunization/immunization-modal/immunization-modal.component";
import { VitalModalComponent } from "./vitals/vital-modal/vital-modal.component";
import { AllergiesModalComponent } from "./allergies/allergies-modal/allergies-modal.component";
import { AuthorizationModalComponent } from "./authorization/authorization-modal/authorization-modal.component";
import { MedicationModalComponent } from "./medication/medication-modal/medication-modal.component";
import { SoapEncounterComponent } from "./soap-encounter/soap-encounter.component";
import { ClientLedgerDetailComponent } from "./client-ledger/client-ledger-detail/client-ledger-detail.component";
import { AddPaymentDetailComponent } from "./client-ledger/add-payment-detail/add-payment-detail.component";
import { AddDocumentComponent } from "./documents/add-document/add-document.component";
import { ChartsModule } from "ng2-charts";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PrescriptionComponent } from './prescription/prescription.component';
import { PrescriptionFaxModalComponent } from './prescription/prescription-fax-modal/prescription-fax-modal.component';
import { PrescriptionModalComponent } from './prescription/prescription-modal/prescription-modal.component';
import { AddPrescriptionComponent } from './prescription/prescription-addprescription/prescription-addprescription.component';
import { SentPrescriptionComponent } from './prescription/prescription-sentprescription/prescription-sentprescription.component';
import { HistoryComponent } from './history/history.component';
import { AlertsComponent } from "./alerts/alerts.component";
import { ProgramsComponent } from "./programs/programs.component";
import { AssignProgramModalComponent } from "./programs/assign-program-modal/assign-program-modal.component";
import { AssessmentsComponent } from "./assessments/assessments.component";
import { AssignQuestionnaireModalComponent } from "./assessments/assign-questionnaire-modal/assign-questionnaire-modal.component";
import { ReviewOfSystemsModelComponent } from "./encounter/review-of-systems-model/review-of-systems-model.component";
import { EncounterNotesModelComponent } from "./encounter/encounter-notes-model/encounter-notes-model.component";
//import { CreateEncounterComponent } from "./create-encounter/create-encounter.component";
import { ScrollbarModule } from 'ngx-scrollbar';
import { ResizableModule } from 'angular-resizable-element';
//import { EncounterService } from "./create-encounter/encounter.service";
import { DragAndDropModule } from "angular-draggable-droppable";
import { DiscardEncounterGuard } from "./discard-encounter.guard";
import { ClientHealthComponent } from "./client-health/client-health.component";
import { ClientHealthMaterialsModule } from "./client-health-materials.module";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxMaskModule } from 'ngx-mask';
import { MemberHraModule } from "../member-hra/member-hra.module";
import { QuestionairePreviewModule } from "../questionaire-preview/questionaire-preview.module";
import { AgencyRegistrationService } from "../../auth/agency-registration/agency-registration.service";
import { EncounterService } from "./encounter/encounter.service";
import { CreateEncounterComponent } from "./create-encounter/create-encounter.component";
import { EncounterModule } from "./encounter/encounter.module";
import { EncounterModule as PatientEncounterModule } from "../patient-encounter/encounter.module";
import { EncounterComponent } from "./encounter-old/encounter.component";

@NgModule({
  imports: [
    CommonModule,
    ClientsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PlatformMaterialModule,
    ChartsModule,
    NgxMatSelectSearchModule,
    ScrollbarModule,
    ResizableModule,
    DragAndDropModule,
    ClientHealthMaterialsModule,
    NgxMaterialTimepickerModule,
    NgxMaskModule,
    MemberHraModule,
    QuestionairePreviewModule,
    EncounterModule,
    PatientEncounterModule
  ],
  providers: [
    DiscardEncounterGuard,
    ClientsService,
    AgencyRegistrationService,
    EncounterService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: true,
        minWidth: "55%",
        maxWidth: "90%"
      }
    }
  ],
  entryComponents: [
    DemographicInfoComponent,
    GuardianComponent,
    AddressComponent,
    InsuranceComponent,
    CustomFieldsComponent,
    GuardianModalComponent,
    DiagnosisModalComponent,
    FamilyHistoryModelComponent,
    EligibilityEnquiryComponent,
    ImmunizationModalComponent,
    VitalModalComponent,
    AllergiesModalComponent,
    AuthorizationModalComponent,
    MedicationModalComponent,
    ClientLedgerDetailComponent,
    AddPaymentDetailComponent,
    AddDocumentComponent,
    PrescriptionModalComponent,
    PrescriptionFaxModalComponent,
    // AddPrescriptionComponent,
    SentPrescriptionComponent,
    AssignProgramModalComponent,
    AssignQuestionnaireModalComponent,
  ],
  declarations: [
    ClientComponent,
    DemographicInfoComponent,
    GuardianComponent,
    AddressComponent,
    InsuranceComponent,
    CustomFieldsComponent,
    GuardianModalComponent,
    ClientHeaderComponent,
    ProfileComponent,
    SocialHistoryComponent,
    FamilyHistoryComponent,
    ImmunizationComponent,
    DiagnosisComponent,
    VitalsComponent,
    AllergiesComponent,
    AuthorizationComponent,
    MedicationComponent,
    EncounterComponent,
    ClientLedgerComponent,
    DocumentsComponent,
    LabOrdersComponent,
    DiagnosisModalComponent,
    FamilyHistoryModelComponent,
    EligibilityEnquiryComponent,
    ImmunizationModalComponent,
    VitalModalComponent,
    AllergiesModalComponent,
    AuthorizationModalComponent,
    MedicationModalComponent,
    SoapEncounterComponent,
    ClientLedgerDetailComponent,
    AddPaymentDetailComponent,
    AddDocumentComponent,
    PrescriptionComponent,
    PrescriptionFaxModalComponent,
    PrescriptionModalComponent,
    // AddPrescriptionComponent,
    SentPrescriptionComponent,
    HistoryComponent,
    AlertsComponent,
    ProgramsComponent,
    AssignProgramModalComponent,
    AssessmentsComponent,
    AssignQuestionnaireModalComponent,
    CreateEncounterComponent,
    ClientHealthComponent,
    ReviewOfSystemsModelComponent
    //EncounterComponent
  ]
  //exports: [DiagnosisModalComponent]
})
export class ClientsModule { }
