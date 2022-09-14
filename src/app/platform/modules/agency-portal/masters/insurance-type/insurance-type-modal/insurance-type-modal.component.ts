import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InsuranceTypeModel } from '../insurance-type.model';
import { InsuranceTypeService } from '../insurance-type.service';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-insurance-type-modal',
  templateUrl: './insurance-type-modal.component.html',
  styleUrls: ['./insurance-type-modal.component.css']
})
export class InsuranceTypeModalComponent implements OnInit {
  insuranceTypeModel: InsuranceTypeModel;
  insuranceTypeForm: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private insuranceTypeDialogModalRef: MatDialogRef<InsuranceTypeModalComponent>,
    private insuranceTypeService: InsuranceTypeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.insuranceTypeModel = data;
  }

  ngOnInit() {
    this.insuranceTypeForm = this.formBuilder.group({
      id: [this.insuranceTypeModel.id],
      insuranceType: new FormControl(this.insuranceTypeModel.insuranceType, {
        validators: [Validators.required],
        asyncValidators: [this.validateInsuranceType.bind(this)],
        updateOn: 'blur'
      }),
      insuranceCode: new FormControl(this.insuranceTypeModel.insuranceCode, {
        validators: [Validators.required],
        asyncValidators: [this.validateInsuranceCode.bind(this)],
        updateOn: 'blur'
      }),
      description: [this.insuranceTypeModel.description],
      value: [this.insuranceTypeModel.insuranceType]
    });
  }
  get formControls() { return this.insuranceTypeForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.insuranceTypeForm.invalid) {
      this.submitted = false;
      return;
    }
    this.insuranceTypeModel = this.insuranceTypeForm.value;
    this.insuranceTypeService.create(this.insuranceTypeModel).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message)
        this.closeDialog('SAVE');
      } else {
        this.notifier.notify('error', response.message)
      }
    });
  }
  closeDialog(type?: string): void {
    this.insuranceTypeDialogModalRef.close(type);
  }

  validateInsuranceType(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Insurance Type",
        "tableName": "MASTER_INSURANCETYPE_INSURANCETYPE",
        "value": ctrl.value,
        "colmnName": "INSURANCETYPE",
        "id": this.insuranceTypeModel.id,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
      this.insuranceTypeService.validate(postData)
        .subscribe((response: any) => {
          if (response.statusCode !== 202)
            resolve({ uniqueName: true })
          else
            resolve();
        })
    })
  }

  validateInsuranceCode(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Insurance Code",
        "tableName": "MASTER_INSURANCETYPE_INSURANCECODE",
        "value": ctrl.value,
        "colmnName": "INSURANCECODE",
        "id": this.insuranceTypeModel.id,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
      this.insuranceTypeService.validate(postData)
        .subscribe((response: any) => {
          if (response.statusCode !== 202)
            resolve({ uniqueName: true })
          else
            resolve();
        })
    })
  }

}
