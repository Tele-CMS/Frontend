import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollGroupComponent } from './payroll-group/payroll-group.component';
import { PayrollBreaktimeComponent } from './payroll-breaktime/payroll-breaktime.component';
import { ManageHolidaysComponent } from './manage-holidays/manage-holidays.component';
import { UserTimeSheetComponent } from './user-time-sheet/user-time-sheet.component';
import { PayrollReportComponent } from './payroll-report/payroll-report.component';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';


const routes: Routes = [
    {
        path: 'payroll-group',
        canActivate: [AgencyPermissionGuard],
        component: PayrollGroupComponent,
    },
    {
        path: 'payroll-break-time',
        canActivate: [AgencyPermissionGuard],
        component: PayrollBreaktimeComponent,
    },
    {
        path: 'holiday',
        canActivate: [AgencyPermissionGuard],
        component: ManageHolidaysComponent,
    },
    {
        path: 'user-timesheet',
        canActivate: [AgencyPermissionGuard],
        component: UserTimeSheetComponent,
    },
    {
        path: 'payroll-report',
        canActivate: [AgencyPermissionGuard],
        component: PayrollReportComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PayrollRoutingModule { }
