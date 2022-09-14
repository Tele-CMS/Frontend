import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormBuilder, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ServiceCodeService } from '../service-code.service';
import { ServiceCodeModal, Modifier } from '../service-code.modal';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-service-code-modal',
  templateUrl: './service-code-modal.component.html',
  styleUrls: ['./service-code-modal.component.css']
})
export class ServiceCodeModalComponent implements OnInit {
  serviceCodeForm: FormGroup;
  serviceCodeModal: ServiceCodeModal;
  serviceCodeId: number;
  // for loading ...
  loadingMasterData: boolean = false;
  submitted: boolean = false;
  // master value fields
  masterUnitType: Array<any> = [];
  masterRoundingRules: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private serviceCodesService: ServiceCodeService,
    private dialogRef: MatDialogRef<ServiceCodeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceCodeModal,
    private notifier: NotifierService
  ) {
    this.serviceCodeModal = data || new ServiceCodeModal();
    this.serviceCodeId = this.serviceCodeModal.id;
  }

  ngOnInit() {
    this.loadMasterData();
    this.initializeFormFields(this.serviceCodeModal);
  }

  // convenience getter for easy access to form fields
  get f() { return this.serviceCodeForm.controls; }

  get modifierModel() {
    return this.serviceCodeForm.get('modifierModel') as FormArray;
  }

  addModifierFields(modifierObj?: Modifier) {
    const modifierControls = modifierObj || new Modifier();
    this.modifierModel.push(this.formBuilder.group(modifierControls));
  }

  removeModifierFields(ix: number) {
    this.modifierModel.removeAt(ix);
  }

  initializeFormFields(serviceCodeObj?: ServiceCodeModal) {
    serviceCodeObj = serviceCodeObj || new ServiceCodeModal();
    const configControls = {
      'serviceCode': new FormControl(serviceCodeObj.serviceCode, {
        validators: [Validators.required],
        asyncValidators: [this.validateServiceCodeName.bind(this)],
        updateOn: 'blur'
      }),
      'ruleID': [serviceCodeObj.ruleID, Validators.required],
      'unitDuration': [serviceCodeObj.unitDuration, Validators.required],
      'unitTypeID': [serviceCodeObj.unitTypeID, Validators.required],
      'ratePerUnit': [serviceCodeObj.ratePerUnit, Validators.required],
      'description': [serviceCodeObj.description, Validators.required],
      'modifierModel': this.formBuilder.array([]),
      'isBillable': [serviceCodeObj.isBillable],
      'isRequiredAuthorization': [serviceCodeObj.isRequiredAuthorization],
    }
    this.serviceCodeForm = this.formBuilder.group(configControls);
    // initialize modifier modal
    if (serviceCodeObj.modifierModel && serviceCodeObj.modifierModel.length) {
      serviceCodeObj.modifierModel.forEach(obj => {
        this.addModifierFields(obj);
      })
    } else {
      this.addModifierFields();
    }
  }

  loadMasterData() {
    // load master data
    this.loadingMasterData = true;
    const masterData = { masterdata: 'masterUnitType,masterRoundingRules' };
    this.serviceCodesService.getMasterData(masterData).subscribe((response: any) => {
      this.loadingMasterData = false;
      this.masterUnitType = response.masterUnitType || [];
      this.masterRoundingRules = response.masterRoundingRules || [];
    });
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.serviceCodeForm.invalid) {
      this.submitted = false;
      return;
    }
    this.serviceCodeModal = this.serviceCodeForm.value;
    this.serviceCodeModal.id = this.serviceCodeId;
    this.serviceCodesService.create(this.serviceCodeModal).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        this.notifier.notify('success', response.message)
        this.dialogRef.close('SAVE');
      } else {
        this.notifier.notify('error', response.message)
      }
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  validateServiceCodeName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Code",
        "tableName": "MASTER_SERVICECODE_SERVICECODE",
        "value": ctrl.value,
        "colmnName": "SERVICECODE",
        "id": this.serviceCodeId,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
      this.serviceCodesService.validate(postData)
        .subscribe((response: any) => {
          if (response.statusCode !== 202)
            resolve({ uniqueName: true })
          else
            resolve();
        })
    })
  }
}

