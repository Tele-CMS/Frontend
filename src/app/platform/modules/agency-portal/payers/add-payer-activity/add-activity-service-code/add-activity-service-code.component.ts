import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PayerActivityServiceCodeModel, ActivityCodeModifierUpdateModel } from '../../payers.model';
import { PayersService } from '../../payers.service';
import { ResponseModel } from '../../../../core/modals/common-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-activity-service-code',
  templateUrl: './add-activity-service-code.component.html',
  styleUrls: ['./add-activity-service-code.component.css']
})
export class AddActivityServiceCodeComponent implements OnInit {
  activityServiceCodeForm: FormGroup;
  activityServiceCodeModel: PayerActivityServiceCodeModel;
  activityCodeModifierUpdateModel: ActivityCodeModifierUpdateModel
  activityServiceCodes: any = []
  payerModifierModel: any = []
  payerId: number;
  activityId: number;
  activityServiceCodeId: number;
  submitted: boolean = false;
  payerServiceCodeId: number;
  masterUnitType: Array<any> = [];
  headerText:string='';
  isEdit:boolean=false;
  constructor(private actSCDialogModalRef: MatDialogRef<AddActivityServiceCodeComponent>,
    private formBuilder: FormBuilder,
    private payerService: PayersService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.activityServiceCodeModel = this.data.actServiceCode;
    if(this.activityServiceCodeModel.id!=undefined && this.activityServiceCodeModel.id>0)
    this.isEdit=true;
    this.payerId = this.data.payerId;
    this.activityId = this.data.activityId;
    this.activityServiceCodeId = this.data.activityServiceCodeId;
    this.payerServiceCodeId = this.data.payerServiceCodeId;
    if(this.payerServiceCodeId!=undefined && this.payerServiceCodeId>0)
    this.headerText="Edit Service Code";
    else this.headerText="Add Service Code";
  }
  ngOnInit() {
    this.activityServiceCodeForm = this.formBuilder.group({
      id: [this.activityServiceCodeModel.id!=undefined?this.activityServiceCodeId:null],
      description: [this.activityServiceCodeModel.description],
      unitDuration: [this.activityServiceCodeModel.unitDuration],
      unitType: [this.activityServiceCodeModel.unitType],
      ratePerUnit: [this.activityServiceCodeModel.ratePerUnit],
      isBillable: [this.activityServiceCodeModel.isBillable],
      ruleID: [this.activityServiceCodeModel.ruleID],
      isRequiredAuthorization: [this.activityServiceCodeModel.isRequiredAuthorization],
      serviceCodeId: [this.activityServiceCodeModel.serviceCodeId],
      payerServiceCodeId: [this.payerServiceCodeId ? this.payerServiceCodeId : this.activityServiceCodeModel.payerServiceCodeId],
      payerId: [(this.activityServiceCodeModel.payerId || this.payerId)],
      modifier1: [(this.activityServiceCodeModel.modifier1)],
      modifier2: [(this.activityServiceCodeModel.modifier2)],
      modifier3: [(this.activityServiceCodeModel.modifier3)],
      modifier4: [(this.activityServiceCodeModel.modifier4)],

    });
    if(!this.isEdit)
      this.getServiceCodesForActivity();
    this.getMasterData();
    // if (this.payerServiceCodeId)
    //   this.updateValue(this.payerServiceCodeId);
  }
  get formControls() {
    return this.activityServiceCodeForm.controls;
  }
  getMasterData() {
    let data = "masterunittype"
    this.payerService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterUnitType = response.masterUnitType != null ? response.masterUnitType : [];
      }
    });
  }
  updateValue(payerServiceCodeId: number) {
    this.payerService.getPayerServiceCodeById(payerServiceCodeId).subscribe((response: any) => {
      let serviceCodeObj: any;
      if (response != null && response.data != null) {
        serviceCodeObj = response.data;
        this.payerModifierModel = response.data.payerModifierModel!=undefined && response.data.payerModifierModel!=null && response.data.payerModifierModel.length>0?response.data.payerModifierModel.filter(x=>x.key=="PSCM"):[];
      }
      if (serviceCodeObj != null) {
        this.activityServiceCodeForm.patchValue({ description: serviceCodeObj.description, unitDuration: serviceCodeObj.unitDuration, unitType: serviceCodeObj.unitType, isBillable: serviceCodeObj.isBillable, ratePerUnit: serviceCodeObj.ratePerUnit });
      }
    });
  }
  getServiceCodesForActivity() {
    this.payerService.getExcludedServiceCodesForActivity(this.payerId, this.activityId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.statusCode==200)
        this.activityServiceCodes = response.data;
        else this.activityServiceCodes = [];

    });
  }
  onSubmit() {
    // Please update this code as unnecssary code has been written here
    if (this.activityServiceCodeForm.invalid) {
      return
    }
    this.submitted = true;
    if (this.payerServiceCodeId) {
      this.activityCodeModifierUpdateModel = this.activityServiceCodeForm.value;
      let postData = this.activityCodeModifierUpdateModel;
      postData = {
        'id': this.activityCodeModifierUpdateModel.id,
        'ratePerUnit': this.activityCodeModifierUpdateModel.ratePerUnit ? this.activityCodeModifierUpdateModel.ratePerUnit : null,
        'modifier1': this.activityCodeModifierUpdateModel.modifier1 ? this.activityCodeModifierUpdateModel.modifier1 : null,
        'modifier2': this.activityCodeModifierUpdateModel.modifier2 ? this.activityCodeModifierUpdateModel.modifier2 : null,
        'modifier3': this.activityCodeModifierUpdateModel.modifier3 ? this.activityCodeModifierUpdateModel.modifier3 : null,
        'modifier4': this.activityCodeModifierUpdateModel.modifier4 ? this.activityCodeModifierUpdateModel.modifier4 : null,
      };
      this.payerService.updatePayerActivityModifiers(postData).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode === 200) {
          this.notifier.notify('success', response.message);
          this.closeDialog('SAVE');
        } else {
          this.notifier.notify('error', response.message);
        }
      });
    } else {
      this.activityServiceCodeModel = this.activityServiceCodeForm.value;
      let formData = this.activityServiceCodeModel;
      formData = {
        'id': 0,
        'appointmentTypeId': this.activityId,
        'payerId': this.payerId,
        'payerServiceCodeId': this.payerServiceCodeId ? this.payerServiceCodeId : this.activityServiceCodeModel.payerServiceCodeId,
        'modifier1': this.activityServiceCodeModel.modifier1 ? this.activityServiceCodeModel.modifier1 : null,
        'modifier2': this.activityServiceCodeModel.modifier2 ? this.activityServiceCodeModel.modifier2 : null,
        'modifier3': this.activityServiceCodeModel.modifier3 ? this.activityServiceCodeModel.modifier3 : null,
        'modifier4': this.activityServiceCodeModel.modifier4 ? this.activityServiceCodeModel.modifier4 : null,
        'ratePerUnit': this.activityServiceCodeModel.ratePerUnit,
      };
      this.payerService.savePayerActivityCode(formData).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode === 200) {
          this.notifier.notify('success', response.message);
          this.closeDialog('SAVE');
        } else {
          this.notifier.notify('error', response.message);
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.actSCDialogModalRef.close(action);
  }
}
