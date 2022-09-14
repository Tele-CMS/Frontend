import { Component, OnInit } from '@angular/core';
import { FilterModel, ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { format, addYears, addDays, isValid } from 'date-fns';
import { ClientEncounterService } from '../client-encounter.service';
import { ClientEncounter, ClientEncounterFilterModel } from './client-encounter.model';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../core/services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { filter } from 'rxjs/operators';

// import { CareGapFilterModel } from '../../clients-caregap/care-gap-listing/care-gaps.model';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-client-encounter-listing',
  templateUrl: './client-encounter-listing.component.html',
  styleUrls: ['./client-encounter-listing.component.scss']
})
export class ClientEncounterListingComponent implements OnInit {
  //clientEncounterFilterModel: FilterModel;
  encounterListModel: ClientEncounter[];
  masterStaffs: Array<any>;
  metaData: any;
  currentLocationId: number;
  subscription: Subscription;
  careManagerId: number;
  masterEncounterTypes: Array<any>;
  encounterFormGroup: FormGroup;
  filterParams: ClientEncounterFilterModel;
  masterEncounterStatus: Array<any>;
  isExportButtonDisabled: boolean = true;
  isLoadingExportPrint: boolean = false;
  nextAppointmentList: Array<any> = [
    { id: true, value: 'Upcoming Appointment' },
    { id: false, value: 'No Upcoming Appointment' }
  ];

