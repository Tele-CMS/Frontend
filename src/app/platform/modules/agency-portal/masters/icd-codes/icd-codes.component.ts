import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { IcdCodeModalComponent } from './icd-code-modal/icd-code-modal.component';
import { ICDCodesModel } from './icd-codes.model';
import { ICDCodeService } from './icd-code.service';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-icd-codes',
  templateUrl: './icd-codes.component.html',
  styleUrls: ['./icd-codes.component.css']
})
export class IcdCodesComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel;
  searchText: string = "";
  icdCodeData: ICDCodesModel[];
  addPermission: boolean;
  displayedColumns: Array<any> = [
    { displayName: 'ICD Code', key: 'code', isSort: true, class: '', width: '30%' },
    { displayName: 'Description', key: 'description', isSort: true, class: '', width: '60%', type: "60", isInfo: true },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
  constructor(
    private icdCodeDialogModal: MatDialog,
    private icdCodeService: ICDCodeService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getICDCodeList();
    this.getUserPermissions();
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.icdCodeService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new ICDCodesModel());
  }
  createModal(icdCodeModel: ICDCodesModel) {
    let icdCodesModal;
    icdCodesModal = this.icdCodeDialogModal.open(IcdCodeModalComponent, { hasBackdrop: true, data: icdCodeModel })
    icdCodesModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getICDCodeList();
    });
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', '');
    this.getICDCodeList();
  }
  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getICDCodeList();
  // } old one

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getICDCodeList();
  }
  
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.code;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        {
          this.dialogService.confirm(`Once you click yes, all the patients linked with this diagnosis code will get effected. Are you sure you want to delete this diagnosis code?`).subscribe((result: any) => {
            if (result == true) {
              this.icdCodeService.delete(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  this.getICDCodeList();
                } else if (response.statusCode === 401) {
                  this.notifier.notify('warning', response.message)
                } else {
                  this.notifier.notify('error', response.message)
                }
              });
            }
          });
        }
        break;
      default:
        break;
    }
  }

  getICDCodeList() {
    this.icdCodeService.getAll(this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.icdCodeData = response.data;
        this.metaData = response.meta;
      } else {
        this.icdCodeData = [];
        this.metaData = null;
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }
  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getICDCodeList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.icdCodeService.getUserScreenActionPermissions('MASTERS', 'MASTERS_DIAGNOSISCODES_LIST');
    const { MASTERS_DIAGNOSISCODES_LIST_ADD, MASTERS_DIAGNOSISCODES_LIST_UPDATE, MASTERS_DIANOSISCODES_LIST_DELETE } = actionPermissions;
    if (!MASTERS_DIAGNOSISCODES_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_DIANOSISCODES_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_DIAGNOSISCODES_LIST_ADD || false;

  }
}
