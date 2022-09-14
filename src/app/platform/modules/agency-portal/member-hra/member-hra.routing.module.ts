import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';
import { MemberHraListingComponent } from './member-hra-listing/member-hra-listing.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AgencyPermissionGuard],
    component: MemberHraListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberHRARoutingModule { }
