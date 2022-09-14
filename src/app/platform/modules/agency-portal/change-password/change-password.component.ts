import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangePasswordService } from './change-password.service';
import { ResponseModel } from '../../../../super-admin-portal/core/modals/common-model';
import { Subscription } from 'rxjs';
import { CommonService } from '../../core/services';
import { LoginUser } from '../../core/modals/loginUser.modal';
import { MatDialogRef } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { PasswordValidator } from '../../../../shared/password-validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  submitted: boolean = false;
  subscription: Subscription;
  userId: number;
  constructor(private notifier: NotifierService, private dialogModalRef: MatDialogRef<ChangePasswordComponent>, private commonService: CommonService, private formBuilder: FormBuilder, private changePasswordService: ChangePasswordService) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: [],
      newPassword: [null,[PasswordValidator.strong]],
      confirmNewPassword: []
    }, { validator: this.validateForm.bind(this) });

    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.userId = user.data.userID;
      }
    });
  }
  get formControls() {
    return this.changePasswordForm.controls;
  }
  validateForm(formGroup: FormGroup) {
    let pass = formGroup.controls.newPassword.value;
    let confirmPass = formGroup.controls.confirmNewPassword.value;

    if (confirmPass == undefined || !confirmPass.length)
      return null;

    return pass && confirmPass && pass === confirmPass ? null : formGroup.controls.confirmNewPassword.setErrors({ notSame: true })
  }

  onSubmit() {
    if (!this.changePasswordForm.invalid) {
      let data = this.changePasswordForm.value;
      data.userID = this.userId;
      this.submitted = true;
      this.changePasswordService.updateNewPassword(data).subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.closeDialog('save');
        }
        else
          this.notifier.notify('error', response.message);
      });
    }
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
}
