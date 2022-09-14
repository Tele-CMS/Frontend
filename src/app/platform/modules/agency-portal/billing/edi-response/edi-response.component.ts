

import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { addDays, format } from 'date-fns';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { ClaimsService } from '../claims/claims.service';
import { Claim } from '../claims/claims.model';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { merge } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { GenerateClaimDialogComponent } from '../claims/generate-claim-dialog/generate-claim-dialog.component';

class CustomFilterModel extends FilterModel {
  fromDate: string = '';
  toDate: string = '';
  claimStatusId: string = '';
  payerName: string = '';
  claimId: string = '';
  patientIds: string = '';
}

@Component({
  selector: 'app-edi-response',
  templateUrl: './edi-response.component.html',
  styleUrls: ['./edi-response.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EDIResponseComponent implements OnInit {
  currentLocationId: number;
  claimFilterForm: FormGroup;
  customFilterModel: CustomFilterModel;
  ProcessedClaims: Claim[];
  ProcessedClaimServiceLines: Array<any>;
  ProcessedClaimServiceLineAdjustments: Array<any>;
  expandedClaimIds: Array<number>;
  expandedClaimServiceLineIds: Array<any>;
  allPatients: Array<any>;
  masterInsuranceCompany: Array<any>;
  metaData: any;
  isLoadingResults: boolean = false;
  // service line form dropdowns
  officeAndPatientLocations: Array<any>;
  ServiceCodeModifiers: Array<any>;
  ServiceCodes: Array<any>;
  isLoadedPayerServiceCodeAndModifiers: boolean = false;
  isLoadedPatientLocations: boolean = false;
  checkedEDIClaimIds: Array<number>;
  checkedNonEDIClaimIds: Array<number>;
  isAllchecked: boolean;
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
    this.ProcessedClaims = [];
    this.ProcessedClaimServiceLines = [];
    this.ProcessedClaimServiceLineAdjustments = [];
    this.expandedClaimIds = [];
    this.expandedClaimServiceLineIds = [];
    this.allPatients = [];
    this.metaData = {};
    // service code dropdowns
    this.officeAndPatientLocations = [];
    this.ServiceCodes = [];
    this.ServiceCodeModifiers = [];
    this.checkedEDIClaimIds = [];
    this.checkedNonEDIClaimIds = [];
    this.isAllchecked = false;
  }

  ngOnInit() {
    const currentDate = new Date();
    const previousWeekDate = addDays(currentDate, -7);

    this.claimFilterForm = this.formBuilder.group({
      claimId: [''],
      patientIds: [''],
      payerName: [''],
      fromDate: [previousWeekDate],
      toDate: [currentDate],
    });

    this.getMasterData();
    this.getPatientsList();
    this.onApplyFilter();
    this.onSortOrPageChanges();
  }

  handleExpandRow(claimId: number) {
    const claimIndex = this.expandedClaimIds.findIndex(obj => obj == claimId);
    if (claimIndex > -1) {
      this.expandedClaimIds.splice(claimIndex, 1);
    } else {
      this.expandedClaimIds.push(claimId);
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
      claimStatusId: 1,
      fromDate: format(formValues.fromDate, 'YYYY-MM-DD'),
      toDate: format(formValues.toDate, 'YYYY-MM-DD'),
      pageNumber: this.customFilterModel.pageNumber,
      pageSize: this.customFilterModel.pageSize,
      sortColumn: this.customFilterModel.sortColumn || 'claimID',
      sortOrder: this.customFilterModel.sortOrder || 'desc',
    }

    this.claimService.getProcessedClaims(this.customFilterModel)
      .subscribe((response: ResponseModel) => {
        this.isLoadingResults = false;
        this.isAllchecked = false;
        this.checkedEDIClaimIds = [];
        this.checkedNonEDIClaimIds = [];
        if (response.statusCode !== 200) {
          this.expandedClaimIds = [];
          this.expandedClaimServiceLineIds = [];
          this.ProcessedClaims = [];
          this.ProcessedClaimServiceLines = [];
          this.ProcessedClaimServiceLineAdjustments = [];
          this.metaData = {};
        }
        else {
          this.ProcessedClaims = response.data.ProcessedClaims || [];
          this.ProcessedClaimServiceLines = response.data.ProcessedClaimServiceLines || [];
          this.ProcessedClaimServiceLineAdjustments = response.data.ProcessedClaimServiceLineAdjustments || [];
          this.metaData = response.meta || {};
          this.expandedClaimIds = this.ProcessedClaims.map(obj => obj.claimId) || [];
          this.expandedClaimServiceLineIds = [];
        }
      })
  }
  
  filterClaimServiceLines(claim835ClaimId: number) : Array<any> {
    let serviceLineArray = [];
    if (this.ProcessedClaimServiceLines && this.ProcessedClaimServiceLines.length)
    serviceLineArray = this.ProcessedClaimServiceLines.filter((claimObj) => claimObj.claim835ClaimId === claim835ClaimId) || [];
    return serviceLineArray;
  }

  filterClaimServiceLineAdjustmentsArray(claim835ServiceLineId: number) : Array<any> {
    let adjustmentArray = [];
    if (this.ProcessedClaimServiceLineAdjustments && this.ProcessedClaimServiceLineAdjustments.length)
    adjustmentArray = this.ProcessedClaimServiceLineAdjustments.filter((serviceObj) => serviceObj.claim835ServiceLineId === claim835ServiceLineId) || [];
    return adjustmentArray;
  }

  generatePaperClaim(claimObj: any) {
    const dialog = this.claimDailog.open(GenerateClaimDialogComponent, {
      data: {
        ...claimObj,
        payerPreference: 'SECONDARY'
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      if (result == 'Success')
        this.onApplyFilter();
    })
  }

  getPatientsList() {
    this.claimService.getStaffAndPatientByLocation(this.currentLocationId.toString())
      .subscribe((response: ResponseModel) => {
        if (response.statusCode !== 200) {
          this.allPatients = [];
        }
        else {
          this.allPatients = response.data.patients || [];
        }
      })
  }

  getMasterData() {
    const masterData = { masterdata: 'MASTERINSURANCECOMPANY' }
    this.claimService.getMasterData(masterData)
      .subscribe((response: any) => {
        if (response) {
          this.masterInsuranceCompany = response.insuranceCompanies || [];
        } else {
          this.masterInsuranceCompany = [];
        }
      })
  }

  onSortOrPageChanges() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
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

  onCheckClaims(event: any, claimObj: Claim) {
    const checked = event.checked;
    if (claimObj) {
        if (checked)
          this.checkedEDIClaimIds.push(claimObj.claimId)
        else {
          const claimIndex = this.checkedEDIClaimIds.findIndex(id => id == claimObj.claimId);
          this.checkedEDIClaimIds.splice(claimIndex, 1);
        }
    } else {
      if (!checked)
        this.checkedEDIClaimIds = [];
      else
        (this.ProcessedClaims || []).forEach((obj: Claim) => {
            this.checkedEDIClaimIds.push(obj.claimId)
        });
    }
    this.isAllchecked = (this.ProcessedClaims.length == (this.checkedEDIClaimIds.length))
  }

  batchGenerateForSecondaryPayer(event: any) {
    const claimIds = this.checkedEDIClaimIds.join(',');
    this.dialogService.confirm('Are you sure you want to submit selected claims for EDI generation?')
      .subscribe(result => {
        if (result) {
          this.checkedEDIClaimIds = [];
          this.BatchEDIGeneration(claimIds);
        }
      })
  }

  BatchEDIGeneration(claimIds: string) {
    this.claimService.generateBatchEDI837_Secondary(claimIds)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.checkedEDIClaimIds = [];
          this.isAllchecked = false;
          this.notifier.notify('error', response.message);
        } else {
          this.notifier.notify('success', response.message);
          this.onApplyFilter();
        }
      });
  }

}

