import { Component, OnInit } from '@angular/core';
import { MatDialog, } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { MasterTemplate } from '../template.model';
import { FilterModel } from '../../core/modals/common-model';
import { TemplateService } from '../template.service';
import { DialogService } from '../../../../shared/layout/dialog/dialog.service';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services';

@Component({
  selector: 'app-template-listing',
  templateUrl: './template-listing.component.html',
  styleUrls: ['./template-listing.component.css']
})
export class TemplateListingComponent implements OnInit {
  subscription: Subscription
  masterTemplatesList: MasterTemplate[] = [];
  metaData: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  searchText: string = "";
  filterModel: FilterModel;

  loading = false;
  addPermission: boolean = true;

  constructor(
    public activityModal: MatDialog,
    public templateService: TemplateService,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private router: Router,
    private commonService: CommonService
  ) {
    this.displayedColumns = [
      { displayName: 'Template Name', key: 'templateName', isSort: true, class: '', width: '40%' },
      { displayName: 'Template Category', key: 'templateCategoryName', class: '', width: '25%' },
      { displayName: 'Template Subcategory', key: 'templateSubCategoryName', class: '', width: '25%' },
      { displayName: 'Actions', key: 'Actions', width: '10%' }
    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    ];
  }

  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getListData();
  }
  openDialog(id?: number): void {
    if (id) {
      const encryptId = this.commonService.encryptValue(id, true);
      this.router.navigate(['/web/Masters/template/builder'], { queryParams: { id: encryptId } });
    } else {
      this.router.navigate(['/web/Masters/template/builder']);
    }
  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getListData();
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getListData();
  }

  applyFilter(searchText: string = '') {
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    this.getListData();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.name;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        this.deleteDetails(id, name);
        break;
      default:
        break;
    }
  }

  getListData() {
    this.templateService.getMasterTemplates(this.filterModel)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.masterTemplatesList = response.data;
            this.metaData = response.meta;
          } else {
            this.masterTemplatesList = [];
            this.metaData = {};
          }
          this.metaData.pageSizeOptions = [5,10,25,50,100];
        });
  }

  deleteDetails(id: number, name: string) {
    this.dialogService.confirm(`Are you sure you want to delete this template?`).subscribe((result: any) => {
      if (result == true) {
        this.templateService.deleteTemplate(id)
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

  // getUserPermissions() {
  //   const actionPermissions = this.appointmentTypeService.getUserScreenActionPermissions('MASTERS', 'MASTERS_APPOINTMENTTYPES_LIST');
  //   const { MASTERS_APPOINTMENTTYPES_LIST_ADD, MASTERS_APPOINTMENTTYPES_LIST_UPDATE, MASTERS_APPOINTMENTTYPES_LIST_DELETE } = actionPermissions;
  //   if (!MASTERS_APPOINTMENTTYPES_LIST_UPDATE) {
  //     let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
  //     this.actionButtons.splice(spliceIndex, 1)
  //   }
  //   if (!MASTERS_APPOINTMENTTYPES_LIST_DELETE) {
  //     let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
  //     this.actionButtons.splice(spliceIndex, 1)
  //   }

  //   this.addPermission = MASTERS_APPOINTMENTTYPES_LIST_ADD || false;

  // }

}