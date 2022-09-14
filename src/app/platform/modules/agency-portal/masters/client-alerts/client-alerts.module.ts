import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientAlertsListingComponent } from './client-alerts-listing/client-alerts-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { AgencyPermissionGuard } from '../../agency_routing_permission.guard';
import { ClientAlertsService } from './client-alerts.service';
import { MatSelectModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatPaginator, MatPaginatorModule, MatButtonModule, MatDatepickerModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailModalComponent } from './email-modal/email-modal.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReminderModalComponent } from './reminder-modal/reminder-modal.component';
const routes: Routes = [
  {
    path: '',
    //canActivate: [AgencyPermissionGuard],
    component: ClientAlertsListingComponent
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
    MatDatepickerModule,
    MatDialogModule,
    SharedModule,
  ],
  declarations: [ClientAlertsListingComponent, EmailModalComponent, MessageModalComponent, ReminderModalComponent],
  entryComponents: [EmailModalComponent, MessageModalComponent, ReminderModalComponent],
  providers: [
    ClientAlertsService
  ]
})
export class ClientAlertsModule { }
