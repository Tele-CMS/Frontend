import { Component, OnInit } from '@angular/core';
import { ResponseModel, FilterModel } from '../../../../../super-admin-portal/core/modals/common-model';
import { CategoryCodeModel } from '../documents/document.model';
import { CategoryCodeModalComponent } from './category-code-modal/category-code-modal.component';
import { MatDialog } from '@angular/material';
import { DocumentService } from '../documents/document.service';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-category-code',
  templateUrl: './category-code.component.html',
  styleUrls: ['./category-code.component.css']
})
export class CategoryCodeComponent implements OnInit {
  metaData: any;
  categoryId: number;
  filterModel: FilterModel;
  searchText: string = "";
  masterCategory: any = [];
  categoryCodeData: CategoryCodeModel[];
  displayedColumns: Array<any> = [
    { displayName: 'Category Code', key: 'codeName', isSort: true, class: '', width: '20%' },
    { displayName: 'Description', key: 'description', isSort: true, class: '', width: '50%', sInfo: true },
    { displayName: 'Order', key: 'displayOrder', isSort: true, class: '', width: '10%', },
    { displayName: 'QIK Score', key: 'score', isSort: true, class: '', width: '10%', },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
  constructor(
    private categoryCodeDialogModal: MatDialog,
    private categoryCodeService: DocumentService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getMasterData();
  }
  getMasterData() {
    let data = { 'masterdata': 'categories' }
    this.categoryCodeService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterCategory = response.categories != null ? response.categories : [];
      }
    });
  }
  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.categoryCodeService.getCategoryCodeById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new CategoryCodeModel());
  }
  createModal(categoryCodeModel: CategoryCodeModel) {
    let categoryCodeModal;
    categoryCodeModal = this.categoryCodeDialogModal.open(CategoryCodeModalComponent, { hasBackdrop: true, data: { categoryCodeModel: categoryCodeModel, categoryId: this.categoryId } })
    categoryCodeModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getCategoryCodeList();
    });
  }
  clearFilters() {
    this.searchText = '';
    this.categoryId = null;
    this.categoryCodeData = [];
    this.metaData = [];
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', '');
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getCategoryCodeList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.code;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        {
          this.dialogService.confirm(`Are you sure you want to delete this category code?`).subscribe((result: any) => {
            if (result == true) {
              this.categoryCodeService.deleteCategoryCode(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  this.getCategoryCodeList();
                } else if (response.statusCode === 401) {
                  this.notifier.notify('warning', response.message)
                } else {
                  this.notifier.notify('error', response.message)
                }
              });
            }
          });
        }
        break;
      default:
        break;
    }
  }
  onCategorySelect(id) {
    this.categoryId = id;
    if (this.categoryId)
      this.getCategoryCodeList();
  }
  getCategoryCodeList() {
    this.categoryCodeService.getAllCategoryCode(this.filterModel, this.categoryId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.categoryCodeData = response.data;
        this.metaData = response.meta;
      } else {
        this.categoryCodeData = [];
        this.metaData = null;
      }
    }
    );
  }
  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getCategoryCodeList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

}
