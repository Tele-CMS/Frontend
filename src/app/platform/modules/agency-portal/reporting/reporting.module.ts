import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentReportComponent } from './appointment-report/appointment-report.component';
import { ReportingRoutingModule } from './reporting-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule, MatInputModule, MatDatepickerModule,
  MatSelectModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatDialogModule, MatTooltipModule
} from '@angular/material';
import { ReportingService } from './reporting.service';
import { SendEmailModalComponent } from './appointment-report/send-email-modal/send-email-modal.component';
import { CustomReportComponent } from './custom-report/custom-report.component';
import { CustomBulkMessageModalComponent } from './custom-report/custom-report-bulk-message-modal/custom-report-bulk-message-modal.component';
import { CustomBulkEmailModalComponent } from './custom-report/custom-report-bulk-email-modal/custom-report-bulk-email-modal.component';
import { SendMessageModalComponent } from './appointment-report/send-message-modal/send-message-modal.component';
// import { EasyQueryComponent } from '../compliance-query-builder/easyquery/easyquery.component';
// import { ComplianceQueryBuilderModule } from '../compliance-query-builder/compliance-query-builder.module';
// import { EasyQueryDialogComponent } from '../compliance-query-builder/easy-query-dialog-component/easy-query-dialog-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReportingRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
    ReactiveFormsModule,
    // ComplianceQueryBuilderModule
  ],
  declarations: [AppointmentReportComponent, SendEmailModalComponent, CustomReportComponent, CustomBulkMessageModalComponent, CustomBulkEmailModalComponent, SendMessageModalComponent],
  entryComponents: [SendEmailModalComponent, CustomBulkMessageModalComponent, CustomBulkEmailModalComponent, SendMessageModalComponent],
  providers: [ReportingService]
})
export class ReportingModule { }
