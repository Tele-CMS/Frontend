import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddQuestionComponent } from './add-question/add-question.component';
import { ProviderQuestionnairesContainerComponent } from './provider-questionnaires-container/provider-questionnaires-container.component';

// const routes: Routes = [
//   {
//     path: '',
//     canActivate: [AgencyPermissionGuard],
//     component: ManagequestionnairesListComponent,
//   },
//   // {
//   //   path: '',
//   //   canActivate: [AgencyPermissionGuard],
//   //   component: ProviderquestionnairesComponent,
//   // },
//   {
//     path: 'questionnairelist',
//     component: ManagequestionnairesListComponent, 
//   },
//   {
//     path: 'addquestionnaires',
//     component: AddManagequestionnairesComponent, 
//   },
//   {
//     path: 'addproviderquestionnaires',
//     component: AddProviderquestionnairesComponent, 
//   },
//   {
//     path: 'addquestionnairesoptions',
//     component: AddQuestionnaireOptionsComponent,
//   },
//   {
//     path: 'questionslist',
//     component: ProviderquestionnairesListComponent,
//   }


// ];

const routes: Routes = [
  {
    path: '',
    component: ProviderQuestionnairesContainerComponent,
    children: [
      {
        path: 'add-question',
        component: AddQuestionComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderquestionnaireRoutingModule { }
