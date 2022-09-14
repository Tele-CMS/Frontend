import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientProgramsRoutingModule } from './client-programs-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientProgramsMaterialsModule } from './client-programs-materials.module';
import { ProgramsComponent } from './programs/programs.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { ClientProgramsService } from './client-programs.service';
import { DiseaseManagementPlanActivityComponent } from './disease-management-plan-activity/disease-management-plan-activity.component';
import { DMPActivityService } from './disease-management-plan-activity/disease-management-plan-activity.service';
import { DMPModalComponent } from './disease-management-plan-activity/dmp-modal/dmp-modal.component';
import { AssignProgramModalComponent } from './programs/assign-program-modal/assign-program-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ClientProgramsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ClientProgramsMaterialsModule,
  ],
  declarations: [ProgramsComponent, DiseaseManagementPlanActivityComponent, DMPModalComponent,AssignProgramModalComponent],
  entryComponents: [DMPModalComponent,AssignProgramModalComponent],
  providers: [
    ClientProgramsService,
    DMPActivityService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '60vw', maxWidth: '75vw' } }
  ]
})
export class ClientProgramsModule { }
