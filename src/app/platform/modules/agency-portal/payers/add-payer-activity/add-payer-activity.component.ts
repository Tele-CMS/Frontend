import { Component, OnInit, Input } from '@angular/core';
import { PayerActivityServiceCodesModel, PayerActivityServiceCodeModel } from '../payers.model';
import { PayersService } from '../payers.service';
import { FilterModel, ResponseModel, Metadata } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { AddActivityServiceCodeComponent } from './add-activity-service-code/add-activity-service-code.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-payer-activity',
  templateUrl: './add-payer-activity.component.html',
  styleUrls: ['./add-payer-activity.component.css']
})
export class AddPayerActivityComponent implements OnInit {
  masterActivities: any[] = [];
  @Input() payerId: number;
  @Input() activityId: number;
  activityServiceCodeData: PayerActivityServiceCodesModel[] = [];
  metaData: Metadata;
  filterModel: FilterModel;
  displayedColumns: Array<any> = [
    { displayName: 'Service Code', key: 'serviceCode', isSort: true, class: '', width: '12%' },
    // { displayName: 'Modifiers', key: 'attachedModifiers', isSort: true, class: '', width: '10%', },
    { displayName: 'Description', key: 'description', isSort: true, class: '', width: '28%', },
    { displayName: 'Unit Duration', key: 'unitDuration', isSort: true, class: '', width: '10%', },
    { displayName: 'Rate', key: 'ratePerUnit', isSort: true, class: '', width: '10%',type:'decimal' },
    { displayName: 'Billable', key: 'isBillable', isSort: true, class: '', width: '10%', type: true },
    { displayName: 'Req. Auth.', key: 'isRequiredAuthorization', isSort: true, class: '', width: '10%', type: true },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }

  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' }
  ];
  constructor(private payersService: PayersService, private actSCDialogModal: MatDialog, private notifier: NotifierService
  ) {
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
    this.getMasterActivities();
    this.getPayerActivityServiceCodes();
  }

  getPayerActivityServiceCodes() {
    if (this.activityId != null && this.activityId > 0) {
      this.payersService.getPayerActivityServiceCodes(this.payerId, this.activityId, this.filterModel).subscribe((response: ResponseModel) => {
        if (response != null && response.data != null && response.data.length > 0) {
          this.activityServiceCodeData = response.data;
          this.metaData = response.meta;
        }
      });
    }
  }

  getMasterActivities() {
    this.payersService.getMasterActivitiesForPayer(this.payerId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        this.masterActivities = response.data;
      }
    });
  }


  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order);
    this.getPayerActivityServiceCodes();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        {
          this.openDialog(id, actionObj.data.payerServiceCodeId);
          break;
        }
      case 'DELETE':
        {
          this.payersService.deletePayerActivityCode(id).subscribe((response: ResponseModel) => {
            if (response.statusCode == 200) {
              this.notifier.notify('success', response.message)
            } else if (response.statusCode == 401) {
              this.notifier.notify('warning', response.message);
            } else {
              this.notifier.notify('error', response.message)
            }
            this.getPayerActivityServiceCodes();
          });
        }
        break;
      default:
        break;
    }
  }


  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = "";
  }

  openDialog(id: number = null, payerServiceCodeId: number) {
    if (id != null && id > 0) {
      this.payersService.getActivityServiceCodeDetailById(id, null).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data, payerServiceCodeId, id);
        }
      });
    }
    else {
      this.createModal(new PayerActivityServiceCodeModel(), payerServiceCodeId, null);
    }
  }
  createModal(actServiceCode: PayerActivityServiceCodeModel, payerServiceCodeId: number, activityServiceCodeId: number) {
    let actServiceCodeModal;
    actServiceCodeModal = this.actSCDialogModal.open(AddActivityServiceCodeComponent, {
      hasBackdrop: true,
      data: {
        actServiceCode: actServiceCode,
        payerId: this.payerId,
        activityId: this.activityId,
        activityServiceCodeId: activityServiceCodeId || null,
        payerServiceCodeId: (payerServiceCodeId || null)
      }
    });
    actServiceCodeModal.afterClosed().subscribe((result: string) => {
      if (result == 'SAVE')
        this.getPayerActivityServiceCodes();
    });
  }
}
