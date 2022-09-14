import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentComponent } from './assessment/assessment.component';
import { AssessmentService } from './assessment.service';
import { SharedModule } from '../../../../shared/shared.module';

import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
         path: '',
         component: AssessmentComponent
      }
   ])
  ],
  declarations: [AssessmentComponent],
  providers: [ AssessmentService],
})
export class AssessmentModule { }
