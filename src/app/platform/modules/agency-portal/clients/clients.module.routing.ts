import { Routes, RouterModule } from "@angular/router";
import { NgModule, Component } from "@angular/core";
import { ClientComponent } from "./client/client.component";
import { ProfileComponent } from "./profile/profile.component";
import { SocialHistoryComponent } from "./social-history/social-history.component";
import { componentFactoryName } from "@angular/compiler";
import { FamilyHistoryComponent } from "./family-history/family-history.component";
import { ImmunizationComponent } from "./immunization/immunization.component";
import { DiagnosisComponent } from "./diagnosis/diagnosis.component";
import { VitalsComponent } from "./vitals/vitals.component";
import { AllergiesComponent } from "./allergies/allergies.component";
import { MedicationComponent } from "./medication/medication.component";
import { EncounterComponent } from "./encounter/encounter/encounter.component";
import { ClientLedgerComponent } from "./client-ledger/client-ledger.component";
import { DocumentsComponent } from "./documents/documents.component";
import { AuthorizationComponent } from "./authorization/authorization.component";
import { LabOrdersComponent } from "./lab-orders/lab-orders.component";
import { SoapEncounterComponent } from "./soap-encounter/soap-encounter.component";
import { AgencyPermissionGuard } from "../agency_routing_permission.guard";
import { ClientPermissionGuard } from "../../client-portal/client_routing_permission.guard";
import { PrescriptionComponent } from "./prescription/prescription.component";
import { HistoryComponent } from "./history/history.component";
import { AlertsComponent } from "./alerts/alerts.component";
import { ProgramsComponent } from "./programs/programs.component";
import { AssessmentsComponent } from "./assessments/assessments.component";
import { ClientHealthComponent } from "./client-health/client-health.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [AgencyPermissionGuard],
    component: ClientHealthComponent,
    children:[
      {
        path: "",
        canActivate: [AgencyPermissionGuard],
        component: ClientComponent
      },
      {
        path: "profile",
        canActivate: [AgencyPermissionGuard],
        component: ProfileComponent
      },
      {
        path: "family-history",
        canActivate: [AgencyPermissionGuard],
        component: FamilyHistoryComponent
      },
      {
        path: "history",
        canActivate: [AgencyPermissionGuard],
        component: HistoryComponent
      },
      {
        path: "social-history",
        canActivate: [AgencyPermissionGuard],
        component: SocialHistoryComponent
      },
      {
        path: "immunization",
        canActivate: [AgencyPermissionGuard],
        component: ImmunizationComponent
      },
      {
        path: "diagnosis",
        canActivate: [AgencyPermissionGuard],
        component: DiagnosisComponent
      },
      {
        path: "laborderlist",
        canActivate: [AgencyPermissionGuard],
        component: LabOrdersComponent
      },
      {
        path: "vitals",
        canActivate: [AgencyPermissionGuard],
        component: VitalsComponent
      },
      {
        path: "allergies",
        canActivate: [AgencyPermissionGuard],
        component: AllergiesComponent
      },
      {
        path: "authorization",
        canActivate: [AgencyPermissionGuard],
        component: AuthorizationComponent
      },
      {
        path: "medication",
        canActivate: [AgencyPermissionGuard],
        component: MedicationComponent
      }, 
      {
        path: "encounter",
        loadChildren: './../patient-encounter/encounter.module#EncounterModule' 
      },  
      {
        path: 'alerts',
        canActivate: [AgencyPermissionGuard],
        component: AlertsComponent
      },
      {
        path: "soap-encounter",
        canActivate: [AgencyPermissionGuard],
        component: SoapEncounterComponent
      },
      {
        path: "ledger",
        canActivate: [AgencyPermissionGuard],
        component: ClientLedgerComponent
      },
      {
        path: "documents",
        canActivate: [AgencyPermissionGuard],
        component: DocumentsComponent
      },
      {
        path: "scheduling",
        canActivate: [AgencyPermissionGuard],
        loadChildren: "../../scheduling/scheduling.module#SchedulingModule"
      },
      {
        path:'prescription',
      canActivate: [AgencyPermissionGuard],
      component:PrescriptionComponent
      },
      {
        path: "programs",
        canActivate: [AgencyPermissionGuard],
        component: ProgramsComponent
      },
      {
        path: 'assessments',
        canActivate: [AgencyPermissionGuard],
        component: AssessmentsComponent
      },
    ]
  }, 
  
];

// const routes: Routes = [
//   {
//     path: "",
//     canActivate: [AgencyPermissionGuard],
//     component: ClientComponent
//   }, 
//       {
//         path: "profile",
//         canActivate: [AgencyPermissionGuard],
//         component: ProfileComponent
//       },
//       {
//         path: "family-history",
//         canActivate: [AgencyPermissionGuard],
//         component: FamilyHistoryComponent
//       },
//       {
//         path: "history",
//         canActivate: [AgencyPermissionGuard],
//         component: HistoryComponent
//       },
//       {
//         path: "social-history",
//         canActivate: [AgencyPermissionGuard],
//         component: SocialHistoryComponent
//       },
//       {
//         path: "immunization",
//         canActivate: [AgencyPermissionGuard],
//         component: ImmunizationComponent
//       },
//       {
//         path: "diagnosis",
//         canActivate: [AgencyPermissionGuard],
//         component: DiagnosisComponent
//       },
//       {
//         path: "laborderlist",
//         canActivate: [AgencyPermissionGuard],
//         component: LabOrdersComponent
//       },
//       {
//         path: "vitals",
//         canActivate: [AgencyPermissionGuard],
//         component: VitalsComponent
//       },
//       {
//         path: "allergies",
//         canActivate: [AgencyPermissionGuard],
//         component: AllergiesComponent
//       },
//       {
//         path: "authorization",
//         canActivate: [AgencyPermissionGuard],
//         component: AuthorizationComponent
//       },
//       {
//         path: "medication",
//         canActivate: [AgencyPermissionGuard],
//         component: MedicationComponent
//       }, 
//       {
//         path: "encounter",
//         component: ClientHealthComponent,
//         loadChildren: './../patient-encounter/encounter.module#EncounterModule' 
//       },  
//       {
//         path: 'alerts',
//         canActivate: [AgencyPermissionGuard],
//         component: AlertsComponent
//       },
//       {
//         path: "soap-encounter",
//         canActivate: [AgencyPermissionGuard],
//         component: SoapEncounterComponent
//       },
//       {
//         path: "ledger",
//         canActivate: [AgencyPermissionGuard],
//         component: ClientLedgerComponent
//       },
//       {
//         path: "documents",
//         canActivate: [AgencyPermissionGuard],
//         component: DocumentsComponent
//       },
//       {
//         path: "scheduling",
//         canActivate: [AgencyPermissionGuard],
//         loadChildren: "../../scheduling/scheduling.module#SchedulingModule"
//       },
//       {
//         path:'prescription',
//       canActivate: [AgencyPermissionGuard],
//       component:PrescriptionComponent
//       },
//       {
//         path: "programs",
//         canActivate: [AgencyPermissionGuard],
//         component: ProgramsComponent
//       },
//       {
//         path: 'assessments',
//         canActivate: [AgencyPermissionGuard],
//         component: AssessmentsComponent
//       },
     
    
  
// ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {}
