import { Component, OnInit, ViewChild } from '@angular/core';
import { SectionItem, Code, SectionItemModel } from '../documents/document.model';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { DocumentService } from '../documents/document.service';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { SectionItemModalComponent } from './section-item-modal/section-item-modal.component';
import { FilterModel, ResponseModel, Metadata } from '../../../core/modals/common-model';
import { merge } from 'rxjs';
import { DocumentPreviewComponent } from '../../questionaire-preview/document-preview/document-preview.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-section-items',
  templateUrl: './section-items.component.html',
  styleUrls: ['./section-items.component.css']
})
export class SectionItemsComponent implements OnInit {
  documentId: number;
  metaData: any = {};
  filterModel: FilterModel;
  expandedSectionItemIds: Array<number>;
  searchText: string = "";
  sectionItemData: SectionItemModel[];
  sectionItemModel: SectionItemModel;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private sectionItemDialogModal: MatDialog,
    private sectionItemService: DocumentService,
    private dialogService: DialogService,
    private notifier: NotifierService,
    private router: Router
  ) {
    this.expandedSectionItemIds = [];
    this.metaData = new Metadata;
    this.sectionItemModel = new SectionItemModel();
    this.sectionItemData = new Array<SectionItemModel>();

  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getSectionItemList();
    this.onPageChanges();

  }

  filterSectionItemCodes(sectionItemObj: any) {
    let codes = [];
    if (this.sectionItemModel && this.sectionItemModel.codes && (sectionItemObj.inputType.toLowerCase() != 'textarea' || sectionItemObj.inputType.toLowerCase() != 'textbox'))
      codes = this.sectionItemModel.codes.filter((obj) => obj.categoryId === sectionItemObj.categoryId);
    return codes;
  }
  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.sectionItemService.getSectionItemById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new SectionItemModel());
  }
  createModal(sectionItemModel: SectionItemModel) {
    let sectionItemModal;
    sectionItemModal = this.sectionItemDialogModal.open(SectionItemModalComponent, { hasBackdrop: true, data: { sectionItemModel: sectionItemModel, documentId: this.documentId } })
    sectionItemModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getSectionItemList();
    });
  }
  onPageChanges() {
    merge(this.paginator.page)
      .subscribe(() => {

        const changeState = {
          pageNumber: (this.paginator.pageIndex + 1),
          pageSize: this.paginator.pageSize
        }
        this.setPaginatorModel(changeState.pageNumber, changeState.pageSize);
        this.getSectionItemList();
      })
  }
  handleExpandRow(sectionItemId: number) {
    const sectionItemIndex = this.expandedSectionItemIds.findIndex(obj => obj == sectionItemId);
    if (sectionItemIndex > -1) {
      this.expandedSectionItemIds.splice(sectionItemIndex, 1);
    } else {
      this.expandedSectionItemIds.push(sectionItemId);
    }
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.code;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      default:
        break;
    }
  }
  openDialogForDocumentPreview() {
    this.sectionItemService.getAllSectionItemForDocumentForm(this.documentId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.createDocumentPreviewModal(response.data);
      } else {
        this.createDocumentPreviewModal(new SectionItemModel);
      }
    }
    );
  }

  createDocumentPreviewModal(sectionItemModel: SectionItemModel) {
    let docPreviewModal;
    docPreviewModal = this.sectionItemDialogModal.open(DocumentPreviewComponent, { hasBackdrop: true, data: { sectionItemData: sectionItemModel.sectionItems, sectionItemCodes: sectionItemModel.codes, documentId: this.documentId, docName: '' } })
    docPreviewModal.afterClosed().subscribe((result: string) => {
    });
  }

  getSectionItemList() {
    this.sectionItemService.getAllSectionItem(this.filterModel, this.documentId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.sectionItemModel = response.data;
        this.metaData = response.meta;
      } else {
        this.sectionItemData = [];
        this.metaData = {};
      }
    }
    );
  }

  setPaginatorModel(pageNumber: number, pageSize: number) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
  }
  deleteSectionItem(id?: number) {
    this.dialogService.confirm(`Are you sure you want to delete this question?`).subscribe((result: any) => {
      if (result == true) {
        this.sectionItemService.deleteSectionItem(id).subscribe((response: ResponseModel) => {
          if (response.statusCode === 200) {
            this.notifier.notify('success', response.message)
            if ((this.sectionItemData || []).length == 1)
              this.filterModel.pageNumber = (this.filterModel.pageNumber - 1) || 1;
            this.getSectionItemList();
          } else if (response.statusCode === 401) {
            this.notifier.notify('warning', response.message)
          } else {
            this.notifier.notify('error', response.message)
          }
        });
      }
    });
  }

  clearRedirection() {
    this.router.navigate(['/web/questionnaire'])
  }
}
