

import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { addDays, format } from 'date-fns';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { ClaimsService } from '../claims/claims.service';
import { Claim } from '../claims/claims.model';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { merge } from 'rxjs';
import { GenerateClaimDialogComponent } from '../claims/generate-claim-dialog/generate-claim-dialog.component';
import { ClaimServiceCodeDialogComponent } from '../claims/claim-service-code-dialog/claim-service-code-dialog.component';
import { map } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { EobPaymentDialogComponent } from '../claims/eob-payment-dialog/eob-payment-dialog.component';

class CustomFilterModel extends FilterModel {
  fromDate: string = '';
  toDate: string = '';
}

@Component({
  selector: 'app-edi837history',
  templateUrl: './edi837history.component.html',
  styleUrls: ['./edi837history.component.css']
})
export class Edi837historyComponent implements OnInit {
  currentLocationId: number;
  claimFilterForm: FormGroup;
  customFilterModel: CustomFilterModel;
  submittedClaimsBatchList: Array<any>;
  EDI837SubmittedClaimsBatchDetails: Array<any>;
  EDI837Claims: Array<any>;
  EDI837ClaimServiceLines: Array<any>;
  expandedClaimIds: Array<number>;
  expandedClaimServiceLineIds: Array<number>;
  metaData: any;
  isLoadingResults: boolean = false;

  fetched837Ids: Array<number>;
  loadingEDI837DetailsIDs: Array<number>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimsService,
    private claimDailog: MatDialog,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
    this.customFilterModel = new CustomFilterModel();
    this.submittedClaimsBatchList = [];
    this.EDI837SubmittedClaimsBatchDetails = [];
    this.EDI837Claims = [];
    this.EDI837ClaimServiceLines = [];
    this.expandedClaimIds = [];
    this.expandedClaimServiceLineIds = [];
    this.metaData = {};
  }

  ngOnInit() {
    const currentDate = new Date();
    const previousWeekDate = addDays(currentDate, -7);

    this.claimFilterForm = this.formBuilder.group({
      fromDate: [previousWeekDate],
      toDate: [currentDate],
    });
    this.onApplyFilter();
    this.onSortOrPageChanges();
  }

  onDownloadEDIFile(textFile: any, id: number) {
    this.claimService.downLoadFile(textFile, 'text/plain', `EDI${id}.txt`);
  }

  handleExpandRow(claimId: number) {
    const claimIndex = this.expandedClaimIds.findIndex(obj => obj == claimId);
    if (claimIndex > -1) {
      this.expandedClaimIds.splice(claimIndex, 1);
    } else {
      this.expandedClaimIds.push(claimId);
    }

    let fetched837Ids = this.fetched837Ids || [];
    let loadingIds = this.loadingEDI837DetailsIDs || [];
    if (fetched837Ids.findIndex((fetchId) => fetchId === claimId) === -1) {
      fetched837Ids.push(claimId);
      loadingIds.push(claimId);
      this.loadingEDI837DetailsIDs = loadingIds,
        this.fetched837Ids = fetched837Ids;
      this.getEDISubmittedClaimsBatchDetails(claimId);
    }
  }


  handleExpandInnerRow(serviceLineId: number) {
    const serviceIndex = this.expandedClaimServiceLineIds.findIndex(obj => obj == serviceLineId);
    if (serviceIndex > -1) {
      this.expandedClaimServiceLineIds.splice(serviceIndex, 1);
    } else {
      this.expandedClaimServiceLineIds.push(serviceLineId);
    }
  }

  onClearFilter(): void {
    this.claimFilterForm.reset();
    const currentDate = new Date();
    const previousWeekDate = addDays(currentDate, -7);
    this.claimFilterForm.patchValue({
      fromDate: previousWeekDate,
      toDate: currentDate
    })
    this.onApplyFilter();
  }

  onApplyFilter(): void {
    const formValues = this.claimFilterForm.value;

    this.customFilterModel = {
      ...formValues,
      fromDate: format(formValues.fromDate, 'YYYY-MM-DD'),
      toDate: format(formValues.toDate, 'YYYY-MM-DD'),
      pageNumber: this.customFilterModel.pageNumber,
      pageSize: this.customFilterModel.pageSize,
      sortColumn: this.customFilterModel.sortColumn || 'claimID',
      sortOrder: this.customFilterModel.sortOrder || 'desc',
    }

    this.claimService.getSubmittedClaimsBatch(this.customFilterModel)
      .subscribe((response: ResponseModel) => {
        this.isLoadingResults = false;
        if (response.statusCode !== 200) {
          this.expandedClaimIds = [];
          this.expandedClaimServiceLineIds = [];
          this.submittedClaimsBatchList = [];
          this.metaData = {};
        }
        else {
          this.submittedClaimsBatchList = response.data || [];
          this.metaData = response.meta || {};
          this.expandedClaimIds = [];
        }
      })
  }

  onSortOrPageChanges() {
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.paginator.page)
      .subscribe(() => {
        this.isLoadingResults = true;

        const changeState = {
          sort: this.sort.active || 'claimID',
          order: this.sort.direction || 'desc',
          pageNumber: (this.paginator.pageIndex + 1)
        }
        this.setPaginatorModel(changeState.pageNumber, this.customFilterModel.pageSize, changeState.sort, changeState.order);
        this.onApplyFilter();
      })
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.customFilterModel = {
      ...this.customFilterModel,
      pageNumber,
      pageSize,
      sortColumn,
      sortOrder
    }
  }

  filterClaimsArray(batchClaimId: number) : Array<any> {
    let CurrentBatchClaimsArray = [];
    if (this.EDI837Claims && this.EDI837Claims.length)
      CurrentBatchClaimsArray = this.EDI837Claims.filter((claimObj) => claimObj.claim837BatchId === batchClaimId) || [];
    return CurrentBatchClaimsArray;
  }

  filterClaimServiceLinesArray(claimId: number) : Array<any> {
    let CurrentClaimServiceLinesArray = [];
    if (this.EDI837ClaimServiceLines && this.EDI837ClaimServiceLines.length)
    CurrentClaimServiceLinesArray = this.EDI837ClaimServiceLines.filter((claimObj) => claimObj.claim837ClaimId === claimId) || [];
    return CurrentClaimServiceLinesArray;
  }

  getEDISubmittedClaimsBatchDetails(id: number) {
    this.claimService.getSubmittedClaimsBatchDetails(id)
      .subscribe((response: ResponseModel) => {
        this.isLoadingResults = false;
        if (response.statusCode == 200) {
          let unloadingId = id,
            loadingEDI837DetailsIDs = this.loadingEDI837DetailsIDs || [],
            unloadingIndex = loadingEDI837DetailsIDs.findIndex((id) => id === unloadingId);
          if (unloadingIndex > -1) {
            loadingEDI837DetailsIDs.splice(unloadingIndex, 1);
          }
          let batchClaimsData = response.data,
            EDI837SubmittedClaimsBatchDetails = this.EDI837SubmittedClaimsBatchDetails || [];
          if (batchClaimsData && batchClaimsData.Claims) {
            EDI837SubmittedClaimsBatchDetails.push(batchClaimsData);
            (batchClaimsData.Claims || []).forEach((obj) => {
              this.EDI837Claims.push(obj);
            });
            (batchClaimsData.ServiceLines || []).forEach((obj) => {
              this.EDI837ClaimServiceLines.push(obj);
            });
          }
          this.loadingEDI837DetailsIDs = loadingEDI837DetailsIDs
          this.EDI837SubmittedClaimsBatchDetails = EDI837SubmittedClaimsBatchDetails;
        } else {

        }
      });
  }


}
