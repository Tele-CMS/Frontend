import { Routes } from "@angular/router";
import { AgencyPermissionGuard } from "src/app/platform/modules/agency-portal/agency_routing_permission.guard";
import { ClientPermissionGuard } from "src/app/platform/modules/client-portal/client_routing_permission.guard";
import { FamilyHistoryComponent } from "src/app/platform/modules/agency-portal/clients/family-history/family-history.component";

const routes: Routes = [
  // {
  //   path: "family-history",
  //   canActivate: [AgencyPermissionGuard],
  //   component: FamilyHistoryComponent
  // },
  // {
  //   path: "my-family-history",
  //   canActivate: [ClientPermissionGuard],
  //   component: FamilyHistoryComponent
  // }
];
