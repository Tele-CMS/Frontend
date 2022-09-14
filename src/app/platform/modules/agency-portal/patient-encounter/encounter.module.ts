import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoapComponent } from './soap/soap.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatMenuModule, MatIconModule, MatCheckboxModule, MatDatepickerModule } from '@angular/material';
import { EncounterRoutingModule } from './encounter-routing.module';
import { EncounterService } from './encounter.service';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignDialogComponent } from './sign-dialog/sign-dialog.component';
import { EncounterComponent } from './encounter/encounter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EncounterPrintPDFModalComponent } from './encounter-pdf-print-dialog/encounter-pdf-print-dialog.component';
import { ShowHTMLDataPipe } from 'src/app/shared/pipes/showHTMLData.pipe';
import { EncounterNotesModelComponent } from './encounter-notes-model/encounter-notes-model.component';
import { ReviewOfSystemsModelComponent } from './review-of-systems-model/review-of-systems-model.component';


@NgModule({
  imports: [
    CommonModule,
    EncounterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    SignaturePadModule,
    SharedModule,

  ],
  declarations: [SoapComponent, SignDialogComponent, EncounterComponent,EncounterPrintPDFModalComponent, EncounterNotesModelComponent,ReviewOfSystemsModelComponent],
  providers: [EncounterService,ShowHTMLDataPipe,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '60vw' } }],
  entryComponents: [SignDialogComponent, EncounterPrintPDFModalComponent, EncounterNotesModelComponent,ReviewOfSystemsModelComponent],
  exports: [ReviewOfSystemsModelComponent]
})
export class EncounterModule { }
