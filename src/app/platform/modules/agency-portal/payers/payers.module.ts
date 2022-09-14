import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayerListingComponent } from './payer-listing/payer-listing.component';
import { PayerComponent } from './payer/payer.component';
import { PayerServiceCodesComponent } from './payer-service-codes/payer-service-codes.component';
import { PayerActivityComponent } from './payer-activity/payer-activity.component';
import { PayersRoutingModule } from './payers.routing.module';
import { PayersService } from './payers.service';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformMaterialModule } from '../../../platform.material.module';
import { AddPayerComponent } from './add-payer/add-payer.component';
import { PayerServiceCodeModalComponent } from './payer-service-codes/payer-service-code-modal/payer-service-code-modal.component';
import { AddPayerActivityComponent } from './add-payer-activity/add-payer-activity.component';
import { AddActivityServiceCodeComponent } from './add-payer-activity/add-activity-service-code/add-activity-service-code.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    PayersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformMaterialModule,
  ],
  entryComponents:[AddPayerComponent,PayerServiceCodesComponent,PayerActivityComponent,PayerServiceCodeModalComponent,AddActivityServiceCodeComponent],
  providers:[PayersService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '55%',maxWidth: '90%' } }
  ],
  declarations: [PayerListingComponent, PayerComponent, PayerServiceCodesComponent, PayerActivityComponent, AddPayerComponent, PayerServiceCodeModalComponent, AddPayerActivityComponent, AddActivityServiceCodeComponent]
})
export class PayersModule { }
