import { Component, OnInit } from '@angular/core';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ClearingHouseService } from '../clearing-house.service';
import { AddClearingHouseComponent } from '../add-clearing-house/add-clearing-house.component';
import { ClearingHouseModel } from '../clearing-house-model';

@Component({
  selector: 'app-clearing-house-listing',
  templateUrl: './clearing-house-listing.component.html',
  styleUrls: ['./clearing-house-listing.component.css']
})
export class ClearingHouseListingComponent implements OnInit {
  clearingHouseData: ClearingHouseModel[];
  metaData: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  filterModel: FilterModel;
  activityTypeId: number;
  loading = false;
  isBillable = false;
  searchText:string="";

  constructor(
    public clearingHouseModal: MatDialog,
    public clearingHouseService: ClearingHouseService,
    private notifier: NotifierService,
  ) {
    this.displayedColumns = [
      { displayName: 'Clearing House', key: 'clearingHouseName', isSort: true, class: '', width:'40%' },
      { displayName: 'Sender id', key: 'senderID', isSort: true, class: '', width:'20%' },
      { displayName: 'Receiver Id', key: 'receiverID', isSort: true, class: '', width:'20%' },
      { displayName: 'Actions', key: 'Actions', width:'20%' }

    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class:'fa fa-times'},
    ];
  }

  createModel(clearingHouseModel: ClearingHouseModel) {
    const modalPopup = this.clearingHouseModal.open(AddClearingHouseComponent, {hasBackdrop: true, minWidth: '55%',maxWidth: '90%',
      data: clearingHouseModel
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result === 'save'){
        this.getListData(this.filterModel);
      }
    });
  }

  openDialog(id?: number): void {
    if (id!=null && id>0) {
      this.clearingHouseService.getById(id).subscribe((response: any) => {
         if(response!=null && response.data!=null && response.statusCode==200)
           this.createModel(response.data);
      })
    } else {
      this.createModel(new ClearingHouseModel());
    }
  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getListData(this.filterModel);
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
        this.delete(id);
        break;
      default:
        break;
    }
  }
clearFilters()
{
  this.searchText="";
  this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, "");
  this.getListData(this.filterModel);
}
  getListData(filterModel: FilterModel) {
    this.clearingHouseService.getAll(filterModel)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.clearingHouseData = response.data;
            this.metaData = response.meta;
          } else {
            this.clearingHouseData = [];
            this.metaData = {};
          }
        });
  }
  
  delete(id: number) {
    this.clearingHouseService.delete(id).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.notifier.notify('success', response.message);
        this.getListData(this.filterModel);
      }
      else this.notifier.notify('error', response.message);
    });
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = this.searchText;
  }

}
