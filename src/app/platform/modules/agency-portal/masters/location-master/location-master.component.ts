import { Component, OnInit } from '@angular/core';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { LocationModalComponent } from './location-master-modal/location-master-modal.component';
import { MatDialog } from '@angular/material';
import { LocationService } from './location-master.service';
import { LocationModel } from './location-master.model';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-location-master',
  templateUrl: './location-master.component.html',
  styleUrls: ['./location-master.component.css']
})
export class LocationMasterComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel;
  searchText: string = "";
  locationData: LocationModalComponent[];
  addPermission: boolean;
  displayedColumns: Array<any> = [
    { displayName: 'Location', key: 'locationName', isSort: true, class: '', width: '15%' },
    { displayName: 'Description', key: 'locationDescription', isSort: true, class: '', width: '30%', type: "30", isInfo: true },
    { displayName: 'Facility Type', key: 'facilityType', isSort: true, class: '', width: '20%' },
    { displayName: 'Address', key: 'address', isSort: true, class: '', width: '25%', type: "30" },
    { displayName: 'Actions', key: 'Actions', isSort: true, class: '', width: '10%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
  constructor(
    private locationDialogModal: MatDialog,
    private locationService: LocationService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getLocationList();
    this.getUserPermissions();
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.locationService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new LocationModel());
  }
  createModal(locationModel: LocationModel) {
    let locationModal;
    locationModal = this.locationDialogModal.open(LocationModalComponent, { hasBackdrop: true, data: locationModel })
    locationModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getLocationList();
    });
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getLocationList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getLocationList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        {
          this.dialogService.confirm(`Once you click yes, all the staff and patients linked with this location will get effected. Are you sure you want to delete this location ?`).subscribe((result: any) => {
            if (result == true) {
              this.locationService.delete(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  this.getLocationList();
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

  getLocationList() {
    this.locationService.getAll(this.filterModel).subscribe((response: ResponseModel) => {
      if(response.statusCode == 200){
        this.locationData = response.data;
      this.metaData = response.meta;
      } else {
        this.locationData = [];
      this.metaData = null;
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }
  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getLocationList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.locationService.getUserScreenActionPermissions('MASTERS', 'MASTERS_LOCATION_LIST');
    const { MASTERS_LOCATION_LIST_ADD, MASTERS_LOCATION_LIST_UPDATE, MASTERS_LOCATION_LIST_DELETE } = actionPermissions;
    if (!MASTERS_LOCATION_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_LOCATION_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_LOCATION_LIST_ADD || false;

  }
}