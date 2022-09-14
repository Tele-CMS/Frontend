import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { ManageHolidayModel } from '../manage-holidays.model';
import { ManageHolidayService } from '../manage-holidays.service';

@Component({
  selector: 'app-manage-holiday-modal',
  templateUrl: './manage-holiday-modal.component.html',
  styleUrls: ['./manage-holiday-modal.component.css']
})
export class HolidayModalComponent implements OnInit {
  holidayModel: ManageHolidayModel;
  holidayForm: FormGroup;

  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private holidayDialogModalRef: MatDialogRef<HolidayModalComponent>,
    private holidayService: ManageHolidayService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.holidayModel = data;
  }

  ngOnInit() {
    this.holidayForm = this.formBuilder.group({
      id: [this.holidayModel.id],
      date: [this.holidayModel.date],
      description: [this.holidayModel.description]
    });
  }
  get formControls() { return this.holidayForm.controls; }
  onSubmit() {
    if (!this.holidayForm.invalid) {
      this.submitted = true;
      this.holidayModel = this.holidayForm.value;
      this.holidayService.saveHoliday(this.holidayModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.closeDialog('SAVE');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.holidayDialogModalRef.close(action);
  }
}
