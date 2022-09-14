import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentPreviewComponent } from './document-preview/document-preview.component';
import { QuestionairePreviewService } from './questionaire-preview.service';
import { MatExpansionModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatRadioModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatInputModule,
  ],
  providers: [QuestionairePreviewService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '60vw', maxWidth: '75vw' } }
  ],
  declarations: [DocumentPreviewComponent],
  entryComponents: [DocumentPreviewComponent],
  exports: [DocumentPreviewComponent]
})
export class QuestionairePreviewModule { }
