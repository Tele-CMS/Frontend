import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { PayerListingComponent } from './payer-listing/payer-listing.component';
//import { PayerComponent } from './payer/payer.component';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';
import { PayerListingComponent } from '../payers/payer-listing/payer-listing.component';
import { PayerComponent } from '../payers/payer/payer.component';
import { AddCareCategoryComponent } from './add-carecategory/add-carecategory.component';
// import { AddKeywordComponent } from './add-keyword/add-keyword.component';
import { CareCategoryComponent } from './carecategory/carecategory.component';
import { KeywordComponent } from './keywords/keyword.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AgencyPermissionGuard],
    component: KeywordComponent,
  },
  // {
  //   path: 'addkeyword',
  //   component: AddKeywordComponent,
  // },
  {
    path: 'carecategorylisting',
    component: CareCategoryComponent,
  },
  {
    path: 'addcarecategory',
    component: AddCareCategoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeywordRoutingModule { }
