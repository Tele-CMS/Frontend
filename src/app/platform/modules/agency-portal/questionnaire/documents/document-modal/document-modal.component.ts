import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { DocumentModel, BenchmarkRangeModel } from '../document.model';
import { DocumentService } from '../document.service';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.css']
})
export class DocumentsModalComponent implements OnInit {
  documentModel: DocumentModel;
  documentsForm: FormGroup;
  masterDocumentsTypes:Array<any>=[];
  masterBenchmark:Array<any>=[];
  submitted: boolean = false;
benchmarkRange:BenchmarkRangeModel;
  constructor(private formBuilder: FormBuilder,
    private documentDialogModalRef: MatDialogRef<DocumentsModalComponent>,
    private documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.documentModel = data;
  }

  ngOnInit() { 
    this.getDocumentTypes();
    this.getMasterData() 
    this.documentsForm = this.formBuilder.group({
      id: [this.documentModel.id],
      documentName: new FormControl(this.documentModel.documentName, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      description: [this.documentModel.description],
      masterAssessmentTypeId:[this.documentModel.masterAssessmentTypeId],
      benchmarkRangeModel: this.formBuilder.array([]),
    });
  }
  get benchmarkRangeModel() {
    return this.documentsForm.get('benchmarkRangeModel') as FormArray;
  }
  get formControls() { return this.documentsForm.controls; }
  onSubmit() {
    if (!this.documentsForm.invalid) {
      this.submitted = true;
      this.documentModel = this.documentsForm.value;
      
      this.documentService.saveDocuments(this.documentModel).subscribe((response: any) => {
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
    this.documentDialogModalRef.close(action);
  }
  getDocumentTypes() {
    this.documentService.getDocumentsTypes().subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.masterDocumentsTypes = response.data;
      } else {
        this.masterDocumentsTypes = [];
      }
    }
    );
  }
  getMasterData() {
    let data = { 'masterdata': 'MASTERBENCHMARK' }
    this.documentService.getMasterData(data).subscribe((response: any) => { 
      if (response != null) {
        this.masterBenchmark = response.masterBenchmark != null ? response.masterBenchmark : [];
        this.addBanchmarkControls();
      }
    });
  }

  addBanchmarkControls() {
    const benchmarkRange:BenchmarkRangeModel[] = this.documentModel.benchmarkRangeModel || [];
    this.masterBenchmark.forEach((item, index) => {
      let benchmarkRangeControls = benchmarkRange[index] || new BenchmarkRangeModel();
      this.benchmarkRangeModel.push(this.formBuilder.group(benchmarkRangeControls));
    });
  }

  validateDocumentName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "documentName",
        "tableName": "QUESTIONNAIRE_DOCUMENTNAME",
        "value": ctrl.value,
        "colmnName": "DOCUMENTNAME",
        "id": this.documentModel.id,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
        this.documentService.validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode !== 202)
              resolve({ uniqueName: true })
            else
              resolve();
          })
    })
  }
}
