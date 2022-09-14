import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomFieldModel } from '../custom-fields.model';
import { CustomFieldsService } from '../custom-fields.service';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-custom-fields-modal',
  templateUrl: './custom-fields-modal.component.html',
  styleUrls: ['./custom-fields-modal.component.css']
})
export class CustomFieldModalComponent implements OnInit {
  customFieldModel: CustomFieldModel;
  customFieldForm: FormGroup;
  submitted: boolean = false;
  // master value fields
  loadingMasterData: boolean = false;
  userRoleType: Array<any> = [];

  constructor(private formBuilder: FormBuilder,
    private customFieldDialogModalRef: MatDialogRef<CustomFieldModalComponent>,
    private customFieldService: CustomFieldsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.customFieldModel = data;
  }

  ngOnInit() {
    this.loadMasterData();
    this.customFieldForm = this.formBuilder.group({
      id: [this.customFieldModel.id],
      customLabelName: new FormControl(this.customFieldModel.customLabelName, {
        validators: [Validators.required],
        asyncValidators: [this.validateCustomFieldName.bind(this)],
        updateOn: 'blur'
      }),
      roleTypeId: [this.customFieldModel.roleTypeId],
      customLabelTypeId: [this.customFieldModel.customLabelTypeId]
    });
  }
  get formControls() { return this.customFieldForm.controls; }
  onSubmit() {
    if (this.customFieldForm.invalid) {
      return false;
    }
    this.submitted = true;
    this.customFieldModel = this.customFieldForm.value;
    this.customFieldService.create(this.customFieldModel).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        this.notifier.notify('success', response.message);
        this.closeDialog('save');
      } else {
        this.notifier.notify('error', response.message);
      }
    });
  }
  closeDialog(action: string): void {
    this.customFieldDialogModalRef.close(action);
  }
  loadMasterData() {
    // load master data
    this.loadingMasterData = true;
    const masterData = { masterdata: 'userRoleType' };
    this.customFieldService.getMasterData(masterData).subscribe((response: any) => {
      this.loadingMasterData = false;
      this.userRoleType = response.userRoleType || [];
    });
  }

  validateCustomFieldName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Label name",
        "tableName": "MASTER_CUSTOMLABEL_CUSTOMLABELNAME",
        "value": ctrl.value,
        "colmnName": "CUSTOMLABELNAME",
        "id": this.customFieldModel.id,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
        this.customFieldService.validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode !== 202)
              resolve({ uniqueName: true })
            else
              resolve();
          })
    })
  }
}
