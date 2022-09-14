import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { StaffLeaveModel } from '../../users.model';
import { UsersService } from '../../users.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-apply-leave-modal',
  templateUrl: './apply-leave-modal.component.html',
  styleUrls: ['./apply-leave-modal.component.css']
})
export class ApplyLeaveModalComponent implements OnInit {
  staffLeaveModel: StaffLeaveModel;
  staffLeaveForm: FormGroup;
  masterLeaveReason: Array<any> = [];
  masterLeaveType: Array<any> = [];
  submitted: boolean = false;
  loadingMasterData = false;
  staffId: number;
  headerText: string;
  todayDate = new Date();

  constructor(private formBuilder: FormBuilder,
    private staffLeaveDialogModalRef: MatDialogRef<ApplyLeaveModalComponent>,
    private staffLeaveService: UsersService,

    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.staffLeaveModel = data.staffLeaveModel;
    this.staffId = data.staffId;
    if (this.staffLeaveModel.id > 0)
      this.headerText = "Update Applied Leave";
    else
      this.headerText = "Apply Leave";
  }

  ngOnInit() {
    this.staffLeaveForm = this.formBuilder.group({
      id: [this.staffLeaveModel.id],
      description: [this.staffLeaveModel.description],
      toDate: [this.staffLeaveModel.toDate],
      fromDate: [this.staffLeaveModel.fromDate],
      leaveReasonId: [this.staffLeaveModel.leaveReasonId],
      leaveTypeId: [this.staffLeaveModel.leaveTypeId],
      staffId: [this.staffId ? this.staffId : this.staffLeaveModel.staffId]
      // leaveStatusId:[this.staffLeaveModel.leaveStatusId]
    });
    this.loadMasterData();
  }
  loadMasterData() {
    // load master data
    this.loadingMasterData = true;
    const masterData = 'LEAVETYPE,LEAVEREASON';
    this.staffLeaveService.getMasterData(masterData).subscribe((response: any) => {
      if (response != null) {
        this.loadingMasterData = false;
        this.masterLeaveReason = response.leaveReason || [];
        this.masterLeaveType = response.leaveType || [];
      }
    });
  }
  get formControls() { return this.staffLeaveForm.controls; }
  onSubmit() {
    if (!this.staffLeaveForm.invalid) {
      this.submitted = true;
      this.staffLeaveModel = this.staffLeaveForm.value;
      this.staffLeaveModel.fromDate = format(this.staffLeaveModel.fromDate, 'YYYY-MM-DD')
      this.staffLeaveModel.toDate = format(this.staffLeaveModel.toDate, 'YYYY-MM-DD')
      this.staffLeaveService.saveStaffLeave(this.staffLeaveModel).subscribe((response: any) => {
        this.submitted = false;
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
    this.staffLeaveDialogModalRef.close(action);
  }
}
