import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { PatientDocumentModel } from '../../documents/document.model';
import { DocumentService } from '../../documents/document.service';

@Component({
  selector: 'app-assign-questionnaire-modal',
  templateUrl: './assign-questionnaire-modal.component.html',
  styleUrls: ['./assign-questionnaire-modal.component.css']
})
export class AssignQuestionnaireModalComponent implements OnInit {
  patientDocumentModel: PatientDocumentModel;
  patientDocumentForm: FormGroup;
  submitted: boolean = false;
  assignedBy: string;
  // master value fields
  masterDocuments: any = [];
  masterPatients: any = [];

  constructor(private formBuilder: FormBuilder,
    private patientDocumentDialogModalRef: MatDialogRef<AssignQuestionnaireModalComponent>,
    private patientDocumentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.patientDocumentModel = data.patientDocumentModel;
    this.masterDocuments = data.masterDocuments;
    this.masterPatients = data.masterPatients;
    this.assignedBy = data.assignedBy;
  }

  ngOnInit() {
    this.patientDocumentForm = this.formBuilder.group({
      id: [this.patientDocumentModel.id],
      documentId: [this.patientDocumentModel.documentId],
      patientId: [this.patientDocumentModel.patientId]
    });
  }
  get formControls() { return this.patientDocumentForm.controls; }
  onSubmit() {
    if (this.patientDocumentForm.invalid) {
      return false;
    }
    this.submitted = true;
    this.patientDocumentModel = this.patientDocumentForm.value;
    this.patientDocumentModel.assignedBy = this.assignedBy;
    this.patientDocumentService.assignDocumentToPatient(this.patientDocumentModel).subscribe((response: any) => {
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
    this.patientDocumentDialogModalRef.close(action);
  }

}
