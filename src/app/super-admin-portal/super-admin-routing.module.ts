import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuperAdminAuthGuard } from './auth.guard';
import { SuperAdminNoAuthGuard } from './noAuth.guard';
import { ManageAgencyComponent } from './manage-agency/manage-agency.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { AddAgencyComponent } from './manage-agency/add-agency/add-agency.component';
import { ManageDatabaseComponent } from './manage-database/manage-database.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [SuperAdminAuthGuard],
    component: MainContainerComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'agency',
        component: ManageAgencyComponent,
      },
      {
        path: 'agency-setup',
        component: AddAgencyComponent,
      },
      {
        path: 'manage-database',
        component: ManageDatabaseComponent,
      },
    ]
  },
  {
    path: 'auth',
    canActivate: [SuperAdminNoAuthGuard],
    loadChildren: './auth/auth.module#AuthModule'
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '/webadmin' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
