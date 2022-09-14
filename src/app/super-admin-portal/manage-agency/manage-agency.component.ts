import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FilterModel, ResponseModel } from '../core/modals/common-model';
import { ManageAgencyModel } from './manage-agency.model';
import { ManageAgencyService } from './manage-agency.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { Metadata } from '../../platform/modules/core/modals/common-model';

@Component({
  selector: 'app-manage-agency',
  templateUrl: './manage-agency.component.html',
  styleUrls: ['./manage-agency.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ManageAgencyComponent implements OnInit {
  organizationId: number;
  metaData: any;
  searchText: string = "";
  filterModel: FilterModel;
  agencyData: ManageAgencyModel[]=[];
  displayedColumns: Array<any> = [
    { displayName: 'Agency Name', key: 'organizationName', isSort: true, class: '', width: '30%' },
    { displayName: 'Business Name', key: 'businessName', isSort: true, class: '', width: '30%' },
    { displayName: 'Address', key: 'address', class: '', width: '30%' },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }

  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
  ];
  constructor(private agencyService: ManageAgencyService, private notifier: NotifierService, private router: Router) {
    this.filterModel = new FilterModel();
    this.agencyData = new Array<ManageAgencyModel>();
  }

  ngOnInit() {
    this.getAgencyDataList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getAgencyDataList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.organizationID;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.addAgency(id);
        break
      default:
        break;
    }
  }


  applyFilter(searchText: string = '') {
    if (searchText == '' || searchText.length > 2) {
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
      this.getAgencyDataList();
    }
  }

  getAgencyDataList() {
    this.agencyService.getAll(this.filterModel).subscribe((response: ResponseModel) => {
      if (response && response.statusCode == 200) {
        this.agencyData = response.data;
        this.metaData = response.meta;
      }
      else {
        this.agencyData = [];
        this.metaData = new Metadata();
      }
    });
  }
  clearFilters() {
    this.searchText = "";
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getAgencyDataList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  addAgency(organizationId: number = null) {
    this.router.navigate(["/webadmin/agency-setup"], { queryParams: { id: organizationId } });
  }
}
