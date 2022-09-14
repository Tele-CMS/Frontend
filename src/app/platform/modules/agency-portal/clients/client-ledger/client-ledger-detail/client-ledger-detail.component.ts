import { Component, OnInit, Input } from '@angular/core';
import { ClientLedgerDetailsModel, ClientLedgerPaymentDetailsModel } from '../client-ledger.model';
import { ClientsService } from '../../clients.service';
import { ResponseModel } from '../../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { AddPaymentDetailComponent } from '../add-payment-detail/add-payment-detail.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-client-ledger-detail',
  templateUrl: './client-ledger-detail.component.html',
  styleUrls: ['./client-ledger-detail.component.css']
})
export class ClientLedgerDetailComponent implements OnInit {
  @Input() claimId: number;
  @Input() clientId: number;
  serviceLines: Array<ClientLedgerDetailsModel> = []
  paymentList: Array<ClientLedgerPaymentDetailsModel> = []
  isExpandedCodeArray: any = [];
  addPermission: boolean;
  updatePermission: boolean;
  constructor(private clientService: ClientsService, public dialogModal: MatDialog, private notifier: NotifierService) {

  }
  ngOnInit() {
    this.getClaimServiceLinesForPatientLedger();
    this.getUserPermissions();
  }

  getClaimServiceLinesForPatientLedger() {
    this.clientService.getClaimServiceLinesForPatient(this.claimId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        this.serviceLines = response.data.ServiceLines;
        this.serviceLines.forEach(x => {
          if (this.isExpandedCodeArray != undefined && this.isExpandedCodeArray.length > 0 && this.isExpandedCodeArray.findIndex(y => y == x.id) != -1)
            x.isExpanded = true;
          else
            x.isExpanded = false;
        })
        this.paymentList = response.data.PaymentList;
      }
    });
  }
  filterPayment(serviceLineId: number):Array<ClientLedgerPaymentDetailsModel>{
    let items = this.paymentList.filter(x => x.serviceLineId == serviceLineId);
    return items;
  }
  toggleDetails(id: number) {
    let obj = this.serviceLines.find(x => x.id == id);
    obj.isExpanded = obj.isExpanded == false ? true : false;
    if (obj.isExpanded)
      this.isExpandedCodeArray.push(obj.id);
    else {
      let index = this.isExpandedCodeArray.findIndex(y => y.id == obj.id);
      if (index != -1)
        this.isExpandedCodeArray.splice(index, 1)
    }
  }



  //open popup
  openDialog(id: number = null, serviceLineId: number) {
    if (id != null && id > 0) {
      this.clientService.getPaymentDetailById(id).subscribe((response: any) => {
        if (response != null && response.statusCode == 200 && response.data != null) {
          this.createModel(response.data);
        }
      });
    } else {
      let paymentDetailModel = new ClientLedgerPaymentDetailsModel();
      paymentDetailModel.serviceLineId = serviceLineId;
      paymentDetailModel.claimId = this.claimId;
      this.createModel(paymentDetailModel);
    }
  }

  //create modal
  createModel(paymentModel: any) {
    const modalPopup = this.dialogModal.open(AddPaymentDetailComponent, {
      hasBackdrop: true,
      data: { paymentModel: paymentModel, clientId: this.clientId },
    });
    modalPopup.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.getClaimServiceLinesForPatientLedger();
      }
    });
  }
  deletePaymentDetails(id: number) {
    this.clientService.deleteServiceLinePaymentDetail(id).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.notifier.notify('success', response.message);
        this.getClaimServiceLinesForPatientLedger();
      }
      else {
        this.notifier.notify('error', response.message);
      }
    });
  }

  getUserPermissions() {
    const actionPermissions = this.clientService.getUserScreenActionPermissions('CLIENT', 'CLIENT_LEDGER_LIST');
    const { CLIENT_LEDGER_LIST_ADD, CLIENT_LEDGER_LIST_UPDATE } = actionPermissions;
      
    this.addPermission = CLIENT_LEDGER_LIST_ADD || false;
    this.updatePermission = CLIENT_LEDGER_LIST_UPDATE || false;  
  }
}
