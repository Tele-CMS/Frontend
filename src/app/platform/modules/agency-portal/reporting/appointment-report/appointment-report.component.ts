import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FilterModel, Metadata } from '../../../core/modals/common-model';
import { addYears, format, isValid } from 'date-fns';
import { ReportingService } from '../reporting.service';
import { Subscription, merge } from 'rxjs';
import { CommonService } from '../../../core/services';
import { MatPaginator, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { SendEmailModalComponent } from './send-email-modal/send-email-modal.component';
import { NotifierService } from 'angular-notifier';
import { SendMessageModalComponent } from './send-message-modal/send-message-modal.component';

class AppointmentFilterModel extends FilterModel {
  startDateTime: string;
  endDateTime: string;
  currentDate: string;
  cancellationType: number;
  status: number;
  memberName: string;
  nextAppointmentPresent: boolean;
  careManagerIds: Array<number>;
  programTypes: any;
  enrolledPrograms: any;
  isEligible: boolean;
  startDateTimeClone: Date;
  endDateTimeClone: Date;
  
}

class AppointmentCount {
  totalCount: number = 0;
  cancelledCount: number = 0;
  pendingCount: number = 0;
}



@Component({
  selector: 'app-appointment-report',
  templateUrl: './appointment-report.component.html',
  styleUrls: ['./appointment-report.component.css']
})
export class AppointmentReportComponent implements OnInit, OnDestroy {
  
  filterModel: AppointmentFilterModel;
  lastFilterModel: AppointmentFilterModel;
  masterCancellationTypes: Array<any>;
  masterStatus: Array<any>;
  masterStaffs: Array<any>;
  masterProgramTypes: Array<any>;
  appointmentList: Array<any>;
  metaData: Metadata;
  subscription: Subscription;
  currentLocationId: number;
  appointmentsCount: AppointmentCount;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingExportPrint: boolean = false; 
  isExportButtonDisabled: boolean  = true;
  nextAppointmentList: Array<any> = [
    { id: true, value: 'Upcoming Appointment' },
    { id: false, value: 'No Upcoming Appointment' }
  ]
  eligibleList: Array<any> = [
    { id: true, value: 'Yes' },
    { id: false, value: 'No' }
  ]

  constructor(private reportingService: ReportingService,
    private commonService: CommonService,
    private router: Router,
    private dialogModal: MatDialog,
    private notifier: NotifierService,
    private activatedRoute: ActivatedRoute) { 
    this.filterModel = new AppointmentFilterModel();
    // Date Range (default 1 year back, one year forward).
    //const startDate = format(addYears(new Date(), -1), 'YYYY-MM-DD'), endDate = format(addYears(new Date(), 1), 'YYYY-MM-DD');
     const startDate = (addYears(new Date(), -1));
    const endDate = (addYears(new Date(), 1));

    this.filterModel = {
      ...this.filterModel,
      careManagerIds: [],
      //startDateTime: startDate,
      //endDateTime: endDate,
      startDateTimeClone: startDate,
      endDateTimeClone: endDate,
    }
    this.metaData = new Metadata();
    this.appointmentsCount = new AppointmentCount();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLocationId = user.currentLocationId;
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      let id = params.id == undefined ? null : this.commonService.encryptValue(params.id, false),
      stDate = params.startDate == undefined ? null : params.startDate,
      enDate = params.endDate == undefined ? null : params.endDate,
      cmId = params.cmId ? (params.cmId || '').split(',').map(x => parseInt(x, 10)): null;
      if(id > 0) {
        this.filterModel.status = parseInt(id, 10);
      }
      if(stDate || enDate) {
        //this.filterModel.startDateTime = isValid(new Date(stDate)) ? format(stDate, 'YYYY-MM-DD') : this.filterModel.startDateTime;
        //this.filterModel.endDateTime = isValid(new Date(enDate)) ? format(enDate, 'YYYY-MM-DD') : this.filterModel.endDateTime;

        let startDate = stDate.split('-');
        let endDate=enDate.split('-');
        this.filterModel.startDateTimeClone = new Date(startDate[0], startDate[1] - 1, startDate[2]); 
        this.filterModel.endDateTimeClone = new Date(endDate[0], endDate[1] - 1, endDate[2]); 
      }
      if(cmId && cmId.length > 0)
        this.filterModel.careManagerIds = cmId;
      this.applyFilter();
    });

    this.getMasterData();
    this.getProgramList();
    this.fetchStaffs();
    this.onPageChanges();
  }

  clearFilters() {
    this.filterModel = new AppointmentFilterModel();
    this.appointmentList = [];
    this.metaData = new Metadata();
    this.appointmentsCount = new AppointmentCount();
    this.filterModel = {
      ...this.filterModel,
      startDateTime: null,
      endDateTime: null,
      careManagerIds: [],
      enrolledPrograms: [],
      programTypes: [],
      cancellationType: null,
      searchText: '',
      memberName: '',
      startDateTimeClone: null,
      endDateTimeClone:null
    }
    this.applyFilter();
  }

  onPageChanges() {
    merge(this.paginator.page)
      .subscribe(() => {

        const changeState = {
          pageNumber: (this.paginator.pageIndex + 1),
          pageSize:this.paginator.pageSize
        }
        this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, '', '');
        this.applyFilter();
      })
  }

  setPaginatorModel(pageNumber, pageSize, sortColumn, sortOrder) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.sortOrder = sortOrder;
  }

  onNavigate(apptObj: any) {
    let [ cmObj ] = (apptObj.careManagers || [null]);
    this.router.navigate(["/web/client/scheduling"], {
      queryParams: {
        id: this.commonService.encryptValue(apptObj.patientID, true),
        staffId: cmObj && cmObj.id,
        date: format(apptObj.startDateTime, 'MM/DD/YYYY'),
      },
    });
  }

  applyFilter() {
    this.filterModel = {
      ...this.filterModel,
      startDateTime: this.filterModel.startDateTimeClone && format(this.filterModel.startDateTimeClone, 'YYYY-MM-DD'),
      endDateTime: this.filterModel.startDateTimeClone && format(this.filterModel.endDateTimeClone, 'YYYY-MM-DD'),
      currentDate: format(new Date(), 'YYYY-MM-DD'),
      programTypes: this.filterModel.programTypes || [],
      enrolledPrograms: this.filterModel.enrolledPrograms || [],
    }

    this.lastFilterModel = {...this.filterModel};
    this.reportingService.getFilteredAppointments(this.filterModel).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.appointmentList = (response.data.appointmentReportingList || []).map(
            x=> {
              return {
                ...x,
                careManager: (x.careManagers || []).map(y => y.careManagerName).join(", "),
                programNames: (x.programs || []).map(y => y.programName).join(", ")
              }
            }
            
          );
          this.isExportButtonDisabled = this.appointmentList.length > 0 ? false: true;
          this.metaData = response.meta;
          this.appointmentsCount = response.data.appointmentReportingListCount || new AppointmentCount();
        }
      }
    )
  }

  getMasterData() {
    const postData = { masterdata: "APPOINTMENTSTATUS,MASTERCANCELTYPE" }
    this.reportingService.getMasterData(postData).subscribe(
      response => {
        if (response) {
          this.masterStatus = response.appointmentStatus || [];
          this.masterCancellationTypes = response.masterCancelType || [];
          this.masterStatus = response.appointmentStatus || [];
          this.masterStatus = response.appointmentStatus || [];
        }
      }
    )
  }

  getProgramList() {
    this.reportingService.getDiseaseManagementProgramList().subscribe((response) => {
      if (response.statusCode == 200) {
        this.masterProgramTypes = response.data || [];
      } else {
        this.masterProgramTypes = [];
      }
    });
  }

  fetchStaffs(): void {
   let locationId = this.currentLocationId && this.currentLocationId.toString();

    this.reportingService.getStaffAndPatientByLocation(locationId)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.masterStaffs = [];
        } else {
          this.masterStaffs = response.data.staff || [];
        }
      })
  }

  isButtonsDisabled() {
    return !this.appointmentList || this.appointmentList.length == 0;
  }

  createModal() {
    let emailModal;
    const filterParams = this.lastFilterModel || {};
    filterParams['pageSize'] = this.appointmentsCount.totalCount || 0;
    emailModal = this.dialogModal.open(SendEmailModalComponent, { data: { filterModel: filterParams } })
    emailModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }
    });
  }
  printPDFApptReport() {
    this.isLoadingExportPrint = true;
      this.filterModel = {
        ...this.filterModel,
        startDateTime: this.filterModel.startDateTimeClone && format(this.filterModel.startDateTimeClone, 'YYYY-MM-DD'),
        //endDateTime: this.filterModel.startDateTime && format(this.filterModel.endDateTime, 'YYYY-MM-DD'),
        endDateTime: this.filterModel.startDateTimeClone && format(this.filterModel.endDateTimeClone, 'YYYY-MM-DD'),
        currentDate: format(new Date(), 'YYYY-MM-DD'),
        programTypes: this.filterModel.programTypes || [],
        enrolledPrograms: this.filterModel.enrolledPrograms || [],
        pageSize:this.appointmentList.find(x => x.totalRecords> 0).totalRecords
      };
    this.reportingService.generateApptReportPDF(this.filterModel).subscribe((response: any) => {
      this.isLoadingExportPrint = false;
      this.reportingService.downLoadFile(response, 'application/pdf', `Appointment Report.pdf`)
    });
  }
  exportToExcel()
  {
    this.isLoadingExportPrint = true;
    this.filterModel = {
      ...this.filterModel,
      startDateTime: this.filterModel.startDateTimeClone && format(this.filterModel.startDateTimeClone, 'YYYY-MM-DD'),
      endDateTime: this.filterModel.startDateTimeClone && format(this.filterModel.endDateTimeClone, 'YYYY-MM-DD'),
      currentDate: format(new Date(), 'YYYY-MM-DD'),
      programTypes: this.filterModel.programTypes || [],
      enrolledPrograms: this.filterModel.enrolledPrograms || [],
      pageSize:this.appointmentList.find(x => x.totalRecords> 0).totalRecords
    };
    this.reportingService.exportAppointmentReportToExcel( this.filterModel).subscribe((response: any) => {

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
  createMessageModal(){
    let emailModal;
    const filterParams = this.lastFilterModel || {};
    filterParams['pageSize'] = this.appointmentsCount.totalCount || 0;
    emailModal = this.dialogModal.open(SendMessageModalComponent, { data: { filterModel: filterParams } })
    emailModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }
    });
  }
}
