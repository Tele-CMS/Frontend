import { RefundHistoryComponent } from "./refund-history/refund-history.component";
import { PaymentHistoryComponent } from "./payment-history/payment-history.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ManageFeesRefundsComponent } from "./manage-fees-refunds/manage-fees-refunds.component";
const routes: Routes = [
  {
    path: "payment-history",
    component: PaymentHistoryComponent
  },
  {
    path: "refund-history",
    component: RefundHistoryComponent
  },
  {
    path: "manage-fees-refunds",
    component: ManageFeesRefundsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule {}
