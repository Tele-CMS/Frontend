import { Component, OnInit } from '@angular/core';
import { FilterModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { PayrollGroupModel } from './payroll-group.model';
import { PayrollGroupService } from './payroll-group.service';
import { NotifierService } from 'angular-notifier';
import { PayrollGroupModalComponent } from './payroll-group-modal/payroll-group-modal.component';
import { Metadata } from '../../../../../super-admin-portal/core/modals/common-model';

@Component({
  selector: 'app-payroll-group',
  templateUrl: './payroll-group.component.html',
  styleUrls: ['./payroll-group.component.css']
})
export class PayrollGroupComponent implements OnInit {
  payrollGroupModel: PayrollGroupModel;
  payrollGroupData: PayrollGroupModel[];
  metaData: Metadata;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  searchText: string = "";
  filterModel: FilterModel;

  constructor(
    private payrollGroupDailog: MatDialog,
    public payrollGroupService: PayrollGroupService,
    private notifier: NotifierService
  ) {
    this.payrollGroupModel = new PayrollGroupModel();
    this.metaData=new Metadata();
    this.displayedColumns = [
      { displayName: 'Group Name', key: 'groupName', class: '', width: '25%' },
      { displayName: 'Work Week', key: 'workWeekName', class: '', width: '25%' },
      { displayName: 'Pay Period', key: 'payPeriodName', width: '25%' },
      { displayName: 'Actions', key: 'Actions', class: '', width: '25%' }
    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    ];
  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getListData(this.filterModel);
  }

  createModel(payrollGroupModel: PayrollGroupModel) {
    const modalPopup = this.payrollGroupDailog.open(PayrollGroupModalComponent, {
      data: payrollGroupModel || new PayrollGroupModel(),
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result === 'SAVE')
        this.getListData(this.filterModel)
    });
  }

  openDialog(id: number): void {
    this.payrollGroupModel = new PayrollGroupModel();
    if (!id) {
      this.createModel(this.payrollGroupModel)
    } else {
      this.payrollGroupService.getPayrollGroupById(id).subscribe(response => {
        this.payrollGroupModel = {
          ...response,
        };
        this.createModel(this.payrollGroupModel)
      })
    }
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getListData(this.filterModel);
  }

  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getListData(this.filterModel);
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

  getListData(filterModel: FilterModel) {
    this.filterModel.sortColumn = this.filterModel.sortColumn || 'id';
    this.filterModel.sortOrder = this.filterModel.sortOrder || 'desc';
    this.payrollGroupService.getAllPayrollGroup(filterModel)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.payrollGroupData = response.data;
            this.metaData = response.meta;
          } else {
            this.payrollGroupData = [];
            this.metaData = new Metadata();
          }
        });
  }

  deleteDetails(id: number) {
    this.payrollGroupService.deletePayrollGroup(id)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.notifier.notify('success', response.message)
          this.getListData(this.filterModel);
        } else if (response.statusCode === 401) {
          this.notifier.notify('warning', response.message)
        } else {
          this.notifier.notify('error', response.message)
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

}
