import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogComponent } from './audit-log/audit-log.component';
import { LoginLogComponent } from './login-log/login-log.component';
import { LogsService } from './logs.service';
import { SharedModule } from '../../../../shared/shared.module';
import { LogsRoutingModule } from './logs.module.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformMaterialModule } from '../../../platform.material.module';
import { HRAReportLogComponent } from './hra-reportlog/hra-reportlog.component';
import { MemberProgramsEnrollComponent } from './programsenroll-log/programsenroll-log.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LogsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformMaterialModule,
  ],
  declarations: [AuditLogComponent, LoginLogComponent,HRAReportLogComponent,MemberProgramsEnrollComponent],
  providers: [
    LogsService
  ]
})
export class LogsModule { }
