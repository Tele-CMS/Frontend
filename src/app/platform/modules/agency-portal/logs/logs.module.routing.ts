import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuditLogComponent } from "./audit-log/audit-log.component";
import { LoginLogComponent } from "./login-log/login-log.component";
import { AgencyPermissionGuard } from "../agency_routing_permission.guard";
import { HRAReportLogComponent } from "./hra-reportlog/hra-reportlog.component";
import { MemberProgramsEnrollComponent } from "./programsenroll-log/programsenroll-log.component";

const routes: Routes = [
  {
    path: 'audit-log',
    canActivate: [AgencyPermissionGuard],
    component: AuditLogComponent,
  },
  {
    path: 'login-log',
    canActivate: [AgencyPermissionGuard],
    component: LoginLogComponent,
  },
  {
    path: 'hra-report-log',
    canActivate: [AgencyPermissionGuard],
    component: HRAReportLogComponent,
  },
  {
    path: 'programenroll-report-log',
    canActivate: [AgencyPermissionGuard],
    component: MemberProgramsEnrollComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule { }
