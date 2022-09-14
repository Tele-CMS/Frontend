

import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { ProviderDocumentsComponent } from "./providerdocuments/providerdocuments.component";
const routes: Routes = [
  {
    path: "",
    component: ProviderDocumentsComponent 
  },
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderDocumentRoutingModule {}
