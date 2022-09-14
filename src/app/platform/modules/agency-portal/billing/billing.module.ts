import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingRoutingModule } from './billing-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingMaterialModule } from './billing-material.module';
import { ReadyToBillComponent } from './ready-to-bill/ready-to-bill.component';
import { ClaimsComponent } from './claims/claims.component';
import { ClaimsService } from './claims/claims.service';
import { GenerateClaimDialogComponent } from './claims/generate-claim-dialog/generate-claim-dialog.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { ClaimServiceCodeDialogComponent } from './claims/claim-service-code-dialog/claim-service-code-dialog.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EobPaymentDialogComponent } from './claims/eob-payment-dialog/eob-payment-dialog.component';
import { SubmittedClaimsComponent } from './submitted-claims/submitted-claims.component';
import { ReSubmitClaimDialogComponent } from './claims/re-submit-claim-dialog/re-submit-claim-dialog.component';
import { EDIResponseComponent } from './edi-response/edi-response.component';
import { SettledComponent } from './settled/settled.component';
import { ApplyPaymentComponent } from './apply-payment/apply-payment.component';
import { Edi837historyComponent } from './edi837history/edi837history.component';
import { ClaimHistoryComponent } from './claim-history/claim-history.component';
import { ScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    BillingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BillingMaterialModule,
    SharedModule,
    ScrollbarModule
  ],
  declarations: [ReadyToBillComponent, ClaimsComponent, GenerateClaimDialogComponent, ClaimServiceCodeDialogComponent, EobPaymentDialogComponent, SubmittedClaimsComponent, ReSubmitClaimDialogComponent, EDIResponseComponent, SettledComponent, ApplyPaymentComponent, Edi837historyComponent, ClaimHistoryComponent],
  entryComponents: [ReadyToBillComponent, GenerateClaimDialogComponent, ClaimServiceCodeDialogComponent, EobPaymentDialogComponent, SubmittedClaimsComponent, ReSubmitClaimDialogComponent, EDIResponseComponent, SettledComponent, Edi837historyComponent,ClaimHistoryComponent],
  providers: [ClaimsService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, minWidth: '55%',maxWidth: '90%' } }
  ]
})
export class BillingModule { }
