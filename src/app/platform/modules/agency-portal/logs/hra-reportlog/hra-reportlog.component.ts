import { Component, OnInit } from '@angular/core';
import { HRAEmailAndMessageReportLogModel } from '../logs.model';
import { ResponseModel, FilterModel } from '../../../core/modals/common-model';
import { LogsService } from '../logs.service';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { CommonService } from '../../../core/services/common.service';


@Component({
  selector: 'app-hra-reportlog',
  templateUrl: './hra-reportlog.component.html',
  styleUrls: ['./hra-reportlog.component.css']
})
export class HRAReportLogComponent implements OnInit {
  metaData: any;
  searchText: string = '';
  filterModel: FilterModel;
  actionButtons: Array<any>;
  displayedColumns: Array<any>
  hraEmailAndMessageReportLogData: HRAEmailAndMessageReportLogModel[];
  subscription: Subscription;
  userId;
  constructor(
    private auditLogService: LogsService,
    private commonService: CommonService,
  ) {
    this.displayedColumns = [
      { displayName: 'File Name', key: 'fileName', class: '', width: '35%' },
      { displayName: 'Report Date', key: 'reportDate', class: '', width: '25%' },
      { displayName: 'Provider Name', key: 'providerName', class: '', width: '15%' },
      { displayName: 'Report Type', key: 'reportType', class: '', width: '15%' },
      { displayName: 'Actions', key: 'Actions', width: '10%' }
    ]
    this.actionButtons = [
      { displayName: 'Download', key: 'download', class: 'fa fa-download' },
    ];
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.userId = user.data.userID;
        this.getHRAEmailAndMessageReportLog(this.filterModel);
      }
    });

  }


  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getHRAEmailAndMessageReportLog(this.filterModel);
  // } old one
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getHRAEmailAndMessageReportLog(this.filterModel);
  }

  getHRAEmailAndMessageReportLog(filterModel: any) {
    filterModel.moduleKey = 'memberhra'
    this.metaData = [];
    this.metaData.pageSizeOptions = [5,10,25,50,100];
    this.auditLogService.getHRAEmailAndMessageReportLog(filterModel,1,this.userId).subscribe((response: ResponseModel) => {
      this.hraEmailAndMessageReportLogData = response.data;
      if (this.hraEmailAndMessageReportLogData.length > 0) {
        // this.hraEmailAndMessageReportLogData.forEach(x => {
        //   x.formatReportDate = format(x.reportDate, 'MM/DD/YYYY hh:mm a');
        // })
        this.metaData = response.meta;
      }
      else {
        this.hraEmailAndMessageReportLogData = [];
        this.metaData = [];
      }
    }
    );
  }

  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getHRAEmailAndMessageReportLog(this.filterModel);
  }

  clearFilters() {
    if (!this.searchText) {
      return null;
    }
    this.searchText = "";
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getHRAEmailAndMessageReportLog(this.filterModel);
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  //table action
  onTableActionClick(actionObj?: any) {
    const fileName = actionObj.data && actionObj.data.fileName;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'DOWNLOAD':
        this.download(fileName);
        break;

      default:
        break;
    }
  }

  download(fileName: string) {
    this.auditLogService.downloadHRAEmailAndMessageReportLog(fileName).subscribe((response: any) => {
      this.downLoadFile(response, response.type, fileName);
    })
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
