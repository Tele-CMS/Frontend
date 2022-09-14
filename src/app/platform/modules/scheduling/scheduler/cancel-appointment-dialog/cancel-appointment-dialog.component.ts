import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchedulerService } from '../scheduler.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { CancelAppointmentModel } from '../scheduler.model';
import { CommonService } from "../../../core/services";

@Component({
  selector: 'app-cancel-appointment-dialog',
  templateUrl: './cancel-appointment-dialog.component.html',
  styleUrls: ['./cancel-appointment-dialog.component.css']
})
export class CancelAppointmentDialogComponent implements OnInit {
  cancelAppointmentForm: FormGroup;
  cancelAppointmentModel: CancelAppointmentModel;
  appointmentId: number;
  submitted: boolean = false;
  isloadingMasterData: boolean = false;
  masterCancelType: Array<any>;
  currentLoginUserId:any;
  isAdminLogin=false;
  isClientLogin= false;
  constructor(
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService,
    public dialogPopup: MatDialogRef<CancelAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private commonService: CommonService
  ) {
    this.appointmentId = data;
    this.masterCancelType = [];
  }

  ngOnInit() {
    this.initializeFormFields(this.cancelAppointmentModel);
    this.fetchMasterData();
    this.checkLoggedInUser();
  }

  checkLoggedInUser() {
   this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.currentLoginUserId = user.id;
          this.isAdminLogin =
            user.users3 &&
            user.users3.userRoles &&
            (user.users3.userRoles.userType || "").toUpperCase() == "ADMIN";

         this.isClientLogin= user.users3 &&
            user.users3.userRoles &&
            (user.users3.userRoles.userType || "").toUpperCase() == "CLIENT";

            
            
        }
        });
  }

  initializeFormFields(cancelModel?: CancelAppointmentModel) {
    cancelModel = cancelModel || new CancelAppointmentModel();
    const configControls = {
      'cancelTypeId': [cancelModel.cancelTypeId, Validators.required],
      'cancelReason': [cancelModel.cancelReason, Validators.required],
    }
    this.cancelAppointmentForm = this.formBuilder.group(configControls);
    
  }

  get formControls() { return this.cancelAppointmentForm.controls; }

  onClose(): void {
    this.dialogPopup.close();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.cancelAppointmentForm.invalid) {
      this.submitted = false;
      return;
    }

    this.cancelAppointmentModel = this.cancelAppointmentForm.value;
    this.cancelAppointmentModel.ids = [this.appointmentId];

    this.schedulerService.cancelAppointment(this.cancelAppointmentModel)
    .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.notifier.notify('success', response.message);
            this.dialogPopup.close('SAVE');
          } else {
            this.notifier.notify('error', response.message);
          }
        });
  }

  fetchMasterData(): void {
    // load master data
    this.isloadingMasterData = true;
    const masterData = { masterdata: "MASTERCANCELTYPE" };
    this.schedulerService.getMasterData(masterData)
      .subscribe((response: any) => {
        this.isloadingMasterData = false;
        this.masterCancelType = response.masterCancelType || [];

        if(this.isClientLogin){
          this.masterCancelType = this.masterCancelType.filter(x => x.value == 'Cancel By Client');
           this.formControls.cancelTypeId.setValue(this.masterCancelType[0].id);
        }

      });
  }

}
