import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientEncounterListingComponent } from './client-encounter-listing/client-encounter-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule, MatFormFieldModule, MatTooltipModule, MatButtonModule, MatPaginatorModule, MatInputModule, MatDatepickerModule, MatDialogModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientEncounterService } from './client-encounter.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmailModalComponent } from './email-modal/email-modal.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
const routes: Routes = [
  {
    path: '',
    //canActivate: [AgencyPermissionGuard],
    component: ClientEncounterListingComponent
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDialogModule,
    SharedModule,
  ],
  declarations: [ClientEncounterListingComponent, EmailModalComponent, MessageModalComponent],
  entryComponents: [EmailModalComponent, MessageModalComponent],
  providers: [
    ClientEncounterService
  ]
})
export class ClientEncounterModule { }
