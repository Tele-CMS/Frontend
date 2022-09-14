import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CategoryModel } from '../documents/document.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FilterModel, ResponseModel } from '../../../../../super-admin-portal/core/modals/common-model';
import { DocumentService } from '../documents/document.service';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { CategoryModalComponent } from './category-modal/category-modal.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  documentId: number;
  metaData: any;
  filterModel: FilterModel;
  searchText: string = "";
  categoryData: CategoryModel[];
  displayedColumns: Array<any> = [
    { displayName: 'Category Name', key: 'categoryName', isSort: true, class: '', width: '30%' },
    { displayName: 'Description', key: 'description', isSort: true, class: '', width: '60%', type: "60", isInfo: true },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
  constructor(
    private categoryDialogModal: MatDialog,
    private categoryService: DocumentService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getCategoryList();
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.categoryService.getCategoryById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new CategoryModel());
  }
  createModal(categoryModel: CategoryModel) {
    let categoryModal;
    categoryModal = this.categoryDialogModal.open(CategoryModalComponent, { hasBackdrop: true, data: categoryModel })
    categoryModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getCategoryList();
    });
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', '');
    this.getCategoryList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getCategoryList();
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
          this.dialogService.confirm(`Are you sure you want to delete this category?`).subscribe((result: any) => {
            if (result == true) {
              this.categoryService.deleteCategory(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  this.getCategoryList();
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

  getCategoryList() {
    this.categoryService.getAllCategory(this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.categoryData = response.data;
        this.metaData = response.meta;
      } else {
        this.categoryData = [];
        this.metaData = null;
      }
    }
    );
  }
  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getCategoryList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
}
