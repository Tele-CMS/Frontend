import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportingService } from '../reporting.service';
import { MatDialog, MatPaginator } from '@angular/material';
import { CustomBulkEmailModalComponent } from './custom-report-bulk-email-modal/custom-report-bulk-email-modal.component';
import { CustomBulkMessageModalComponent } from './custom-report-bulk-message-modal/custom-report-bulk-message-modal.component';
import { Metadata, FilterModel } from '../../../core/modals/common-model';
import { merge } from 'rxjs';
import { CustomReportFilter } from './custom-report.model';
import { NotifierService } from 'angular-notifier';
// import { EasyQueryComponent } from '../../compliance-query-builder/easyquery/easyquery.component';
// import { EasyQueryDialogComponent } from '../../compliance-query-builder/easy-query-dialog-component/easy-query-dialog-component';

@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.css']
})

export class CustomReportComponent implements OnInit {
  masterRuleData: Array<any>
  reportData: Array<any>
  ruleId: number
  headers: Array<any>
  isDisabled: boolean = true
  isDialogLoading: boolean;
  metaData: Metadata;
  isExportButtonDisabled: boolean = true;
  filterModel: CustomReportFilter;
  dropdownData: Array<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private customReportService: ReportingService,
    private customBulkEmailDialogModal: MatDialog, private customBulkMessageDialogModal: MatDialog,
    private queryBuilderModal: MatDialog, private notifier: NotifierService, ) {
    this.masterRuleData = [];
    this.filterModel = new CustomReportFilter();
    this.metaData = new Metadata();
    this.dropdownData = [{ id: true, value: 'Yes' }, { id: false, value: 'No' }];
  }

  ngOnInit() {
    this.getRuleData();
    this.onPageChanges();
  }

  getRuleData() {
    this.customReportService.getRuleData().subscribe((response) => {
      if (response.statusCode == 200) {
        this.masterRuleData = response.data || [];
      } else {
        this.masterRuleData = [];
      }
    });
  }
  onApplyFilter() {
    this.getReportData();
  }
  getReportData() {
    const changeFilters = {
      ...this.filterModel,
      isBiometricsComplete: this.filterModel.isBiometricsComplete,
      isEncountersCompliant: this.filterModel.isEncountersCompliant
    };
    this.customReportService.getReportDataByRuleId(changeFilters).subscribe((response) => {
      if (response.statusCode == 200) {
        this.reportData = response.data || [];
        this.isExportButtonDisabled = this.reportData.length > 0 ? false : true;
        this.metaData = response.meta;
        this.isDisabled = this.reportData && this.reportData.length > 0 ? false : true
        this.headers = Object.keys(this.reportData && this.reportData.length > 0 ? this.reportData[0] : [])
        this.headers.shift();
        this.headers.length && this.headers.splice(0, 0, this.headers.pop());
        this.headers = this.headers.map(x => (x || '').replace(/_/g, ' '));
      } else {
        this.reportData = [];
        this.metaData = new Metadata()
      }
    });
  }
  getDataForTable(index: number) {
    if (this.reportData && this.reportData.length) {
      let reportDataValues = Object.values(this.reportData[index])
      reportDataValues.shift();
      reportDataValues.splice(0, 0, reportDataValues.pop());
      return reportDataValues
    }
  }
  createEmailModal() {
    const changeFilters = {
      ...this.filterModel,
      isBiometricsComplete: this.filterModel.isBiometricsComplete,
      isEncountersCompliant: this.filterModel.isEncountersCompliant
    };
    let customEmailModal;
    customEmailModal = this.customBulkEmailDialogModal.open(CustomBulkEmailModalComponent, { data: { reportData: this.reportData, ruleId: this.ruleId, changeFiltersData: changeFilters } })
    customEmailModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {

      }

    });
  }
  createMessageModal() {
    const changeFilters = {
      ...this.filterModel,
      isBiometricsComplete: this.filterModel.isBiometricsComplete,
      isEncountersCompliant: this.filterModel.isEncountersCompliant
    };
    let customMessageModal;

    customMessageModal = this.customBulkMessageDialogModal.open(CustomBulkMessageModalComponent, { data: { changeFiltersData: changeFilters} })
    customMessageModal.afterClosed().subscribe((result: string) => {
      if (result == 'save') {
      }
    });
  }
  openQueryBuilder(ruleId) {
    localStorage.removeItem("QueryBuilderRuleId");
    let openQueryBuilderModal;
    if (ruleId && ruleId != undefined && ruleId != null && ruleId != '') {
      let isMannualQuery = this.masterRuleData.find(e => e.id === ruleId).isMannualQuery;

      if (isMannualQuery) {
        this.notifier.notify('error', "You can't refresh manually added queries ")
        return;
      }
      // else {
      //   localStorage.setItem('QueryBuilderRuleId', ruleId);
      //   openQueryBuilderModal = this.queryBuilderModal.open(EasyQueryDialogComponent, { data: { fromCustomRptComponent: true } })
      //   openQueryBuilderModal.afterClosed().subscribe((result: string) => {
      //     if (result == 'save') {
      //     }
      //   });
      // }
    } 
  }

  setCustomReportPaginatorModel(pageNumber, pageSize, sortColumn, sortOrder) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
  }
  onPageChanges() {
    merge(this.paginator.page)
      .subscribe(() => {
        const changeState = {
          pageNumber: (this.paginator.pageIndex + 1),
          pageSize: this.paginator.pageSize
        }
        this.setCustomReportPaginatorModel(changeState.pageNumber, changeState.pageSize, '', '');
        this.getReportData();
      })
  }

  exportToExcel() {
    const changeFilters = {
      ...this.filterModel,
      isBiometricsComplete: this.filterModel.isBiometricsComplete,
      isEncountersCompliant: this.filterModel.isEncountersCompliant
    };
    this.isDialogLoading = true;
    this.customReportService.exportDataFromComplianceQueryToExcel(changeFilters).subscribe((response: any) => {

      if (response) {
        this.isDialogLoading = false;
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

}
