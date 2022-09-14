import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { PayrollBreaktimeService } from '../payroll-breaktime.service';
import { PayrollBreakTimeModel, PayrollBreaktimeDetailModel } from '../payroll-breaktime.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-payroll-breaktime-modal',
  templateUrl: './payroll-breaktime-modal.component.html',
  styleUrls: ['./payroll-breaktime-modal.component.css']
})
export class PayrollBreaktimeModalComponent implements OnInit {
  payrollBreaktimeForm: FormGroup;
  payrollBreaktimeModel: PayrollBreakTimeModel;
  payrollBreaktimeId: number;
  totalDataLength = 1;
  masterState: Array<any> = [];
  masterCountry: Array<any> = [];
  // defaultCountryId: number;
  // for loading ...
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private payrollBreaktimeService: PayrollBreaktimeService,
    private dialogRef: MatDialogRef<PayrollBreaktimeModalComponent>,
    private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: PayrollBreakTimeModel
  ) {
    this.payrollBreaktimeModel = data || new PayrollBreakTimeModel();
    this.payrollBreaktimeId = this.payrollBreaktimeModel.id;
  }

  ngOnInit() {
    this.initializeFormFields(this.payrollBreaktimeModel);
    this.getMasterData();
  }

  // convenience getter for easy access to form fields
  get formControls() { return this.payrollBreaktimeForm.controls; }

  get payrollBreaktimeDetails() {
    return this.payrollBreaktimeForm.get('payrollBreaktimeDetails') as FormArray;
  }

  addPayrollBreaktimeDetailsFields(payrollBreaktimeDetailObj?: PayrollBreaktimeDetailModel) {
    let payrollBreaktimeDetailArray = this.payrollBreaktimeDetails.value;
    let payrollBreaktimeDetailControls: PayrollBreaktimeDetailModel;
    if (!payrollBreaktimeDetailObj) {
      let nextStartRange = '1', nextEndRange = '2', nextNoOfUnits = 1;

      let totalDataLength = payrollBreaktimeDetailArray.length;
      if (totalDataLength > 0) {
        let rangeDiff = parseFloat(payrollBreaktimeDetailArray[totalDataLength - 1].endRange) - parseFloat(payrollBreaktimeDetailArray[totalDataLength - 1].startRange);
        nextStartRange = (parseFloat(payrollBreaktimeDetailArray[totalDataLength - 1].endRange) + 0.01).toFixed(2);
        nextEndRange = (parseFloat(payrollBreaktimeDetailArray[totalDataLength - 1].endRange) + 0.01 + rangeDiff).toFixed(2);
        nextNoOfUnits = parseInt(payrollBreaktimeDetailArray[totalDataLength - 1].numberOfBreaks, 10) + 1;
      }
      payrollBreaktimeDetailControls = {
        startRange: parseFloat(nextStartRange),
        endRange: parseFloat(nextEndRange),
        numberOfBreaks: nextNoOfUnits
      }
    } else {
      payrollBreaktimeDetailControls = payrollBreaktimeDetailObj;
    }
    this.payrollBreaktimeDetails.push(this.formBuilder.group(payrollBreaktimeDetailControls));

  }
  getMasterData() {
    let data = "MASTERSTATE,MASTERCOUNTRY"
    this.payrollBreaktimeService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterCountry = response.masterCountry != null ? response.masterCountry : [];
        // let defaultCountryObj = (response.masterCountry || []).find((obj) => (obj.countryName || '').toUpperCase() === 'US');
        // this.defaultCountryId = defaultCountryObj && defaultCountryObj.id;
        this.masterState = response.masterState != null ? response.masterState : [];
      }
    });
  }
  removePayrollBreaktimeFields(ix: number) {
    this.payrollBreaktimeDetails.removeAt(ix);
    let payrollBreaktimeDetailControls: PayrollBreaktimeDetailModel;
    let payrollBreaktimeDetailArray = this.payrollBreaktimeDetails.value;
    for (let j = ix; j < payrollBreaktimeDetailArray.length; j++) {
      let nextStartRange = parseFloat(payrollBreaktimeDetailArray[j - 1].endRange) + 0.01;
      let nextEndRange = parseFloat(payrollBreaktimeDetailArray[j - 1].endRange) + 0.01 + (parseFloat(payrollBreaktimeDetailArray[j - 1].endRange) - parseFloat(payrollBreaktimeDetailArray[j - 1].startRange));
      let nextNoOfUnits = parseInt(payrollBreaktimeDetailArray[j - 1].unit, 10) + 1;
      payrollBreaktimeDetailControls = {
        startRange: nextStartRange,
        endRange: nextEndRange,
        numberOfBreaks: nextNoOfUnits
      }
      payrollBreaktimeDetailArray[j] = payrollBreaktimeDetailControls;
    }
    this.payrollBreaktimeForm.patchValue({
      payrollBreaktimeDetails: payrollBreaktimeDetailArray
    })
  }

  initializeFormFields(payrollBreaktimeObj?: PayrollBreakTimeModel) {
    payrollBreaktimeObj = payrollBreaktimeObj || new PayrollBreakTimeModel();
    const configControls = {
      'name': new FormControl(payrollBreaktimeObj.name, {
        validators: [Validators.required],
        asyncValidators: [this.validatePayrollBreaktimeName.bind(this)],
        updateOn: 'blur'
      }),
      duration: [this.payrollBreaktimeModel.duration],
      stateId: [this.payrollBreaktimeModel.stateId],
      countryID: [this.payrollBreaktimeModel.countryID],
      'payrollBreaktimeDetails': this.formBuilder.array([]),
    }
    this.payrollBreaktimeForm = this.formBuilder.group(configControls);
    // initialize modifier modal
    if (payrollBreaktimeObj.payrollBreaktimeDetails && payrollBreaktimeObj.payrollBreaktimeDetails.length) {
      payrollBreaktimeObj.payrollBreaktimeDetails.forEach(obj => {
        this.addPayrollBreaktimeDetailsFields(obj);
      })
    } else {
      this.addPayrollBreaktimeDetailsFields();
    }
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.payrollBreaktimeForm.invalid) {
      this.submitted = false;
      return;
    }
    this.payrollBreaktimeModel = this.payrollBreaktimeForm.value;
    this.payrollBreaktimeModel.id = this.payrollBreaktimeId;
    this.payrollBreaktimeService.savePayrollBreaktime(this.payrollBreaktimeModel).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        this.notifier.notify('success', response.message)
        this.closeDialog('save');
      } else {
        this.notifier.notify('error', response.message)
      }
    })
  }

  closeDialog(action: string): void {
    this.dialogRef.close(action);
  }

  validatePayrollBreaktimeName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Break Time name",
        "tableName": "MASTER_ROUNDINGRULE_RULENAME",
        "value": ctrl.value,
        "colmnName": "RULENAME",
        "id": this.payrollBreaktimeId,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
        this.payrollBreaktimeService.validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode !== 202)
              resolve({ uniqueName: true })
            else
              resolve();
          })
    })
  }
}