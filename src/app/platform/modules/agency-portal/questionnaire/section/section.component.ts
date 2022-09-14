import { Component, OnInit } from '@angular/core';
import { FilterModel, ResponseModel } from '../../../../../super-admin-portal/core/modals/common-model';
import { SectionModel } from '../documents/document.model';
import { MatDialog } from '@angular/material';
import { DocumentService } from '../documents/document.service';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { SectionModalComponent } from './section-modal/section-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  documentId: number;
  metaData: any;
  filterModel: FilterModel;
  searchText: string = "";
  sectionData: SectionModel[];
  displayedColumns: Array<any> = [
    { displayName: 'Section', key: 'sectionName', isSort: true, class: '', width: '40%' },
    { displayName: 'Order', key: 'displayOrder', isSort: true, class: '', width: '40%' },
    { displayName: 'Actions', key: 'Actions', class: '', width: '20%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
  constructor(
    private sectionDialogModal: MatDialog,
    private sectionService: DocumentService,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private router: Router
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getSectionList();
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.sectionService.getSectionById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new SectionModel());
  }
  createModal(sectionModel: SectionModel) {
    let sectionModal;
    sectionModal = this.sectionDialogModal.open(SectionModalComponent, { hasBackdrop: true, data: { sectionModel: sectionModel, documentId: this.documentId } })
    sectionModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getSectionList();
    });
  }
  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getSectionList();
  // } old one
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getSectionList();
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
          this.dialogService.confirm(`Are you sure you want to delete this section?`).subscribe((result: any) => {
            if (result == true) {
              this.sectionService.deleteSection(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  if ((this.sectionData || []).length == 1)
                    this.filterModel.pageNumber = (this.filterModel.pageNumber - 1) || 1;
                  this.getSectionList();
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

  getSectionList() {
    this.sectionService.getAllSection(this.filterModel, this.documentId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.sectionData = response.data;
        this.metaData = response.meta;
      } else {
        this.sectionData = [];
        this.metaData = null;
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  clearRedirection() {
    this.router.navigate(['/web/questionnaire'])
  }
}
