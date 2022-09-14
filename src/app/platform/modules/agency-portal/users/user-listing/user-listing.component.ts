import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ICDCodesModel } from '../../masters/icd-codes/icd-codes.model';
import { UserModel } from '../users.model';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { format } from 'date-fns';
import { NotifierService } from 'angular-notifier';
import { CommonService } from '../../../core/services';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { Metadata } from '../../../../../super-admin-portal/core/modals/common-model';

@Component({
  selector: 'app-user',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel;
  usersData: UserModel[];
  userFormGroup: FormGroup;
  staffName: string = "";
  masterRoles: any[];
  masterTagsForStaff: any[];
  currentLocationId: number;
  addPermission: boolean;
  displayedColumns: Array<any> = [
    { displayName: 'Name', key: 'staffName', isSort: true, class: '', width: '15%' },
    { displayName: 'User Name', key: 'userName', isSort: true, class: '', width: '15%' },
    { displayName: 'Role', key: 'roleName', class: '', width: '10%' },
    { displayName: 'Phone', key: 'phoneNumber', class: '', width: '15%' },
    { displayName: 'Date Joined', key: 'doj', class: '', width: '15%' },
    { displayName: 'Active', key: 'isActive', class: '', width: '10%', type: 'togglespan', permission: true },
    { displayName: 'Lock User', key: 'isBlock', class: '', width: '10%', type: 'togglespan', permission: true },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }

  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];

  constructor(
    private usersService: UsersService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private ref: ChangeDetectorRef
    ) {
    this.filterModel = new FilterModel();
    this.usersData = new Array<UserModel>();
    this.currentLocationId = null;
  }
  ngOnInit() {
    this.userFormGroup = this.formBuilder.group({
      searchText: [],
      tagIds: [],
      roleId: []
    });
    this.getMasterData();

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLocationId = user.currentLocationId;
      }
    });
    this.getUsersList(this.filterModel, '', '');
    this.getUserPermissions();
  }

  onPageOrSortChange(changeState?: any) {
    let formValues = this.userFormGroup.value;

    this.setPaginatorModel(changeState.pageNumber,changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getUsersList(this.filterModel, formValues.tagIds, formValues.roleId);
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.staffID;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.addUser(id);
        break;
      case 'DELETE':
        {
          this.notifier.hideAll();
          this.dialogService.confirm(`Are you sure you want to delete this user?`).subscribe((result: any) => {
            if (result == true) {
              this.usersService.deleteStaff(id).subscribe((response: ResponseModel) => {
                this.notify(response);
              });
            }
          });
        }
        break;
      case "TOGGLE":
        {
          this.notifier.hideAll();
          if (actionObj.column.key == "isActive") {
            this.dialogService.confirm(`Are you sure you want to change user status?`).subscribe((result: any) => {
              if (result == true) {
                this.usersService.updateUserActiveStatus(actionObj.data.staffID, (actionObj.data.isActive == true ? false : true)).subscribe((response: ResponseModel) => {
                  this.notify(response);
                });
              }else{
                this.getUsersList(this.filterModel, '', '');
              }
            });
          }
          else if (actionObj.column.key == "isBlock") {
            this.dialogService.confirm(`Are you sure you want to change user lock status?`).subscribe((result: any) => {
              if (result == true) {
                this.usersService.updateUserStatus(actionObj.data.userID, (actionObj.data.isBlock == true ? false : true)).subscribe((response: ResponseModel) => {
                  this.notify(response);
                });
              }else{
                this.getUsersList(this.filterModel, '', '');
              }
            });
          }
        }
        break;
      default:
        break;
    }
  }
  notify(response: ResponseModel) {
    if (response.statusCode == 200) {
      this.notifier.notify('success', response.message)
      this.getUsersList(this.filterModel, '', '');
    } else if (response.statusCode == 401) {
      this.notifier.notify('warning', response.message);
    } else {
      this.notifier.notify('error', response.message)
    }
  }


  applyFilter() {
    let formValues = this.userFormGroup.value;
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, formValues.searchText);
    this.getUsersList(this.filterModel, formValues.tagIds, formValues.roleId);
  }

  getUsersList(filterModel: FilterModel, tags: any, roleIds: any) {
    this.usersService.getAll(filterModel, (tags != null ? tags.toString() : ''), (roleIds || ''), this.currentLocationId).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.usersData = response.data;
        this.usersData = (response.data || []).map((obj: any) => {
          obj.doj = format(obj.doj, 'MM/DD/YYYY');
          obj.staffName = `${obj.firstName} ${obj.lastName}`;
          return obj;
        });
        this.metaData = response.meta;
      } else { this.usersData = []; this.metaData = new Metadata();
       }
       this.metaData.pageSizeOptions = [5,10,25,50,100];
    });
  }
  clearFilters() {
    this.userFormGroup.reset();
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getUsersList(this.filterModel, '', '');
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  addUser(staffId: number = null) {
    this.router.navigate(["/web/manage-users/user"], { queryParams: { id: staffId != null ? this.commonService.encryptValue(staffId, true) : null } });
  }
  InviteUser()
  {

  }
  getMasterData() {
    let data = "MASTERROLES,MASTERTAGSFORSTAFF";
    this.usersService.getMasterData(data).subscribe((response: any) => {
      this.masterRoles = response.masterRoles;
      this.masterTagsForStaff = response.masterTagsforStaff;
    });
  }

  getUserPermissions() {
    const actionPermissions = this.usersService.getUserScreenActionPermissions('USER', 'USER_LIST');
    const { USER_LIST_ADD, USER_LIST_UPDATE, USER_LIST_DELETE, USER_LIST_CHANGELOCK } = actionPermissions;
    if (!USER_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!USER_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if(!USER_LIST_CHANGELOCK) {
      const column = this.displayedColumns.find(obj => obj.key == 'isBlock');
      column.permission = false;
    }

    this.addPermission = USER_LIST_ADD || false;

  }
}
