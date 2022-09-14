import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';
import { AppointmentReportComponent } from './appointment-report/appointment-report.component';
import { CustomReportComponent } from './custom-report/custom-report.component';

const routes: Routes = [
  {
    path: 'client-appointment',
    canActivate: [AgencyPermissionGuard],
    component: AppointmentReportComponent,
  },
  // {
  //   path: 'custom',
  //   canActivate: [AgencyPermissionGuard],
  //   component: CustomReportComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
