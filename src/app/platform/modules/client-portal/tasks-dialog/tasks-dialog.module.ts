import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksDialogComponent } from './tasks-dialog/tasks-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule, MatInputModule, MAT_DIALOG_DEFAULT_OPTIONS, MatDatepickerModule, MatDialogModule, MatButtonModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { TasksDialogService } from './tasks-dialog.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  providers: [TasksDialogService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '60vw' } }
  ],
  declarations: [TasksDialogComponent],
  entryComponents: [TasksDialogComponent],
  exports: [TasksDialogComponent]
})
export class TasksDialogModule { }
