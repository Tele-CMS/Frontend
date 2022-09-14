import { FrontRoutingModule } from "./front/front-routing.module";
import { FrontModule } from "src/app/front/front.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SubDomainGuard } from "./subDomain.guard";
import { DoctorListComponent } from "./front/doctor-list/doctor-list.component";

const routes: Routes = [

  {
    path: "",
    canActivate: [SubDomainGuard],
    loadChildren: "./platform/modules/auth/auth.module#AuthModule"
    //  //platform.module#PlatformModule"
    //pathMatch: 'full',
    //loadChildren: "./front/front.module#FrontModule"
    //redirectTo: "/web/login-selection"

  },
  {
    path: "web",
    canActivate: [SubDomainGuard],
    loadChildren: "./platform/platform.module#PlatformModule"
  },
  {
    path: "webadmin",
    loadChildren:
      "./super-admin-portal/super-admin-portal.module#SuperAdminPortalModule"
  },
  {
    path: "doctor-list",
    component: DoctorListComponent
  },
  // {
  //   path: 'front',
  //   loadChildren: './front/front.module#FrontModule'
  // },
  // otherwise redirect to home
  { path: "**", redirectTo: "/" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
