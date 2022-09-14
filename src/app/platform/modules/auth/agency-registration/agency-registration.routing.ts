import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyRegistrationComponent } from './agency-registration.component';
const routes: Routes = [
  {
    path: '',
    //canActivate: [AgencyAuthGuard],
    component: AgencyRegistrationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyRegistrationRoutingModule { }
