import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicationTabsComponent } from './medication-tabs/medication-tabs.component';
import { MedicationModuleRoutingModule } from './medication-module.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
// import { ClinicalHistoryMaterialsModule } from '../clinical-history/clinical-history-materials.module';
import { ResizableModule } from 'angular-resizable-element';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ScrollbarModule } from 'ngx-scrollbar';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MedicationModuleMaterialsModule } from './medication-module-materials.module';
import { MedicationModuleService } from './medication-module.service';
import { CurrentMedicationModalComponent } from './current-medication/current-medication-modal/current-medication-modal.component';
import { CurrentMedicationComponent } from './current-medication/current-medication.component';
import { MedicationModalComponent } from './medication/medication-modal/medication-modal.component';
import { MedicationComponent } from './medication/medication.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MedicationModuleRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MedicationModuleMaterialsModule,
    ResizableModule,
    [NgxMaterialTimepickerModule.forRoot()],
    ScrollbarModule,
    DragAndDropModule ,
    NgxMatSelectSearchModule
  ],
  declarations: [MedicationTabsComponent,CurrentMedicationComponent,CurrentMedicationModalComponent,MedicationComponent,MedicationModalComponent],
  providers:[MedicationModuleService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '60vw' } }],
  entryComponents:[CurrentMedicationModalComponent,MedicationModalComponent]
})
export class MedicationModuleModule { }
