import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PayerListingComponent } from './payer-listing/payer-listing.component';
// import { PayerComponent } from './payer/payer.component';
// import { PayerServiceCodesComponent } from './payer-service-codes/payer-service-codes.component';
// import { PayerActivityComponent } from './payer-activity/payer-activity.component';
// import { PayersRoutingModule } from './payers.routing.module';
// import { PayersService } from './payers.service';
// import { SharedModule } from '../../../../shared/shared.module';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { PlatformMaterialModule } from '../../../platform.material.module';
// import { AddPayerComponent } from './add-payer/add-payer.component';
// import { PayerServiceCodeModalComponent } from './payer-service-codes/payer-service-code-modal/payer-service-code-modal.component';
// import { AddPayerActivityComponent } from './add-payer-activity/add-payer-activity.component';
// import { AddActivityServiceCodeComponent } from './add-payer-activity/add-activity-service-code/add-activity-service-code.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { PayersRoutingModule } from '../payers/payers.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformMaterialModule } from 'src/app/platform/platform.material.module';
import { KeywordComponent } from './keywords/keyword.component';
import { AddPayerComponent } from '../payers/add-payer/add-payer.component';
import { PayerServiceCodesComponent } from '../payers/payer-service-codes/payer-service-codes.component';
import { PayerActivityComponent } from '../payers/payer-activity/payer-activity.component';
import { PayerServiceCodeModalComponent } from '../payers/payer-service-codes/payer-service-code-modal/payer-service-code-modal.component';
import { AddActivityServiceCodeComponent } from '../payers/add-payer-activity/add-activity-service-code/add-activity-service-code.component';
import { KeywordService } from './keyword.service';
import { PayerListingComponent } from '../payers/payer-listing/payer-listing.component';
import { PayerComponent } from '../payers/payer/payer.component';
import { AddPayerActivityComponent } from '../payers/add-payer-activity/add-payer-activity.component';
import { KeywordRoutingModule } from './keyword.routing.module';
// import { AddKeywordComponent } from './add-keyword/add-keyword.component';
import { PayersService } from '../payers/payers.service';
import { CareCategoryComponent } from './carecategory/carecategory.component';
import { AddCareCategoryComponent } from './add-carecategory/add-carecategory.component';

@NgModule({
  imports: [
    CommonModule,
    KeywordRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformMaterialModule,
  ],
  entryComponents:[
    //KeywordComponent,
    // AddKeywordComponent,
    //CareCategoryComponent,
    //AddCareCategoryComponent
  ],
  providers:[KeywordService,PayersService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '55%',maxWidth: '90%' } }
  ],
  declarations: [
    //KeywordComponent,
    // AddKeywordComponent,
    //CareCategoryComponent,
    //AddCareCategoryComponent
  ]
})
export class KeywordModule { }  
