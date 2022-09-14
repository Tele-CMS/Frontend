import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
//import { MedicationModel } from '../medication.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
//import { ClientsService } from '../../clients.service';
import { NotifierService } from 'angular-notifier';
import { ClientsService } from '../../../agency-portal/clients/clients.service';
import { MedicationModel } from '../../../agency-portal/clients/medication/medication.model';


@Component({
  selector: 'app-medication-modal',
  templateUrl: './medication-modal.component.html',
  styleUrls: ['./medication-modal.component.css']
})
export class MedicationModalComponent implements OnInit {
  medicationModel: MedicationModel;
  medicationForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Medication';
  masterFrequencyType: any[];
  patientId: number;
  maxDate = new Date();
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();

  //construtor
  constructor(private formBuilder: FormBuilder, private medicationDialogModalRef: MatDialogRef<MedicationModalComponent>,
    private clientService: ClientsService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.medicationModel = data.medication;
    this.refreshGrid.subscribe(data.refreshGrid);

    //header text updation
    if (this.medicationModel.id != null && this.medicationModel.id > 0)
      this.headerText = 'Edit Medication';
    else
      this.headerText = 'Add Medication';

    this.patientId = this.medicationModel.patientId;
  }

  // on initial load
  ngOnInit() {
    this.medicationForm = this.formBuilder.group({
      id: [this.medicationModel.id],
      dose: [this.medicationModel.dose],
      endDate: [this.medicationModel.endDate],
      frequencyID: [this.medicationModel.frequencyID],
      medicine: [this.medicationModel.medicine],
      startDate: [this.medicationModel.startDate],
      strength: [this.medicationModel.strength]
    });
    this.getMasterData();
  }

  //call master data for drop down
  getMasterData() {
    let data = "FREQUENCYTYPE";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterFrequencyType = response.masterFrequencyType != null ? response.masterFrequencyType : [];
      }
    });
  }

  // get all the controls
  get formControls() { return this.medicationForm.controls; }

  //submit the form
  onSubmit(event: any) {
    if (!this.medicationForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.medicationModel = this.medicationForm.value;
      this.medicationModel.patientId = this.patientId;
      this.clientService.createMedication(this.medicationModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) 
        {
          this.notifier.notify('success', response.message)
          if (clickType == "Save")
            this.closeDialog('SAVE');
          else if (clickType == "SaveAddMore") {
            this.refreshGrid.next();
            this.medicationForm.reset();
            //this.medicationDialogModalRef.close('SAVE');
          }
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }

  //to close popup
  closeDialog(action: string): void {
    this.medicationDialogModalRef.close(action);    
  }

}

