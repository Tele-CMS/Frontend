import { Component, OnInit } from '@angular/core';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { CustomFieldModel } from './custom-fields.model';
import { MatDialog } from '@angular/material';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldModalComponent } from './custom-fields-modal/custom-fields-modal.component';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css']
})
export class CustomFieldsComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel;
  searchText: string = "";
  customFieldData: CustomFieldModel[];
  addPermission: boolean;
  displayedColumns: Array<any> = [
    { displayName: 'Name', key: 'customLabelName', isSort: true, class: '' },
    { displayName: 'Link To', key: 'roleTypeName', isSort: true, class: '' },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];

  constructor(
    private customFieldDialogModal: MatDialog,
    private customFieldService: CustomFieldsService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getcustomFieldList();
    this.getUserPermissions();
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.customFieldService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new CustomFieldModel());
  }
  createModal(customFieldModel: CustomFieldModel) {
    let customFieldModal;
    customFieldModal = this.customFieldDialogModal.open(CustomFieldModalComponent, { hasBackdrop: true, data: customFieldModel })
    customFieldModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getcustomFieldList();
    });
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getcustomFieldList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.customLabelName;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        {
          this.dialogService.confirm(`Once you click yes, all the staff and patients linked with this custom field will get effected. Are you sure you want to delete this custom field?`).subscribe((result: any) => {
            if (result == true) {
              this.customFieldService.delete(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  this.getcustomFieldList();
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
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getcustomFieldList();
  }
  getcustomFieldList() {
    this.customFieldService.getAll(this.filterModel)
    .subscribe((response: ResponseModel) => {
      if(response.statusCode == 200){
        this.customFieldData = response.data;
      this.metaData = response.meta;
    } else {
      this.customFieldData = [];
      this.metaData = null;
    }
    this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }

  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getcustomFieldList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.customFieldService.getUserScreenActionPermissions('MASTERS', 'MASTERS_CUSTOMFIELDS_LIST');
    const { MASTERS_CUSTOMFIELDS_LIST_ADD, MASTERS_CUSTOMFIELDS_LIST_UPDATE, MASTERS_CUSTOMFIELDS_LIST_DELETE } = actionPermissions;
    if (!MASTERS_CUSTOMFIELDS_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_CUSTOMFIELDS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_CUSTOMFIELDS_LIST_ADD || false;

  }
}
