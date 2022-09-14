import { Component, OnInit } from '@angular/core';
import { FilterModel } from '../../../core/modals/common-model';

@Component({
  selector: 'app-manage-leaves',
  templateUrl: './manage-leaves.component.html',
  styleUrls: ['./manage-leaves.component.css']
})
export class ManageLeavesComponent implements OnInit {
  private filterModel: FilterModel;
  constructor() {
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  // onPageOrSortChange(changeState?: any) {
  //   let formValues=this.userFormGroup.value;
  //   this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getUsersList(this.filterModel, formValues.tagIds, formValues.roleId);
  // }

  // onTableActionClick(actionObj?: any) {
  //   const id = actionObj.data && actionObj.data.staffID;
  //   switch ((actionObj.action || '').toUpperCase()) {
  //     case 'EDIT':
  //       this.addUser(id);
  //       break;
  //     case 'DELETE':
  //       {
  //         this.usersService.deleteStaff(id).subscribe((response: ResponseModel) => {
  //           if (response.statusCode == 200) {
  //             this.notifier.notify('success', response.message)
  //           } else if (response.statusCode == 401) {
  //             this.notifier.notify('warning', response.message);
  //           } else {
  //             this.notifier.notify('error', response.message)
  //           }
  //           this.getUsersList(this.filterModel, '', '');
  //         });
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }
}
