import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainContainerComponent } from './modules/main-container/main-container.component';
import { AgencyAuthGuard } from './auth.guard';
import { AgencyNoAuthGuard } from './noAuth.guard';
import { PageNotAllowedComponent } from './modules/page-not-allowed/page-not-allowed.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [AgencyAuthGuard],
    component: MainContainerComponent,
    children: [
      {
        path: '',
        loadChildren: './modules/agency-portal/agency-portal.module#AgencyPortalModule'
      },
      {
        path: 'client',
        loadChildren: './modules/client-portal/client-portal.module#ClientPortalModule'
      },
      {
        path: 'not-allowed',
        component: PageNotAllowedComponent
      }
    ]
  },
  {
    path: '',
    canActivate: [AgencyNoAuthGuard],
    loadChildren: './modules/auth/auth.module#AuthModule'
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '/web' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule { }
