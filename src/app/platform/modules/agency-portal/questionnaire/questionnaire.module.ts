import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents/documents.component';
import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformMaterialModule } from '../../../platform.material.module';
import { SharedModule } from '../../../../shared/shared.module';
import { DocumentsModalComponent } from './documents/document-modal/document-modal.component';
import { DocumentService } from './documents/document.service';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatAccordion } from '@angular/material';
import { QuestionnaireIndexComponent } from './questionnaire-index/questionnaire-index.component';
import { CategoryComponent } from './category/category.component';
import { CategoryCodeComponent } from './category-code/category-code.component';
import { SectionComponent } from './section/section.component';
import { SectionItemsComponent } from './section-items/section-items.component';
import { CategoryModalComponent } from './category/category-modal/category-modal.component';
import { CategoryCodeModalComponent } from './category-code/category-code-modal/category-code-modal.component';
import { SectionModalComponent } from './section/section-modal/section-modal.component';
import { SectionItemModalComponent } from './section-items/section-item-modal/section-item-modal.component';
import { AssignQuestionnaireComponent } from './assign-questionnaire/assign-questionnaire.component';
import { AssignQuestionnaireModalComponent } from './assign-questionnaire/assign-questionnaire-modal/assign-questionnaire-modal.component';
import { SignDailogComponent } from './assign-questionnaire/sign-dailog/sign-dailog.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { QuestionairePreviewModule } from '../questionaire-preview/questionaire-preview.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MemberHraModule } from '../member-hra/member-hra.module';

@NgModule({
  imports: [
    CommonModule,
    QuestionnaireRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformMaterialModule,
    NgxMatSelectSearchModule,
    SharedModule,
    SignaturePadModule,
    QuestionairePreviewModule,
    MemberHraModule
  ],
  declarations: [DocumentsComponent, DocumentsModalComponent, QuestionnaireIndexComponent, CategoryComponent, CategoryCodeComponent, SectionComponent, CategoryModalComponent, SectionItemsComponent, CategoryCodeModalComponent, SectionModalComponent, SectionItemModalComponent, AssignQuestionnaireComponent, AssignQuestionnaireModalComponent, SignDailogComponent],
  providers: [
    DocumentService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '60vw', maxWidth: '75vw' } }
  ],
  entryComponents: [
    DocumentsModalComponent, CategoryCodeComponent, CategoryComponent, SectionComponent, SectionItemsComponent, CategoryModalComponent, CategoryCodeModalComponent, SectionModalComponent, SectionItemModalComponent, AssignQuestionnaireModalComponent, SignDailogComponent
  ]
})
export class QuestionnaireModule { }
