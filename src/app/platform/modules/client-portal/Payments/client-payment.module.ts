import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientPaymentRoutingModule } from './client-payment-routing.module';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { RefundHistoryComponent } from './refund-history/refund-history.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//import { PaymentContainerComponent } from './payment-container/payment-container.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ClientPaymentRoutingModule
  ],
  declarations: [PaymentHistoryComponent, RefundHistoryComponent, ],
  entryComponents: [
    PaymentHistoryComponent, RefundHistoryComponent,
    // PaymentContainerComponent
    
  ],
})
export class ClientPaymentModule { }
