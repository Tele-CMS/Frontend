import { Component, OnInit } from '@angular/core';
import { ResponseModel, FilterModel } from '../../../core/modals/common-model';
import { InsuranceTypeModalComponent } from './insurance-type-modal/insurance-type-modal.component';
import { InsuranceTypeModel } from './insurance-type.model';
import { MatDialog } from '@angular/material';
import { InsuranceTypeService } from './insurance-type.service';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-insurance-type',
  templateUrl: './insurance-type.component.html',
  styleUrls: ['./insurance-type.component.css']
})
export class InsuranceTypeComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel;
  searchText: string = '';
  insuranceTypeData: InsuranceTypeModel[];
  addPermission: boolean;
  displayedColumns: Array<any> = [
    { displayName: 'Insurance Type', key: 'insuranceType', isSort: true, class: '', width: '20%' },
    { displayName: 'Insurance Code', key: 'insuranceCode', isSort: true, class: '', width: '20%' },
    { displayName: 'Description', key: 'description', isSort: true, class: '', width: '50%', type: "50", isInfo: true },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];

  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];

  constructor(
    private insuranceTypeDialogModal: MatDialog,
    private insuranceTypeService: InsuranceTypeService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getInsuranceTypeList();
    this.getUserPermissions();
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.insuranceTypeService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new InsuranceTypeModel());
  }
  createModal(icdCodeModel: InsuranceTypeModel) {
    let icdCodesModal;
    icdCodesModal = this.insuranceTypeDialogModal.open(InsuranceTypeModalComponent, { hasBackdrop: true, data: icdCodeModel })
    icdCodesModal.afterClosed().subscribe((result: string) => {
      if (result == 'SAVE')
        this.getInsuranceTypeList();
    });
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getInsuranceTypeList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getInsuranceTypeList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        {
          this.dialogService.confirm(`Once you click yes, all the payers linked with this insurance type will get effected. Are you sure you want to delete this insurance type?`).subscribe((result: any) => {
            if (result == true) {
              this.insuranceTypeService.delete(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  this.getInsuranceTypeList();
                } else if (response.statusCode === 401) {
                  this.notifier.notify('warning', response.message)
                } else {
                  this.notifier.notify('error', response.message)
                }
              });
            }
          })
        }
        break;
      default:
        break;
    }
  }

  getInsuranceTypeList() {
    this.insuranceTypeService.getAll(this.filterModel).subscribe((response: ResponseModel) => {
      if(response.statusCode == 200){  
        this.insuranceTypeData = response.data;
      this.metaData = response.meta;
      } else {
        this.insuranceTypeData = [];
      this.metaData = null;
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }
  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getInsuranceTypeList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.insuranceTypeService.getUserScreenActionPermissions('MASTERS', 'MASTERS_INSURANCETYPES_LIST');
    const { MASTERS_INSURANCETYPES_LIST_ADD, MASTERS_INSURANCETYPES_LIST_UPDATE, MASTERS_INSURANCETYPES_LIST_DELETE } = actionPermissions;
    if (!MASTERS_INSURANCETYPES_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_INSURANCETYPES_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_INSURANCETYPES_LIST_ADD || false;

  }
}
