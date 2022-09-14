import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { StaffPayrollRateModel } from '../users.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ResponseModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-payroll-rate',
  templateUrl: './payroll-rate.component.html',
  styleUrls: ['./payroll-rate.component.css']
})
export class PayrollRateComponent implements OnInit {
  masterStaffs: any = [];
  staffId: number = null;
  staffPayrollRate: Array<StaffPayrollRateModel> = [];
  masterAppointmentType: any = [];
  staffPayrollRateForm: FormGroup;
  constructor(private userService: UsersService, private formBuilder: FormBuilder,private notifier:NotifierService) {
  }

  ngOnInit() {
    this.staffPayrollRateForm = this.formBuilder.group({
      payrollRate: this.formBuilder.array([])
    });
    this.getMasterData();
  }
  getMasterData() {
    this.userService.getMasterData('masterstaff,AppointmentType').subscribe((response: any) => {
      this.masterStaffs = response.staffs != null ? response.staffs : []; 
      this.masterAppointmentType= response.appointmentType != null ? response.appointmentType : [];
    });
  }

  get formControls() {
    return this.staffPayrollRateForm.value;
  }

  get payrollRates() {
    return this.staffPayrollRateForm.get('payrollRate') as FormArray;
  }
  addItem(item: StaffPayrollRateModel=new StaffPayrollRateModel()) {
    const control = (<FormArray>this.staffPayrollRateForm.controls['payrollRate']) as FormArray;
    control.push(this.formBuilder.group({
      id:item.id,
      staffId:this.staffId,
      appointmentTypeId:item.appointmentTypeId,
      payRate:item.payRate
    }));
  }
  
  removeItem(index: number) {
    this.payrollRates.removeAt(index);
  }

  getStaffPayrollRates() {
    while (this.payrollRates.length !== 0) {
      this.payrollRates.removeAt(0)
    }
    if (this.staffId != null && this.staffId > 0) {
      this.userService.getStaffPayrollRate(this.staffId).subscribe((response: ResponseModel) => {
        if (response != null && response.data != null && response.data.length > 0) {
          response.data.forEach(element => {
            this.addItem(element);
          });
        }
        else
          this.addItem();
      });
    }
  }
  clearFilters()
  {
    this.staffId=null;
    this.getStaffPayrollRates();
  }
  onSubmit()
  {
    if(!this.staffPayrollRateForm.invalid)
    {
      this.userService.saveStaffPayrollRate(this.staffPayrollRateForm.value.payrollRate).subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.getStaffPayrollRates();
        } else {
          this.notifier.notify('error', response.message);
        }
      });
    }
  }
}
