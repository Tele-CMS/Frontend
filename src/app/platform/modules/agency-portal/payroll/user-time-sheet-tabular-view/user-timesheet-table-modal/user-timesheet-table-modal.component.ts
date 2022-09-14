import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { format } from 'date-fns';
import { UserTimesheetTabularViewModel } from '../../user-time-sheet-sheet-view/timesheet-sheet-view.model';
import { UserTimeSheetTabularViewService } from '../user-time-sheet-tablular.service';

@Component({
  selector: 'app-user-timesheet-table-modal',
  templateUrl: './user-timesheet-table-modal.component.html',
  styleUrls: ['./user-timesheet-table-modal.component.css']
})
export class AddUserTimeSheetModalComponent implements OnInit {
  userTimeSheetModel: UserTimesheetTabularViewModel;
  userTimesheetForm: FormGroup;
  // master value fields
  loadingMasterData: boolean = false;
  staffId: number;
  masterAppointmentType: Array<any> = [];
  masterTimesheetStatus: Array<any> = [];
  masterstaff: Array<any> = [];
  dialogTitle: string = "";
  submitted:boolean=false;
  constructor(private formBuilder: FormBuilder,
    private userTimeSheetDialogModalRef: MatDialogRef<AddUserTimeSheetModalComponent>,
    private userTimeSheetService: UserTimeSheetTabularViewService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.userTimeSheetModel = data.userTimeSheetModel;
    if (this.userTimeSheetModel.id > 0)
      this.dialogTitle = "Update Staff Time Sheet ";
    else
      this.dialogTitle = "Add Time Sheet";
    this.staffId = data.staffId;
    this.userTimeSheetModel.startDateTime = format(this.userTimeSheetModel.startDateTime || new Date(), 'HH:mm');
    this.userTimeSheetModel.endDateTime = format(this.userTimeSheetModel.endDateTime || new Date(), 'HH:mm');
  }

  ngOnInit() {
    this.userTimesheetForm = this.formBuilder.group({
      id: [this.userTimeSheetModel.id],
      appointmentTypeId: [this.userTimeSheetModel.appointmentTypeId],
      staffId: [this.staffId ? this.staffId : this.userTimeSheetModel.staffId],
      dateOfService: [this.userTimeSheetModel.dateOfService],
      startDateTime: [this.userTimeSheetModel.startDateTime],
      endDateTime: [this.userTimeSheetModel.endDateTime],
      expectedTimeDuration: [this.userTimeSheetModel.expectedTimeDuration],
      actualTimeDuration: [this.userTimeSheetModel.actualTimeDuration],
      notes: [this.userTimeSheetModel.notes],
      statusId: [this.userTimeSheetModel.statusId],
    });
    this.loadMasterData();
  }
  get formControls() { return this.userTimesheetForm.controls; }
  onSubmit() {
    if (!this.userTimesheetForm.invalid) {
      this.userTimeSheetModel = this.userTimesheetForm.value;
      this.userTimeSheetService.saveUserTimeSheet(this.userTimeSheetModel).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.closeDialog('save');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.userTimeSheetDialogModalRef.close(action);
  }
  loadMasterData() {
    // load master data
    this.loadingMasterData = true;
    const masterData = { masterdata: 'appointmenttype,TIMESHEETSTATUS,masterstaff' };
    this.userTimeSheetService.getMasterData(masterData).subscribe((response: any) => {
      this.loadingMasterData = false;
      this.masterAppointmentType = response.appointmentType || [];
      this.masterTimesheetStatus = response.timesheetStatus || [];
      this.masterstaff = response.staffs || [];
    });
  }

}
