import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DiseaseManagementProgramService } from '../disease-management.service';
import { NotifierService } from 'angular-notifier';
import { DiseaseMangementProgramModel } from '../disease-management.model';

@Component({
  selector: 'app-disease-management-program-modal',
  templateUrl: './disease-management-program-modal.component.html',
  styleUrls: ['./disease-management-program-modal.component.css']
})
export class DiseaseManagementProgramModalComponent implements OnInit {
  diseaseMangementProgramModel: DiseaseMangementProgramModel;
  diseaseProgramForm: FormGroup;
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private diseaseManagementProgramModalComponent: MatDialogRef<DiseaseManagementProgramModalComponent>,
    private diseaseMangementProgramService: DiseaseManagementProgramService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.diseaseMangementProgramModel = data; 
  }

  
  ngOnInit() {
    this.diseaseProgramForm = this.formBuilder.group({
      id :[this.diseaseMangementProgramModel.id],
    description:[this.diseaseMangementProgramModel.description],
    isActive:[this.diseaseMangementProgramModel.isActive]
  });
}
  get formControls() { return this.diseaseProgramForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.diseaseProgramForm.invalid) {
      this.submitted = false;
      return;
    }
    this.diseaseMangementProgramModel = this.diseaseProgramForm.value;
    this.diseaseMangementProgramService.create(this.diseaseMangementProgramModel).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        this.notifier.notify('success', response.message)
        this.closeDialog('SAVE');
      } else {
        this.notifier.notify('error', response.message)
      }
    });
  }
  closeDialog(type?: string): void {
    this.diseaseManagementProgramModalComponent.close(type);
  }

}
