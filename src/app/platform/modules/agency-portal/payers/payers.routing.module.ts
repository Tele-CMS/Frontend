import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayerListingComponent } from './payer-listing/payer-listing.component';
import { PayerComponent } from './payer/payer.component';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AgencyPermissionGuard],
    component: PayerListingComponent,
  },
  {
    path: 'payer',
    component: PayerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayersRoutingModule { }
