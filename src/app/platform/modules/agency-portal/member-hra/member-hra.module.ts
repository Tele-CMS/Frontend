import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberHraListingComponent } from './member-hra-listing/member-hra-listing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MemberHRARoutingModule } from './member-hra.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformMaterialModule } from 'src/app/platform/platform.material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MemberHRAService } from './member-hra.service';
import { AssignAssessmentModalComponent } from './member-hra-listing/assign-assessment-modal/assign-assessment-modal.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { QuestionairePreviewModule } from '../questionaire-preview/questionaire-preview.module';
import { BulkUpdateAssessmentComponent } from './member-hra-listing/bulk-update-assessment/bulk-update-assessment.component';
import { BulkEmailModalComponent } from './member-hra-listing/member-hra-bulk-email-modal/member-hra-bulk-email-modal.component';
import { ExecutiveReportModalComponent } from './member-hra-listing/executive-report-modal/executive-report-modal.component';
import { PreviewIndividualReportComponent } from './member-hra-listing/preview-individual-report/preview-individual-report.component';
import { BulkMessageModalComponent } from './member-hra-listing/member-hra-bulk-message-modal/member-hra-bulk-message-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MemberHRARoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformMaterialModule,
    NgxMatSelectSearchModule,
    QuestionairePreviewModule
  ],
  providers:[MemberHRAService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '60vw', maxWidth: '75vw'  } }
  ],
  declarations: [MemberHraListingComponent,AssignAssessmentModalComponent, BulkUpdateAssessmentComponent, BulkEmailModalComponent,ExecutiveReportModalComponent,PreviewIndividualReportComponent, BulkMessageModalComponent],
  entryComponents:[AssignAssessmentModalComponent,BulkUpdateAssessmentComponent, BulkEmailModalComponent,ExecutiveReportModalComponent,PreviewIndividualReportComponent,BulkMessageModalComponent ],
  exports:[BulkUpdateAssessmentComponent]
})
export class MemberHraModule { }
