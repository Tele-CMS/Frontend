import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClearingHouseListingComponent } from './clearing-house-listing/clearing-house-listing.component';


const routes: Routes = [
  {
    path: '',
    component: ClearingHouseListingComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClearingHouseRoutingModule { }
