import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ServiceCodeModalComponent } from './service-code-modal/service-code-modal.component';
import { ServiceCodeService } from './service-code.service';
import { ServiceCodeModal } from './service-code.modal';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';


@Component({
  selector: 'app-service-codes',
  templateUrl: './service-codes.component.html',
  styleUrls: ['./service-codes.component.css']
})
export class ServiceCodesComponent implements OnInit {
  serviceCodeModal: ServiceCodeModal;
  serviceCodeData: ServiceCodeModal[];
  metaData: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  searchText: string = "";
  filterModel: FilterModel;
  addPermission: boolean;

  constructor(
    private serviceCodeDailog: MatDialog,
    public serviceCodeService: ServiceCodeService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
    this.displayedColumns = [
      { displayName: 'Service Code', key: 'serviceCode', isSort: true, class: '', width: '15%' },
      { displayName: 'Description', key: 'description', isSort: true, class: '', width: '25%', type: "30", isInfo: true },
      { displayName: 'Billable', key: 'isBillable', width: '10%', type: true },
      { displayName: 'Unit Duration', key: 'unitDuration', width: '10%' },
      { displayName: 'Unit Type', key: 'unitTypeName', width: '10%' },
      { displayName: 'Rate Per Unit', key: 'ratePerUnit', width: '10%',type:'decimal' },
      { displayName: 'Req. Authorization', key: 'isRequiredAuthorization', width: '10%', type: true },
      { displayName: 'Actions', key: 'Actions', isSort: true, class: '', width: '10%' }
    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    ];
  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getListData();
    this.getUserPermissions();
  }

  createModel(serviceCodeModal: ServiceCodeModal) {
    const serviceCodeModalPopup = this.serviceCodeDailog.open(ServiceCodeModalComponent, {
      hasBackdrop: true,
      data: serviceCodeModal || new ServiceCodeModal(),
    });
    serviceCodeModalPopup.afterClosed().subscribe(result => {
      if (result === 'SAVE')
        this.getListData()
    });
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getListData();
  }
  openDialog(id?: number): void {
    this.serviceCodeModal = {
      id: id || 0,
    }
    if (!this.serviceCodeModal.id) {
      this.createModel(this.serviceCodeModal)
    } else {
      this.serviceCodeService.get(id).subscribe(response => {
        this.serviceCodeModal = {
          ...response,
          modifierModel: (response.modifierModel || []).map(obj => {
            return {
              modifier: obj.modifier,
              rate: obj.rate,
            }
          }),
        };
        this.createModel(this.serviceCodeModal)
      })
    }
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getListData();
  }
  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getListData();
  // }

  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getListData();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        this.deleteDetails(id);
        break;
      default:
        break;
    }
  }

  getListData() {
    this.filterModel.sortColumn = this.filterModel.sortColumn || 'id';
    this.filterModel.sortOrder = this.filterModel.sortOrder || 'desc';
    this.serviceCodeService.getAll(this.filterModel)
      .subscribe(
        (response: any) => {   
          if (response.statusCode === 200) {
            this.serviceCodeData = response.data;
            this.metaData = response.meta;
          } else {
            this.serviceCodeData = [];
            this.metaData = {};
          }
          this.metaData.pageSizeOptions = [5,10,25,50,100];
          
        });
  }

  deleteDetails(id: number) {
    this.dialogService.confirm(`Once you click yes, all the appointments and patients linked with this service code will get effected. Are you sure you want to delete this service code ?`).subscribe((result: any) => {
      if (result == true) {
        this.serviceCodeService.delete(id)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifier.notify('success', response.message)
              this.getListData();
            } else if (response.statusCode === 401) {
              this.notifier.notify('warning', response.message)
            } else {
              this.notifier.notify('error', response.message)
            }
          })
      }
    })
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  

  getUserPermissions() {
    const actionPermissions = this.serviceCodeService.getUserScreenActionPermissions('MASTERS', 'MASTERS_SERVICECODES_LIST');
    const { MASTERS_SERVICECODES_LIST_ADD, MASTERS_SERVICECODES_LIST_UPDATE, MASTERS_SERVICECODES_LIST_DELETE } = actionPermissions;
    if (!MASTERS_SERVICECODES_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_SERVICECODES_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_SERVICECODES_LIST_ADD || false;

  }

}
