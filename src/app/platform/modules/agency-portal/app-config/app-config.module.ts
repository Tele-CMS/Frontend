import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfigurationComponent } from './app-configuration/app-configuration.component';
import { AppConfigService } from './app-config.service';
import { MatInputModule, MatButtonModule, MatCheckboxModule } from '@angular/material';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppConfigRoutingModule } from './app-config.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    AppConfigRoutingModule
  ],
  declarations: [AppConfigurationComponent],
  providers:[AppConfigService]
})
export class AppConfigModule { }
