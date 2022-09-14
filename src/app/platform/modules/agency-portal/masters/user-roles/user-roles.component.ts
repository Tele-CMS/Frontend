import { Component, OnInit } from '@angular/core';
import { UserRoleModal } from './user-role.modal';
import { FilterModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { UserRoleService } from './user-role.service';
import { UserRoleModalComponent } from './user-role-modal/user-role-modal.component';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {
  userRoleModal: UserRoleModal;
  userRolesData: UserRoleModal[];
  metaData: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  searchText: string = "";
  filterModel: FilterModel;
  addPermission: boolean;
  assignRolePermission: boolean;

  constructor(
    private userRoleDailog: MatDialog,
    public userRoleService: UserRoleService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
    this.displayedColumns = [
      { displayName: 'Role', key: 'roleName', isSort: true, class: '', width: '50%' },
      { displayName: 'Status', key: 'isActive', isSort: true, class: '', width: '40%', type: ['Active', 'Inactive'] },
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

  createModel(userRoleModal: UserRoleModal) {
    const userRoleModalPopup = this.userRoleDailog.open(UserRoleModalComponent, {
      hasBackdrop: true,
      data: userRoleModal || new UserRoleModal(),
    });

    userRoleModalPopup.afterClosed().subscribe(result => {
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
    this.userRoleModal = {
      id: id || 0,
    }
    if (!this.userRoleModal.id) {
      this.createModel(this.userRoleModal)
    } else {
      this.userRoleService.get(id).subscribe(response => {
        this.userRoleModal = {
          ...response,
        };
        this.createModel(this.userRoleModal)
      })
    }
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getListData();
  }

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
    this.filterModel.sortColumn = this.filterModel.sortColumn || '';
    this.filterModel.sortOrder = this.filterModel.sortOrder || ''; 
    this.userRoleService.getAll(this.filterModel)
      .subscribe(
        (response: any) => { 
          if (response.statusCode === 200) {
            this.userRolesData = response.data;
            this.metaData = response.meta;
          } else {
            this.userRolesData = [];
            this.metaData = {};
          }
          this.metaData.pageSizeOptions = [5,10,25,50,100];
        });
  }

  deleteDetails(id: number) {
    this.dialogService.confirm(`Are you sure you want to delete User Role details?`).subscribe((result: any) => {
      if (result == true) {
        this.userRoleService.delete(id)
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
    const actionPermissions = this.userRoleService.getUserScreenActionPermissions('MASTERS', 'MASTERS_USERROLES_LIST');
    const { MASTERS_USERROLES_LIST_ADD, MASTERS_USERROLES_LIST_UPDATE, MASTERS_USERROLES_LIST_DELETE, MASTERS_USERROLES_LIST_ASSIGN_PERMISSIONS } = actionPermissions;
    if (!MASTERS_USERROLES_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_USERROLES_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_USERROLES_LIST_ADD || false;
    this.assignRolePermission = MASTERS_USERROLES_LIST_ASSIGN_PERMISSIONS || false;

  }

}
