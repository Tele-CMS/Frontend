import { Component, OnInit, ViewChild } from '@angular/core';
import { ProgramModel, ProgramsFilterModel } from './program.model';
import { FilterModel, Metadata, ResponseModel } from '../../../core/modals/common-model';
import { ClientsProgramService } from '../clients-program.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MatDialog, MatPaginator } from '@angular/material';
import { CommonService } from '../../../core/services';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { format, isValid } from 'date-fns';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-programs-listing',
  templateUrl: './programs-listing.component.html',
  styleUrls: ['./programs-listing.component.scss']
})
export class ProgramsListingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  patientProgramsList: ProgramModel[];
  programsListingData: any;
  filterModel: ProgramsFilterModel;
  metaData: Metadata;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  currentLocationId: number;
  loginStaffId: number;
  masterPrograms: Array<any>;
  masterStatus: Array<any>;
  isDialogLoading: boolean;
  isLoadingClients: boolean;
  masterStaffs: any[];
  locationId: number;
  isLoadingExportPrint: boolean = false
  masterChronicCondition: Array<any>
  masterEnrollmentFilterData: Array<any> = []
  eligibleDD: Array<any>
  masterRelationship: Array<any>;
  masterGender: Array<any>
  defaultEnrollmentId: number;
  nextAppointmentList: Array<any> = [
    { id: true, value: 'Upcoming Appointment' },
    { id: false, value: 'No Upcoming Appointment' }
  ];
  constructor(
    private clientProgramsService: ClientsProgramService,
    private router: Router,
    private notifier: NotifierService,
    private dialogModal: MatDialog,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService) {
    // this.displayedColumns = [
    //   { displayName: 'Patient Name', key: 'patientName', class: '', width: '15%' },
    //   { displayName: 'Program Name', key: 'diseaseManageProgram', class: '', width: '18%' },
    //   { displayName: 'Graduation Date', key: 'graduationDate', class: '', width: '7%', type: "date" },
    //   { displayName: 'Enrollment Date', key: 'dateOfEnrollment', class: '', width: '7%', type: "date" },
    //   { displayName: 'Termination Date', key: 'dateOfTermination', class: '', width: '7%', type: "date" },
    //   { displayName: 'Provider', key: 'careManager', class: '', width: '15%' },
    //   { displayName: 'Status', key: 'status', class: '', width: '8%' },
    //   { displayName: 'Frequency', key: 'frequency', class: '', width: '15%' },
    //   // { displayName: 'Frequency Description', key: 'frequencyDescription', class: '', width: '15%', isInfo: true },
    //   { displayName: 'Actions', key: 'Actions', class: '', width: '8%' }
    // ];
    this.actionButtons = [];
    this.masterChronicCondition = []
    this.masterStaffs = [];
    this.masterPrograms = [];
    this.masterStatus = [];
    this.programsListingData = null;
    this.patientProgramsList = []
    this.filterModel = new ProgramsFilterModel();
    this.filterModel = {
      ...this.filterModel,
      ProgramIds: [],
      Status: null,
      StartDate: null,
      EndDate: null,
      CareManagerIds: [],
      EnrollmentId: null,
      conditionId: [],
      isEligible: '',
      startAge: null,
      searchText: '',
      endAge: null,
      relationship: [],
      genderId: [],
      nextAppointmentPresent: null,
    }
    this.metaData = new Metadata();
    this.eligibleDD = [{ value: 'Yes' }, { value: 'No' }]
    this.masterRelationship = []
    this.masterGender = []
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.locationId = user.currentLocationId;
        // this.filterModel.CareManagerIds = [parseInt(user.id, 10)]
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      // let prgId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false),
      let stDate = params.startDate == undefined ? null : params.startDate,
        enDate = params.endDate == undefined ? null : params.endDate,
        enrollmentId = params.enrollmentId == undefined ? null : this.commonService.encryptValue(params.enrollmentId, false);
      let programIds = params.id ? this.commonService.encryptValue(params.id, false) : null,
        prgId = programIds ? (programIds || '').split(',').map(x => parseInt(x, 10)) : null;
      let conditionIds = params.conditionId ? this.commonService.encryptValue(params.conditionId, false) : null,
        conditionId = conditionIds ? (conditionIds || '').split(',').map(x => parseInt(x, 10)) : null;

      this.filterModel.nextAppointmentPresent = params.nextApp == undefined ? null : Boolean(JSON.parse(params.nextApp));
      // if (prgId.length > 0) {
      //   this.filterModel.ProgramIds = [parseInt(prgId, 10)];
      // }
      // if (conditionId > 0) {
      //   this.filterModel.conditionId = [parseInt(conditionId, 10)];
      // }
      if (stDate) {
        this.filterModel.StartDate = isValid(new Date(stDate)) ? format(stDate, 'YYYY-MM-DD')+'T00:00:00' : this.filterModel.StartDate;
      }
      if (enDate) {
        this.filterModel.EndDate = isValid(new Date(enDate)) ? format(enDate, 'YYYY-MM-DD')+'T00:00:00' : this.filterModel.EndDate;
      }
      if (enrollmentId > 0)
        this.filterModel.EnrollmentId = parseInt(enrollmentId, 10)

      if (prgId && prgId.length > 0)
        this.filterModel.ProgramIds = prgId;

      if (conditionId && conditionId.length > 0)
        this.filterModel.conditionId = conditionId;

      if (prgId > 0 || stDate || enDate || conditionId > 0) {
        this.filterModel.CareManagerIds = [];
      }
    });
    this.getStaffsByLocation();
    this.getMasterData();
    this.getMasterProgramsList();
     this.getPatientDiseaseManagementProgramList();
    this.onPageChanges();
  }
  onPageChanges() {
    merge(this.paginator.page)
      .subscribe(() => {

        const changeState = {
          pageNumber: (this.paginator.pageIndex + 1),
          pageSize: this.paginator.pageSize
        }
        //this.setTasksPaginatorModel(changeState.pageNumber, changeState.pageSize, '', '');
        this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, '', '');
        this.getPatientDiseaseManagementProgramList();
      })
  }
  searchFilter() {
    this.setPaginatorModel(this.filterModel.pageNumber, this.filterModel.pageSize, '', '');
    this.getPatientDiseaseManagementProgramList();
  }

  clearFilters() {
    // this.filterModel = new ProgramsFilterModel();
    // this.filterModel = {
    //  // ...this.filterModel,
    //   ProgramIds: [],
    //   Status: null,
    //   StartDate: null,
    //   EndDate: null,
    //   conditionId:null,
    //   EnrollmentId:null,
    //   isEligible: ''
    // };
    this.filterModel.ProgramIds = [],
      this.filterModel.conditionId = [],
      this.filterModel.StartDate = null,
      this.filterModel.CareManagerIds = [],
      this.filterModel.Status = null,
      this.filterModel.EndDate = null,
      // this.filterModel.EnrollmentId = this.defaultEnrollmentId,
      this.filterModel.EnrollmentId = null,
      this.filterModel.isEligible = null,
      this.filterModel.searchText = '',
    this.filterModel.relationship = [],
    this.filterModel.startAge = null,
    this.filterModel.endAge = null,
      this.filterModel.genderId = [],
      this.filterModel.nextAppointmentPresent = null,
    this.setPaginatorModel(1, this.filterModel.pageSize, '', '');
    this.getPatientDiseaseManagementProgramList();
  }

  getStaffsByLocation(): void {
    const locId = this.locationId.toString();
    this.clientProgramsService.getStaffAndPatientByLocation(locId)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.masterStaffs = [];
        } else {
          this.masterStaffs = response.data.staff || [];
        }
      })
  }

  getMasterData() {
    const masterdata = "MASTERRELATIONSHIP,PATIENTPROGRAMSTATUS,MASTERENROLLMENTTYPEFILTER,MASTERCHRONICCONDITION,MASTERGENDER";
    this.clientProgramsService.getMasterData(masterdata).subscribe((response: any) => {
      if (response != null) {
        this.masterRelationship = response.masterRelationship != null ? response.masterRelationship : [];
        this.masterGender = response.masterGender != null ? response.masterGender : [];
        this.masterStatus = response.patientProgramStatus != null ? response.patientProgramStatus : [];
        this.masterEnrollmentFilterData = response.masterEnrollmentTypeFilter || [];
        if ((this.filterModel.ProgramIds || []).length > 0) {
          let defaultStatus = this.masterStatus.find(x => (x.value || '').toLowerCase() == 'active');
          this.filterModel.Status = defaultStatus && defaultStatus.id;
          this.filterModel.isEligible = 'Yes';

        }

        if (this.masterEnrollmentFilterData.length > 0) {
          let enrollmentObj = this.masterEnrollmentFilterData.find(x => x.id > 0 && x.value.toLowerCase() == 'all');
          this.defaultEnrollmentId = enrollmentObj && enrollmentObj.id;
          if (this.filterModel.EnrollmentId == null)
            this.filterModel.EnrollmentId = this.defaultEnrollmentId;
          this.masterChronicCondition = response.masterChronicCondition != null ? response.masterChronicCondition : [];

        }
        if (this.filterModel.EnrollmentId > 0 && this.filterModel.Status > 0)
        this.getPatientDiseaseManagementProgramList()
      }
    });
  }

  getMasterProgramsList() {
    this.clientProgramsService.getDiseaseProgramsWithEnrollmentsList().subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.masterPrograms = response.data || [];
      } else {
        this.masterPrograms = [];
      }
    }
    );
  }
  onResetProgramsDropdown(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterModel.ProgramIds.length == this.masterPrograms.length) {
        return;
      }
      this.filterModel.ProgramIds = this.masterPrograms.map(x => x.id);
    } else {
      if (this.filterModel && (this.filterModel.ProgramIds || []).length == 0) {
        return;
      }
      this.filterModel.ProgramIds = [];
    }
    this.getPatientDiseaseManagementProgramList();
  }
  onSelectDeselectConditionsDropdown(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterModel.conditionId.length == this.masterChronicCondition.length) {
        return;
      }
      this.filterModel.conditionId = this.masterChronicCondition.map(x => x.id);
    } else {
      if (this.filterModel && (this.filterModel.conditionId || []).length == 0) {
        return;
      }
      this.filterModel.conditionId = [];
    }
    this.getPatientDiseaseManagementProgramList();
  }
  onSelectDeselectGenderDropdown(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterModel.genderId.length == this.masterGender.length) {
        return;
      }
      this.filterModel.genderId = this.masterGender.map(x => x.id);
    } else {
      if (this.filterModel && (this.filterModel.genderId || []).length == 0) {
        return;
      }
      this.filterModel.genderId = [];
    }
    this.getPatientDiseaseManagementProgramList();
  }
  onSelectDeselectRelationshipDropdown(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterModel.relationship.length == this.masterRelationship.length) {
        return;
      }
      this.filterModel.relationship = this.masterRelationship.map(x => x.value);
    } else {
      if (this.filterModel && (this.filterModel.relationship || []).length == 0) {
        return;
      }
      this.filterModel.relationship = [];
    }
    this.getPatientDiseaseManagementProgramList();
  }
  getPatientDiseaseManagementProgramList() {
    const filterParams = {
      ...this.filterModel,
      StartDate: this.filterModel.StartDate && format(this.filterModel.StartDate, 'YYYY-MM-DD'),
      EndDate: this.filterModel.EndDate && format(this.filterModel.EndDate, 'YYYY-MM-DD'),
      IsEligible: this.filterModel.isEligible,
      Status: this.filterModel.Status
    }
    this.clientProgramsService.getAllPatientDiseaseManagementProgramsList(filterParams).subscribe((response: any) => {
      if (response && response.statusCode == 200) {
        this.programsListingData = response.data;
        this.patientProgramsList = response.data.DMPPatientModel || [];
        this.metaData = response.data.meta;
      } else {
        this.programsListingData = null;
        this.patientProgramsList = []
        this.metaData = new Metadata();
      }
    }
    );
  }
  getPatientDMProgramData(patientObj: any) {
    let programDetailData = []
    if (this.programsListingData && this.programsListingData.AllPatientsDiseaseManagementProgramModel.length > 0) {
      programDetailData = (this.programsListingData.AllPatientsDiseaseManagementProgramModel || []).filter((x) => x.patientId == patientObj.patientId);
    }
    else {
      programDetailData = []
    }
    return programDetailData
  }
  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
  //   this.getPatientDiseaseManagementProgramList();
  // }
  onProgramsCMSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterModel.CareManagerIds.length == this.masterStaffs.length) {
        return;
      }
      this.filterModel.CareManagerIds = this.masterStaffs.map(x => x.id);
    } else {
      if (this.filterModel && (this.filterModel.CareManagerIds || []).length == 0) {
        return;
      }
      this.filterModel.CareManagerIds = [];
    }
    this.getPatientDiseaseManagementProgramList();
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
  }

  openEmailPopup() {
    let customEmailModal;
    const filters = {
      ...this.filterModel,
      pageSize: this.patientProgramsList[0].totalRecords,
      ProgramIds: (this.filterModel.ProgramIds || []).join(','),
      conditionId: (this.filterModel.conditionId || []).join(','),
      CareManagerIds: (this.filterModel.CareManagerIds || []).join(','),
      StartDate: this.filterModel.StartDate && format(this.filterModel.StartDate, 'YYYY-MM-DD'),
      EndDate: this.filterModel.EndDate && format(this.filterModel.EndDate, 'YYYY-MM-DD'),
      nextAppointmentPresent: this.filterModel.nextAppointmentPresent,
    }
    customEmailModal = this.dialogModal.open(EmailModalComponent, {
      data: filters
    });
    customEmailModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }

    });
  }

  createMessageModal() {

    let clientMessageModal;
    const filters = {
      ...this.filterModel,
      pageSize: this.patientProgramsList[0].totalRecords,
      ProgramIds: (this.filterModel.ProgramIds || []).join(','),
      conditionId: (this.filterModel.conditionId || []).join(','),
      CareManagerIds: (this.filterModel.CareManagerIds || []).join(','),
      StartDate: this.filterModel.StartDate && format(this.filterModel.StartDate, 'YYYY-MM-DD'),
      EndDate: this.filterModel.EndDate && format(this.filterModel.EndDate, 'YYYY-MM-DD'),
      nextAppointmentPresent: this.filterModel.nextAppointmentPresent
    }

    clientMessageModal = this.dialogModal.open(MessageModalComponent, {
      data: filters
    });
    clientMessageModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {
      }
    });
  }

  onNavigate(dmpObj: any) {
    this.router.navigate(["/web/client/programs"], {
      queryParams: {
        id: this.commonService.encryptValue(dmpObj.patientId, true),
      },
    });
  }
  exportToExcel() {
    //let pageSize =5;
    let pageSize = this.patientProgramsList.find(x => x.totalRecords > 0).totalRecords
    //let pageSize = this.reportData[0].totalRecords;
    // this.programsListingData.pageSize = this.programsListingData[0].TotalRecords;

    const filterParams = {
      ...this.filterModel,
      StartDate: this.filterModel.StartDate && format(this.filterModel.StartDate, 'YYYY-MM-DD'),
      EndDate: this.filterModel.EndDate && format(this.filterModel.EndDate, 'YYYY-MM-DD'),
      EnrollmentId: this.filterModel.EnrollmentId ? this.filterModel.EnrollmentId : null,
      nextAppointmentPresent: this.filterModel.nextAppointmentPresent
    }
    this.isLoadingExportPrint = true;
    this.clientProgramsService.getPatientDiseaseManagementDataExport(filterParams, pageSize).subscribe((response: any) => {

      if (response) {
        this.isLoadingExportPrint = false;
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
  clearParticularField(key: string) {
    switch ((key || '').toLowerCase()) {
      case 'eligibleclear':
        this.filterModel.isEligible = ''
        break;
    }
  }
  printDMPEnrollPatientsData(event: any) {
    let pageSize = this.patientProgramsList.find(x => x.totalRecords > 0).totalRecords
    //let pageSize = this.reportData[0].totalRecords;
    // this.programsListingData.pageSize = this.programsListingData[0].TotalRecords;
    this.isLoadingExportPrint = true;
    const filterParams = {
      ...this.filterModel,
      StartDate: this.filterModel.StartDate && format(this.filterModel.StartDate, 'YYYY-MM-DD'),
      EndDate: this.filterModel.EndDate && format(this.filterModel.EndDate, 'YYYY-MM-DD'),
      EnrollmentId: this.filterModel.EnrollmentId ? this.filterModel.EnrollmentId : null,
      nextAppointmentPresent: this.filterModel.nextAppointmentPresent
    }
    // this.clientProgramsService.generateDMPEnrollPatientsPDF(filterParams, pageSize).subscribe((response: any) => {
    //   this.clientProgramsService.downLoadFile(response, 'application/pdf', `Task List.pdf`)
    // });
    this.clientProgramsService.generateDMPEnrollPatientsPDF(filterParams, pageSize).subscribe((response: any) => {
      this.isLoadingExportPrint = false;
      this.clientProgramsService.downLoadFile(response, 'application/pdf', `Program Enrollments.pdf`)
    });
  }
}
