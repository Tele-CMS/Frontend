import { Routes, RouterModule } from "@angular/router";
import { NgModule, Component } from "@angular/core";
import { ClientComponent } from "./client/client.component"
import { ClientPermissionGuard } from "../../client-portal/client_routing_permission.guard";
import { AddressComponent } from "./address/address.component";
const routes: Routes = [
  {
    path: "",
    canActivate: [ClientPermissionGuard],
    component: ClientComponent
  },
  {
    path: "address",
    canActivate: [ClientPermissionGuard],
    component: AddressComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {}
