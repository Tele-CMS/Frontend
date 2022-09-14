import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { CategoryCodeModel } from '../../documents/document.model';
import { DocumentService } from '../../documents/document.service';

@Component({
  selector: 'app-category-code-modal',
  templateUrl: './category-code-modal.component.html',
  styleUrls: ['./category-code-modal.component.css']
})
export class CategoryCodeModalComponent implements OnInit {
  categoryCodesModel: CategoryCodeModel;
  categoryCodeForm: FormGroup;
  categoryId: number;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private categoryCodeDialogModalRef: MatDialogRef<CategoryCodeModalComponent>,
    private categoryCodeService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.categoryCodesModel = data.categoryCodeModel;
    this.categoryId = data.categoryId;
  }

  ngOnInit() {
    if (!this.categoryCodesModel) {
      this.categoryCodesModel = new CategoryCodeModel();
    }
    this.categoryCodeForm = this.formBuilder.group({
      id: [this.categoryCodesModel.id],
      codeName: new FormControl(this.categoryCodesModel.codeName, {
        validators: [Validators.required],
        asyncValidators: [this.validateCategoryCodeName.bind(this)],
        updateOn: 'blur'
      }),
      displayOrder: [this.categoryCodesModel.displayOrder],
      score: [this.categoryCodesModel.score],
      description: [this.categoryCodesModel.description]
    });
  }
  get formControls() { return this.categoryCodeForm.controls; }
  onSubmit() {
    if (!this.categoryCodeForm.invalid) {
      this.submitted = true;
      this.categoryCodesModel = this.categoryCodeForm.value;
      this.categoryCodesModel.categoryId = this.categoryId;
      this.categoryCodeService.saveCategoryCode(this.categoryCodesModel).subscribe((response: any) => {
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
    this.categoryCodeDialogModalRef.close(action);
  }

  validateCategoryCodeName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "code",
        "tableName": "MASTER_DIAGNOSIS_CODE",
        "value": ctrl.value,
        "colmnName": "CODE",
        "id": this.categoryCodesModel.id,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
        this.categoryCodeService.validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode !== 202)
              resolve({ uniqueName: true })
            else
              resolve();
          })
    })
  }
}
