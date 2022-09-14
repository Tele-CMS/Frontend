import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageAgencyComponent } from './manage-agency/manage-agency.component';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminAuthGuard } from './auth.guard';
import { SuperAdminNoAuthGuard } from './noAuth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperAdminMaterialModule } from './superadmin.material.module';
import { MainContainerComponent } from './main-container/main-container.component';
import { SharedModule } from '../shared/shared.module';
import { CommonService } from './core/services';
import { LayoutService } from '../platform/modules/core/services';
import { ManageAgencyService } from './manage-agency/manage-agency.service';
import { AddAgencyComponent } from './manage-agency/add-agency/add-agency.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './core/interceptors';
import { ManageDatabaseComponent } from './manage-database/manage-database.component';
import { AddDatabaseComponent } from './manage-database/add-database/add-database.component';
import { ManageDatabaseService } from './manage-database/manage-database.service';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SuperAdminMaterialModule,
    SharedModule,
    HttpClientModule
  ],
  declarations: [
    DashboardComponent,
    ManageAgencyComponent,
    MainContainerComponent,
    AddAgencyComponent,
    ManageDatabaseComponent,
    AddDatabaseComponent
  ],
  entryComponents:[AddDatabaseComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    SuperAdminAuthGuard,
    SuperAdminNoAuthGuard,
    CommonService,
    LayoutService,
    ManageAgencyService,
    ManageDatabaseService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, width: '700px' } }

  ]
})
export class SuperAdminPortalModule {
  constructor(commonService: CommonService) {
    // commonService.initializeAuthData();
  }
}
