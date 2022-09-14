import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { AllergyModel } from '../allergies.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientsService } from '../../clients.service';
import { NotifierService } from 'angular-notifier';
import { LayoutService } from 'src/app/platform/modules/core/services';

@Component({
  selector: 'app-allergies-modal',
  templateUrl: './allergies-modal.component.html',
  styleUrls: ['./allergies-modal.component.css']
})
export class AllergiesModalComponent implements OnInit {
  maxDate = new Date();
  patientId: number;
  allergyModel: AllergyModel;
  allergyForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Patient Allergies';
  //master models
  masterAllergies: any[];
  masterReaction: any[];
  statusModel: any[];
  linkedEncounterId: number;

  //////////////////
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();


  constructor(private formBuilder: FormBuilder, private allergyDialogModalRef: MatDialogRef<AllergiesModalComponent>, private clientService: ClientsService,
     @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService, private layoutService: LayoutService) { //assign data
    this.allergyModel = data.allergy;
    this.refreshGrid.subscribe(data.refreshGrid);
    this.patientId = this.allergyModel.patientId;
    //update header text
    if (this.allergyModel.id != null && this.allergyModel.id > 0)
      this.headerText = 'Edit Patient Allergies';
    else
      this.headerText = 'Add Patient Allergies';

    this.statusModel = [{ id: true, value: 'Active' }, { id: false, value: 'Inactive' }];
  }

  //on initial load
  ngOnInit() {
    this.allergyForm = this.formBuilder.group({
      id: [this.allergyModel.id],
      patientID: [this.allergyModel.patientId],
      allergen: [this.allergyModel.allergen],
      allergyTypeId: [this.allergyModel.allergyTypeId],
      createdDate: [this.allergyModel.createdDate],
      isActive: [this.allergyModel.isActive],
      note: [this.allergyModel.note],
      reactionID: [this.allergyModel.reactionID]
    });

    this.layoutService.clientDrawerData.subscribe(({ encounterId }) => {
      this.linkedEncounterId = encounterId;
    });

    //page load calling master data for dropdowns
    this.getMasterData();
  }

  //get the form controls on html page
  get formControls() { return this.allergyForm.controls; }

  //submit for create update of vitals
  onSubmit(event: any) {
    if (!this.allergyForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.allergyModel = this.allergyForm.value;
      this.allergyModel.patientId = this.patientId;
      this.allergyModel.linkedEncounterId = this.linkedEncounterId;
      this.clientService.createAllergy(this.allergyModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          if (clickType == "Save")
            this.closeDialog('save');
          else if (clickType == "SaveAddMore") {
            this.refreshGrid.next();
            this.allergyForm.reset();
          }
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }

  //close popup
  closeDialog(action: string): void {
    this.allergyDialogModalRef.close(action);
  }

  //call master data api
  getMasterData() {
    let data = "MASTERALLERGIES,MASTERREACTION";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterAllergies = response.masterAllergies != null ? response.masterAllergies : [];
        this.masterReaction = response.masterReaction != null ? response.masterReaction : [];
      }
    });
  }
}
