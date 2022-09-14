import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { onboardingRoutes } from './onboarding.routing';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingDetailsComponent } from './details/details.component';
import { OnboardingListComponent } from './list/list.component';
import { AddHeaderModalComponent } from './modals/add-header-modal/add-header-modal.component';
import { AddDetailsModalComponent } from './modals/add-details-modal/add-details-modal.component';


import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { OnboardingService } from './onboarding.service';
import { QuillModule } from 'ngx-quill';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { OnboardingApiService } from './onboarding-api.service';
import { DataPaginationComponent } from '../data-pagination/data-pagination.component';
import { IconsModule } from 'src/app/shared/icons/icons.module';


@NgModule({
    declarations: [
        OnboardingComponent,
        OnboardingDetailsComponent,
        OnboardingListComponent,
        AddHeaderModalComponent,
        AddDetailsModalComponent,
        DataPaginationComponent
    ],
    imports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(onboardingRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatTabsModule, 
        DropdownModule,
        TooltipModule,
        QuillModule.forRoot(),
        NgxPaginationModule,

    ]  ,entryComponents: [ 
        AddDetailsModalComponent],exports: [DataPaginationComponent],
  
    providers:[OnboardingApiService,{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '55%',maxWidth: '90%' } }]
})
export class OnboardingModule
{
}
