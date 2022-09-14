
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { addDays, format } from 'date-fns';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { ClaimsService } from '../claims/claims.service';
import { Claim } from '../claims/claims.model';
import { MatPaginator, MatSort } from '@angular/material';
import { merge } from 'rxjs';

class CustomFilterModel extends FilterModel {
  fromDate: string = '';
  toDate: string = '';
  claimStatusId: string = '';
  payerName: string = '';
  claimId: string = '';
  patientIds: string = '';
}

@Component({
  selector: 'app-settled',
  templateUrl: './settled.component.html',
  styleUrls: ['./settled.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SettledComponent implements OnInit {
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
  isLoadedPayerServiceCodeAndModifiers: boolean = false;
  isLoadedPatientLocations: boolean = false;
  claimInfoBoxClaimId: number;
  showEncounterDetails: boolean;
  patientEncounterDetailsData: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimsService,
  ) {
    this.customFilterModel = new CustomFilterModel();
    this.allClaimsWithServiceLines = [];
    this.expandedClaimIds = [];
    this.allPatients = [];
    this.metaData = {};
    // service code dropdowns
    this.officeAndPatientLocations = [];
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
      claimStatusId: 4,
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
        this.claimInfoBoxClaimId = null;
        this.showEncounterDetails = false;
        this.patientEncounterDetailsData = null;
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

