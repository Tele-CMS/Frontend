import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SchedulingRoutingModule } from './scheduling-routing.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { SchedulerDialogComponent } from './scheduler/scheduler-dialog/scheduler-dialog.component';
import { SchedulerMaterialModule } from './scheduler.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { SharedModule } from '../../../shared/shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {NgxMaskModule} from 'ngx-mask';
import { RecurrenceRuleComponent } from './scheduler/recurrence-rule/recurrence-rule.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { EncounterModule } from '../agency-portal/encounter/encounter.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    ReactiveFormsModule,
    SchedulingRoutingModule,
    SchedulerMaterialModule,
    EncounterModule,
    [NgxMaterialTimepickerModule.forRoot()],
    SharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    [NgxMaskModule.forRoot()]
  ],

  declarations: [SchedulerComponent, SchedulerDialogComponent, RecurrenceRuleComponent],
  entryComponents: [
    SchedulerDialogComponent,

  ],
  providers: [
    SchedulerService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false, disableClose: true, minWidth: '55%',maxWidth: '90%' } }
  ],
  exports:[
    SchedulerComponent, SchedulerDialogComponent, RecurrenceRuleComponent,SchedulerDialogComponent
  ]
})
export class SchedulingModule { }
