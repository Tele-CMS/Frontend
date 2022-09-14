import { Component, OnInit } from '@angular/core';
import { TagModal } from './tag.modal';
import { FilterModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { TagsService } from './tags.service';
import { TagModalComponent } from './tag-modal/tag-modal.component';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  tagModal: TagModal;
  TagsData: TagModal[];
  metaData: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  searchText: String = "";
  filterModel: FilterModel;
  addPermission: boolean;

  constructor(
    private tagDailog: MatDialog,
    public tagsService: TagsService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
    this.displayedColumns = [
      { displayName: 'Tag Name', key: 'tag', isSort: true, class: '', width: '15%' },
      { displayName: 'Description', key: 'description', isSort: true, class: '', width: '35%', type: "40", isInfo: true },
      { displayName: 'BG Color', key: 'colorCode', width: '12%',type:'roundspan'},
      { displayName: 'Font Color', key: 'fontColorCode', width: '13%',type:'roundspan'},
      { displayName: 'Link To', key: 'roleTypeName', width: '15%' },
      { displayName: 'Actions', key: 'Actions', isSort: true, class: '', width: '10%' }
    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    ];
  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getListData();
    this.getUserPermissions();
  }

  createModel(tagModal: TagModal) {
    const modalPopup = this.tagDailog.open(TagModalComponent, {
      hasBackdrop: true,
      data: tagModal || new TagModal(),
    });
    modalPopup.afterClosed().subscribe(result => {
      if (result === 'SAVE')
        this.getListData()
    });
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getListData();
  }
  openDialog(id?: number): void {
    this.tagModal = {
      id: id || 0,
    }
    if (!this.tagModal.id) {
      this.createModel(this.tagModal)
    } else {
      this.tagsService.get(id).subscribe(response => {
        this.tagModal = {
          ...response,
        };
        this.createModel(this.tagModal)
      })
    }
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getListData();
  }

  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getListData();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        this.deleteDetails(id);
        break;
      default:
        break;
    }
  }

  getListData() {
    this.filterModel.sortColumn = this.filterModel.sortColumn || '';
    this.filterModel.sortOrder = this.filterModel.sortOrder || '';
    this.tagsService.getAll(this.filterModel)
      .subscribe(
        (response: any) => {   
          if (response.statusCode === 200) {
            this.TagsData = response.data;
            this.metaData = response.meta;
          } else {
            this.TagsData = [];
            this.metaData = {};
          }
          this.metaData.pageSizeOptions = [5,10,25,50,100];
        });
  }

  deleteDetails(id: number) {
    this.dialogService.confirm(`Once you click yes, all the staff and patients linked with this tag will get effected. Are you sure you want to delete this tag?`).subscribe((result: any) => {
      if (result == true) {
        this.tagsService.delete(id)
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

  getUserPermissions() {
    const actionPermissions = this.tagsService.getUserScreenActionPermissions('MASTERS', 'MASTERS_MANAGETAGS_LIST');
    const { MASTERS_MANAGETAGS_LIST_ADD, MASTERS_MANAGETAGS_LIST_UPDATE, MASTERS_MANAGETAGS_LIST_DELETE } = actionPermissions;
    if (!MASTERS_MANAGETAGS_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_MANAGETAGS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_MANAGETAGS_LIST_ADD || false;

  }

}
