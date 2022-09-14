import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { EncounterNotesModel } from './encounter-notes.model';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { EncounterService } from '../encounter.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-encounter-notes-model',
  templateUrl: './encounter-notes-model.component.html',
  styleUrls: ['./encounter-notes-model.component.css']
})
export class EncounterNotesModelComponent implements OnInit, OnDestroy {
  encounterNotesModel: EncounterNotesModel;
  encounterNotesForm: FormGroup;
  submitted: boolean = false;

  // autocomplete
  filterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private encounterService: EncounterService,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private dialogModalRef: MatDialogRef<EncounterNotesModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.encounterNotesModel = data;
  }
    ngOnDestroy(): void {
      this._onDestroy.next();
      this._onDestroy.complete();
    }

  ngOnInit() {
    this.encounterNotesForm = this.formBuilder.group({
      id: [this.encounterNotesModel.id],
      patientEncounterId: [this.encounterNotesModel.patientEncounterId],
      notes: [this.encounterNotesModel.notes],
    });
  }

  get formControls() { return this.encounterNotesForm.controls; }

  onSubmit() {
    if (this.encounterNotesForm.invalid) {
      return;
    }
    this.dialogService.confirm(`Are you sure you want to add notes? Please Note: saved notes cannot be edited.`).subscribe((result: any) => {
      if (result == true) {
        this.submitted = true;
        let postData = this.encounterNotesForm.value;
        this.encounterService.saveEncounterNotes(postData).subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify('success', response.message)
            this.closeDialog('save');
          } else {
            this.notifier.notify('error', response.message)
          }
        });
      }
    });
  }

  closeDialog(result: string) {
    this.dialogModalRef.close(result);
  }
}
