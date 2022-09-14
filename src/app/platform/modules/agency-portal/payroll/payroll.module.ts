import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollGroupComponent } from './payroll-group/payroll-group.component';
import { PayrollRoutingModule } from './payroll-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformMaterialModule } from '../../../platform.material.module';
import { SharedModule } from '../../../../shared/shared.module';
import { PayrollGroupService } from './payroll-group/payroll-group.service';
import { PayrollGroupModalComponent } from './payroll-group/payroll-group-modal/payroll-group-modal.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { PayrollBreaktimeComponent } from './payroll-breaktime/payroll-breaktime.component';
import { PayrollBreaktimeService } from './payroll-breaktime/payroll-breaktime.service';
import { PayrollBreaktimeModalComponent } from './payroll-breaktime/payroll-breaktime-modal/payroll-breaktime-modal.component';
import { ManageHolidaysComponent } from './manage-holidays/manage-holidays.component';
import { ManageHolidayService } from './manage-holidays/manage-holidays.service';
import { HolidayModalComponent } from './manage-holidays/manage-holiday-modal/manage-holiday-modal.component';
import { UserTimeSheetComponent } from './user-time-sheet/user-time-sheet.component';
import { UserTimeSheetTabularViewComponent } from './user-time-sheet-tabular-view/user-time-sheet-tabular-view.component';
import { UserTimeSheetSheetViewComponent } from './user-time-sheet-sheet-view/user-time-sheet-sheet-view.component';
import { UserTimeSheetService } from './user-time-sheet/user-time-sheet.service';
import { UserTimeSheetViewService } from './user-time-sheet-sheet-view/user-time-sheet-sheet.service';
import { UserTimeSheetTabularViewService } from './user-time-sheet-tabular-view/user-time-sheet-tablular.service';
import { AddUserTimeSheetModalComponent } from './user-time-sheet-tabular-view/user-timesheet-table-modal/user-timesheet-table-modal.component';
import { PayrollReportComponent } from './payroll-report/payroll-report.component';
import { PayrollReportService } from './payroll-report/payroll-report.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  imports: [
    CommonModule,
    PayrollRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformMaterialModule,
    SharedModule,
    [NgxMaterialTimepickerModule.forRoot()]
  ],
  declarations: [PayrollGroupComponent, PayrollGroupModalComponent, PayrollBreaktimeComponent, PayrollBreaktimeModalComponent, ManageHolidaysComponent, HolidayModalComponent, UserTimeSheetComponent, UserTimeSheetTabularViewComponent, UserTimeSheetSheetViewComponent, AddUserTimeSheetModalComponent, PayrollReportComponent],
  providers: [
    PayrollGroupService,
    PayrollBreaktimeService,
    ManageHolidayService,
    UserTimeSheetService,
    UserTimeSheetViewService,
    UserTimeSheetTabularViewService,
    PayrollReportService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '55%',maxWidth: '90%' }
     }

  ],
  entryComponents: [
    PayrollGroupModalComponent, PayrollBreaktimeModalComponent, HolidayModalComponent, UserTimeSheetTabularViewComponent, UserTimeSheetSheetViewComponent, AddUserTimeSheetModalComponent
  ]
})
export class PayrollModule { }
