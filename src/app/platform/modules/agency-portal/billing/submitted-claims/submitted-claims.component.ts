import { Component, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
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
import { ReSubmitClaimDialogComponent } from '../claims/re-submit-claim-dialog/re-submit-claim-dialog.component';

class CustomFilterModel extends FilterModel {
  fromDate: string = '';
  toDate: string = '';
  claimStatusId: string = '';
  payerName: string = '';
  claimId: string = '';
  patientIds: string = '';
}

@Component({
  selector: 'app-submitted-claims',
  templateUrl: './submitted-claims.component.html',
  styleUrls: ['./submitted-claims.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubmittedClaimsComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  claimId: number;
  currentLocationId: number;
  claimFilterForm: FormGroup;
  customFilterModel: CustomFilterModel;
  allClaimsWithServiceLines: Claim[];
  expandedClaimIds: Array<number>;
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
  editableClaimInfoId: number;
  claimInfoBoxClaimId: number;
  showEncounterDetails: boolean;
  patientEncounterDetailsData: any;

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
    this.allClaimsWithServiceLines = [];
    this.expandedClaimIds = [];
    this.allPatients = [];
    this.metaData = {};
    // service code dropdowns
    this.officeAndPatientLocations = [];
    this.ServiceCodes = [];
    this.ServiceCodeModifiers = [];
    this.checkedEDIClaimIds = [];
    this.checkedNonEDIClaimIds = [];
    this.isAllchecked = false;
    this.editableClaimInfoId = null;
    this.claimInfoBoxClaimId = null;
    this.showEncounterDetails = false;
    this.patientEncounterDetailsData = null;
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
  handleOpenHistory(claimId) {
    this.handleTabChange.next({ tab: "Claim History", claimId: claimId });
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
      claimStatusId: 2,
      fromDate: format(formValues.fromDate, 'YYYY-MM-DD'),
      toDate: format(formValues.toDate, 'YYYY-MM-DD'),
      pageNumber: this.customFilterModel.pageNumber,
      pageSize: this.customFilterModel.pageSize,
      sortColumn: this.customFilterModel.sortColumn || 'claimID',
      sortOrder: this.customFilterModel.sortOrder || 'desc',
    }

    this.claimService.getAllClaimsWithServiceLines(this.customFilterModel)
      .subscribe((response: ResponseModel) => {
        this.isLoadingResults = false;
        this.isAllchecked = false;
        this.editableClaimInfoId = null;
        this.claimInfoBoxClaimId = null;
        this.showEncounterDetails = false;
        this.patientEncounterDetailsData = null;
        this.checkedEDIClaimIds = [];
        this.checkedNonEDIClaimIds = [];
        if (response.statusCode !== 200) {
          this.expandedClaimIds = [];
          this.allClaimsWithServiceLines = [];
          this.metaData = {};
        }
        else {
          this.allClaimsWithServiceLines = response.data || [];
          this.metaData = response.meta || {};
          this.expandedClaimIds = this.allClaimsWithServiceLines.map(obj => obj.claimId);
        }
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

  onEditClaimAdditionalInfo(claimId: number) {
    this.editableClaimInfoId = claimId || null;
  }

  onUpdatePayerAdditionalInfo(claimId: number, event: any) {
    const value = event.target.value;
    if (!value || !value.length)
      return null;

    const postData = {
      "claimId": claimId,
      "additionalClaimInfo": value
    }
    this.claimService.updateClaimDetails(postData)
      .subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.onApplyFilter();
        } else {
          this.notifier.notify('error', response.message);
        }
      });
  }

  onCheckClaims(event: any, claimObj: Claim) {
    const checked = event.checked;
    if (claimObj) {
      if (claimObj.isEDIPayer) {
        if (checked)
          this.checkedEDIClaimIds.push(claimObj.claimId)
        else {
          const claimIndex = this.checkedEDIClaimIds.findIndex(id => id == claimObj.claimId);
          this.checkedEDIClaimIds.splice(claimIndex, 1);
        }
      } else {
        if (checked)
          this.checkedNonEDIClaimIds.push(claimObj.claimId);
        else {
          const claimIndex = this.checkedNonEDIClaimIds.findIndex(id => id == claimObj.claimId);
          this.checkedNonEDIClaimIds.splice(claimIndex, 1);
        }
      }
    } else {
      if (!checked)
        this.checkedEDIClaimIds = [], this.checkedNonEDIClaimIds = [];
      else
        (this.allClaimsWithServiceLines || []).forEach((obj: Claim) => {
          if (obj.isEDIPayer)
            this.checkedEDIClaimIds.push(obj.claimId)
          else
            this.checkedNonEDIClaimIds.push(obj.claimId);
        });
    }
    this.isAllchecked = (this.allClaimsWithServiceLines.length == (this.checkedEDIClaimIds.length + this.checkedNonEDIClaimIds.length))
  }

  batchGenerate(event: any, isEDIPayers: boolean) {
    if (isEDIPayers) {
      const dialog = this.claimDailog.open(ReSubmitClaimDialogComponent, {
        data: this.checkedEDIClaimIds
      });
      dialog.afterClosed().subscribe((result: any) => {
        if (result == 'Success')
          this.onApplyFilter();
      })
    }
  }

  generatePaperClaim(claimObj: any) {
    const dialog = this.claimDailog.open(GenerateClaimDialogComponent, {
      data: {
        ...claimObj,
        isResubmitClaim: true
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      if (result == 'Success')
        this.onApplyFilter();
    })
  }

  onServiceLineAddUpdateClick(claimObj: Claim, serviceLineId: number) {
    this.isLoadedPatientLocations = false;
    this.isLoadedPayerServiceCodeAndModifiers = false;
    this.getPatientLocations(this.currentLocationId, claimObj.patientId, claimObj.dos.toString(), claimObj.dos.toString()).subscribe(res => {
      this.isLoadedPatientLocations = true;
      if (this.isLoadedPatientLocations && this.isLoadedPayerServiceCodeAndModifiers) {
        this.getClaimServiceLineDetail(claimObj.claimId, serviceLineId);
      }
    })
    this.getPayerServiceCodesAndModifiers(claimObj.patientId, null, claimObj.payerId, claimObj.patientInsuranceId).subscribe(res => {
      this.isLoadedPayerServiceCodeAndModifiers = true;
      if (this.isLoadedPatientLocations && this.isLoadedPayerServiceCodeAndModifiers) {
        this.getClaimServiceLineDetail(claimObj.claimId, serviceLineId);
      }
    })
  }

  createServiceCodeModel(data: any) {
    const dialog = this.claimDailog.open(ClaimServiceCodeDialogComponent, {
      data: data
    });
    dialog.afterClosed().subscribe((result: any) => {
      if (result == 'SAVE')
        this.onApplyFilter();
    })
  }


  getPatientLocations(locationId: number, patientId: number, startDate: string, endDate: string) {
    const appointmentData = {
      'locationId': locationId || null,
      'patientId': patientId || null,
      'startDate': startDate,
      'endDate': endDate,
    }
    return this.claimService.getDataForScheduler(appointmentData)
      .pipe(map((response: any) => {
        if (response.statusCode !== 200) {
          this.officeAndPatientLocations = [];
        } else {
          this.officeAndPatientLocations = response.data.PatientAddresses || [];
        }
      }))
  }

  getPayerServiceCodesAndModifiers(patientId: number, date: string, payerId: number, patientInsuranceId) {
    const filterModel = {
      patientId: patientId,
      PayerPreference: 'primary',
      date: date,
      payerId: payerId,
      patientInsuranceId: patientInsuranceId,
    }
    return this.claimService.getPatientPayerServiceCodesAndModifiers(filterModel)
      .pipe(map((response: any) => {
        if (response.statusCode !== 200) {
          this.ServiceCodes = [];
          this.ServiceCodeModifiers = [];
        } else {
          this.ServiceCodes = response.data.ServiceCodes || [];
          this.ServiceCodeModifiers = response.data.ServiceCodeModifiers || [];
        }
      }))
  }

  getClaimServiceLineDetail(claimId: number, serviceLineId: number) {
    const filterModel = {
      claimId: claimId,
      serviceLineId: serviceLineId,
    }
    this.claimService.getClaimServiceLineDetail(filterModel)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          const data = {
            claimId,
            officeAndPatientLocations: this.officeAndPatientLocations,
            ServiceCodes: this.ServiceCodes,
            ServiceCodeModifiers: this.ServiceCodeModifiers,
            claimServiceLineDetails: null
          }
          this.createServiceCodeModel(data);
        } else {
          const data = {
            claimId,
            officeAndPatientLocations: this.officeAndPatientLocations,
            ServiceCodes: this.ServiceCodes,
            ServiceCodeModifiers: this.ServiceCodeModifiers,
            claimServiceLineDetails: response.data
          }
          this.createServiceCodeModel(data);
        }
      })
  }



  BatchEDIGeneration(claimIds: string) {
    this.claimService.downloadBatchEDI837(claimIds)
      .subscribe((response: any) => {
        this.claimService.downLoadFile(response, 'text/plain', 'batchEDI.txt');
        this.onApplyFilter();
      });
  }

  BatchPaperClaimGeneration(claimIds: string) {
    const dialog = this.claimDailog.open(GenerateClaimDialogComponent, {
      data: { multipleClaimIds: claimIds }
    });
    dialog.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.checkedNonEDIClaimIds = [];
        this.onApplyFilter();
      }
    })
  }


  onToggleClaimInfoBox(claimId: number) {
    this.claimInfoBoxClaimId = this.claimInfoBoxClaimId ? null : claimId;
  }

  closeSOAPDetail() {
    this.showEncounterDetails = false;
    this.patientEncounterDetailsData = null;
  }

  getPatientEncounterDetails(patientEncounterId: number) {
    this.showEncounterDetails = true;
    this.claimService.getPatientEncounterDetails(patientEncounterId)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.patientEncounterDetailsData = response.data;
          }
        }
      )
  }


}

