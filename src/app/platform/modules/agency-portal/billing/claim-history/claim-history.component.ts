import { Component, OnInit, Output } from '@angular/core';
import { ClaimsService } from '../claims/claims.service';
import { Metadata, FilterModel } from '../../../core/modals/common-model';
import { ClaimHistory, ClaimDetail } from '../claims/claims.model';

@Component({
  selector: 'app-claim-history',
  templateUrl: './claim-history.component.html',
  styleUrls: ['./claim-history.component.css']
})
export class ClaimHistoryComponent implements OnInit {
  claimHistoryData: ClaimHistory[];
  claimDetails: ClaimDetail;
  metaData: Metadata;
  claimId: number;
  filterModel: FilterModel;
  displayedColumns: Array<any> = [
    { displayName: 'LOG DATE', key: 'logDate', isSort: true, class: '', width: '22%', type: 'date' },
    { displayName: 'ACTION', key: 'action', isSort: true, class: '', width: '22%' },
    { displayName: 'FIELD', key: 'columnName', class: '', width: '25%' },
    { displayName: 'OLD VALUE', key: 'oldValue', class: '', width: '12%' },
    { displayName: 'NEW VALUE', key: 'newValue', class: '', width: '17%' }

  ];
  actionButtons: Array<any> = [];
  constructor(public claimService: ClaimsService) {
    this.filterModel = new FilterModel();
    this.claimHistoryData = new Array<ClaimHistory>();
    this.claimDetails = new ClaimDetail();
  }
  ngOnInit() {
    this.getClaimHistoryData();
  }
  getClaimHistoryData() {
    this.claimService.getClaimHistory(this.filterModel, this.claimId)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.claimHistoryData = response.data.ClaimHistory.map((obj) => {
              obj.columnName = obj.columnName || '-',
                obj.oldValue = obj.oldValue || '-',
                obj.newValue = obj.newValue || '-'
              return obj;
            });
            this.claimDetails = response.data.ClaimDetail;
          } else {
            this.claimHistoryData = [];
            this.claimDetails = new ClaimDetail;
          }
        });
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getClaimHistoryData();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
}
