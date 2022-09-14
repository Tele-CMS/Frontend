import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProgramsComponent } from "./programs/programs.component";
import { AgencyPermissionGuard } from "../agency_routing_permission.guard";
import { DiseaseManagementPlanActivityComponent } from "./disease-management-plan-activity/disease-management-plan-activity.component";

const routes: Routes = [
  {
    path: '',
    component: ProgramsComponent
  },{
    path: 'program-activity',
    component: DiseaseManagementPlanActivityComponent
  }
];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ClientProgramsRoutingModule { }
  