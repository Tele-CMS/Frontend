import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PayerListingComponent } from '../../payer-listing/payer-listing.component';
import { NotifierService } from 'angular-notifier';
import { PayerServiceCodeWithModifierModel, PayerServiceCodeModifierModel } from '../../payers.model';
import { PayersService } from '../../payers.service';
import { ResponseModel } from '../../../../core/modals/common-model';

@Component({
  selector: 'app-payer-service-code-modal',
  templateUrl: './payer-service-code-modal.component.html',
  styleUrls: ['./payer-service-code-modal.component.css']
})
export class PayerServiceCodeModalComponent implements OnInit {
  pscCodesModel: PayerServiceCodeWithModifierModel;
  pscCodeForm: FormGroup;
  headerText: string = "";
  submitted: boolean = false;
  masterServiceCode: any[];
  masterRoundingRules: any[];
  masterUnitType: any[];
  masterModifers: any[] = [];
  isUpdate: boolean = false;
  payerId: number;
  constructor(private formBuilder: FormBuilder,
    private pscDialogModalRef: MatDialogRef<PayerServiceCodeModalComponent>,
    private payersService: PayersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.pscCodesModel = data.payerServiceCode;
    this.payerId = data.payerId;
    if (this.pscCodesModel != undefined && this.pscCodesModel.id != undefined && this.pscCodesModel.id > 0) {
      this.isUpdate = true;
      this.headerText = "Edit Service Code";
    }
    else {
      this.headerText = "Add Service Code";
    }
  }

  ngOnInit() {
    this.getMasterData();
    this.pscCodeForm = this.formBuilder.group({
      id: [this.pscCodesModel.id],
      description: [this.pscCodesModel.description],
      unitDuration: [this.pscCodesModel.unitDuration],
      unitType: [this.pscCodesModel.unitType],
      ratePerUnit: [this.pscCodesModel.ratePerUnit],
      isBillable: [this.pscCodesModel.isBillable],
      ruleID: [this.pscCodesModel.ruleID],
      isRequiredAuthorization: [this.pscCodesModel.isRequiredAuthorization],
      effectiveDate: [this.pscCodesModel.effectiveDate],
      newRatePerUnit: [this.pscCodesModel.newRatePerUnit],
      serviceCodeId: [this.pscCodesModel.serviceCodeId],
      payerId: [(this.pscCodesModel.payerId || this.payerId)],
      payerModifierModel: this.formBuilder.array([]),
    });
    this.createModiferArray(this.pscCodesModel.payerModifierModel);
    this.masterModifers = this.pscCodesModel.payerModifierModel;
    this.getUnMappedCodesForPayer();
  }
  get formControls() {
    return this.pscCodeForm.controls;
  }
  get modifiers() {
    return this.pscCodeForm.get("payerModifierModel") as FormArray;
  }
  getMasterData() {
    let data = "masterRoundingRules,masterUnitType,masterServiceCode";
    this.payersService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        //this.masterServiceCode = response.masterServiceCode != null ? response.masterServiceCode : [];
        this.masterRoundingRules = response.masterRoundingRules != null ? response.masterRoundingRules : [];
        this.masterUnitType = response.masterUnitType != null ? response.masterUnitType : [];
      }
    });
  }
  getUnMappedCodesForPayer()   //Get all codes which are not linked with Payer
  {
    this.payersService.getUnMappedCodesForPayer(this.payerId).subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {
        this.masterServiceCode = response.data;
      }
    });
  }
  getMasterServiceCodeById(serviceCodeId: number) {
    this.payersService.getMasterServiceCodeById(serviceCodeId).subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {
        this.pscCodesModel = {
          description: response.data.description,
          unitDuration: response.data.unitDuration,
          unitType: response.data.unitTypeID,
          ratePerUnit: response.data.ratePerUnit,
          isBillable: response.data.isBillable,
          ruleID: response.data.ruleID,
          isRequiredAuthorization: response.data.isRequiredAuthorization,
          payerId: this.payerId,
          serviceCodeId: response.data.id,
          payerModifierModel: response.data.modifierModel.filter(x => x.key == "PSCM")
        }
        this.masterModifers = response.data.modifierModel.map(x => {
          let a = {
            id: x.modifierID,
            payerServiceCodeId: 0,
            modifier: x.modifier,
            rate: x.rate,
            key: x.key,
            isUsedModifier: x.isUsedModifier,
            value: x.modifier
          }
          return a;
        });
      }
      this.pscCodeForm.patchValue(this.pscCodesModel);
    });
  }
  closeDialog(action: string): void {
    this.pscDialogModalRef.close(action);
  }
  onSubmit() {
    let data = this.pscCodeForm.value;
    if (!this.checkIfArrayIsUnique(data.payerModifierModel)) {
      this.notifier.notify('error', "All modifiers should be different");
      return
    }
    if (!this.pscCodeForm.invalid) {
      this.submitted = true;
      this.payersService.savePayerServiceCode(data).subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null && response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.pscDialogModalRef.close("save");
        }
        else
          this.notifier.notify('error', response.message);
      })
    }
  }
  addRate(index:number,event:any)
  {
    let rate=this.masterModifers.find(x=>x.modifier==event.value).rate;
    let mod = this.modifiers.get([index]) as FormGroup;
    mod.controls["rate"].setValue(rate);
  }
  checkIfArrayIsUnique(arr): boolean {
    let isSame=true;
    arr.forEach(element => {
      let ele=arr.filter(x=>x.modifier==element.modifier);
      if(ele!=undefined && ele!=null && ele.length>1)
      {
        isSame=false;
      }
    });
    return isSame;
  }
  createModiferArray(payerModifers: Array<PayerServiceCodeModifierModel>) {
    if (payerModifers != null && payerModifers.length > 0) {
      payerModifers.forEach(x => {
        if (x.payerServiceCodeId != null && x.payerServiceCodeId > 0)
          this.modifiers.push(this.createModiferControl(x));
      });
    }
    else
      this.modifiers.push(this.createModiferControl(new PayerServiceCodeModifierModel()));
  }
  createModiferControl(payerServiceCodeModifier: PayerServiceCodeModifierModel): FormGroup {
    return this.formBuilder.group({
      id: payerServiceCodeModifier.id,
      payerServiceCodeId: payerServiceCodeModifier.payerServiceCodeId || this.pscCodesModel.id,
      modifier: payerServiceCodeModifier.modifier,
      rate: payerServiceCodeModifier.rate,
      isUsedModifier: payerServiceCodeModifier.isUsedModifier,
    });
  }
  addModifier() {
    this.modifiers.push(this.createModiferControl(new PayerServiceCodeModifierModel()));
  }
  removeModifier(index: number) {
    this.modifiers.removeAt(index);
  }
}
