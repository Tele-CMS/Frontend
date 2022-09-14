import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyPermissionGuard } from '../agency_routing_permission.guard';
import { DocumentsComponent } from './documents/documents.component';
import { QuestionnaireIndexComponent } from './questionnaire-index/questionnaire-index.component';
import { AssignQuestionnaireComponent } from './assign-questionnaire/assign-questionnaire.component';


const routes: Routes = [
    {
        path: '',
        canActivate: [AgencyPermissionGuard],
        component: DocumentsComponent,
    },
    {
        path: 'questionnaire-details',
        component: QuestionnaireIndexComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionnaireRoutingModule { }
