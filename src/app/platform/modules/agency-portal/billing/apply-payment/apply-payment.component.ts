import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Claim, ClaimServiceLine, ClaimServiceLineAdjustment } from './apply-payment.modal';
import { ClaimsService } from '../claims/claims.service';
import { addDays, format } from 'date-fns';
import { CommonService } from '../../../core/services';
import { NotifierService } from 'angular-notifier';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-apply-payment',
  templateUrl: './apply-payment.component.html',
  styleUrls: ['./apply-payment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ApplyPaymentComponent implements OnInit {
  claimFilterForm: FormGroup;
  allClaimsWithServiceLines: Claim[];
  expandedClaimIds: Array<number>;
  expandedServiceLineIds: Array<any>;
  paymentSourceList: Array<any>;
  allPatients: Array<any>;
  patientGuarantors: Array<any>;
  masterInsuranceCompany: Array<any>;
  masterPaymentDescription: Array<any>;
  filterDescriptionTypes: Array<any>;
  masterPaymentType: Array<any>;
  filterPaymentTypes: Array<any>;
  masterTagsforPatient: Array<any>;
  claimPaymentStatus: Array<any>;
  adjustmentGroupCodeModel: Array<any>;
  paymentModeName: string;
  currentLocationId: string;
  submitted: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimsService,
    private commonService: CommonService,
    private notifierService: NotifierService
  ) {
    this.submitted = false;
    this.allClaimsWithServiceLines = [];
    this.expandedClaimIds = [];
    this.expandedServiceLineIds = [];
    this.paymentSourceList = ['Self', 'Guarantor', 'Insurance']
    this.allPatients = [];
    this.patientGuarantors = [];
    this.masterPaymentDescription = [];
    this.filterDescriptionTypes = [];
    this.masterPaymentType = [];
    this.filterPaymentTypes = [];
    this.masterTagsforPatient = [];
    this.claimPaymentStatus = [];
    this.adjustmentGroupCodeModel = [];
    this.paymentModeName = null;
    this.currentLocationId = null;
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLocationId = user.currentLocationId
      }
    })

    const currentDate = new Date();
    const previousWeekDate = addDays(currentDate, -7);

    this.claimFilterForm = this.formBuilder.group({
      source: [''],
      patientId: [''],
      payerId: [''],
      guarantorId: [''],
      paymentDescriptionId: [''],
      paymentTypeId: [''],
      amount: [''],
      CustomReferenceNumber: [''],
      paymentDate: [currentDate],
      // filters
      filterPayerId: [''],
      filterPatientIds: [''],
      filterTagIds: [''],
      filterFromDate: [previousWeekDate],
      filterToDate: [currentDate],
    });
    this.getMasterData();
    this.getPatientsList();
    this.formControlValueChanged();
  }

  get formControls() {
    return this.claimFilterForm.controls;
  }

  formControlValueChanged() {
    // value changes for source
    this.claimFilterForm.get('source').valueChanges.subscribe(
      (source: any) => {
        if ((source || '').toUpperCase() == 'SELF' || (source || '').toUpperCase() == 'GUARANTOR') {
          this.formControls.patientId.setValidators([Validators.required]);
        } else {
          this.formControls.patientId.clearValidators();
        }

        if ((source || '').toUpperCase() == 'GUARANTOR') {
          this.formControls.guarantorId.setValidators([Validators.required]);
        } else {
          this.formControls.guarantorId.clearValidators();
        }

        if ((source || '').toUpperCase() == 'INSURANCE') {
          this.formControls.payerId.setValidators([Validators.required]);
        } else {
          this.formControls.payerId.clearValidators();
        }

        this.formControls.patientId.updateValueAndValidity();
        this.formControls.guarantorId.updateValueAndValidity();
        this.formControls.payerId.updateValueAndValidity();
      });
      // value changes for payment type
      this.claimFilterForm.get('paymentTypeId').valueChanges.subscribe(
        (paymentTypeId: any) => {
          const paymentObj = (this.filterPaymentTypes || []).find(obj => obj.id == paymentTypeId);
          const typeName = (paymentObj && paymentObj.value) || '';
          if ((typeName || '').toLowerCase() === 'check' || (typeName || '').toLowerCase() === 'check ins') {
            this.formControls.CustomReferenceNumber.setValidators([Validators.required]);
          } else {
            this.formControls.CustomReferenceNumber.clearValidators();
          }
          this.formControls.CustomReferenceNumber.updateValueAndValidity();
        });
  }

  handleExpandRow(claimId: number) {
    const claimIndex = this.expandedClaimIds.findIndex(obj => obj == claimId);
    if (claimIndex > -1) {
      this.expandedClaimIds.splice(claimIndex, 1);
    } else {
      this.expandedClaimIds.push(claimId);
    }
  }

  handleExpandInnerRow(claimId: number, serviceLineObj: ClaimServiceLine, patientInsuranceId: number) {
    const claimData = this.allClaimsWithServiceLines.find(obj => obj.claimId == claimId);
    const serviceLineData = claimData && (claimData.claimServiceLines || []).find(obj => obj.id == serviceLineObj.id);
    const serviceIndex = this.expandedServiceLineIds.findIndex(obj => obj == serviceLineObj.id);
    if (serviceIndex > -1) {
      this.expandedServiceLineIds.splice(serviceIndex, 1);
      serviceLineData.claimServiceLineAdjustment = [];
    } else {
      this.expandedServiceLineIds.push(serviceLineObj.id);
      const adjustmentObj : ClaimServiceLineAdjustment = {
        serviceLineId: serviceLineObj.id,
        patientInsuranceId: patientInsuranceId,
        amountAdjusted: '',
        adjustmentGroupCode: null,
        adjustmentReasonCode: ''
      }
      serviceLineData.claimServiceLineAdjustment = [adjustmentObj]
    }
  }

  addAdjustment(event: any, claimId: number, serviceLineObj: ClaimServiceLine, patientInsuranceId: number) {
    const claimData = this.allClaimsWithServiceLines.find(obj => obj.claimId == claimId);
    const serviceLineData = claimData && (claimData.claimServiceLines || []).find(obj => obj.id == serviceLineObj.id);
    const adjustmentObj : ClaimServiceLineAdjustment = {
      serviceLineId: serviceLineObj.id,
      patientInsuranceId: patientInsuranceId,
      amountAdjusted: '',
      adjustmentGroupCode: null,
      adjustmentReasonCode: ''
    }
    serviceLineData.claimServiceLineAdjustment.push(adjustmentObj);
  }

  removeAdjustment(event: any, claimId: number, serviceLineObj: ClaimServiceLine, ix: number) {
    const claimData = this.allClaimsWithServiceLines.find(obj => obj.claimId == claimId);
    const serviceLineData = claimData && (claimData.claimServiceLines || []).find(obj => obj.id == serviceLineObj.id);
    serviceLineData.claimServiceLineAdjustment.splice(ix, 1);
  }

  onPaymentSourceChange(value: string) {
    this.onChangeSource(value);
  }

  onPatientChange(value: number) {
    this.claimFilterForm.patchValue({
      filterPatientIds: [value]
    });
    this.getPatientGuarantorList(value);
  }

  onPayerChange(value: number) {
    this.claimFilterForm.patchValue({
      filterPayerId: value
    })
  }

  onDescriptionTypeChange(event: any) {
    const source: MatSelect = event.source;
    const { triggerValue } = source;
    this.onChangeDescriptionType(triggerValue);
  }

  onPaymentTypeChange(event: any) {
    const source: MatSelect = event.source;
    const { triggerValue } = source;
    this.paymentModeName = triggerValue;
  }

  onUpdateClaimAmount(value: any, claimId: number, serviceLineId?: number) {
    // if(value.length > 1)
    //   value = parseFloat(value).toFixed();

    const paymentAmount = parseFloat(value || 0);
    const claimsData = this.allClaimsWithServiceLines.find((data) => data.claimId === claimId);
    if (claimsData) {
      let tempAmount = paymentAmount;
      if (paymentAmount > claimsData.balance) {
        tempAmount = claimsData.balance
        claimsData.totalServiceLinePayment = tempAmount;
      }
      let total = 0;
      claimsData.claimServiceLines.forEach((obj, index) => {
        if (serviceLineId) {
          if (serviceLineId != obj.id || (serviceLineId == obj.id && paymentAmount > obj.balance))
            tempAmount = obj.paymentAmount || 0;
          else
            tempAmount = paymentAmount;
        }

        if (tempAmount <= obj.balance) {
          obj.paymentAmount = tempAmount;
          tempAmount = 0;
        } else {
          obj.paymentAmount = obj.balance;
          tempAmount = tempAmount - obj.balance;
        }
        total = total + obj.paymentAmount;
      })
      claimsData.totalServiceLinePayment = total;
      claimsData.isFullPayment = (claimsData.totalServiceLinePayment == claimsData.balance) ? true : false;
    }
  }

  onCheckFullPaymentClaim(event: any, claimObj?: Claim) {
    const isChecked = event.checked;
    if (claimObj) {
      let claimData = this.allClaimsWithServiceLines.find(obj => obj.claimId == claimObj.claimId);
      const balance = isChecked ? claimData.balance : 0;
      this.onUpdateClaimAmount(balance, claimData.claimId);
      claimData.isFullPayment = isChecked ? true : false;
    } else {
      this.allClaimsWithServiceLines.forEach(obj => {
        const balance = isChecked ? obj.balance : 0;
        this.onUpdateClaimAmount(balance, obj.claimId);
        obj.isFullPayment = isChecked ? true : false;
      })
    }
  }

  onCheckApplyPaymentClaim(event: any, claimObj?: Claim) {
    const isChecked = event.checked;
    if (claimObj) {
      let claimData = this.allClaimsWithServiceLines.find(obj => obj.claimId == claimObj.claimId);
      claimData.isApplyPayment = isChecked ? true : false;
    } else {
      this.allClaimsWithServiceLines.forEach(obj => {
        obj.isApplyPayment = isChecked ? true : false;
      })
    }
  }

  get isAllCheckedApplyPayment() {
    const checkedApplyPayments = this.allClaimsWithServiceLines.filter(obj => obj.isApplyPayment);
    return this.allClaimsWithServiceLines.length && checkedApplyPayments.length == this.allClaimsWithServiceLines.length
  }

  get isAllCheckedFullPayment() {
    const checkedFullPayments = this.allClaimsWithServiceLines.filter(obj => obj.isFullPayment);
    return this.allClaimsWithServiceLines.length && checkedFullPayments.length == this.allClaimsWithServiceLines.length
  }

  get checkedApplyPaymentLength() {
    const checkedApplyPayments = this.allClaimsWithServiceLines.filter(obj => obj.isApplyPayment);
    return checkedApplyPayments.length;
  }

  onClearFilter(): void {
    this.claimFilterForm.reset();
    const currentDate = new Date();
    const previousWeekDate = addDays(currentDate, -7);
    this.claimFilterForm.patchValue({
      filterFromDate: previousWeekDate,
      filterToDate: currentDate,
      paymentDate: currentDate
    })
    this.onApplyFilter();
  }

  onApplyFilter(): void {
    const formValues = this.claimFilterForm.value;

    const { filterPayerId, filterPatientIds, filterTagIds, filterFromDate, filterToDate } = formValues;
    const customFilterModel = {
      payerIds: filterPayerId,
      patientIds: filterPatientIds,
      tags: filterTagIds,
      fromDate: format(filterFromDate, 'YYYY-MM-DD'),
      toDate: format(filterToDate, 'YYYY-MM-DD'),
      locationId: this.currentLocationId
    }

    this.claimService.applyPaymentGetAllClaims(customFilterModel)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.expandedClaimIds = [];
          this.allClaimsWithServiceLines = [];
        }
        else {
          this.allClaimsWithServiceLines = response.data.claims || [];
          this.expandedClaimIds = this.allClaimsWithServiceLines.map(obj => obj.claimId);
        }
      })
  }

  onChangeSource(source: string) {
    let paymentTypes = this.masterPaymentType || [];
    if ((source || '').toLowerCase() == 'insurance') {
      this.filterPaymentTypes = paymentTypes.filter((obj) => obj.associatedEntity.toLowerCase() === 'insurance');
    } else {
      this.filterPaymentTypes = paymentTypes.filter((obj) => obj.associatedEntity.toLowerCase() !== 'insurance');
    }
    let descriptionTypes = this.masterPaymentDescription || [];
    if ((source || '').toLowerCase() == 'insurance') {
      this.filterDescriptionTypes = descriptionTypes;
    } else {
      this.filterDescriptionTypes = descriptionTypes.filter((obj) => !(obj.key.toLowerCase()).includes('adjustment'));
    }
  }

  onChangeDescriptionType(descriptionType: string) {
    const { source } = this.claimFilterForm.value;
    if ((source || '').toLowerCase() == 'insurance') {
      let paymentTypes = this.masterPaymentType || [];
      if ((descriptionType || '').toLowerCase() === 'adjustment') {
        this.filterPaymentTypes = paymentTypes.filter((obj) => (obj.key.toLowerCase()).includes('adjustment'));
      } else {
        this.filterPaymentTypes = paymentTypes.filter((obj) => !(obj.key.toLowerCase()).includes('adjustment') && obj.associatedEntity.toLowerCase() === 'insurance');
      }
    }
  }

  onSubmit() {
    if (this.claimFilterForm.invalid) {
      return null;
    }

    let totalPaymentData = 0;
    const filteredClaimsWithServiceLines = this.allClaimsWithServiceLines.filter(obj=> obj.isApplyPayment);
    filteredClaimsWithServiceLines.forEach((obj) => {
      totalPaymentData = totalPaymentData + obj.totalServiceLinePayment;
    });
    const { source, patientId, payerId, guarantorId, CustomReferenceNumber, paymentDescriptionId, paymentTypeId, amount, paymentDate } = this.claimFilterForm.value;
    if (parseFloat((totalPaymentData || 0).toString()) != parseFloat(amount || 0)) {
      this.notifierService.notify('warning', 'Total claims payment should be equal to the apply payment amount.');
      return null;
    }
    const postData = {
      "PaymentTypeId": paymentTypeId,
      "DescriptionTypeId": paymentDescriptionId,
      "CustomReferenceNumber": CustomReferenceNumber || null,
      "PayerId": (source || '').toUpperCase() == 'INSURANCE' ? payerId : null,
      "PatientId": (source || '').toUpperCase() == 'SELF' || (source || '').toUpperCase() == 'GUARANTOR' ? patientId : null,
      "GuarantorId": (source || '').toUpperCase() == 'GUARANTOR' ? guarantorId : null,
      "Amount": amount,
      "PaymentDate": format(paymentDate, 'YYYY-MM-DD'),
      "Claims": filteredClaimsWithServiceLines
    };
    this.submitted = true;
    this.claimService.applyPayment(postData)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.submitted = false;
          this.notifierService.notify('error', response.message);
        }
        else {
          this.submitted = false;
          this.notifierService.notify('success', response.message);
          this.onClearFilter();
        }
      })
  }


  getPatientsList() {
    this.claimService.getStaffAndPatientByLocation(this.currentLocationId.toString())
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.allPatients = [];
        }
        else {
          this.allPatients = response.data.patients || [];
        }
      })
  }

  getPatientGuarantorList(patientId: number) {
    this.claimService.getPatientGuarantor(patientId)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.patientGuarantors = [];
        }
        else {
          this.patientGuarantors = response.data || [];
        }
      })
  }

  getMasterData() {
    const masterData = { masterdata: 'MASTERINSURANCECOMPANY,MASTERPAYMENTTYPE,MASTERTAGSFORPATIENT,MASTERPAYMENTDESCRIPTION,MASTERADJUSTMENTGROUPCODE,CLAIMPAYMENTSTATUS' }
    this.claimService.getMasterData(masterData)
      .subscribe((response: any) => {
        if (response) {
          this.masterInsuranceCompany = response.insuranceCompanies || [];
          this.masterPaymentDescription = response.masterPaymentDescription || [];
          this.masterPaymentType = response.masterPaymentType || [];
          this.masterTagsforPatient = response.masterTagsforPatient || [];
          this.claimPaymentStatus = response.claimPaymentStatus || [];
          this.adjustmentGroupCodeModel = response.adjustmentGroupCodeModel || [];
        } else {
          this.masterInsuranceCompany = [];
          this.masterPaymentDescription = [];
          this.masterPaymentType = [];
          this.masterTagsforPatient = [];
          this.claimPaymentStatus = [];
          this.adjustmentGroupCodeModel = [];
        }
      })
  }



}
