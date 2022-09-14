import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimsComponent } from './claims/claims.component';
import { ApplyPaymentComponent } from './apply-payment/apply-payment.component';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';

const routes: Routes = [
  {
    path: 'claims',
    canActivate: [AgencyPermissionGuard],
    component: ClaimsComponent,
  },
  {
    path: 'apply-payment',
    canActivate: [AgencyPermissionGuard],
    component: ApplyPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
