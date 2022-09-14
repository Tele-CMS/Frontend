import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SoapComponent } from './soap/soap.component';
import { EncounterComponent } from './encounter/encounter.component';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';

const routes: Routes = [
  {
    path: '',
    component: EncounterComponent
  },
  {
    path: 'soap',
    component: SoapComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncounterRoutingModule { }
