import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { HealtheScoreListModel } from './assigned-health-e-score-list.model';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ClientsService } from '../clients.service';
import { CommonService } from '../../core/services';
import { FilterModel, ResponseModel } from '../../core/modals/common-model';
import { PreviewHealtheScoreReportComponent } from './preview-health-e-score-report/preview-health-e-score-report.component';

@Component({
  selector: 'app-assigned-health-e-score-list',
  templateUrl: './assigned-health-e-score-list.component.html',
  styleUrls: ['./assigned-health-e-score-list.component.css']
})
export class AssignedHealtheScoreComponent implements OnInit {
  metaData: any;
  urlSafe: any;
  imageBlobUrl: string;
  totalRecords: number
  isDialogLoading: boolean;
  clientId: number;
  filterModel: any;
  searchText: string = '';
  healtheScoresData: HealtheScoreListModel[];
  isRoleClient: boolean = false;
  loginClientId: number;
  addPermission: boolean;
  masterHealtheScoreStatus: Array<any>
  displayedColumns: Array<any> = [
    { displayName: 'Assigned By', key: 'staffName', isSort: true, class: '', width: '25%' },
    { displayName: 'Health-e Score Date', key: 'healtheScoreDate', class: '', width: '20%', type: 'datetime' },
    { displayName: 'Start Date', key: 'startDate', class: '', width: '15%', type: 'date' },
    { displayName: 'End Date', key: 'endDate', class: '', width: '15%', type: 'date' },
    { displayName: 'Status', key: 'statusName', isSort: true, class: '', width: '15%' },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
  ];

  actionButtons: Array<any> = [
    { displayName: 'Preview Health-e Score Report', key: 'preview', class: 'fa fa-eye' },
    { displayName: 'Download Health-e Score Report', key: 'download', class: 'fa fa-download' },
  ];
  constructor(
    private healtheScoresService: ClientsService,
    public bulkUpdationModal: MatDialog,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    public dialogModal: MatDialog,
  ) {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.isRoleClient = user.users3 && user.users3.userRoles && (user.users3.userRoles.userType || '').toUpperCase() == 'CLIENT';
        if (this.isRoleClient)
          this.loginClientId = user.id;
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.isRoleClient) {
        this.clientId = this.loginClientId;
      }
    });
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getHealtheScoreList();
    this.getMasterData()
  }

  clearFilters() {
    if (!this.searchText) {
      return null;
    }
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getHealtheScoreList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getHealtheScoreList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id,
      patientName = actionObj.data && actionObj.data.patientName
    switch ((actionObj.action || '').toUpperCase()) {
      case 'DOWNLOAD':
        this.viewHealtheScoreReport(id, patientName, 'download');
        break;
        case 'PREVIEW':
          this.viewHealtheScoreReport(id, patientName, 'preview');
        break;
      default:
        break;
    }
  }
  viewHealtheScoreReport(patientHealtheScoreId: number, patientName: string,key:string) {
    this.isDialogLoading = true;
    this.healtheScoresService.generateeHealthScorePDF(patientHealtheScoreId, this.clientId).subscribe((response: any) => {
      this.isDialogLoading = false;
      if (key == 'download') {
        this.healtheScoresService.downLoadFile(response, 'application/pdf', `Health-e Score For ${patientName}.pdf`)
      } else {
        this.createImageFromBlob(response);
      }
    });
}
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    this.imageBlobUrl = "";
    this.urlSafe = ''
    reader.addEventListener("load", () => {
      this.imageBlobUrl = reader.result as string;

      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageBlobUrl);
      let previewModal;
      previewModal = this.dialogModal.open(PreviewHealtheScoreReportComponent, {
        data: { urlSafe: this.urlSafe }
      })
      previewModal.afterClosed().subscribe((result: string) => {
      });
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  getHealtheScoreList() {
    this.filterModel.patientId = this.clientId;
    this.healtheScoresService.getHealtheScoreListData(this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.healtheScoresData = (response.data || []).map(x => {
          x['disableActionButtons'] = (x.statusName || '').toUpperCase() == 'VOIDED' && ['download' , 'preview'];
          return x;
        })
        this.totalRecords = this.healtheScoresData.find(x => x.totalRecords > 0).totalRecords;
        this.metaData = response.meta;
      } else {
        this.healtheScoresData = [];
        this.metaData = null;
        this.totalRecords = 0;
      }
    }
    );
  }
  getMasterData() {
    let data = "HEALTHESCORE";
    this.healtheScoresService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {

        this.masterHealtheScoreStatus = response.healtheScore || [];
      }
    });
  }
  applyFilter(searchText: string = '') {
    if (searchText.trim() == '' || searchText.trim().length >= 3) {
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
      this.getHealtheScoreList();
    }
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

}
