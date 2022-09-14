import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { CategoryModel } from '../../documents/document.model';
import { DocumentService } from '../../documents/document.service';
import { debug } from 'util';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css']
})
export class CategoryModalComponent implements OnInit {
  categoryModel: CategoryModel;
  categoryForm: FormGroup;
  masterHRACategoryRisk:Array<any>=[];
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private categoryDialogModalRef: MatDialogRef<CategoryModalComponent>,
    private categoryService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.categoryModel = data;
  }

  ngOnInit() {
    this.getMasterData();
    this.categoryForm = this.formBuilder.group({
      id: [this.categoryModel.id],
      categoryName: new FormControl(this.categoryModel.categoryName, {
        validators: [Validators.required],
        asyncValidators: [this.validateCategoryName.bind(this)],
        updateOn: 'blur'
      }),
      description: [this.categoryModel.description],
      hraCategoryRiskIds: [this.categoryModel.hraCategoryRiskIds],
      perfectScore: [this.categoryModel.perfectScore]
    });
  }
  get formControls() { return this.categoryForm.controls; }
  onSubmit() {
    if (!this.categoryForm.invalid) {
      this.submitted = true;
      this.categoryModel = this.categoryForm.value;
      this.categoryService.saveCategory(this.categoryModel).subscribe((response: any) => {
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
    this.categoryDialogModalRef.close(action);
  }

  validateCategoryName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "categoryName",
        "tableName": "QUESTIONNAIRE_CATEGORYNAME",
        "value": ctrl.value,
        "colmnName": "CATEGORYNAME",
        "id": this.categoryModel.id,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
        this.categoryService.validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode !== 202)
              resolve({ uniqueName: true })
            else
              resolve();
          })
    })
  }

  getMasterData() {
    let data = { 'masterdata': 'MASTERHRACATEGORYRISK' }
    this.categoryService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterHRACategoryRisk = response.masterHRACategoryRisk != null ? response.masterHRACategoryRisk : [];        
      }
    });
  }
}
