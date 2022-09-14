import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { MedicationComponent } from "./medication/medication.component";
import { AgencyPermissionGuard } from "../agency_routing_permission.guard";
import { MedicationTabsComponent } from "./medication-tabs/medication-tabs.component";
import { CurrentMedicationComponent } from "./current-medication/current-medication.component";
// const routes: Routes = [
//   {
//     path: '',
//     // canActivate: [AgencyPermissionGuard],
//     component: MedicationTabsComponent,
//     children: [
//       {
//         path: 'claim',
//         component: MedicationComponent
//       },
//       {
//         path: 'current',
//         component: CurrentMedicationComponent
//       },
//     ]
//   }
// ];
const routes: Routes = [
  {
    path: '', 
    component: CurrentMedicationComponent
  }
];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MedicationModuleRoutingModule { }
  