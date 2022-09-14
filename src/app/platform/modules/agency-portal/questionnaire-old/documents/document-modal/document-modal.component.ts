import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { DocumentModel } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.css']
})
export class DocumentsModalComponent implements OnInit {
  documentModel: DocumentModel;
  documentsForm: FormGroup;

  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private documentDialogModalRef: MatDialogRef<DocumentsModalComponent>,
    private documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.documentModel = data;
  }

  ngOnInit() {
    this.documentsForm = this.formBuilder.group({
      id: [this.documentModel.id],
      documentName: new FormControl(this.documentModel.documentName, {
        validators: [Validators.required],
        // asyncValidators: [this.validateDocumentName.bind(this)],
        updateOn: 'blur'
      }),
      description: [this.documentModel.description]
    });
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
