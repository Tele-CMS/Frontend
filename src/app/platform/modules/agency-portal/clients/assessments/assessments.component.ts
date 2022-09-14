import { Component, OnInit } from '@angular/core';
import { FilterModel } from '../../../core/modals/common-model';
import { AssessmentModel, PatientDocumentModel } from './assessment.model';
// import { ClientHealthService } from '../client-health.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../core/services';
import { MatDialog } from '@angular/material';
import { DocumentPreviewComponent } from '../../questionaire-preview/document-preview/document-preview.component';
import { AssignQuestionnaireModalComponent } from './assign-questionnaire-modal/assign-questionnaire-modal.component';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { MemberHRAService } from '../../member-hra/member-hra.service';
import { BulkUpdateAssessmentComponent } from '../../member-hra/member-hra-listing/bulk-update-assessment/bulk-update-assessment.component';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewIndividualReportComponent } from '../../member-hra/member-hra-listing/preview-individual-report/preview-individual-report.component';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css']
})
export class AssessmentsComponent implements OnInit {
  urlSafe: any;
  imageBlobUrl: string;
  assessmentListingData: AssessmentModel[];
  filterModel: FilterModel;
  metaData: any;
  masterDocuments: Array<any>;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  clientId: number;
  addPermission: boolean;
  subscription: Subscription;
  loginUserId: number;
  selectedLocationId: number;
  masterStatus: any;
  filters: any
  filterParams: {
    documentId?: number,
    statusId?: number,
    patientId?: number,
  }
  header: string = "Patient Assessments";
  constructor(
    // private clientService: ClientHealthService,
    private clientService: ClientsService,
    private assignDocumentDialogModal: MatDialog,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private memberHRAService: MemberHRAService,
    public bulkUpdationModal: MatDialog,
    public dialogModal: MatDialog,
    private sanitizer: DomSanitizer,
    private patientDocumentAnswerDialogModal: MatDialog) {
    this.displayedColumns = [
      { displayName: 'Assessment', key: 'documentName', class: '' },
      { displayName: 'Completion Date', key: 'completionDate', class: '', type: "date" },
      { displayName: 'Status', key: 'status', class: '', width: '10%' },
      { displayName: 'Assigned Date', key: 'assignedDate', class: '', type: "date" },
      { displayName: 'Assigned By', key: 'assignedBy', class: '' },
      { displayName: 'Due Date', key: 'expirationDate', class: '', type: "date" },
      { displayName: 'Actions', key: 'Actions', class: '' }
    ];
    this.actionButtons = [
      { displayName: 'Fill Assessment', key: 'questionnaire', class: 'fa fa-file-text-o' },
      { displayName: 'Edit Assessment', key: 'edit', class: 'fa fa-pencil' },
      // { displayName: 'Download Individual Report', key: 'viewreport', class: 'fa fa-download' },
      // { displayName: 'Preview Individual Report', key: 'previewreport', class: 'fa fa-eye' },


    ];
    this.filterModel = new FilterModel();
    this.filterParams = {
    }
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      const documentId = params.docId == undefined ? null : params.docId,
        statusId = params.statusId == undefined ? null : params.statusId;
      this.filterParams.documentId = parseInt(documentId, 10)
      this.filterParams.statusId = parseInt(statusId, 10)
    });

    this.subscription = this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.loginUserId = user.id;
        this.selectedLocationId = user.currentLocationId;
      }
    });
    if (this.filterParams && this.filterParams.documentId > 0 || this.filterParams.statusId > 0)
      this.applyFilter();
    this.getMasterData();
    this.getPatientDocumentList()
  }
  getMasterData() {
    let data = 'DOCUMENTS,MASTERDOCUMENTSTATUS'
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterDocuments = response.documents != null ? response.documents : [];
        this.masterStatus = response.masterDocumentStatus != null ? response.masterDocumentStatus : [];
      }
    });
  }
  getPatientDocumentList() {
    const filterParams = {
      ...this.filterModel,
      ...this.filters,
      patientId: this.clientId,
    }
    this.clientService.getAllPatientDocuments(filterParams).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.assessmentListingData = (response.data || []).map(x => {
          let disableActionArray = []
          if (x.documentName != 'HRA Scoring' && x.documentName != 'WHO-5 Well-Being Index') {
            disableActionArray.push('viewreport');
            disableActionArray.push('previewreport');
          }
          if (x.status.toLowerCase() == 'past due' ) {
            disableActionArray.push('viewreport');
            disableActionArray.push('previewreport');
          }

          x['disableActionButtons'] = disableActionArray
          return x;
        })
      //  this.assessmentListingData = response.data;
        this.metaData = response.meta;
      } else {
        this.assessmentListingData = [];
        this.metaData = {};
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }
  openDialog(id?: number) {
    this.createModal(new PatientDocumentModel());
  }
  createModal(patientDocumentModel: PatientDocumentModel) {
    let patientDocumentModal, selectFilteredServerSideMembers;
    const filterPatients = patientDocumentModel.id > 0 && patientDocumentModel.patientName ?
      [{
        id: patientDocumentModel.patientId,
        value: patientDocumentModel.patientName,
        dob: null,
        mrn: ""
      }] :
      selectFilteredServerSideMembers;
    patientDocumentModal = this.assignDocumentDialogModal.open(AssignQuestionnaireModalComponent,
      {
        hasBackdrop: true,
        data: {
          patientDocumentModel: patientDocumentModel,
          clientId: this.clientId,
          masterDocuments: this.masterDocuments,
          patientDocumentId: patientDocumentModel.id,
          assignedBy: this.loginUserId,
          selectedLocationId: this.selectedLocationId,
          selectFilteredServerSideMembers: filterPatients
        }
      }
    )
    patientDocumentModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getPatientDocumentList();
    });
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getPatientDocumentList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
  }

  onTableActionClick(actionObj?: any) {
    const patientDocumentId = actionObj.data && actionObj.data.id,
      documentId = actionObj.data && actionObj.data.documentId,
      patientId = actionObj.data && actionObj.data.patientId;
    let memberObj = actionObj.data;
    memberObj.patientDocumentId = patientDocumentId;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'QUESTIONNAIRE':
        this.openQuestionnaireDialog(patientDocumentId, documentId, patientId, actionObj.data.documentName);
        break;
      case 'EDIT':
        this.openDialogForEdit(memberObj)
        break;
      case 'VIEWREPORT':
        this.viewIndividualReport(actionObj.data, 'view')
        break;
      case 'PREVIEWREPORT':
        this.viewIndividualReport(actionObj.data, 'preview')
        break;
      default:
        break;
    }
  }
  viewIndividualReport(memberListObj: any, stringKey: string) {

    if (memberListObj.status.toLowerCase() == 'assigned') {
      this.notifierService.notify('warning', 'Assessment has not been submitted/answered yet.')
    }
    else {
      this.memberHRAService.generateIndividualSummaryPDF(memberListObj.patientDocumentId, memberListObj.patientId).subscribe((response: any) => {
        if (stringKey == 'view') {
          this.memberHRAService.downLoadFile(response, 'application/pdf', `${memberListObj.reportName}.pdf`)
        } else {
          this.createImageFromBlob(response);
        }
      });
    }
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    this.imageBlobUrl = "";
    this.urlSafe = ''
    reader.addEventListener("load", () => {
      this.imageBlobUrl = reader.result as string;

      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageBlobUrl);
      let previewModal;
      previewModal = this.dialogModal.open(PreviewIndividualReportComponent, { data: { urlSafe: this.urlSafe } })
      previewModal.afterClosed().subscribe((result: string) => {
      });
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  openDialogForEdit(memberListObj: any[]) {
    const modalPopup = this.bulkUpdationModal.open(BulkUpdateAssessmentComponent, {
      hasBackdrop: true,
      data: { memberListObj: memberListObj, masterStatus: this.masterStatus, key: 'edit' },
    });
    modalPopup.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getPatientDocumentList();
    });
  }
  openQuestionnaireDialog(patientDocumentId: number, documentId: number, patientId: number, docName: string) {
    this.clientService.getPatientDocumentAnswer(documentId, patientId, patientDocumentId).subscribe((response: any) => {
      if (response != null && response.data != null) {
        this.createQuestionnaireModal(response.data, documentId, patientId, patientDocumentId, docName);
      }
    });
  }
  createQuestionnaireModal(questionnaireModel: any, documentId: number, patientId: number, patientDocumentId: number, docName: string) {
    let questionnaireModal;
    questionnaireModal = this.patientDocumentAnswerDialogModal.open(DocumentPreviewComponent,
      {
        hasBackdrop: true,
        data: {
          answer: questionnaireModel.answer,
          sectionItemData: questionnaireModel.sectionItems,
          sectionItemCodes: questionnaireModel.codes,
          patientDocumentId: patientDocumentId, // view only answers
          documentId: documentId,
          patientId: patientId,
          docName: docName
        }
      })
    questionnaireModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getPatientDocumentList();
    });
  }
  getUserPermissions() {
    const actionPermissions = this.clientService.getUserScreenActionPermissions('CLIENT', 'CLIENT_ASSESSMENTS_LIST');
    const { CLIENT_VIEW_QUESTIONNAIRE } = actionPermissions;

    if (!CLIENT_VIEW_QUESTIONNAIRE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'questionnaire');
      this.actionButtons.splice(spliceIndex, 1)
    }
  }

  clearfilterParams() {
    this.filterParams.documentId = null;
    this.filterParams.statusId = null;
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '');
    // this.filters = null
    this.assessmentListingData = []
    // this.getPatientDocumentList()
    this.applyFilter()
  }
  applyFilter() {
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '');
    this.filters = {
      documentId: this.filterParams && this.filterParams.documentId ? this.filterParams.documentId : null,
      statusId: this.filterParams && this.filterParams.statusId ? this.filterParams.statusId : null,
    }
    if (this.filters) {
      this.getPatientDocumentList();
    }
  }
}
