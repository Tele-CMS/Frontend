import { Component, OnInit } from '@angular/core';
import { PayrollBreakTimeModel } from './payroll-breaktime.model';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { PayrollBreaktimeService } from './payroll-breaktime.service';
import { PayrollBreaktimeModalComponent } from './payroll-breaktime-modal/payroll-breaktime-modal.component';

@Component({
  selector: 'app-payroll-breaktime',
  templateUrl: './payroll-breaktime.component.html',
  styleUrls: ['./payroll-breaktime.component.css']
})
export class PayrollBreaktimeComponent implements OnInit {

  payrollBreakTimeModel: PayrollBreakTimeModel;
  payrollBreakTimeData: PayrollBreakTimeModel[];
  metaData: any;
  displayedColumns: Array<any>;
  searchText:string='';

  filterModel: FilterModel;
  addPermission: boolean;
  constructor(
    private payrollBreakTimeDailog: MatDialog,
    public payrollBreakTimeService: PayrollBreaktimeService,
  ) {
    this.payrollBreakTimeModel = new PayrollBreakTimeModel();
    this.displayedColumns = [
      { displayName: 'Name', key: 'name', isSort: true, class: '', width: '50%' },
      { displayName: 'Duration', key: 'duration', isSort: true, class: '', width: '30%' },
      { displayName: 'Actions', key: 'Actions', isSort: true, class: '', width: '20%' }
    ];
  }
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getListData(this.filterModel);
    this.getUserPermissions();
  }

  createModel(payrollBreakTimeModel: PayrollBreakTimeModel) {
    const payrollBreaktimeModalPopup = this.payrollBreakTimeDailog.open(PayrollBreaktimeModalComponent, {
      data: payrollBreakTimeModel || new PayrollBreakTimeModel(),
    });

    payrollBreaktimeModalPopup.afterClosed().subscribe(result => {
      if (result === 'save')
        this.getListData(this.filterModel)
    });
  }

  openDialog(id: number): void {
    this.payrollBreakTimeModel = {
      id: id || 0,
    }
    if (!this.payrollBreakTimeModel.id) {
      this.createModel(this.payrollBreakTimeModel)
    } else {
      this.payrollBreakTimeService.getPayrollBreaktimeById(id).subscribe(response => {
        this.payrollBreakTimeModel = {
          ...response,
          payrollBreaktimeDetails: (response.payrollBreaktimeDetails || []).map(obj => {
            return {
              startRange: obj.startRange,
              endRange: obj.endRange,
              numberOfBreaks: obj.numberOfBreaks,
            }
          }),
        };
        this.createModel(this.payrollBreakTimeModel)
      })
    }
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getListData(this.filterModel);
  }


  applyFilter(type: string = '') {
    if (type == "clear")
      this.searchText = "";
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.searchText);
    if (this.searchText.trim() == '' || this.searchText.trim().length >= 3)
      this.getListData(this.filterModel);
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        {
          this.payrollBreakTimeService.deletePayrollBreaktime(id).subscribe((response: ResponseModel) => {
            this.getListData(this.filterModel);
          });
        } break;
      default:
        break;
    }
  }

  getListData(filterModel: FilterModel) {
    this.filterModel.sortColumn = this.filterModel.sortColumn || 'id';
    this.filterModel.sortOrder = this.filterModel.sortOrder || 'desc';
    this.payrollBreakTimeService.getAllPayrollBreaktime(filterModel)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.payrollBreakTimeData = response.data;
            this.metaData = response.meta;
          } else {
            this.payrollBreakTimeData = [];
            this.metaData = {};
          }
        });
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.payrollBreakTimeService.getUserScreenActionPermissions('PAYROLL', 'PAYROLL_BREATTIME_LIST');
    const { PAYROLL_BREATTIME_LIST_ADD, PAYROLL_BREATTIME_LIST_UPDATE, PAYROLL_BREATTIME_LIST_DELETE } = actionPermissions;
    if (!PAYROLL_BREATTIME_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!PAYROLL_BREATTIME_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }
    this.addPermission = PAYROLL_BREATTIME_LIST_ADD || false;
  }

}
