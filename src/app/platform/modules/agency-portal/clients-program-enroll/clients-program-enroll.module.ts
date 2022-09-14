import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramsListingComponent } from './programs-listing/programs-listing.component';
import { EmailModalComponent } from './email-modal/email-modal.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { ClientsProgramService } from './clients-program.service';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';
import { MatDialogModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatDatepickerModule, MatButtonModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [
  {
    path: '',
    canActivate: [AgencyPermissionGuard],
    component: ProgramsListingComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatButtonModule, MatDialogModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatDatepickerModule,
    NgxMatSelectSearchModule
  ],
  declarations: [ProgramsListingComponent, EmailModalComponent, MessageModalComponent],
  entryComponents: [EmailModalComponent, MessageModalComponent],
  providers: [
    ClientsProgramService
  ]
})
export class ClientsProgramEnrollModule { }