  displayedColumns: Array<any> = [
    { displayName: 'Patient Name', key: 'patientName', isSort: true, class: '', width: '28%', type: 'link', url: '/web/client/encounter', queryParamsColumn: 'queryParamsPatientObj'  },
    // { displayName: 'DOB', key: 'dob', isSort: true, class: '', width: '28%' },
    { displayName: 'DATE OF SERVICE', key: 'dateOfService', isSort: true, class: '', width: '28%' },
    { displayName: 'DURATION', key: 'duration', class: '', width: '7%' },
    { displayName: 'Provider', key: 'staffName', class: '', width: '15%' },
    // { displayName: 'ENCOUNTER TYPE', key: 'encounterType', class: '', width: '15%' },
    { displayName: 'COMPLAINT', key: 'manualChiefComplaint', class: '', width: '20%', type: "25", isInfo: true },
    { displayName: 'STATUS', key: 'status', isSort: true, width: '10%', type: ['RENDERED', 'PENDING'] },
    // { displayName: 'Upcoming Appointment', key: 'nextAppointmentDate', isSort: true, class: '', width: '10%', type: 'datetime' },
    { displayName: 'Actions', key: 'Actions', class: '', width: '5%' }

  ];
  actionButtons: Array<any> = [];
  masterEnrollmentTypeFilter: Array<any>;
  defaultEnrollmentId: number;
  constructor(
    private clientEncounterService: ClientEncounterService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private activatedRoute: ActivatedRoute,
    private dialogModal: MatDialog,
  ) {
    this.filterParams = new ClientEncounterFilterModel();
    this.filterParams = {
      ...this.filterParams,
      fromDate: null,
      toDate: null,
      CareManagerIds: [],
      encounterTypeIds: [],
      EnrollmentId: null,
      status: null,
      nextAppointmentPresent: null,
    }
    this.masterStaffs = [];
    this.masterEncounterTypes = [];
    this.masterEnrollmentTypeFilter = [];
  }

  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLocationId = user.currentLocationId;
        this.filterParams.CareManagerIds = [user.id];
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      let encId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false),
        stDate = params.startDate == undefined ? null : params.startDate,
        enDate = params.endDate == undefined ? null : params.endDate;
      let caremanagerIds = params.cmId ? this.commonService.encryptValue(params.cmId, false) : null,
        cmId = caremanagerIds ? (caremanagerIds || '').split(',').map(x => parseInt(x, 10)) : null,
        enrollId = params.enrollId == undefined ? null : this.commonService.encryptValue(params.enrollId, false);
      this.filterParams.nextAppointmentPresent = params.nextApp == undefined ? null : Boolean(JSON.parse(params.nextApp));

      if (encId > 0) {
        this.filterParams.encounterTypeIds = [parseInt(encId, 10)];
      }
      if (stDate || enDate) {
        this.filterParams.fromDate = isValid(new Date(stDate)) ? format(stDate, 'YYYY-MM-DD') : this.filterParams.fromDate;
        this.filterParams.toDate = isValid(new Date(enDate)) ? format(enDate, 'YYYY-MM-DD') : this.filterParams.toDate;
      }
      if (cmId && cmId.length > 0)
        this.filterParams.CareManagerIds = cmId;
      else if (encId > 0) {
        this.filterParams.CareManagerIds = [];
      }
      if (enrollId > 0)
        this.filterParams.EnrollmentId = parseInt(enrollId, 10);
    });
    this.getMasterData();
    this.getStaffsByLocation();
  }
  // getEncounterList(filterModel: FilterModel,  fromDate: string, toDate: string) {

    onCMSelectOrDeselect(key: string = '') {
      if(key.toLowerCase() == 'selectall') {
        if((this.filterParams.CareManagerIds || []).length != (this.masterStaffs || []).length) {
          this.filterParams.CareManagerIds = this.masterStaffs.map(x => x.id);
        }
      } else {
        if((this.filterParams.CareManagerIds || []).length != 0 ) {
          this.filterParams.CareManagerIds = [];
        }
      }
    }
  // }
  onEncTypeSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if ((this.filterParams.encounterTypeIds || []).length != (this.masterEncounterTypes || []).length) {
        this.filterParams.encounterTypeIds = this.masterEncounterTypes.map(x => x.id);
      }
    } else {
      if (this.filterParams && (this.filterParams.encounterTypeIds || []).length == 0) {
        return;
      }
      this.filterParams.encounterTypeIds = [];
    }
  }

  getEncounterList() {
    const filters: ClientEncounterFilterModel = {
      ...this.filterParams,
      fromDate: this.filterParams.fromDate && format(this.filterParams.fromDate, 'YYYY-MM-DD'),
      toDate: this.filterParams.toDate && format(this.filterParams.toDate, 'YYYY-MM-DD'),
      //CurrentDateTime: format(new Date(), 'YYYY-MM-DDTHH:mm:ss')
    }
    this.clientEncounterService.getClientEncounters(filters).subscribe((response: ResponseModel) => {
      if (response && response.statusCode == 200) {
        this.encounterListModel = response.data
        this.encounterListModel = (response.data || []).map((obj: any) => {
          obj.dateOfService = format(obj.dateOfService, 'MM/DD/YYYY') + " (" + format(obj.startDateTime, 'h:mm A') + " - " + format(obj.endDateTime, 'h:mm A') + ")";
          obj['queryParamsPatientObj'] = { id: obj.patientID > 0 ? this.commonService.encryptValue(obj.patientID, true) : null };
          return obj;
        });
        this.isExportButtonDisabled = this.encounterListModel.length > 0 ? false : true;
        this.metaData = response.meta;
      } else {
        this.encounterListModel = [];
        this.isExportButtonDisabled = true;
        this.metaData = null;
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    });
  }
  getMasterData() {
    const masterData = { masterdata: "ENCOUNTERTYPES,ENCOUNTERSTATUS,MASTERENROLLMENTTYPEFILTER" };
    this.clientEncounterService.getMasterData(masterData)
      .subscribe((response: any) => {
        this.masterEncounterTypes = response.encounterTypes || [];
        this.masterEncounterStatus = response.encounterStatus || [];
        this.masterEnrollmentTypeFilter = response.masterEnrollmentTypeFilter || [];
        // this.masterEncounterMethods = response.encounterMethods || [];
        let defaultEnrollTypeObj = this.masterEnrollmentTypeFilter.find(x => x.value == 'All');
        this.defaultEnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
        if (!this.filterParams.EnrollmentId) {
          this.filterParams.EnrollmentId = this.defaultEnrollmentId;
        }
        this.getEncounterList();
      });
  }


  getStaffsByLocation(): void {
    const locId = this.currentLocationId.toString();
    this.clientEncounterService.getStaffAndPatientByLocation(locId)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.masterStaffs = [];
        } else {
          this.masterStaffs = response.data.staff || [];
          this.masterStaffs = [
            { 'id': -1, 'value': 'Provider Not Assigned' },
            ...this.masterStaffs
          ]
        }
      })
  }

  applyFilter() {
    //.setPaginatorModel(1, this.clientEncounterFilterModel.pageSize, this.clientEncounterFilterModel.sortColumn, this.clientEncounterFilterModel.sortOrder);
    this.getEncounterList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getEncounterList();
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterParams.pageNumber = pageNumber;
    this.filterParams.pageSize = pageSize;
    this.filterParams.sortOrder = sortOrder;
    this.filterParams.sortColumn = sortColumn;
  }

  get getEncountersLength() {
    return (this.encounterListModel || []).length;
  }

  openEmailPopup() {
    let customEmailModal;
    const filters =  {
      ...this.filterParams,
      pageSize: this.encounterListModel[0] ? this.encounterListModel[0].totalRecords : 0,
      encounterTypeIds: (this.filterParams.encounterTypeIds || []).join(','),
      CareManagerIds: (this.filterParams.CareManagerIds || []).join(','),
      fromDate: this.filterParams.fromDate && format(this.filterParams.fromDate, 'YYYY-MM-DD'),
      toDate: this.filterParams.toDate && format(this.filterParams.toDate, 'YYYY-MM-DD'),
      nextAppointmentPresent: this.filterParams.nextAppointmentPresent,
    }

    customEmailModal = this.dialogModal.open(EmailModalComponent, {
      data: filters
    });
    customEmailModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }
    });
  }

  openMessagePopup() {
    let customEmailModal;
    const filters =  {
      ...this.filterParams,
      pageSize: this.encounterListModel[0] ? this.encounterListModel[0].totalRecords : 0,
      encounterTypeIds: (this.filterParams.encounterTypeIds || []).join(','),
      CareManagerIds: (this.filterParams.CareManagerIds || []).join(','),
      fromDate: this.filterParams.fromDate && format(this.filterParams.fromDate, 'YYYY-MM-DD'),
      toDate: this.filterParams.toDate && format(this.filterParams.toDate, 'YYYY-MM-DD'),
      nextAppointmentPresent: this.filterParams.nextAppointmentPresent,
    }

    customEmailModal = this.dialogModal.open(MessageModalComponent, {
      data: filters
    });
    customEmailModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }
    });
  }

  exportToExcel() {
    this.isLoadingExportPrint = true
    const filters: ClientEncounterFilterModel = {
      ...this.filterParams,
      fromDate: this.filterParams.fromDate && format(this.filterParams.fromDate, 'YYYY-MM-DD'),
      toDate: this.filterParams.toDate && format(this.filterParams.toDate, 'YYYY-MM-DD'),
    }
    let pageSize = this.encounterListModel.find(x => x.totalRecords > 0).totalRecords
    this.clientEncounterService.exportEncounters(filters, pageSize).subscribe((response: any) => {

      if (response) {
        this.isLoadingExportPrint = false
        this.notifier.notify('success', "Please check the downloaded report for exported results")
        this.downLoadFile(response, response.type, "Report.xls");

      } else {
        this.notifier.notify('error', "Error")
      }
    });
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

  clearFilters() {
    this.filterParams = {
      ...this.filterParams,
      fromDate: null,
      toDate: null,
      CareManagerIds: [],
      encounterTypeIds: [],
      // EnrollmentId: this.defaultEnrollmentId,
      EnrollmentId: null,
      status: null,
      nextAppointmentPresent: null
    };
    this.getEncounterList();
  }
  printEncounterListData(event: any) {
    this.isLoadingExportPrint = true
    const filters: ClientEncounterFilterModel = {
      ...this.filterParams,
      fromDate: this.filterParams.fromDate && format(this.filterParams.fromDate, 'YYYY-MM-DD'),
      toDate: this.filterParams.toDate && format(this.filterParams.toDate, 'YYYY-MM-DD'),
    }
    let pageSize = this.encounterListModel.find(x => x.totalRecords > 0).totalRecords
    this.clientEncounterService.printEncounterListData(filters, pageSize).subscribe((response: any) => {
      this.isLoadingExportPrint = false
      this.clientEncounterService.downLoadFile(response, 'application/pdf', `Encounter List.pdf`)
    });
  }
}

