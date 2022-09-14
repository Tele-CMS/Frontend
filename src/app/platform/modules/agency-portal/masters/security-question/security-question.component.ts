import { Component, OnInit } from '@angular/core';
import { SecurityQuestionModel } from './security-question.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SecurityQuestionService } from './security-question.service';
import { SecurityQestionModalComponent } from './security-question-modal/security-question-modal.component';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.css']
})
export class SecurityQuestionComponent implements OnInit {
 filterModel: FilterModel;
 formGroup: FormGroup;
 metaData: any;
 searchText: string = "";
 securityQuestionData: SecurityQuestionModel[];
  addPermission: boolean;
   displayedColumns: Array<any> = [
    { displayName: 'Question', key: 'question', isSort: true, class: '', width: '60%' },
    { displayName: 'Status', key: 'isActive', isSort: true, class: '', width: '30%', type: ['Active', 'Inactive'] },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];
   actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];

  constructor(private securityQuestionDialogModal: MatDialog,
    private securityQuestionService: SecurityQuestionService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.formGroup = this.formBuilder.group({
      searchText: ['']
    });
    this.getSecurityQuestionList();
    this.getUserPermissions();
  }
  get formControls() { return this.formGroup.controls; }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.securityQuestionService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new SecurityQuestionModel());
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getSecurityQuestionList();
  }
  createModal(securityQuestionModel: SecurityQuestionModel) {
    let SecurityQuestionModal;
    SecurityQuestionModal = this.securityQuestionDialogModal.open(SecurityQestionModalComponent, { hasBackdrop: true, data: securityQuestionModel })
    SecurityQuestionModal.afterClosed().subscribe(result => {
      if (result === 'SAVE')
        this.getSecurityQuestionList();
    });
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getSecurityQuestionList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        this.dialogService.confirm(`Are you sure you want to delete the Security question ?`).subscribe((result: any) => {
          if (result == true) {
            this.securityQuestionService.delete(id).subscribe((response: ResponseModel) => {
              if (response.statusCode === 200) {
                this.notifier.notify('success', response.message)
                this.getSecurityQuestionList();
              } else if (response.statusCode === 401) {
                this.notifier.notify('warning', response.message)
              } else {
                this.notifier.notify('error', response.message)
              }
            });
          }
        })
        break;
      default:
        break;
    }
  }

  getSecurityQuestionList() {
    this.securityQuestionService.getAll(this.filterModel).subscribe((response: any) => {
      if (response.statusCode === 200) {
        this.securityQuestionData = response.data || [];
        this.securityQuestionData = response.data;
        this.metaData = response.meta;
      } else {
        this.securityQuestionData = [];
        this.metaData = {};
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }
  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getSecurityQuestionList();
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.securityQuestionService.getUserScreenActionPermissions('MASTERS', 'MASTERS_SECURITYQUESTIONS_LIST');
    const { MASTERS_SECURITYQUESTIONS_LIST_ADD, MASTERS_SECURITYQUESTIONS_LIST_UPDATE, MASTERS_SECURITYQUESTIONS_LIST_DELETE } = actionPermissions;
    if (!MASTERS_SECURITYQUESTIONS_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_SECURITYQUESTIONS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_SECURITYQUESTIONS_LIST_ADD || false;

  }
}


