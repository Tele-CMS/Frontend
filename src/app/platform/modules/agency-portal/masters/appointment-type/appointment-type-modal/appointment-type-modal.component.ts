import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, ValidationErrors, AbstractControl, FormControl } from '@angular/forms';
import { AppointmentTypeService } from '../appointment-type.service';
import { AppointmentTypeModal } from '../appointment-type.model';
import { Observable } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-appointment-type-modal',
  templateUrl: './appointment-type-modal.component.html',
  styleUrls: ['./appointment-type-modal.component.css']
})
export class AppointmentTypeModalComponent implements OnInit {
  appointmentTypeForm: FormGroup;
  appointmentTypeModal: AppointmentTypeModal;
  appointmentTypeId: number;
  loading: boolean = false;
  submitted: boolean = false;
  color = '';
  fontColor = '';

  constructor(
    private formBuilder: FormBuilder,
    private appointmentTypeService: AppointmentTypeService,
    public activityModalPopup: MatDialogRef<AppointmentTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentTypeModal,
    private notifier: NotifierService
  ) {
    this.appointmentTypeModal = data || new AppointmentTypeModal();
    this.appointmentTypeId = this.appointmentTypeModal.id;
  }

  onNoClick(): void {
    this.activityModalPopup.close();
  }

  initializeFormFields(appointmentTypeObj?: AppointmentTypeModal) {
    appointmentTypeObj = appointmentTypeObj || new AppointmentTypeModal();
    const configControls = {
      'name': new FormControl(appointmentTypeObj.name, {
        validators: [Validators.required],
        asyncValidators: [this.validateAppointmentTypeName.bind(this)],
        updateOn: 'blur'
      }),
      'defaultDuration': [appointmentTypeObj.defaultDuration, Validators.required],
      'description': [appointmentTypeObj.description],
      'color': [appointmentTypeObj.color || ''],
      'fontColor': [appointmentTypeObj.fontColor || ''],
      'isBillable': [appointmentTypeObj.isBillable],
      'allowMultipleStaff': [appointmentTypeObj.allowMultipleStaff],
      'isClientRequired': [appointmentTypeObj.isClientRequired],
    }
    this.appointmentTypeForm = this.formBuilder.group(configControls);
    this.color = appointmentTypeObj.color || '';
    this.fontColor = appointmentTypeObj.fontColor || '';
  }

  ngOnInit() {
    this.initializeFormFields(this.appointmentTypeModal);
  }

  get f() { return this.appointmentTypeForm.controls; }

  onSubmit(): any {
    this.submitted = true;
    if (this.appointmentTypeForm.invalid) {
      this.submitted = false;
      return;
    }
    this.appointmentTypeModal = this.appointmentTypeForm.value;
    this.appointmentTypeModal.id = this.appointmentTypeId;
    this.appointmentTypeModal.color = this.color;
    this.appointmentTypeModal.fontColor = this.fontColor;
    this.appointmentTypeService.create(this.appointmentTypeModal).subscribe((response) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        this.notifier.notify('success', response.message)
        this.activityModalPopup.close('SAVE');
      }
      else {
        this.notifier.notify('error', response.message)
      }
    });
  }

  validateAppointmentTypeName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Appointment name",
        "tableName": "MASTER_APPOINTMENT_NAME",
        "value": ctrl.value,
        "colmnName": "NAME",
        "id": this.appointmentTypeId,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
      this.appointmentTypeService.validate(postData)
        .subscribe((response: any) => {
          if (response.statusCode !== 202)
            resolve({ uniqueName: true })
          else
            resolve();
        })
    })
  }

}
