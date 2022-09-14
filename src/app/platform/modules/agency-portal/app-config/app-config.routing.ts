import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppConfigurationComponent } from './app-configuration/app-configuration.component';


const routes: Routes = [
  {
    path: '',
    component: AppConfigurationComponent,
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppConfigRoutingModule { }
