import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ClaimsService } from '../claims.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-eob-payment-dialog',
  templateUrl: './eob-payment-dialog.component.html',
  styleUrls: ['./eob-payment-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EobPaymentDialogComponent implements OnInit {
  eobPaymentForm: FormGroup;
  submitted: boolean = false;
  isloadingMasterData: boolean = false;
  adjustmentGroupCodeModel: Array<any>;
  insuranceCompanies: Array<any>;
  masterPaymentType: Array<any>;
  allPatients: Array<any>;
  tempPatientName: string;
  openChargesForBalance: Array<any>;
  applyPaymentDataArray: Array<any>;
  totalPaymentAmount: number;
  totalBalanceAmount: number;

  constructor(
    private formBuilder: FormBuilder,
    private claimsService: ClaimsService,
    public dialogPopup: MatDialogRef<EobPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.adjustmentGroupCodeModel = [];
    this.insuranceCompanies = [];
    this.masterPaymentType = [];
    this.allPatients = data.allPatients || [];
    this.openChargesForBalance = [];
    this.applyPaymentDataArray = [];

    this.totalPaymentAmount = null;
    this.totalBalanceAmount = null;
  }

  ngOnInit() {
    this.initializeFormFields();
    this.fetchMasterData();
  }

  initializeFormFields() {
    const configControls = {
      'payerId': [''],
      'check': [''],
      'amount': [''],
      'paymenttype': [''],
      'paymentDate': [new Date()],
      'patient': [''],
      'dos': [''],
      'payment': [''],
      'settled': [false],
      'adjustments': this.formBuilder.array([])
    }
    this.eobPaymentForm = this.formBuilder.group(configControls);
    this.addAdjustments()
  }

  get formControls() { return this.eobPaymentForm.controls; }

  get adjustments() {
    return this.eobPaymentForm.get('adjustments') as FormArray;
  }

  addAdjustments() {
    const control = (<FormArray>this.eobPaymentForm.controls['adjustments']);
    control.push(this.formBuilder.group({
      'amountAdjusted': [''],
      'adjustmentGroupCode': [''],
      'adjustmentReasonCode': ['']
    })
    )
  }

  removeAdjustments(ix: number) {
    const control = (<FormArray>this.eobPaymentForm.controls['adjustments']);
    control.removeAt(ix)
  }

  onClose(): void {
    this.dialogPopup.close();
  }

  onPatientSelected(event: any) {
    const selectedValue = event.value;
    const select: MatSelect = event.source;
    this.tempPatientName = select.triggerValue;

    if (this.formControls['payerId'].value) {
      this.getOpenChargesForBalance(selectedValue, this.formControls['payerId'].value);
    }
  }

  onSelectServiceCode(event: any) {
    const selectedValue = event.value
    let serviceCodeObj = (this.openChargesForBalance || []).find((obj) => obj.id === selectedValue);
    this.totalPaymentAmount = serviceCodeObj && serviceCodeObj.totalAmount;
    this.totalBalanceAmount = serviceCodeObj && serviceCodeObj.balance;
  }

  calculateTotalAmount() {
    let dataArray = this.applyPaymentDataArray || [];
    let totalCalculatedAmount = 0;
    dataArray.forEach((obj) => {
      totalCalculatedAmount = totalCalculatedAmount + parseFloat(obj.claimServiceLines[0].paymentAmount || 0);
    });
    return totalCalculatedAmount;
  }

  calculateTotalAdjustmentAmount() {
    let dataArray = this.applyPaymentDataArray || [];
    let totalCalculatedAdjAmount = 0;
    dataArray.forEach((obj) => {
      (obj.claimServiceLines[0].claimServiceLineAdjustment || []).forEach(adjObj => {
        totalCalculatedAdjAmount = totalCalculatedAdjAmount + parseFloat(adjObj.amountAdjusted || 0); 
      });
    });
    return totalCalculatedAdjAmount;
  }

  onAddPaymentDetails() {

    const { payment, amount, patient, dos, settled, adjustments } = this.eobPaymentForm.value;

    if ((this.calculateTotalAmount() + parseFloat(payment || 0)) > parseFloat(amount)) {
      return false;
    }

    if (patient && dos && amount) {
      let serviceCodeObj = (this.openChargesForBalance || []).find((obj) => obj.id === dos);
      let applyPaymentData = {
        claimId: serviceCodeObj.claimId,
        markSettled: settled || false,
        claimSettledDate: format(new Date(), 'YYYY-MM-DD'),
        patientInsuranceId: serviceCodeObj.patientInsuranceId,
        patientName: this.tempPatientName,
        claimServiceLines: [{
          // patientInsuranceId: serviceCodeObj.patientInsuranceId,
          id: serviceCodeObj.id,
          totalAmount: serviceCodeObj.totalAmount,
          balance: serviceCodeObj.balance,
          paymentAmount: payment,
          serviceCode: serviceCodeObj.value,
          claimServiceLineAdjustment: (adjustments || []).map((adjObj) => {
            return {
              serviceLineId: serviceCodeObj.id,
              amountAdjusted: adjObj.amountAdjusted,
              adjustmentGroupCode: adjObj.adjustmentGroupCode,
              adjustmentReasonCode: adjObj.adjustmentReasonCode,
              patientInsuranceId: serviceCodeObj.patientInsuranceId,
            };
          }),
        }],
      };
      this.applyPaymentDataArray.push(applyPaymentData);
      this.formControls['dos'].reset();
      this.formControls['payment'].reset();
      this.formControls['settled'].reset();
      this.formControls['adjustments'].reset();

      this.formControls['dos'].markAsUntouched();
      this.formControls['payment'].markAsUntouched();

      this.totalPaymentAmount = null;
      this.totalBalanceAmount = null;
    }
  }

  onDeleteServiceCode(event, index) {
    this.applyPaymentDataArray.splice(index, 1);
  }

  onSubmit(): void {
    this.submitted = true;
    const { payerId, amount, check, paymenttype, paymentDate } = this.eobPaymentForm.value;
    let postData = {
      payerId: payerId,
      customReferenceNumber: check,
      paymentTypeId: paymenttype,
      amount: amount,
      paymentDate: format(paymentDate, 'YYYY-MM-DD'),
      claims: this.applyPaymentDataArray,
    };
    this.claimsService.submitEOBPayments(postData)
      .subscribe((response: any) => {
        this.submitted= false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.dialogPopup.close('Success');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
  }

  fetchMasterData(): void {
    // load master data
    this.isloadingMasterData = true;
    const masterData = { masterdata: "MASTERINSURANCECOMPANY,MASTERPAYMENTTYPE,MASTERADJUSTMENTGROUPCODE" };
    this.claimsService.getMasterData(masterData)
      .subscribe((response: any) => {
        this.isloadingMasterData = false;
        this.adjustmentGroupCodeModel = response.adjustmentGroupCodeModel || [];
        this.insuranceCompanies = response.insuranceCompanies || [];
        this.masterPaymentType = (response.masterPaymentType || []).filter((obj) => (obj.key.toLowerCase()).includes('cheque_ins'));
      });
  }

  getOpenChargesForBalance(patientId: number, payerId: number) {
    this.claimsService.getOpenChargesForPatient(patientId, payerId)
      .subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.openChargesForBalance = response.data || [];
        } else {
          this.openChargesForBalance = [];
        }
      });
  }



}


