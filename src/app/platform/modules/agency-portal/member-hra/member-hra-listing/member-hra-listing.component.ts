import { Component, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject, Subject, Observable, of, merge, Subscription } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, finalize, delay, catchError } from 'rxjs/operators';
import { MemberHRAService } from '../member-hra.service';
import { FormControl } from '@angular/forms';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { MemberHRAModel } from './member-hra.model';
import { Metadata } from 'src/app/super-admin-portal/core/modals/common-model';
import { MatDialog, MatPaginator } from '@angular/material';
import { AssignAssessmentModalComponent } from './assign-assessment-modal/assign-assessment-modal.component';
import { DocumentPreviewComponent } from '../../questionaire-preview/document-preview/document-preview.component';
import { SectionItemModel } from '../../questionnaire/documents/document.model';
import { NotifierService } from 'angular-notifier';
import { BulkUpdateAssessmentComponent } from './bulk-update-assessment/bulk-update-assessment.component';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
// import { DocumentUploadModel } from '../../client-health/documents/document-upload.model';
import { BulkEmailModalComponent } from './member-hra-bulk-email-modal/member-hra-bulk-email-modal.component';
import { format } from 'date-fns';
import { CommonService } from '../../../core/services';
import { Router, ActivatedRoute } from '@angular/router';
import { ExecutiveReportModalComponent } from './executive-report-modal/executive-report-modal.component';
import { PreviewIndividualReportComponent } from './preview-individual-report/preview-individual-report.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Overlay } from '@angular/cdk/overlay';
import { BulkMessageModalComponent } from './member-hra-bulk-message-modal/member-hra-bulk-message-modal.component';
import { parse } from 'querystring';


interface HealthPlanModel {
  id: number;
  value: string;
  description: string;
  insuranceCompanyId: number;
}
interface UpdateStatusModel {
  statusId: number
  patientDocumentId: number
}

