import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyHistoryComponent } from './family-history/family-history.component';
import { SocialHistoryComponent } from './social-history/social-history.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "my-family-history",
    component: FamilyHistoryComponent
  },
  {
    path: "my-social-history",
    component: SocialHistoryComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }
