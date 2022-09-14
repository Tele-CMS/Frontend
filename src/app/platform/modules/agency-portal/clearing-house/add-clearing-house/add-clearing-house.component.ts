import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClearingHouseService } from '../clearing-house.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';
import { ClearingHouseModel } from '../clearing-house-model';
import { PasswordValidator } from '../../../../../shared/password-validator';

@Component({
  selector: 'app-add-clearing-house',
  templateUrl: './add-clearing-house.component.html',
  styleUrls: ['./add-clearing-house.component.css']
})
export class AddClearingHouseComponent implements OnInit {
  clearingHouseForm: FormGroup;
  clearingHouseModel: ClearingHouseModel;
  submitted: boolean = false;
  headerText: string;
  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddClearingHouseComponent>,
    private clearingHouseService: ClearingHouseService,
    @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.clearingHouseModel = this.data;
    if (this.clearingHouseModel.id > 0)
      this.headerText = "Edit Clearing House";
    else
      this.headerText = "Add Clearing House";
  }
  ngOnInit() {
    this.clearingHouseForm = this.formBuilder.group({
      id: [this.clearingHouseModel.id],
      clearingHouseName: [this.clearingHouseModel.clearingHouseName],
      senderID: [this.clearingHouseModel.senderID],
      receiverID: [this.clearingHouseModel.receiverID],
      interchangeQualifier: [this.clearingHouseModel.interchangeQualifier],
      ftpurl: [this.clearingHouseModel.ftpurl],
      portNo: [this.clearingHouseModel.portNo],
      ftpUsername: [this.clearingHouseModel.ftpUsername],
      ftpPassword: [this.clearingHouseModel.ftpPassword],
      confirmPassword: [this.clearingHouseModel.ftpPassword],
      path837: [this.clearingHouseModel.path837],
      path835: [this.clearingHouseModel.path835]
    }, { validator: this.validateForm.bind(this) });
  }
  get formControls() {
    return this.clearingHouseForm.controls;
  }
  closeDialog(action: string): void {
    this.dialogRef.close(action);
  }
  onSubmit() {
    if (!this.clearingHouseForm.invalid) {
      this.submitted = true;
      this.clearingHouseService.save(this.clearingHouseForm.value).subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null && response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.closeDialog('save');
        }
        else this.notifier.notify('error', response.message);
      });
    }
  }

  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls.ftpPassword.value;
    let confirmPass = formGroup.controls.confirmPassword.value;
    if (confirmPass == null || !confirmPass.length)
      return null;
    return pass && confirmPass && pass === confirmPass ? null : formGroup.controls.confirmPassword.setErrors({ notSame: true })
  }

}
