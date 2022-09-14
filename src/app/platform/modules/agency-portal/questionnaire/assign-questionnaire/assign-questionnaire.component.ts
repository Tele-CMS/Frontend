import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponseModel, FilterModel, Metadata } from '../../../core/modals/common-model';
import { PatientDocumentModel, SectionItemModel } from '../documents/document.model';
import { DocumentService } from '../documents/document.service';
import { MatDialog } from '@angular/material';
import { AssignQuestionnaireModalComponent } from './assign-questionnaire-modal/assign-questionnaire-modal.component';
import { CommonService } from '../../../core/services';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { Subscription, ReplaySubject, Subject, of, Observable } from 'rxjs';
import { SignDailogComponent } from './sign-dailog/sign-dailog.component';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { DocumentPreviewComponent } from '../../questionaire-preview/document-preview/document-preview.component';
import { FormControl } from '@angular/forms';
import { filter, tap, takeUntil, debounceTime, map, finalize, delay, catchError } from 'rxjs/operators';


interface ClientModal {
  id: number;
  value: string;
  dob: Date;
  mrn: string;
}

@Component({
  selector: 'app-assign-questionnaire',
  templateUrl: './assign-questionnaire.component.html',
  styleUrls: ['./assign-questionnaire.component.css']
})
export class AssignQuestionnaireComponent implements OnInit, OnDestroy {
  metaData: Metadata;
  filterModel: FilterModel;
  searchText: string = "";
  documentId: number;
  patientId: number;
  addPermission: boolean;
  patientDocumentId: number;
  masterDocuments: any = [];
  subscription: Subscription;
  loginUserId: number;
  selectedLocationId: number;
  patientDocumentData: PatientDocumentModel[];
  filters: {
    patientId: number;
    documentId: number;
  }
  displayedColumns: Array<any> = [
    { displayName: 'Assessment', key: 'documentName', class: '', width: '15%' },
    { displayName: 'STATUS', key: 'status', class: '', width: '10%' },
    { displayName: 'Patient NAME', key: 'patientName', class: '', width: '15%', },
    { displayName: 'Q SCORE', key: 'qScore', class: '', width: '10%', },
    { displayName: 'RISK', key: 'risk', class: '', width: '10%', },
    { displayName: 'Assigned Date', key: 'assignedDate', class: '', width: '10%', type: "date" },
    { displayName: 'COMPLETION DATE', key: 'completionDate', class: '', width: '10%', type: "date" },
    { displayName: 'Due Date', key: 'expirationDate', class: '', width: '10%', type: "date" },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];
  actionButtons: Array<any> = [
    { displayName: 'Sign', key: 'sign', class: 'fa fa-pencil-square-o' },
    { displayName: 'Assessment', key: 'questionnaire', class: 'fa fa-file-text-o' },
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
  ];

