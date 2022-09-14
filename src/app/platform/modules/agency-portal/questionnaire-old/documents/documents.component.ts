import { Component, OnInit } from '@angular/core';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { DocumentModel, SectionItemModel } from './document.model';
import { MatDialog } from '@angular/material';
import { DocumentService } from './document.service';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { DocumentsModalComponent } from './document-modal/document-modal.component';
import { Router } from '@angular/router';
import { DocumentPreviewComponent } from '../document-preview/document-preview.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel;
  searchText: string = "";
  documentData: DocumentModel[];
  displayedColumns: Array<any> = [
    { displayName: 'QUESTIONNAIRE', key: 'documentName', isSort: true, class: '', width: '30%' },
    { displayName: 'Description', key: 'description', isSort: true, class: '', width: '50%', isInfo: true },
    { displayName: 'Actions', key: 'Actions', class: '', width: '20%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Preview', key: 'preview', class: 'fa fa-eye' },
    { displayName: 'View', key: 'view', class: 'fa fa-pencil-square-o' },
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
  constructor(
    private documentDialogModal: MatDialog,
    private sectionItemDialogModal: MatDialog,
    private documentService: DocumentService,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private router: Router,
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getDocumentsList();
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.documentService.getDocumentsById(id).subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new DocumentModel());
  }
  createModal(documentModel: DocumentModel) {
    let documentModal;
    documentModal = this.documentDialogModal.open(DocumentsModalComponent, { hasBackdrop: true, data: documentModel })
    documentModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getDocumentsList();
    });
  }
  openDialogForDocumentPreview(id: number) {
    this.documentService.getAllSectionItemForDocumentModal(id).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.createDocumentPreviewModal(response.data, id);
      } else {
        this.createDocumentPreviewModal(new SectionItemModel, null);
      }
    }
    );
  }

  createDocumentPreviewModal(sectionItemModel: SectionItemModel, documentId: number) {
    let docPreviewModal;
    docPreviewModal = this.sectionItemDialogModal.open(DocumentPreviewComponent, { hasBackdrop: true, data: { sectionItemData: sectionItemModel.sectionItems, sectionItemCodes: sectionItemModel.codes, documentId: documentId } })
    docPreviewModal.afterClosed().subscribe((result: string) => {
    });
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', '');
    this.getDocumentsList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getDocumentsList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.code;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'PREVIEW':
        this.openDialogForDocumentPreview(id);
        break;
      case 'VIEW':
        this.openQuestionnaireWindow(id);
        break;
      case 'DELETE':
        {
          this.dialogService.confirm(`Are you sure you want to delete this document?`).subscribe((result: any) => {
            if (result == true) {
              this.documentService.deleteDocuments(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  this.getDocumentsList();
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
  openDialogForPreview(id: number) {

  }
  openQuestionnaireWindow(documentId: number) {
    this.router.navigate(["/web/questionnaire/questionnaire-details"], { queryParams: { id: documentId } });
  }
  getDocumentsList() {
    this.documentService.getAllDocuments(this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.documentData = response.data;
        this.metaData = response.meta;
      } else {
        this.documentData = [];
        this.metaData = null;
      }
    }
    );
  }
  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getDocumentsList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
}

