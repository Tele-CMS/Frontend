import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormContainerComponent } from './form-container/form-container.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormRendererComponent } from './form-renderer/form-renderer.component';
import { TemplateListingComponent } from './template-listing/template-listing.component';

const routes: Routes = [
  {
    path: '',
    component: TemplateListingComponent
  },
  {
    path: 'builder',
    component: FormBuilderComponent
  },
  {
    path: 'render',
    component: FormRendererComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
