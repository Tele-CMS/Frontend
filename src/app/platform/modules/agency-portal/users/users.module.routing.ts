import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { UserListingComponent } from "./user-listing/user-listing.component";
import { UserComponent } from "./user/user.component";
import { UserLeavesComponent } from "./user-leaves/user-leaves.component";
import { PayrollRateComponent } from "./payroll-rate/payroll-rate.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserDocumentsComponent } from "./user-documents/user-documents.component";
import { UserInvitationComponent } from "./user-invitation/user-invitation.component";
import { AgencyPermissionGuard } from "../agency_routing_permission.guard";

const routes: Routes = [
  {
    path: "",
    canActivate: [AgencyPermissionGuard],
    children: [
      {
        path: "",
        component: UserListingComponent
      },
      {
        path: "users",
        component: UserListingComponent
      },
      {
        path: "user",
        component: UserComponent
      },
      {
        path: "user-leaves",
        component: UserLeavesComponent
      },
      {
        path: "user-payroll",
        component: PayrollRateComponent
      },
      {
        path: "user-profile",
        component: UserProfileComponent
      },
      {
        path: "user-documents",
        component: UserDocumentsComponent
      },
      {
        path: "user-invitation",
        component: UserInvitationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
