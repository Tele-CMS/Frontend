import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { PayrollGroupModel } from '../payroll-group.model';
import { PayrollGroupService } from '../payroll-group.service';

@Component({
  selector: 'app-payroll-group-modal',
  templateUrl: './payroll-group-modal.component.html',
  styleUrls: ['./payroll-group-modal.component.css']
})
export class PayrollGroupModalComponent implements OnInit {
  payrollGroupModel: PayrollGroupModel;
  payrollGroupForm: FormGroup;
  loadingMasterData: boolean = false;
  isCaliforniaRule: number = 0;
  // master value fields
  masterPayPeriod: Array<any> = [];
  masterPayrollBreakTime: Array<any> = [];
  masterWorkWeek: Array<any> = [];
  masterOptions = [{ id: false, value: 'Calculation Period' }, { id: true, value: 'California' }];
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private payrollGroupDialogModalRef: MatDialogRef<PayrollGroupModalComponent>,
    private payrollGroupService: PayrollGroupService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.payrollGroupModel = data;
  }

  ngOnInit() {
    this.payrollGroupForm = this.formBuilder.group({
      id: [this.payrollGroupModel.id],
      groupName: [this.payrollGroupModel.groupName],
      payPeriodId: [this.payrollGroupModel.payPeriodId],
      workWeekId: [this.payrollGroupModel.workWeekId],
      payrollBreakTimeId: [this.payrollGroupModel.payrollBreakTimeId],
      isCaliforniaRule: [this.payrollGroupModel.isCaliforniaRule],
      dailyLimit: [this.payrollGroupModel.dailyLimit],
      weeklyLimit: [this.payrollGroupModel.weeklyLimit],
      overTime: [this.payrollGroupModel.overTime],
    });
    this.loadMasterData();
  }
  get formControls() { return this.payrollGroupForm.controls; }
  onSubmit() {
    if (!this.payrollGroupForm.invalid) {
      this.submitted = true;
      this.payrollGroupModel = this.payrollGroupForm.value;
      this.payrollGroupService.savePayrollGroup(this.payrollGroupModel).subscribe((response: any) => {
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
  changeCalforniaRule(event: any) {
    const selectedValue = event.value;
    let payPeriodObj = this.masterPayPeriod.find((obj) => obj.value === 'Weekly');
    let workWeekObj = this.masterWorkWeek.find((obj) => obj.value === 'Sunday-Saturday');
    if (selectedValue === true) {
      this.payrollGroupForm.patchValue({ payPeriodId: payPeriodObj && payPeriodObj.id, workWeekId: workWeekObj && workWeekObj.id, dailyLimit: 8, weeklyLimit: 40, overTime: 4 });
    } else {
      this.payrollGroupForm.patchValue({ payPeriodId: null, workWeekId: null, dailyLimit: null, weeklyLimit: null, overTime: null });
    }

  }
  loadMasterData() {
    // load master data
    this.loadingMasterData = true;
    const masterData = { masterdata: 'PAYPERIOD,WORKWEEK,PAYROLLBREAKTIME' };
    this.payrollGroupService.getMasterData(masterData).subscribe((response: any) => {
      this.loadingMasterData = false;
      this.masterPayPeriod = response.payPeriod || [];
      this.masterPayrollBreakTime = response.payrollBreakTime || [];
      this.masterWorkWeek = response.workWeek || [];
    });
  }
  closeDialog(action: string): void {
    this.payrollGroupDialogModalRef.close(action);
  }


}
