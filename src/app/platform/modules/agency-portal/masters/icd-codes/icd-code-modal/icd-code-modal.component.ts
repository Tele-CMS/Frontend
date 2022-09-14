import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { ICDCodesModel } from '../icd-codes.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ICDCodeService } from '../icd-code.service';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-icd-code-modal',
  templateUrl: './icd-code-modal.component.html',
  styleUrls: ['./icd-code-modal.component.css']
})
export class IcdCodeModalComponent implements OnInit {
  icdCodesModel: ICDCodesModel;
  icdCodeForm: FormGroup;

  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private icdCodeDialogModalRef: MatDialogRef<IcdCodeModalComponent>,
    private icdCodeService: ICDCodeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.icdCodesModel = data;
  }

  ngOnInit() {
    this.icdCodeForm = this.formBuilder.group({
      id: [this.icdCodesModel.id],
      code: new FormControl(this.icdCodesModel.code, {
        validators: [Validators.required],
        asyncValidators: [this.validateICDCodeName.bind(this)],
        updateOn: 'blur'
      }),
      description: [this.icdCodesModel.description]
    });
  }
  get formControls() { return this.icdCodeForm.controls; }
  onSubmit() {
    if (!this.icdCodeForm.invalid) {
      this.submitted = true;
      this.icdCodesModel = this.icdCodeForm.value;
      this.icdCodeService.create(this.icdCodesModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.closeDialog('save');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.icdCodeDialogModalRef.close(action);
  }

  validateICDCodeName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "code",
        "tableName": "MASTER_DIAGNOSIS_CODE",
        "value": ctrl.value,
        "colmnName": "CODE",
        "id": this.icdCodesModel.id,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
      this.icdCodeService.validate(postData)
        .subscribe((response: any) => {
          if (response.statusCode !== 202)
            resolve({ uniqueName: true })
          else
            resolve();
        })
    })
  }
}
