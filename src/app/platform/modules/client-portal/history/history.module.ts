import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FamilyHistoryComponent } from './family-history/family-history.component';
import { HistoryRoutingModule } from './history-routing.module';
import { SocialHistoryComponent } from './social-history/social-history.component';
import { PlatformMaterialModule } from 'src/app/platform/platform.material.module';
//import { HistoryContainerComponent } from './history-container/history-container.component';

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PlatformMaterialModule,
    SharedModule,
  ],
  declarations: [FamilyHistoryComponent,SocialHistoryComponent ],
  entryComponents: [FamilyHistoryComponent,SocialHistoryComponent],
})
export class HistoryModule { }
