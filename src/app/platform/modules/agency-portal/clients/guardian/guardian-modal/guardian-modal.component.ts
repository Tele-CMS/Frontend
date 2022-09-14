import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientsService } from '../../clients.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { GuardianModel } from '../../guardian.model';

@Component({
  selector: 'app-guardian-modal',
  templateUrl: './guardian-modal.component.html',
  styleUrls: ['./guardian-modal.component.css']
})
export class GuardianModalComponent implements OnInit {
  guardianModel: GuardianModel;
  guardianForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Guardian/Guarantor';
  masterRelationship: any[];
  patientId: number;
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  constructor(private formBuilder: FormBuilder, private guardianDialogModalRef: MatDialogRef<GuardianModalComponent>,
    private clientService: ClientsService,

    @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.guardianModel = data.guardian;
    this.refreshGrid.subscribe(data.refreshGrid);
    if (this.guardianModel.id != null && this.guardianModel.id > 0)
      this.headerText = 'Edit Guardian/Guarantor';
    else
      this.headerText = 'Add Guardian/Guarantor';

    this.patientId = this.guardianModel.patientID;
  }

  ngOnInit() {
    this.guardianForm = this.formBuilder.group({
      id: [this.guardianModel.id],
      guardianFirstName: [this.guardianModel.guardianFirstName],
      guardianLastName: [this.guardianModel.guardianLastName],
      guardianMiddleName: [this.guardianModel.guardianMiddleName],
      guardianHomePhone: [this.guardianModel.guardianHomePhone],
      guardianEmail: [this.guardianModel.guardianEmail],
      relationshipID: [this.guardianModel.relationshipID],
      isGuarantor: [this.guardianModel.isGuarantor],
    });
    this.getMasterData();
  }
  get formControls() { return this.guardianForm.controls; }
  onSubmit(event: any) {
    if (!this.guardianForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.guardianModel = this.guardianForm.value;
      this.guardianModel.patientID = this.patientId;
      this.guardianModel.isActive = true;
      this.clientService.createGuardian(this.guardianModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          if (clickType == "Save")
          {
            this.closeDialog('save');
          }
          else if (clickType == "SaveAddMore") {
            this.refreshGrid.next();
            this.guardianForm.reset();
          }
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.guardianDialogModalRef.close(action);
  }

  getMasterData() {
    let data = "MASTERRELATIONSHIP";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterRelationship = response.masterRelationship != null ? response.masterRelationship : [];
      }
    });
  }

}