@Component({
  selector: 'app-member-hra-listing',
  templateUrl: './member-hra-listing.component.html',
  styleUrls: ['./member-hra-listing.component.css']
})
export class MemberHraListingComponent implements OnInit {
  isDialogLoading: boolean;
  urlSafe: any;
  imageBlobUrl: string;
  masterHealthPlan: Array<any>;
  filterParams: any;
  isDisabled: boolean = true
  totalRecords: number;
  docName: string
  count: number
  programListData: Array<any>;
  masterRelationship: Array<any>;
  meta: Metadata;
  masterChronicCondition: Array<any>;
  masterDocuments: Array<any>;
  newMemberList: Array<any>;
  masterStatus: Array<any>;
  filterModel: FilterModel;
  memberListData: MemberHRAModel[];
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  checkMember: boolean = false;
  statusModel: UpdateStatusModel
  statusArray: Array<any> = [];
  patientDocIdArray: Array<any> = []
  metaData: Metadata;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isExportButtonDisabled: boolean = true;
  subscription: Subscription;
  currentLoginUserId: number
  currentLocationId: number
  masterStaffs: Array<any>
  eligibleDD: Array<any>
  masterEnrollmentTypeFilter: Array<any>
  nextAppointmentList: Array<any> = [
    { id: true, value: 'Upcoming Appointment' },
    { id: false, value: 'No Upcoming Appointment' }
  ];
  //Autocomplete
  memberHealthPlanFilterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideHealthPlan: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideMemberHealthPlan: Array<any>;
  selectFilteredServerSideMemberHealthPlan: Array<any>;
  filters: {
    healthPlanId?: number;
    programTypeId: string;
    documentId?: number;
    statusId?: number;
    conditionId: string;
    searchText: string;
    completionStartDate?: Date;
    completionEndDate?: Date;
    expirationStartDate?: Date;
    expirationEndDate?: Date;
    isEligible?: string;
    assignedStartDate?: Date;
    assignedEndDate?: Date;
    eligibilityStartDate?: Date;
    eligibilityEndDate?: Date;
    relationship: string,
    careManagerIds: Array<string>,
    enrollmentId?: number,
    nextAppointmentPresent: boolean
  }
  protected _onDestroy = new Subject<void>();
  constructor(
    private overlay: Overlay,
    private memberHRAService: MemberHRAService,
    public memberAssessmentModal: MatDialog,
    public bulkUpdationModal: MatDialog,
    public exectiveSummaryModal: MatDialog,
    public dialogModal: MatDialog,
    private sanitizer: DomSanitizer,
    private patientDocumentAnswerDialogModal: MatDialog,
    private memberHRAEmailDialogModal: MatDialog,
    private commonService: CommonService,
    private router: Router,
    private notifierService: NotifierService,
    private memberHRAMessageModal: MatDialog,
    private activatedRoute: ActivatedRoute
    //private notifier: NotifierService
  ) {
    this.eligibleDD = [{ value: 'Yes' }, { value: 'No' }]
    this.filterModel = new FilterModel();
    this.filterParams = null
    this.newMemberList = []
    this.masterStaffs = []
    this.patientDocIdArray = []
    this.masterEnrollmentTypeFilter = []
    this.count = 0
    this.metaData = new Metadata();
    this.selectFilteredServerSideMemberHealthPlan = [];
    this.fetchedFilteredServerSideMemberHealthPlan = [];
    this.filters = {
      searchText: '',
      relationship: '',
      isEligible: '',
      conditionId: '',
      programTypeId: '',
      careManagerIds: [],
      enrollmentId: null,
      nextAppointmentPresent: null
    };
    this.activatedRoute.queryParams.subscribe(params => {
      const documentId = params.docId == undefined ? null : params.docId,
        statusId = params.statusId == undefined ? null : params.statusId,
        enrollmentId = params.EnrollmentId == undefined ? null : this.commonService.encryptValue(params.EnrollmentId, false)
      this.filters.nextAppointmentPresent = params.nextApp == undefined ? null : Boolean(JSON.parse(params.nextApp));

      // let caremanagerIdArray;
      // caremanagerIdArray = params.careManagerIds ? (params.careManagerIds || '').split(',').map(x => parseInt(x)): null;
      let caremanagerIdArray;
      caremanagerIdArray = params.careManagerIds ? (this.commonService.encryptValue(params.careManagerIds, false) || '').split(',').map(x => parseInt(x)) : null;
      // if(params.careManagerIds == undefined){
      //   return null;
      // }else{
      //   params.careManagerIds.forEach(x=>{
      //     caremanagerIdArray.push(parseInt(x))
      //   })
      // }
      this.filters.documentId = parseInt(documentId, 10);
      this.filters.statusId = parseInt(statusId, 10);
      this.filters.enrollmentId = parseInt(enrollmentId, 10)
      if (caremanagerIdArray && caremanagerIdArray.length > 0) {
        this.filters.careManagerIds = caremanagerIdArray
      }
      // if (this.filters && (this.filters.enrollmentId > 0 || this.filters.documentId > 0 || this.filters.statusId > 0 || (this.filters.careManagerIds && this.filters.careManagerIds.length > 0)))
      //   this.applyFilter();
    });
  }

  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLoginUserId = user.id;
        this.currentLocationId = user.currentLocationId;
      }
    });
    this.onPageChanges();
    this.getMasterData();
    this.getProgramList();
    this.getStaffsByLocation();
    //this.getMemberHRAList();
    this.applyFilter();
    this.memberHealthPlanFilterCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {

          // simulate server fetching and filtering data
          if (search.length > 2) {
            return this._filter(search).pipe(
              finalize(() => this.searching = false),
            )
          } else {
            // if no value is present, return null
            return of([]);
          }
        }),
        delay(500)
      )
      .subscribe(filteredMembers => {
        this.searching = false;
        filteredMembers.subscribe(res => { this.fetchedFilteredServerSideMemberHealthPlan = res; this.filteredServerSideHealthPlan.next(res) });
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });
  }
  getStaffsByLocation(): void {
    const locId = this.currentLocationId.toString();
    this.memberHRAService.getStaffAndPatientByLocation(locId)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.masterStaffs = [];
        } else {
          this.masterStaffs = response.data.staff || [];
        }
      })
  }

  onPageChanges() {
    merge(this.paginator.page)
      .subscribe(() => {

        const changeState = {
          pageNumber: (this.paginator.pageIndex + 1),
          pageSize: this.paginator.pageSize
        }
        this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, '', '', this.filterModel.searchText);
        this.getMemberHRAList();
      })
  }
  viewResponses(documentId: number, patientId: number, patientDocumentId: number) {
    this.memberHRAService.getPatientDocumentAnswer(documentId, patientId, patientDocumentId).subscribe((response: any) => {
      if (response != null && response.data != null) {
        this.createQuestionnaireModal(response.data, patientId, patientDocumentId);
      }
    });
  }
  createQuestionnaireModal(questionnaireModel: SectionItemModel, patientId: number, patientDocumentId: number) {
    let questionnaireModal;
    questionnaireModal = this.patientDocumentAnswerDialogModal.open(DocumentPreviewComponent,
      {
        hasBackdrop: true,
        data: {
          answer: questionnaireModel.answer,
          sectionItemData: questionnaireModel.sectionItems,
          sectionItemCodes: questionnaireModel.codes,
          patientDocumentId: patientDocumentId, // view only answers
          documentId: this.filters.documentId,
          patientId: patientId,
          key: 'memberhra',
          docName: this.docName
        }
      })
    questionnaireModal.afterClosed().subscribe((result: string) => {

    });
  }

  viewIndividualReport(memberListObj: any, stringKey: string) {
    if (memberListObj.status.toLowerCase() == 'assigned') {
      this.notifierService.notify('warning', 'Assessment has not been submitted/answered yet.')
    } else {
      this.isDialogLoading = true;
      this.memberHRAService.generateIndividualSummaryPDF(memberListObj.patientDocumentId, memberListObj.patientId).subscribe((response: any) => {
        this.isDialogLoading = false;
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
      previewModal = this.dialogModal.open(PreviewIndividualReportComponent, {
        data: { urlSafe: this.urlSafe }
      })
      previewModal.afterClosed().subscribe((result: string) => {
      });
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  printExecutiveSummary() {
    const modalPopup = this.exectiveSummaryModal.open(ExecutiveReportModalComponent, {
      hasBackdrop: true,
      data: { masterDocuments: this.masterDocuments },
    });
    modalPopup.afterClosed().subscribe((result: string) => {
    });
  }
  updateBulkData() {
    let distinctAssessmentCount = this.docName != "" ? this.memberListData.find(x => x.distinctAssessments > 0).distinctAssessments : 0;
    this.filterParams.pageSize = this.totalRecords;
    if (distinctAssessmentCount > 0) {
      const modalPopup = this.bulkUpdationModal.open(BulkUpdateAssessmentComponent, {
        hasBackdrop: true,
        data: { patientDocIdArray: this.patientDocIdArray, filterModel: this.filterParams, masterStatus: this.masterStatus, count: distinctAssessmentCount, key: 'editbulk', nextAppointmentPresent: this.filters.nextAppointmentPresent },
      });
      modalPopup.afterClosed().subscribe((result: string) => {
        if (result == 'save')
          this.getMemberHRAList();
      });
    } else {
      this.notifierService.notify("warning", "No assessment selected to update.")
    }

  }
  openAssignAssessment() {
    let distinctMemberArray = Array.from(new Set(this.newMemberList.map(x => x.patientId))).map(patientId => {
      let x = this.newMemberList.find(x => x.patientId == patientId)
      return {
        ...x
      }
    })
    const modalPopup = this.memberAssessmentModal.open(AssignAssessmentModalComponent, {
      hasBackdrop: true,
      data: { memberListData: distinctMemberArray, documentId: this.filters.documentId, masterDocuments: this.masterDocuments, count: distinctMemberArray.length, key: 'AssignAssessment' },
    });
    modalPopup.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getMemberHRAList();
    });

  }
  getProgramList() {
    this.memberHRAService.getDiseaseManagementProgramList(this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.programListData = response.data || [];
        this.meta = response.meta;
      } else {
        this.programListData = [];
        this.meta = null;
      }
    }
    );
  }
  getMasterData() {
    let data = "MASTERCHRONICCONDITION,MASTERDOCUMENTSTATUS,DOCUMENTS,DOCUMENTSTATUS,MASTERRELATIONSHIP,MASTERENROLLMENTTYPEFILTER";
    this.memberHRAService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterChronicCondition = response.masterChronicCondition != null ? response.masterChronicCondition : [];
        this.masterStatus = response.masterDocumentStatus != null ? response.masterDocumentStatus : [];
        this.masterDocuments = response.documents != null ? response.documents : [];
        this.masterRelationship = response.masterRelationship != null ? response.masterRelationship : [];
        this.masterEnrollmentTypeFilter = response.masterEnrollmentTypeFilter || [];
      }
    });
  }
  clearParticularField(key: string) {
    switch ((key || '').toLowerCase()) {
      case 'conditionclear':
        this.filters.conditionId = '';
        break;
      case 'documentclear':
        this.filters.documentId = null;
        break;
      case 'programclear':
        this.filters.programTypeId = '';
        break;
      case 'statusclear':
        this.filters.statusId = null;
        break;
      case 'searchclear':
        this.filters.searchText = '';
        break;
      case 'complstartclear':
        this.filters.completionStartDate = null;
        break;
      case 'complendclear':
        this.filters.completionEndDate = null;
        break;
      case 'expstartclear':
        this.filters.expirationStartDate = null;
        break;
      case 'expendclear':
        this.filters.expirationEndDate = null;
        break;
      case 'assignstartclear':
        this.filters.assignedStartDate = null;
        break;
      case 'assignndclear':
        this.filters.assignedEndDate = null;
        break;
      case 'eligibilitystartclear':
        this.filters.eligibilityStartDate = null
        break;
      case 'eligibilityenddateclear':
        this.filters.eligibilityEndDate = null
        break;
      case 'relationshipclear':
        this.filters.relationship = ''
        break;
      case 'caremanagerclear':
        this.filters.careManagerIds = []
        break;
      case 'eligibleclear':
        this.filters.isEligible = ''
        break;
      case 'enrollclear':
        this.filters.enrollmentId = null
        break;
    }
  }


  clearFilters() {
    this.filters.searchText = '';
    this.filters.documentId = null;
    this.filters.programTypeId = '';
    this.filters.healthPlanId = null;
    this.filters.statusId = null;
    this.filters.conditionId = '';
    this.filters.completionEndDate = null;
    this.filters.completionStartDate = null;
    this.filters.expirationEndDate = null;
    this.filters.expirationStartDate = null;
    this.filters.isEligible = '';
    this.filters.assignedStartDate = null;
    this.filters.relationship = ''
    this.filters.assignedEndDate = null;
    this.filters.eligibilityStartDate = null;
    this.filters.eligibilityEndDate = null;
    this.filters.relationship = '';
    this.filters.careManagerIds = [];
    this.filters.enrollmentId = null;
    this.filters.nextAppointmentPresent = null;
    this.memberListData = [];
    this.setPaginatorModel(null, null, '', '', this.filterModel.searchText);
    this.patientDocIdArray = [];
    this.newMemberList = [];
    this.count = 0,
      this.isDisabled = true
  }
  getMemberHRAList() {
    const postfilterParams = {
      ...this.filterParams,
      ...this.filterModel,
    }
    this.memberHRAService.getMemberHRAListing(postfilterParams).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.memberListData = response.data;
        this.memberListData.forEach(x => {
          this.patientDocIdArray.push(x.patientDocumentId);
        })
        this.totalRecords = this.memberListData.find(x => x.totalRecords > 0).totalRecords;
        // this.docName = this.memberListData.find(x => x.documentId && x.documentId == this.filters.documentId).assessmentName || ""
        let docObj = this.memberListData.find(x => x.documentId && x.documentId == this.filters.documentId)
        this.docName = docObj != null ? docObj.assessmentName : ''
        this.memberListData.forEach(y => {
          if (y != null && y.patientDocumentId > 0 && this.patientDocIdArray.find(x => x == y.patientDocumentId) != null) {
            y.isChecked = true;
          }
          else if (y != null && y.patientId > 0 && this.newMemberList.find(x => x == y.patientId) != null) {
            y.isChecked = true;
          }
          else
            y.isChecked = false;
        })
        this.isExportButtonDisabled = this.memberListData.length > 0 ? false : true;
        this.metaData = response.meta;
        //this.metaData.totalRecords = this.totalRecords > 0 ? this.totalRecords : 0

      } else {
        this.memberListData = [];
        this.metaData = new Metadata();
        this.totalRecords = 0;
      }
    }
    );
  }
  assignBulkHRAData() {
    let distinctPatientCount = this.memberListData.find(x => x.distinctPatients > 0).distinctPatients
    this.filterParams.pageSize = this.totalRecords
    const modalPopup = this.memberAssessmentModal.open(AssignAssessmentModalComponent, {
      hasBackdrop: true,
      data: { memberListData: this.memberListData, documentId: this.filters.documentId, masterDocuments: this.masterDocuments, count: distinctPatientCount, key: 'AssignBulkAssessment', filterParams: this.filterParams, docName: this.docName },
    });
    modalPopup.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getMemberHRAList();
    });
  }
  openDialog(memberListObj: any) {
    memberListObj.documentName = this.docName
    const modalPopup = this.bulkUpdationModal.open(BulkUpdateAssessmentComponent, {
      hasBackdrop: true,
      data: { memberListObj: memberListObj, masterStatus: this.masterStatus, key: 'edit', },
    });
    modalPopup.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getMemberHRAList();
    });
  }
  _filter(value: string): Observable<any> {
    const filterValue = value.toLowerCase();
    return this.memberHRAService
      .getPatientPayerHealthPlan(filterValue)
      .pipe(
        map(
          (response: any) => {
            if (response.statusCode !== 200)
              return [];
            else
              return (response.data || []).map((healthPlanObj: any) => {
                const Obj: HealthPlanModel = {
                  id: healthPlanObj.id,
                  value: healthPlanObj.value,
                  description: healthPlanObj.description,
                  insuranceCompanyId: healthPlanObj.insuranceCompanyId
                }
                return Obj;
              });
          }),
        catchError(_ => {
          return [];
        })
      );
  }

  get getSlectFilteredServerSideMemberHealthPlan() {
    return (this.selectFilteredServerSideMemberHealthPlan || []).filter(x => {
      if ((this.fetchedFilteredServerSideMemberHealthPlan || []).findIndex(y => y.id == x.id) > -1)
        return false;
      else
        return true;
    })
  }
  onNavigate(url: string, patientId: number) {
    this.router.navigate([url], { queryParams: { id: this.commonService.encryptValue(patientId, true) } });
  }
  onPatientHealthPlanSelect(id) {
    let clientsArray = this.fetchedFilteredServerSideMemberHealthPlan || [];
    clientsArray = [...this.selectFilteredServerSideMemberHealthPlan, ...clientsArray];
    clientsArray = Array.from(new Set(clientsArray.map(s => s)));
    this.selectFilteredServerSideMemberHealthPlan = clientsArray.filter(x => x.id == id);
  }
  isButtonDisabled(event: any) {
    this.isDisabled = true
  }

  applyFilter() {
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', this.filters.searchText);
    this.isDisabled = false
    this.filterParams = {
      searchText: this.filters && this.filters.searchText ? this.filters.searchText : '',
      documentId: this.filters && this.filters.documentId ? this.filters.documentId : null,
      relationship: this.filters && this.filters.relationship ? this.filters.relationship : '',
      careManagerIds: this.filters && this.filters.careManagerIds ? this.filters.careManagerIds : [],
      conditionId: this.filters && this.filters.conditionId ? this.filters.conditionId : '',
      statusId: this.filters && this.filters.statusId ? this.filters.statusId : null,
      healthPlanId: this.filters && this.filters.healthPlanId ? this.filters.healthPlanId : null,
      programTypeId: this.filters && this.filters.programTypeId ? this.filters.programTypeId : '',
      completionStartDate: this.filters && this.filters.completionStartDate ? format(this.filters.completionStartDate, 'MM/DD/YYYY') : null,
      completionEndDate: this.filters && this.filters.completionEndDate ? format(this.filters.completionEndDate, 'MM/DD/YYYY') : null,
      expirationStartDate: this.filters && this.filters.expirationStartDate ? format(this.filters.expirationStartDate, 'MM/DD/YYYY') : null,
      expirationEndDate: this.filters && this.filters.expirationEndDate ? format(this.filters.expirationEndDate, 'MM/DD/YYYY') : null,
      assignedStartDate: this.filters && this.filters.assignedStartDate ? format(this.filters.assignedStartDate, 'MM/DD/YYYY') : null,
      assignedEndDate: this.filters && this.filters.assignedEndDate ? format(this.filters.assignedEndDate, 'MM/DD/YYYY') : null,
      eligibilityStartDate: this.filters && this.filters.eligibilityStartDate ? format(this.filters.eligibilityStartDate, 'MM/DD/YYYY') : null,
      eligibilityEndDate: this.filters && this.filters.eligibilityEndDate ? format(this.filters.eligibilityEndDate, 'MM/DD/YYYY') : null,
      isEligible: this.filters && this.filters.isEligible ? this.filters.isEligible : '',
      enrollmentId: this.filters && this.filters.enrollmentId ? this.filters.enrollmentId : null,
      nextAppointmentPresent: this.filters.nextAppointmentPresent,
    }
    if (this.filters.searchText.trim() == '' || this.filters.searchText.trim().length >= 3 && this.filterParams) {
      this.getMemberHRAList();
    }
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  createModal(documentObj?: any) {
    let distinctPatientCount = this.memberListData.find(x => x.distinctPatients > 0).distinctPatients
    this.filterParams.pageSize = distinctPatientCount
    let documentModal;
    const filterParams = this.filterParams

    documentModal = this.memberHRAEmailDialogModal.open(BulkEmailModalComponent, { data: { documentObj: documentObj, filterModel: filterParams, nextAppointmentPresent: this.filters.nextAppointmentPresent } })
    documentModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }

    });
  }

  createMessageModal(documentObj?: any) {
    let distinctPatientCount = this.memberListData.find(x => x.distinctPatients > 0).distinctPatients
    this.filterParams.pageSize = distinctPatientCount
    let documentModal;
    const filterParams = this.filterParams

    documentModal = this.memberHRAMessageModal.open(BulkMessageModalComponent, { data: { documentObj: documentObj, filterModel: filterParams, nextAppointmentPresent: this.filters.nextAppointmentPresent } })
    documentModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }

    });
  }

  exportToExcel() {
    if (this.memberListData && this.memberListData.length > 0) {
      let pageSize = this.memberListData.find(x => x.totalRecords > 0).totalRecords
      // this.filterModel.pageSize = pageSize
      this.filterParams = {
        ...this.filterModel,
        pageSize: pageSize,
        searchText: this.filters && this.filters.searchText ? this.filters.searchText : '',
        documentId: this.filters && this.filters.documentId ? this.filters.documentId : null,
        relationship: this.filters && this.filters.relationship ? this.filters.relationship : '',
        careManagerIds: this.filters && this.filters.careManagerIds ? this.filters.careManagerIds.join(',') : "",
        conditionId: this.filters && this.filters.conditionId ? this.filters.conditionId : '',
        statusId: this.filters && this.filters.statusId ? this.filters.statusId : null,
        healthPlanId: this.filters && this.filters.healthPlanId ? this.filters.healthPlanId : null,
        programTypeId: this.filters && this.filters.programTypeId ? this.filters.programTypeId : '',
        completionStartDate: this.filters && this.filters.completionStartDate ? format(this.filters.completionStartDate, 'MM/DD/YYYY') : null,
        completionEndDate: this.filters && this.filters.completionEndDate ? format(this.filters.completionEndDate, 'MM/DD/YYYY') : null,
        expirationStartDate: this.filters && this.filters.expirationStartDate ? format(this.filters.expirationStartDate, 'MM/DD/YYYY') : null,
        expirationEndDate: this.filters && this.filters.expirationEndDate ? format(this.filters.expirationEndDate, 'MM/DD/YYYY') : null,
        assignedStartDate: this.filters && this.filters.assignedStartDate ? format(this.filters.assignedStartDate, 'MM/DD/YYYY') : null,
        assignedEndDate: this.filters && this.filters.assignedEndDate ? format(this.filters.assignedEndDate, 'MM/DD/YYYY') : null,
        eligibilityStartDate: this.filters && this.filters.eligibilityStartDate ? format(this.filters.eligibilityStartDate, 'MM/DD/YYYY') : null,
        eligibilityEndDate: this.filters && this.filters.eligibilityEndDate ? format(this.filters.eligibilityEndDate, 'MM/DD/YYYY') : null,
        isEligible: this.filters && this.filters.isEligible ? this.filters.isEligible : '',
        enrollmentId: this.filters && this.filters.enrollmentId ? this.filters.enrollmentId : null,
        nextAppointmentPresent: this.filters.nextAppointmentPresent,
      }
      this.isDialogLoading = true;
      this.memberHRAService.exportMemberHRAReportToExcel(this.filterParams, pageSize).subscribe((response: any) => {

        if (response) {
          this.isDialogLoading = false;
          this.notifierService.notify('success', "Please check the downloaded report for exported results")
          this.downLoadFile(response, response.type, "Report.xls");

        } else {
          this.notifierService.notify('error', "Error")
        }
      });
    } else {
      this.notifierService.notify('warning', "There are no records to export.")
    }
  }

  downLoadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob, filename);
      return;
    }
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    document.body.appendChild(link);
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(data);
    }, 100);
  }

  onSelectOrDeselectChange(key: string) {
    if (key.toUpperCase() == 'SELECTALL') {
      if (this.filters.careManagerIds.length == this.masterStaffs.length) {
        return;
      }
      this.filters.careManagerIds = this.masterStaffs.map(x => x.id);
    } else {
      if (this.filters && (this.filters.careManagerIds || []).length == 0) {
        return;
      }
      this.filters.careManagerIds = [];
    }
    this.getMemberHRAList()

  }
  printMemberAssessmentList(event: any) {
    if (this.memberListData && this.memberListData.length > 0) {
      let pageSize = this.memberListData.find(x => x.totalRecords > 0).totalRecords
      // this.filterModel.pageSize = pageSize
      this.filterParams = {
        ...this.filterModel,
        pageSize: pageSize,
        searchText: this.filters && this.filters.searchText ? this.filters.searchText : '',
        documentId: this.filters && this.filters.documentId ? this.filters.documentId : null,
        relationship: this.filters && this.filters.relationship ? this.filters.relationship : '',
        careManagerIds: this.filters && this.filters.careManagerIds ? this.filters.careManagerIds.join(',') : "",
        conditionId: this.filters && this.filters.conditionId ? this.filters.conditionId : '',
        statusId: this.filters && this.filters.statusId ? this.filters.statusId : null,
        healthPlanId: this.filters && this.filters.healthPlanId ? this.filters.healthPlanId : null,
        programTypeId: this.filters && this.filters.programTypeId ? this.filters.programTypeId : '',
        completionStartDate: this.filters && this.filters.completionStartDate ? format(this.filters.completionStartDate, 'MM/DD/YYYY') : null,
        completionEndDate: this.filters && this.filters.completionEndDate ? format(this.filters.completionEndDate, 'MM/DD/YYYY') : null,
        expirationStartDate: this.filters && this.filters.expirationStartDate ? format(this.filters.expirationStartDate, 'MM/DD/YYYY') : null,
        expirationEndDate: this.filters && this.filters.expirationEndDate ? format(this.filters.expirationEndDate, 'MM/DD/YYYY') : null,
        assignedStartDate: this.filters && this.filters.assignedStartDate ? format(this.filters.assignedStartDate, 'MM/DD/YYYY') : null,
        assignedEndDate: this.filters && this.filters.assignedEndDate ? format(this.filters.assignedEndDate, 'MM/DD/YYYY') : null,
        eligibilityStartDate: this.filters && this.filters.eligibilityStartDate ? format(this.filters.eligibilityStartDate, 'MM/DD/YYYY') : null,
        eligibilityEndDate: this.filters && this.filters.eligibilityEndDate ? format(this.filters.eligibilityEndDate, 'MM/DD/YYYY') : null,
        isEligible: this.filters && this.filters.isEligible ? this.filters.isEligible : '',
        enrollmentId: this.filters && this.filters.enrollmentId ? this.filters.enrollmentId : null,
        nextAppointmentPresent: this.filters.nextAppointmentPresent,
      }
      this.isDialogLoading = true;
      this.memberHRAService.printMemberHRAReportPDF(this.filterParams, pageSize).subscribe((response: any) => {

        this.isDialogLoading = false;
        this.memberHRAService.downLoadFile(response, 'application/pdf', `Assessment List.pdf`)
      });
    }
  }
}
