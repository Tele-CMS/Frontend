import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ManageDatabaseService } from '../manage-database.service';
import { ManageDatabaseModel } from '../manage-database.model';
import { ResponseModel } from '../../../platform/modules/core/modals/common-model';

@Component({
  selector: 'app-add-database',
  templateUrl: './add-database.component.html',
  styleUrls: ['./add-database.component.css']
})
export class AddDatabaseComponent implements OnInit {
  addDatabaseForm: FormGroup;
  private databaseModel: ManageDatabaseModel;
  headerText: string = '';
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder, private databaseService: ManageDatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService,
    private dialogModalRef: MatDialogRef<AddDatabaseComponent>, ) {
    this.databaseModel = this.data == null ? new ManageDatabaseModel() : this.data;
    if (this.databaseModel.databaseDetailID != null && this.databaseModel.databaseDetailID > 0)
      this.headerText = "Edit Database Details";
    else
      this.headerText = "Add Database Details";
  }

  ngOnInit() {
    this.addDatabaseForm = this.formBuilder.group({
      databaseDetailID: [this.databaseModel.databaseDetailID],
      databaseName: [this.databaseModel.databaseName],
      serverName: [this.databaseModel.serverName],
      userName: [this.databaseModel.userName],
      password: [this.databaseModel.password],
      confirmPassword: [this.databaseModel.password],
      isCentralised: [this.databaseModel.isCentralised]
    }, { validator: this.validateForm.bind(this) });
  }
  get formControls() {
    return this.addDatabaseForm.controls;
  }
  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls.password.value;
    let confirmPass = formGroup.controls.confirmPassword.value;
    if (confirmPass == null || !confirmPass.length)
      return null;
    return pass && confirmPass && pass === confirmPass ? null : formGroup.controls.confirmPassword.setErrors({ notSame: true })
  }
  onSubmit() {
    if (!this.addDatabaseForm.invalid) {
      this.submitted = true;
      this.databaseService.save(this.addDatabaseForm.value).subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null) {
          this.notifier.notify('success', response.message)
          this.closeDialog('save');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
}