  // autocomplete
  memberFilterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideMembers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideMembers: Array<any>;
  selectFilteredServerSideMembers: Array<any>;
  protected _onDestroy = new Subject<void>();
  constructor(
    private assignDocumentDialogModal: MatDialog,
    private patientDocumentAnswerDialogModal: MatDialog,
    private assignDocumentService: DocumentService,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private dialogService: DialogService
  ) {
    this.filters = {
      patientId: 0,
      documentId: 0
    }
    this.selectFilteredServerSideMembers = [];
    this.fetchedFilteredServerSideMembers = [];
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getMasterData();
    this.getPatientDocumentList();
    this.getUserPermissions();
    this.subscription = this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.loginUserId = user.id;
        this.selectedLocationId = user.currentLocationId;
      }
    });

    this.memberFilterCtrl.valueChanges
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
          // return this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredMembers => {
        this.searching = false;
        filteredMembers.subscribe(res => { this.fetchedFilteredServerSideMembers = res; this.filteredServerSideMembers.next(res) });
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });

  }

  _filter(value: string): Observable<any> {
    const filterValue = value.toLowerCase();
    return this.assignDocumentService
      .getPatientsByLocation(filterValue, this.selectedLocationId)
      .pipe(
        map(
          (response: any) => {
            if (response.statusCode !== 201)
              return [];
            else
              return (response.data || []).map((clientObj: any) => {
                const Obj: ClientModal = {
                  id: clientObj.patientId,
                  value: clientObj.firstName + ' ' + clientObj.lastName,
                  dob: new Date(clientObj.dob),
                  mrn: clientObj.mrn
                }
                return Obj;
              });
          }),
        catchError(_ => {
          return [];
        })
      );
  }

  get getSlectFilteredServerSideMembers() {
    return (this.selectFilteredServerSideMembers || []).filter(x => {
      if ((this.fetchedFilteredServerSideMembers || []).findIndex(y => y.id == x.id) > -1)
        return false;
      else
        return true;
    })
  }

  getMasterData() {
    let data = { 'masterdata': 'DOCUMENTS' }
    this.assignDocumentService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterDocuments = response.documents != null ? response.documents : [];
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
  openQuestionnaireDialog(documentId: number, patientId: number, patientDocumentId: number, docName:string) {
    this.assignDocumentService.getPatientDocumentAnswer(documentId, patientId, patientDocumentId).subscribe((response: any) => {
      if (response != null && response.data != null) {
        this.createQuestionnaireModal(response.data,docName,patientDocumentId);
      }
    });
  }
  createQuestionnaireModal(questionnaireModel: SectionItemModel,docName:string,patientDocumentId:number) {
    let questionnaireModal;
    questionnaireModal = this.patientDocumentAnswerDialogModal.open(DocumentPreviewComponent,
      {
        hasBackdrop: true,
        data: {
          answer: questionnaireModel.answer,
          sectionItemData: questionnaireModel.sectionItems,
          sectionItemCodes: questionnaireModel.codes,
          documentId: this.documentId,
          patientId: this.patientId,
          docName:docName,
          patientDocumentId:patientDocumentId
        }
      })
    questionnaireModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getPatientDocumentList();
    });
  }
  createModal(patientDocumentModel: PatientDocumentModel) {
    let patientDocumentModal;
    const filterPatients = patientDocumentModel.id > 0 && patientDocumentModel.patientName ?
      [{
        id: patientDocumentModel.patientId,
        value: patientDocumentModel.patientName,
        dob: null,
        mrn: ""
      }] :
      this.selectFilteredServerSideMembers;
    patientDocumentModal = this.assignDocumentDialogModal.open(AssignQuestionnaireModalComponent,
      {
        hasBackdrop: true,
        data: {
          patientDocumentModel: patientDocumentModel,
          masterDocuments: this.masterDocuments,
          patientDocumentId: patientDocumentModel.id,
          documentId: this.documentId,
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
  clearFilters() {
    this.searchText = '';
    this.filters.documentId = null;
    this.filters.patientId = null;
    this.patientDocumentData = [];
    this.metaData = new Metadata();
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '', '');
    this.getPatientDocumentList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
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
          this.openQuestionnaireDialog(this.documentId, this.patientId, this.patientDocumentId, actionObj.data.documentName);
        }
        break;
      case 'SIGN':
        this.openSignDailog();
        break;
      case 'DELETE':
        {
          this.dialogService.confirm(`Are you sure you want to delete this questionaire?`).subscribe((result: any) => {
            if (result == true) {
              this.assignDocumentService.deletePatientDocument(this.patientDocumentId).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify('success', response.message)
                  this.getPatientDocumentList();
                } else if (response.statusCode === 401) {
                  this.notifierService.notify('warning', response.message)
                } else {
                  this.notifierService.notify('error', response.message)
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
  openSignDailog() {
    const staffsList = [{
      id: 0,
      value: 'Test',
    }]

    let questionnaireModal;
    questionnaireModal = this.patientDocumentAnswerDialogModal.open(SignDailogComponent,
      {
        hasBackdrop: true,
        data: {
          isShowSignatory: false,
          SignatoryLists: ['Practitioner'],
          staffsList
        }
      })
    questionnaireModal.afterClosed().subscribe((result: any) => {
      if (result && result.bytes)
        this.saveQuestionaireSign(result);
    });
  }
  saveQuestionaireSign(result: any) {
    const signObj = {
      ClinicianSign: (result.bytes || '').substring(22),
      PatientDocumentId: this.patientDocumentId,
    }
    this.assignDocumentService.saveQuestionaireSign(signObj).subscribe(
      (response) => {
        if (response.statusCode == 200) {
          this.notifierService.notify("success", response.message);
          this.getPatientDocumentList();
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }
  onDocumentSelect(id) {
    this.filters.documentId = id;
    if (this.filters.documentId)
      this.getPatientDocumentList();
  }
  onPatientSelect(id) {
    this.filters.patientId = id;
    if (this.filters.patientId)
      this.getPatientDocumentList();

    let clientsArray = this.fetchedFilteredServerSideMembers || [];
    clientsArray = [...this.selectFilteredServerSideMembers, ...clientsArray];
    clientsArray = Array.from(new Set(clientsArray.map(s => s)));
    this.selectFilteredServerSideMembers = clientsArray.filter(x => x.id == id);

  }
  getPatientDocumentList() {
    const filterParams = {
      ...this.filterModel,
      documentId: this.filters && this.filters.documentId,
      patientId: this.filters && this.filters.patientId,
    }
    this.assignDocumentService.getAllPatientDocuments(filterParams).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.patientDocumentData = (response.data || []).map(x => {
          x['disableActionButtons'] = (x.status || '').toUpperCase() == 'TO DO' ? ['sign'] : (x.status || '').toUpperCase() == 'COMPLETED' ? ['edit'] : [];
          return x;
        });
        this.metaData = response.meta;
      } else {
        this.patientDocumentData = [];
        this.metaData = new Metadata();
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
  getUserPermissions() {
    const actionPermissions = this.assignDocumentService.getUserScreenActionPermissions('ASSIGNQUESTIONNAIRE', 'ASSIGNDOCLISTING');
    const { DOC_PREVIEW, DOC_EDIT, DOC_ASSIGN } = actionPermissions;
    if (!DOC_PREVIEW) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'questionnaire');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!DOC_EDIT) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = DOC_ASSIGN || false;

  }
}
