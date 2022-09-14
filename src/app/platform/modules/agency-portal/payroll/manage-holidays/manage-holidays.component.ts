import { Component, OnInit } from '@angular/core';
import { ManageHolidayModel } from './manage-holidays.model';
import { FilterModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ManageHolidayService } from './manage-holidays.service';
import { HolidayModalComponent } from './manage-holiday-modal/manage-holiday-modal.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-manage-holidays',
  templateUrl: './manage-holidays.component.html',
  styleUrls: ['./manage-holidays.component.css']
})
export class ManageHolidaysComponent implements OnInit {
  holidayModel: ManageHolidayModel;
  holidayData: ManageHolidayModel[];
  metaData: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;

  filterModel: FilterModel;
  addPermission: boolean;
  constructor(
    private holidayDailog: MatDialog,
    public holidayService: ManageHolidayService,
    private notifier: NotifierService
  ) {
    this.holidayModel = new ManageHolidayModel();
    this.displayedColumns = [
      { displayName: 'Date', key: 'date', class: '', width: '25%',type:'date' },
      { displayName: 'Description', key: 'description', class: '', width: '35%' },
      { displayName: 'Actions', key: 'Actions', class: '', width: '15%' }
    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    ];
  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getListData(this.filterModel);
    this.getUserPermissions();
  }

  createModel(holidayModel: ManageHolidayModel) {
    const modalPopup = this.holidayDailog.open(HolidayModalComponent, {
      data: holidayModel || new ManageHolidayModel(),
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result === 'SAVE')
        this.getListData(this.filterModel)
    });
  }

  openDialog(id: number): void {
    this.holidayModel = new ManageHolidayModel();
    if (!id) {
      this.createModel(this.holidayModel)
    } else {
      this.holidayService.getHolidayById(id).subscribe(response => {
        this.holidayModel = {
          ...response,
        };
        this.createModel(this.holidayModel)
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
    this.holidayService.getAllHoliday(filterModel)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.holidayData = response.data;
            this.metaData = response.meta;
          } else {
            this.holidayData = [];
            this.metaData = {};
          }
        });
  }

  deleteDetails(id: number) {
    this.holidayService.deleteHoliday(id)
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
    // this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.holidayService.getUserScreenActionPermissions('PAYROLL', 'PAYROLL_MANAEGE_HOLIDAYS_LIST');
    const { PAYROLL_MANAEGE_HOLIDAYS_LIST_ADD, PAYROLL_MANAEGE_HOLIDAYS_LIST_UPDATE, PAYROLL_MANAEGE_HOLIDAYS_LIST_DELETE } = actionPermissions;
    if (!PAYROLL_MANAEGE_HOLIDAYS_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!PAYROLL_MANAEGE_HOLIDAYS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = PAYROLL_MANAEGE_HOLIDAYS_LIST_ADD || false;

  }

}
