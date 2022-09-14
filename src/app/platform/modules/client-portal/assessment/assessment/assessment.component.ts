import { Component, OnInit } from '@angular/core';
import { FilterModel } from '../../../core/modals/common-model';
import { CommonService } from '../../../core/services';
import { MatDialog } from '@angular/material';
import { AssessmentService } from '../assessment.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AssessmentModel, PatientDocumentModel } from './assessment.model';
import { MemberHRAService } from '../../../agency-portal/member-hra/member-hra.service';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentPreviewComponent } from '../../../agency-portal/questionaire-preview/document-preview/document-preview.component';
import { PreviewIndividualReportComponent } from '../../../agency-portal/member-hra/member-hra-listing/preview-individual-report/preview-individual-report.component';
import { getDate } from 'date-fns';
@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {
  filterModel: FilterModel;
  displayedColumns: Array<any>;
  clientId: number;
  loginClientId: number;
  actionButtons: Array<any>;
  subscription: Subscription;
  loginUserId: number;
  selectedLocationId: number;
  assessmentListingData: AssessmentModel[];
  metaData: any;
  imageBlobUrl: string;
  urlSafe: any;
  headerText: string;

  constructor(
    private dialogPopup: MatDialog,
    private assessmentService: AssessmentService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private notifierService: NotifierService,
    private memberHRAService: MemberHRAService,
    private sanitizer: DomSanitizer,
    public dialogModal: MatDialog,
  ) {

    this.displayedColumns = [
      { displayName: 'ASSESSMENT NAME', key: 'documentName', class: '', width: '140px',isSort: true },
      { displayName: 'Assigned By', key: 'assignedBy', class: '', width: '140px',isSort: true },
      { displayName: 'STATUS', key: 'status', class: '', width: '80px', type:['Assigned','Completed','past due'] },
      { displayName: 'COMPLETION DATE', key: 'completionDate', class: '', width: '120px', type: "date",isSort: true },
      { displayName: 'Due Date', key: 'expirationDate', class: '', width: '120px', type: "date",isSort: true },
      { displayName: 'Actions', key: 'Actions', class: '', width: '100px', type: 'memberportalhra' }
    ];
    this.actionButtons = [
      { displayName: 'Click to Start', key: 'questionnaire', class:'font500', title: 'Fill Assessment' },
    { displayName: 'Download Pdf', key: 'viewreport', class:'bluefont', title: 'Download Report' },
    { displayName: 'Preview Pdf', key: 'previewreport', class:'bluefont', title: 'Preview Report' },


    ];
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
    this.headerText = 'My Assessments'
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {

        this.loginClientId = user.id;
        this.getPatientDocumentList();
      }
    });

  }
  getPatientDocumentList() {
    const filterParams = {
      ...this.filterModel,
      patientId: this.loginClientId,
    }
    this.assessmentService.getAllPatientDocuments(filterParams).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.assessmentListingData = (response.data || []).map(x => {
          let disableActionArray = []
          // if ((x.status.toUpperCase() == 'COMPLETED') || (new Date(x.expirationDate) < (new Date(new Date().setHours(0, 0, 0, 0)))))
          // {
          //   disableActionArray.push('questionnaire');
          // }

          // if (x.status.toUpperCase() == 'ASSIGNED' || x.status.toLowerCase() == 'past due') {
          //   disableActionArray.push('viewreport');
          //   disableActionArray.push('previewreport');
          // }
          // else if (x.documentName != 'HRA Scoring' && x.documentName != 'WHO-5 Well-Being Index') {
          //   disableActionArray.push('viewreport');
          //   disableActionArray.push('previewreport');
          // }
          if (x.status.toUpperCase() == 'COMPLETED')
          {
            disableActionArray.push('questionnaire');
            disableActionArray.push('viewreport');
            disableActionArray.push('previewreport');
          } else if (x.status.toUpperCase() == 'ASSIGNED') {
            disableActionArray.push('viewreport');
            disableActionArray.push('previewreport');
          }
          else if (x.status.toLowerCase() == 'past due') {
            x.status  = "Past Due";
            disableActionArray.push('questionnaire');
            disableActionArray.push('viewreport');
            disableActionArray.push('previewreport');
          }

          x['disableActionButtons']  = disableActionArray
          return x;
        })
        this.metaData = response.meta;
      } else {
        this.assessmentListingData = [];
        this.metaData = null;
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
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
        this.assessmentService.getPatientDocumentAnswer(documentId, patientId, patientDocumentId).subscribe((response: any) => {
          if (response != null && response.data != null) {
            this.createQuestionnaireModal(response.data, documentId, patientId, patientDocumentId, actionObj.data.documentName, actionObj.data.assignedById);
          }
        });
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
    } else {
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
  createQuestionnaireModal(questionnaireModel: any, documentId: number, patientId: number, patientDocumentId: number, docName: string,providerId : number) {
    let questionnaireModal;
    questionnaireModal = this.dialogPopup.open(DocumentPreviewComponent,
      {
        hasBackdrop: true,
        data: {
          answer: questionnaireModel.answer,
          sectionItemData: questionnaireModel.sectionItems,
          sectionItemCodes: questionnaireModel.codes,
          patientDocumentId: patientDocumentId, // view only answers
          documentId: documentId,
          patientId: patientId,
          docName: docName,
          providerId: providerId
        }
      })
    questionnaireModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getPatientDocumentList();
    });
  }
}
