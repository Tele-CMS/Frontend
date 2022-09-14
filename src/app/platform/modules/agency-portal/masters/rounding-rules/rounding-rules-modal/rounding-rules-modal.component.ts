import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { RoundingRuleModel, RoundingRuleDetail } from '../rounding-rules.model';
import { RoundingRulesService } from '../rounding-rules.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-rounding-rules-modal',
  templateUrl: './rounding-rules-modal.component.html',
  styleUrls: ['./rounding-rules-modal.component.css']
})
export class RoundingRulesModalComponent implements OnInit {
  roundingRuleForm: FormGroup;
  roundingRuleModel: RoundingRuleModel;
  roundingRuleId: number;
  totalDataLength = 1;
  // for loading ...
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private roundingRuleService: RoundingRulesService,
    private dialogRef: MatDialogRef<RoundingRulesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoundingRuleModel,
    private notifier: NotifierService
  ) {
    this.roundingRuleModel = data || new RoundingRuleModel();
    this.roundingRuleId = this.roundingRuleModel.id;
  }

  ngOnInit() {
    this.initializeFormFields(this.roundingRuleModel);
  }

  // convenience getter for easy access to form fields
  get formControls() { return this.roundingRuleForm.controls; }

  get roundingRuleDetail() {
    return this.roundingRuleForm.get('roundingRuleDetail') as FormArray;
  }

  addRoundingRuleDetailFields(RoundingRuleDetailObj?: RoundingRuleDetail) {
    let roundingRuleDetailArray = this.roundingRuleDetail.value;
    let RoundingRuleDetailControls: RoundingRuleDetail;
    if (!RoundingRuleDetailObj) {
      let nextStartRange = 0.01, nextEndRange = 1.00, nextNoOfUnits = 1;

      let totalDataLength = roundingRuleDetailArray.length;
      if (totalDataLength > 0) {
        let rangeDiff = parseFloat(roundingRuleDetailArray[totalDataLength - 1].endRange) - parseFloat(roundingRuleDetailArray[totalDataLength - 1].startRange);
        nextStartRange = parseFloat(roundingRuleDetailArray[totalDataLength - 1].endRange) + 0.01;
        nextEndRange = parseFloat(roundingRuleDetailArray[totalDataLength - 1].endRange) + 0.01 + rangeDiff;
        nextNoOfUnits = parseInt(roundingRuleDetailArray[totalDataLength - 1].unit, 10) + 1;
      }
      RoundingRuleDetailControls = {
        id: 0,
        startRange: parseFloat((nextStartRange).toFixed(2)),
        endRange: parseFloat((nextEndRange).toFixed(2)),
        unit: nextNoOfUnits
      }
    } else {
      RoundingRuleDetailControls = RoundingRuleDetailObj;
    }
    this.roundingRuleDetail.push(this.formBuilder.group(RoundingRuleDetailControls));

  }

  removeRoundingRuleFields(ix: number) {
    this.roundingRuleDetail.removeAt(ix);
    let RoundingRuleDetailControls: RoundingRuleDetail;
    let roundingRuleDetailArray = this.roundingRuleDetail.value;
    for (let j = ix; j < roundingRuleDetailArray.length; j++) {
      let nextStartRange = parseFloat(roundingRuleDetailArray[j - 1].endRange) + 0.01;
      let nextEndRange = parseFloat(roundingRuleDetailArray[j - 1].endRange) + 0.01 + (parseFloat(roundingRuleDetailArray[j - 1].endRange) - parseFloat(roundingRuleDetailArray[j - 1].startRange));
      let nextNoOfUnits = parseInt(roundingRuleDetailArray[j - 1].unit, 10) + 1;
      RoundingRuleDetailControls = {
        id: roundingRuleDetailArray[j].id || 0,
        startRange: parseFloat((nextStartRange).toFixed(2)),
        endRange: parseFloat((nextEndRange).toFixed(2)),
        unit: nextNoOfUnits
      }
      roundingRuleDetailArray[j] = RoundingRuleDetailControls;
    }
    this.roundingRuleForm.patchValue({
      roundingRuleDetail: roundingRuleDetailArray
    })
  }

  initializeFormFields(roundingRuleObj?: RoundingRuleModel) {
    roundingRuleObj = roundingRuleObj || new RoundingRuleModel();
    const configControls = {
      'ruleName': new FormControl(roundingRuleObj.ruleName, {
        validators: [Validators.required],
        asyncValidators: [this.validateRoundingRuleName.bind(this)],
        updateOn: 'blur'
      }),
      'roundingRuleDetail': this.formBuilder.array([]),
    }
    this.roundingRuleForm = this.formBuilder.group(configControls);
    // initialize modifier modal
    if (roundingRuleObj.roundingRuleDetail && roundingRuleObj.roundingRuleDetail.length) {
      roundingRuleObj.roundingRuleDetail.forEach(obj => {
        this.addRoundingRuleDetailFields(obj);
      })
    } else {
      this.addRoundingRuleDetailFields();
    }
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.roundingRuleForm.invalid) {
      this.submitted = false;
      return;
    }

    const { roundingRuleDetail } = this.roundingRuleForm.value;

    (this.roundingRuleModel.roundingRuleDetail || []).forEach((obj) => {
      if (roundingRuleDetail.findIndex(y => (y.id == obj.id)) == -1) {
        obj.isDeleted = true;
        roundingRuleDetail.push(obj);
      }
    })
    const postData = this.roundingRuleForm.value;
    postData.id = this.roundingRuleId;

    this.roundingRuleService.create(postData).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        this.notifier.notify('success', response.message);
        this.dialogRef.close('SAVE');
      } else {
        this.notifier.notify('error', response.message);
      }
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  validateRoundingRuleName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Rule name",
        "tableName": "MASTER_ROUNDINGRULE_RULENAME",
        "value": ctrl.value,
        "colmnName": "RULENAME",
        "id": this.roundingRuleId,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
        this.roundingRuleService.validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode !== 202)
              resolve({ uniqueName: true })
            else
              resolve();
          })
    })
  }
}