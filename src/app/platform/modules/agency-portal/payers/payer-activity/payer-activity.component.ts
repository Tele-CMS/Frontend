import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Metadata, FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { PayerActivityModel } from '../payers.model';
import { PayersService } from '../payers.service';

@Component({
  selector: 'app-payer-activity',
  templateUrl: './payer-activity.component.html',
  styleUrls: ['./payer-activity.component.css']
})
export class PayerActivityComponent implements OnInit {
  payerId: number;
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  searchText: string = "";
  filterModel: FilterModel;
  payerActivityData: PayerActivityModel[] = [];
  metaData: any;
  showServiceCodeCmp: boolean = false;
  activityId: number = null;
  displayedColumns: Array<any> = [
    { displayName: 'Activity Name', key: 'name', isSort: true, class: '', width: '60%' },
    { displayName: 'Status', key: 'isActive', isSort: true, class: '', width: '30%', type: true },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' }
  ];
  constructor(private payersService: PayersService) {
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
    this.getPayerActivites()
  }
  getPayerActivites() {
    this.payersService.getPayerActivites(this.payerId, this.filterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.data.length>0) {
        this.payerActivityData = response.data;
        this.metaData = response.meta; 
      } else {
        this.payerActivityData = [];
        this.metaData = [];
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
      
    });
  }
  applyFilter() {
    if (this.searchText == '' || this.searchText.length > 2) {
      this.filterModel.searchText = this.searchText;
      this.getPayerActivites();
    }
  }
  clearFilters() {
    this.searchText = "";
    this.filterModel.searchText = this.searchText;
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortOrder, this.filterModel.sortOrder);
    this.getPayerActivites();

  }
  toggleActivity(status: boolean) {
    this.showServiceCodeCmp = status;
    this.activityId = null;
    if (!status) {
      this.searchText = "";
      this.setPaginatorModel(1, this.filterModel.pageSize, "", "");
      this.getPayerActivites();
    }
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order);
    this.getPayerActivites();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.appointmentTypeID;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        {
          this.showServiceCodeCmp = true;
          this.activityId = actionObj.data.appointmentTypeID;
          this.getPayerActivites();
          break;
        }
      case 'DELETE':
        {
          // this.usersService.deleteStaff(id).subscribe((response: ResponseModel) => {
          //   if (response.statusCode == 200) {
          //     this.notifier.notify('success', response.message)
          //   } else if (response.statusCode == 401) {
          //     this.notifier.notify('warning', response.message);
          //   } else {
          //     this.notifier.notify('error', response.message)
          //   }
          //   this.getUsersList(this.filterModel, '', '');
          // });
        }
        break;
      default:
        break;
    }
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = this.searchText;
  }
}
