import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncounterModel } from './encounter.model';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { format, addYears, addDays } from 'date-fns';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService, LayoutService } from '../../../core/services';
import { EncounterService } from '../encounter.service';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { EncounterNotesModel } from '../encounter-notes-model/encounter-notes.model';
import { EncounterNotesModelComponent } from '../encounter-notes-model/encounter-notes-model.component';
import { ReviewOfSystemsModelComponent } from '../review-of-systems-model/review-of-systems-model.component';
import { GetReviewSystemModel } from '../review-of-systems-model/get-review-system.model';
@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit, OnDestroy {
  clientId: number;
  encryptedClientId: string;
  encryptedloginClientId: string;
  maxDate = new Date();
  encounterFormGroup: FormGroup;
  statusList: any[];
  appointmentType: any[];
  encounterListModel: EncounterModel[];
  header: string = "Patient Encounter";
  metaData: any;
  clientEncounterFilterModel: FilterModel;
  isEncounterDrawerOpened: Boolean;
  addPermission: boolean
  isRoleClient: boolean;
  loginClientId: number;
  encounterId: number;
  checkListIds: string[];
  encounterData = [];
  loginStaffId: number;
  displayedColumns: Array<any> = [
    { displayName: 'Date', key: 'dateOfService', isSort: true, class: '', width: '100px' },
    { displayName: 'Duration', key: 'duration', class: '', width: '80px' },
    { displayName: 'Provider', key: 'staffName', class: '', width: '100px' },
    // { displayName: 'Encounter Type', key: 'encounterType', class: '', width: '100px' },
    { displayName: 'Complaint', key: 'manualChiefComplaint', class: '', width: '150px', type: "25", isInfo: true },
    // { displayName: 'Follow Up Notes', key: 'followUpNotes', key2: 'status', checkType: 'Rendered', isSort: true, class: '', width: '150px', type: "isInfo", isAddAction: true, hovertitle: "Add follow up note" },
    // { displayName: 'Referal Provider', key: 'referringProviderName', width: '150px', type: 'isHTML' },
    // { displayName: 'REFERRAL NPI', key: 'referringProviderNPI', width: '100px' },
    { displayName: 'Status', key: 'status', isSort: true, width: '100px', type: ['RENDERED', 'PENDING'] },
    { displayName: 'Actions', key: 'Actions', class: '', width: '70px' }

  ];
  actionButtons: Array<any> = [
    { displayName: 'View', key: 'View', class: 'fa fa-eye' },
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'ROS', key: 'ros', class: 'la la-tasks' },
  ];
  isAdminLogin: boolean;
  getReviewSystemModel:GetReviewSystemModel;
  constructor(
    private activatedRoute: ActivatedRoute,
    private encounterSummaryPDFDialog: MatDialog,
    private encounterService: EncounterService,
    private formBuilder: FormBuilder,
    private route: Router,
    private commonService: CommonService,
    private layoutSerivce: LayoutService,
    private ReviewOfSyatemsDialogModal: MatDialog,
  ) {
    this.encounterListModel = new Array<EncounterModel>();
    this.clientEncounterFilterModel = new FilterModel();
    this.getReviewSystemModel = new GetReviewSystemModel();
    this.statusList = [{ id: true, value: 'Pending' }, { id: false, value: 'Rendered' }];
    this.isEncounterDrawerOpened = false;

  }
  ngOnDestroy(): void {
    const encFilters = { EncounterFilters: this.clientEncounterFilterModel };
      this.layoutSerivce.updateAppFiltersData(encFilters);
  }
  ngOnInit() {
    const sessionFromDate = sessionStorage.getItem("EncFromDate"),
      sessionToDate = sessionStorage.getItem("EncToDate");
    const fromDate = sessionFromDate ? format(sessionFromDate, 'YYYY-MM-DD') : format(addYears(new Date(), -3), 'YYYY-MM-DD'),
      toDate = sessionToDate ? format(sessionToDate, 'YYYY-MM-DD') : format(addDays(new Date(), 1), 'YYYY-MM-DD');
    this.encounterFormGroup = this.formBuilder.group({
      fromDate: fromDate,
      toDate: toDate
    });

    this.layoutSerivce.clientDrawerData.subscribe(({ changedState, encounterId, isSaved }) => {
      this.isEncounterDrawerOpened = changedState;
      if (isSaved) {
        let formValues = this.encounterFormGroup.value;
        this.getEncounterList(this.clientEncounterFilterModel, this.clientId, formValues.appointmentTypeId, formValues.staffName, formValues.status, formValues.fromDate ? format(formValues.fromDate, 'MM/DD/YYYY') : "", formValues.toDate ? format(formValues.toDate, 'MM/DD/YYYY') : "");
        this.layoutSerivce.changeClientDrawerData(false, {});
      }
    });

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.isRoleClient = user.users3 && user.users3.userRoles && (user.users3.userRoles.userType || '').toUpperCase() == 'CLIENT';
        if (this.isRoleClient)
          this.loginClientId = user.id;
        else
          this.loginStaffId = user.userID
      }

    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.isRoleClient) {
        this.clientId = this.loginClientId;
      } else {
        this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      }
      this.encryptedClientId = params.id;
      const redirectApptId = sessionStorage.getItem("redirectApptId");
      if (+redirectApptId > 0) {
        this.openEncounterDialog(+redirectApptId);
        sessionStorage.removeItem("redirectApptId");
      }
    });

    this.layoutSerivce.AppFiltersDrawerData.subscribe(
      data => {
        if (data && data.EncounterFilters) {
          this.clientEncounterFilterModel = data.EncounterFilters;
        }
      }
    )
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, 0, "", "", fromDate, toDate);
    this.getUserPermissions();
  }

  get formControls() { return this.encounterFormGroup.controls; }

  openEncounterDialog(appointmentId?: number) {
    let postData = {
      patientId: this.clientId,
      addEditAction: 'Add',
      clickDateTime: moment.utc(new Date()).local().format('MM/DD/YYYY h:mm a'),
      patientEncounterId: null
    }

    this.encounterService.saveEncounterLogsOnAddClick(postData).subscribe((response: any) => {
      // this.notifier.notify('success', response.message)
       this.layoutSerivce.changeClientDrawerData(true, { encounterId: null, appointmentId: appointmentId });

    });
  }

  editEncounterDialog(encounterId: number) {
    console.log("enc ",encounterId)
      this.layoutSerivce.changeClientDrawerData(true, { encounterId: encounterId })
  }

  createEncounterNotesModel(encounterId: number) {
    const encounterNotesModel = new EncounterNotesModel();
    encounterNotesModel.patientEncounterId = encounterId;

    const dialog = this.encounterSummaryPDFDialog.open(EncounterNotesModelComponent, {
      hasBackdrop: true,
      data: { ...encounterNotesModel }
    });
    dialog.afterClosed().subscribe(result => {
      if (result == 'save') {
        let formValues = this.encounterFormGroup.value;
        this.getEncounterList(this.clientEncounterFilterModel, this.clientId, formValues.appointmentTypeId, formValues.staffName, formValues.status, formValues.fromDate ? format(formValues.fromDate, 'MM/DD/YYYY') : "", formValues.toDate ? format(formValues.toDate, 'MM/DD/YYYY') : "");
      }
    })
  }

  getMasterData() {
    let data = { masterdata: "appointmentType" };
    this.encounterService.getMasterData(data).subscribe((response: any) => {
      this.appointmentType = response.appointmentType;
    });
  }

  getEncounterList(filterModel: FilterModel, clientId: number, appointmentTypeId: number, staffName: string, status: string, fromDate: string, toDate: string) {

    fromDate = format(fromDate, 'YYYY-MM-DD'),
      toDate = format(toDate, 'YYYY-MM-DD');

    this.encounterService.getClientEncounters(this.clientEncounterFilterModel, clientId, appointmentTypeId, staffName, status, fromDate, toDate).subscribe((response: ResponseModel) => {
    if (response && response.statusCode == 200) {
        this.encounterListModel = (response.data || []).map((obj: any) => {
          obj.dateOfService = format(obj.dateOfService, 'MM/DD/YYYY') + " (" + format(obj.startDateTime, 'h:mm A') + " - " + format(obj.endDateTime, 'h:mm A') + ")";
          obj['disableActionButtons'] = (obj.status || '').toUpperCase() == 'RENDERED' && !this.isAdminLogin ? ['edit'] : [];
          if (obj.createdBy != this.loginStaffId && !this.isAdminLogin)
            obj['disableActionButtons'] = ['edit'];
          return obj;
        });
        this.metaData = response.meta;
      } else {
        this.encounterListModel = [];
        this.metaData = [];
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    });
  }
  clearFilters() {
    this.encounterFormGroup.reset();
    const fromDate = format(addYears(new Date(), -3), 'YYYY-MM-DD'),
      toDate = format(new Date(), 'YYYY-MM-DD');
    this.encounterFormGroup.patchValue({
      fromDate,
      toDate
    })
    this.setPaginatorModel(1, this.clientEncounterFilterModel.pageSize, this.clientEncounterFilterModel.sortColumn, this.clientEncounterFilterModel.sortOrder);
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, 0, "", "", fromDate, toDate);
    sessionStorage.removeItem("EncFromDate");
    sessionStorage.removeItem("EncToDate");
  }

  applyFilter() {
    let formValues = this.encounterFormGroup.value;
    this.setPaginatorModel(1, this.clientEncounterFilterModel.pageSize, this.clientEncounterFilterModel.sortColumn, this.clientEncounterFilterModel.sortOrder);
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, formValues.appointmentTypeId, formValues.staffName, formValues.status, formValues.fromDate ? format(formValues.fromDate, 'MM/DD/YYYY') : "", formValues.toDate ? format(formValues.toDate, 'MM/DD/YYYY') : "");
    sessionStorage.setItem("EncFromDate", format(formValues.fromDate, 'MM/DD/YYYY'));
    sessionStorage.setItem("EncToDate", format(formValues.toDate, 'MM/DD/YYYY'));
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.clientEncounterFilterModel.pageNumber = pageNumber;
    this.clientEncounterFilterModel.pageSize = pageSize;
    this.clientEncounterFilterModel.sortOrder = sortOrder;
    this.clientEncounterFilterModel.sortColumn = sortColumn;
  }

  onPageOrSortChange(changeState?: any) {
    let formValues = this.encounterFormGroup.value;
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, formValues.appointmentTypeId, formValues.staffName, formValues.status, formValues.fromDate ? format(formValues.fromDate, 'MM/DD/YYYY') : "", formValues.toDate ? format(formValues.toDate, 'MM/DD/YYYY') : "");
  }
  onTableActionClick(actionObj?: any) {
    const apptId = actionObj.data && actionObj.data.patientAppointmentId,
      encId = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'VIEW':
        if (this.isRoleClient) {

          this.encounterService.getEncounterSummaryPDF(encId).subscribe((response: any) => {
            if (response.statusCode == 200) {
              let encounterData = response.data.patientEncounterChecklistModel;

              let checkListIds = encounterData.filter(x => x.patientEncounterId > 0).map(z => { return z.id })
              this.encounterService.generateEncounterSummaryPDF(encId, checkListIds, 'memberportal').subscribe((response: any) => {
                this.encounterService.downLoadFile(response, 'application/pdf', `Encounter_Summary.pdf`)
              });
            }

          });

        }
        else {
          const redirectUrl = "/web/client/encounter/soap";
          this.route.navigate([redirectUrl], {
            queryParams: {
              id: this.encryptedClientId,
              apptId: apptId > 0 ? this.commonService.encryptValue(apptId, true) : apptId,
              encId: encId > 0 ? this.commonService.encryptValue(encId, true) : encId
            }
          });
        }

        break;
      case 'EDIT':

        this.editEncounterDialog(encId);
        break;
      case 'ADD':

        this.createEncounterNotesModel(encId);
        break;
      case 'ROS':

      this.openROSDialog(encId,this.clientId);
        break;
      default:
        break;
    }
  }
  getUserPermissions() {

    if (this.isRoleClient) {
      this.actionButtons = [
        { displayName: 'Print Encounter', key: 'View', class: 'fa fa-print' },

      ];

      let spliceIndex = this.displayedColumns.findIndex(obj => obj.key == 'followUpNotes');
      // this.displayedColumns.splice(spliceIndex, 1)
      return;
    }
    const actionPermissions = this.encounterService.getUserScreenActionPermissions('CLIENT', 'CLIENT_ENCOUNTER_LIST');
    const { isAdminLogin, CLIENT_ENCOUNTER_ADD, CLIENT_ENCOUNTER_LIST_VIEW } = actionPermissions;
    this.isAdminLogin = isAdminLogin;
    if (!CLIENT_ENCOUNTER_LIST_VIEW) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'View');
      this.actionButtons.splice(spliceIndex, 1)
    }
    this.addPermission = CLIENT_ENCOUNTER_ADD || false;
  }

  openROSDialog(encounterId:number,clientId:number) {
    // if (id != null && id > 0) {
    //   this.clientsService.getPatientMedicalFamilyHistoryById(id).subscribe((response: any) => {
    //     if (response != null && response.data != null) {

    //       this.patientMedicalFamilyHistoryModel = response.data;
    //       this.createModal(this.patientMedicalFamilyHistoryModel);
    //     }
    //   });
    // }
    // else {
    //   this.patientMedicalFamilyHistoryModel = new PatientMedicalFamilyHistoryModel();
    //   this.createModal(this.patientMedicalFamilyHistoryModel);
    // }
    this.getReviewSystemModel.emp_id = clientId;
    this.getReviewSystemModel.encounter_id = encounterId;
    this.createROSModal(this.getReviewSystemModel);
  }

  createROSModal(getReviewSystemModel:GetReviewSystemModel) {

    let rosModal;
    rosModal = this.ReviewOfSyatemsDialogModal.open(ReviewOfSystemsModelComponent, {
       data: getReviewSystemModel })
    rosModal.afterClosed().subscribe((result: string) => {
      if (result == 'SAVE')
      this.getEncounterList(this.clientEncounterFilterModel, this.clientId, 0, "", "", "fromDate", "toDate");
    });
  }
}
