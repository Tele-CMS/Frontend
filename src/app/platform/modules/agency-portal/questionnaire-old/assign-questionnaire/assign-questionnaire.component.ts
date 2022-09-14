import { Component, OnInit } from '@angular/core';
import { ResponseModel, FilterModel } from '../../../core/modals/common-model';
import { PatientDocumentModel, SectionItemModel } from '../documents/document.model';
import { DocumentService } from '../documents/document.service';
import { MatDialog } from '@angular/material';
import { DocumentPreviewComponent } from '../document-preview/document-preview.component';
import { AssignQuestionnaireModalComponent } from './assign-questionnaire-modal/assign-questionnaire-modal.component';
import { CommonService } from '../../../core/services';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assign-questionnaire',
  templateUrl: './assign-questionnaire.component.html',
  styleUrls: ['./assign-questionnaire.component.css']
})
export class AssignQuestionnaireComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel;
  searchText: string = "";
  documentId: number;
  patientId: number;
  patientDocumentId: number;
  masterDocuments: any = [];
  masterPatients: any = [];
  subscription: Subscription;
  loginUserId: number;
  patientDocumentData: PatientDocumentModel[];
  displayedColumns: Array<any> = [
    { displayName: 'QUESTIONNAIRE', key: 'documentName', class: '', width: '30%' },
    { displayName: 'STATUS', key: 'status', class: '', width: '20%' },
    { displayName: 'PATIENT NAME', key: 'patientName', class: '', width: '20%', },
    { displayName: 'ASSIGNED DATE', key: 'createdDate', class: '', width: '20%', type: "date" },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Questionnaire', key: 'questionnaire', class: 'fa fa-file-text-o' },
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
  ];
  constructor(
    private assignDocumentDialogModal: MatDialog,
    private patientDocumentAnswerDialogModal: MatDialog,
    private assignDocumentService: DocumentService,
    private commonService: CommonService
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getMasterData();
    this.getPatientDocumentList();
    this.getPatientMasterForDropdown();
    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.loginUserId = user.data.id;
      }
    });
  }
  getMasterData() {
    let data = { 'masterdata': 'DOCUMENTS' }
    this.assignDocumentService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterDocuments = response.documents != null ? response.documents : [];
      }
    });
  }
  getPatientMasterForDropdown() {
    this.assignDocumentService.getPatientMasterForDropdown().subscribe((response: any) => {
      if (response != null) {
        this.masterPatients = response.data.patients;
      }
    });
  }
  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.assignDocumentService.getPatientDocumentById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new PatientDocumentModel());
  }
  openQuestionnaireDialog(documentId: number, patientId: number) {
    this.assignDocumentService.getPatientDocumentAnswer(documentId, patientId).subscribe((response: any) => {
      if (response != null && response.data != null) {
        this.createQuestionnaireModal(response.data);
      }
    });
  }
  createQuestionnaireModal(questionnaireModel: SectionItemModel) {
    let questionnaireModal;
    questionnaireModal = this.patientDocumentAnswerDialogModal.open(DocumentPreviewComponent, { hasBackdrop: true, data: { answer: questionnaireModel.answer, sectionItemData: questionnaireModel.sectionItems, sectionItemCodes: questionnaireModel.codes, patientDocumentId: this.patientDocumentId, documentId: this.documentId, patientId: this.patientId } })
    questionnaireModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getPatientDocumentList();
    });
  }
  createModal(patientDocumentModel: PatientDocumentModel) {
    let patientDocumentModal;
    patientDocumentModal = this.assignDocumentDialogModal.open(AssignQuestionnaireModalComponent, { hasBackdrop: true, data: { patientDocumentModel: patientDocumentModel, masterDocuments: this.masterDocuments, masterPatients: this.masterPatients, patientDocumentId: patientDocumentModel.id, documentId: this.documentId, assignedBy: this.loginUserId } })
    patientDocumentModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getPatientDocumentList();
    });
  }
  clearFilters() {
    this.searchText = '';
    this.documentId = null;
    this.patientDocumentData = [];
    this.metaData = [];
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', '');
    this.getPatientDocumentList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getPatientDocumentList();
  }

  onTableActionClick(actionObj?: any) {
    this.patientDocumentId = actionObj.data && actionObj.data.id;
    this.documentId = actionObj.data && actionObj.data.documentId;
    this.patientId = actionObj.data && actionObj.data.patientId;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(this.patientDocumentId);
        break;
      case 'QUESTIONNAIRE':
        {
          this.openQuestionnaireDialog(this.documentId, this.patientId);
        }
        break;
      default:
        break;
    }
  }
  onDocumentSelect(id) {
    this.documentId = id;
    if (this.documentId)
      this.getPatientDocumentList();
  }
  getPatientDocumentList() {
    this.assignDocumentService.getAllPatientDocuments(this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.patientDocumentData = response.data;
        this.metaData = response.meta;
      } else {
        this.patientDocumentData = [];
        this.metaData = null;
      }
    }
    );
  }
  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getPatientDocumentList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

}
