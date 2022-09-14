import { Component, OnInit } from '@angular/core';
import { PayrollReportModel } from './payroll-report.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PayrollReportService } from './payroll-report.service';
import { format, addWeeks, addDays, startOfWeek, endOfWeek } from 'date-fns';

@Component({
  selector: 'app-payroll-report',
  templateUrl: './payroll-report.component.html',
  styleUrls: ['./payroll-report.component.css']
})
export class PayrollReportComponent implements OnInit {
  metaData: any;
  payrollReportData: PayrollReportModel[];
  payrollReportFormGroup: FormGroup;
  masterPayrollGroup: any[];
  enableDaysForToDate: any[];
  enableDaysForFromDate: any[];
  seletedPayPeriod: string = '';
  selectedWorkWeek: string = '';
  FromDate: Date;
  ToDate: Date;
  masterUserForPayrollGroup: any[];
  currentLocationId: number;
  displayedColumns: Array<any> = [
    { displayName: 'STAFF', key: 'staffName', class: '', width: '10%' },
    { displayName: 'APT. DATE', key: 'appointmentDate', class: '', width: '9%' },
    { displayName: 'APT. TYPE', key: 'appointmentType', class: '', width: '9%' },
    { displayName: 'APT. TIME(HRS)', key: 'activityTime', class: '', width: '9%',type:'decimal' },
    { displayName: 'TOTAL WORKING HOURS(HRS)', key: 'totalHoursWorkedInDay', class: '', width: '9%',type:'decimal' },
    { displayName: 'DAILY LIMIT(HRS)', key: 'dailyLimit', class: '', width: '9%',type:'decimal' },
    { displayName: 'DAY TIME WITHOUT OT(HRS)', key: 'dayTimeWithoutOT', width: '9%',type:'decimal' },
    { displayName: 'OVERTIME(HRS)', key: 'overtime', class: '', width: '9%',type:'decimal' },
    { displayName: 'DOUBLE OVERTIME(HRS)', key: 'doubleOvertime', class: '', width: '9%',type:'decimal' },
    { displayName: 'TOTAL DISTANCE', key: 'totalDistance', class: '', width: '9%',type:'decimal' },
    { displayName: 'NO. OF BREAKS', key: 'noOfBreaks', class: '', width: '9%' },

  ];
  actionButtons: Array<any> = [];

  constructor(private payrollReportService: PayrollReportService, private formBuilder: FormBuilder, ) {
    this.payrollReportData = new Array<PayrollReportModel>();
  }
  ngOnInit() {
    this.payrollReportFormGroup = this.formBuilder.group({
      FromDate: new Date(new Date().setDate(new Date().getDate() - 7)),
      ToDate: new Date(),
      payrollGroupId: '',
      StaffId: ''
    });
    this.getPayrollGroupDropDown();
  }
  generatePayrollreport() {
    if (this.payrollReportFormGroup.value.StaffId || this.payrollReportFormGroup.value.payrollGroupId) {
      this.getPayrollReportData();
    }
  }
  getPayrollReportData() {
    let fromDate = format(this.payrollReportFormGroup.value.FromDate, 'YYYY-MM-DD'),
      toDate = format(this.payrollReportFormGroup.value.ToDate, 'YYYY-MM-DD')
    this.payrollReportService.getPayrollReportData(this.payrollReportFormGroup.value.StaffId, this.payrollReportFormGroup.value.payrollGroupId, fromDate, toDate).subscribe((response: any) => {
      this.payrollReportData = response.data.map(x => {
        x.appointmentDate = format(x.appointmentDate, 'MM/DD/YYYY');
        return x;
      });
    });
  }

  filterDatesByPayrollGroup(selectedPayrollGroup) {
    this.seletedPayPeriod = selectedPayrollGroup.payPeriodName;
    this.selectedWorkWeek = selectedPayrollGroup.workweek;

    if ((this.seletedPayPeriod || '').toUpperCase() === 'DAILY') {
      this.FromDate = this.ToDate;
      this.enableDaysForFromDate = [], this.enableDaysForToDate = [];
    } else {
      let addWeek = 0;
      if ((this.seletedPayPeriod || '').toUpperCase() === 'WEEKLY') {
        addWeek = 1;
      } else if ((this.seletedPayPeriod || '').toUpperCase() === 'BI-WEEKLY') {
        addWeek = 2;
      } else if ((this.seletedPayPeriod || '').toUpperCase() === 'MONTHLY') {
        addWeek = 4;
      }
      let FromDate = startOfWeek(new Date());
      let ToDate = endOfWeek(new Date());
      ToDate = addWeeks(ToDate, addWeek);
      switch (this.selectedWorkWeek) {
        case 'TUTOMO':
          FromDate = addDays(ToDate, 2);
          ToDate = addDays(ToDate, 1);
          this.enableDaysForFromDate = [2], this.enableDaysForToDate = [1], FromDate, ToDate;
          break;
        case 'WETOTU':
          FromDate = addDays(ToDate, 3);
          ToDate = addDays(ToDate, 2);
          this.enableDaysForFromDate = [3], this.enableDaysForToDate = [2], FromDate, ToDate;
          break;
        case 'THTOWE':
          FromDate = addDays(ToDate, 4);
          ToDate = addDays(ToDate, 3);
          this.enableDaysForFromDate = [4], this.enableDaysForToDate = [3], FromDate, ToDate;
          break;
        case 'FRTOTH':
          FromDate = addDays(ToDate, 5);
          ToDate = addDays(ToDate, 4);
          this.enableDaysForFromDate = [5], this.enableDaysForToDate = [4], FromDate, ToDate;
          break;
        case 'SATOFR':
          FromDate = addDays(ToDate, 6);
          ToDate = addDays(ToDate, 5);
          this.enableDaysForFromDate = [6], this.enableDaysForToDate = [5], FromDate, ToDate;
          break;
        case 'SUTOSA':
          FromDate = new Date(FromDate);
          ToDate = addDays(ToDate, -1);
          this.enableDaysForFromDate = [0], this.enableDaysForToDate = [6], FromDate, ToDate;
          break;
        default:
          this.enableDaysForFromDate = [], this.enableDaysForToDate = [];
      }
    }

  }
  payrollGroupOnChange(event) {
    this.payrollReportFormGroup.value.payrollGroupId = event.value;
    if (this.payrollReportFormGroup.value.payrollGroupId) {
      this.getUsersForPayrollGroup();
    }
    let selectedPayrollGroup = (this.masterPayrollGroup || []).find((obj) => obj.id === event.value);
    if (selectedPayrollGroup) {
      this.filterDatesByPayrollGroup(selectedPayrollGroup);
    }
  }
  onDateChange(input, value) {
    input.onChange(format(value, 'MM/DD/YYYY'));
    input.name = value;

    if ((this.seletedPayPeriod || '').toUpperCase() === 'DAILY') {
      let changeInputName = input.name === 'FromDate' ? 'ToDate' : 'FromDate';
      changeInputName = value;
    } else {
      let addWeek = 0;
      if ((this.seletedPayPeriod || '').toUpperCase() === 'WEEKLY') {
        addWeek = 1;
      } else if ((this.seletedPayPeriod || '').toUpperCase() === 'BI-WEEKLY') {
        addWeek = 2;
      } else if ((this.seletedPayPeriod || '').toUpperCase() === 'MONTHLY') {
        addWeek = 4;
      }
      let changeInputName = '', changeValue;
      if (input.name === 'FromDate') {
        changeInputName = 'ToDate';
        changeValue = addWeeks(value, addWeek);
      } else {
        changeInputName = 'FromDate';
        changeValue = addWeeks(value, -addWeek);
      }
      changeInputName = changeValue;
    }
  }

  disableDaysForToDate(date: Date): boolean {
    let enableDays = this.enableDaysForToDate || [];
    if (enableDays.length) {
      return !enableDays.includes(date.getDay());
    }
    return false;
  }
  disableDaysForFromDate(date: Date): boolean {
    let enableDays = this.enableDaysForFromDate || [];
    if (enableDays.length) {
      return !enableDays.includes(date.getDay());
    }
    return false;
  }
  getPayrollGroupDropDown() {
    this.payrollReportService.getPayrollGroupDropDown().subscribe((response: any) => {
      this.masterPayrollGroup = response.data;
    });
  }
  getUsersForPayrollGroup() {
    this.payrollReportService.getUsersForPayrollGroup(this.payrollReportFormGroup.value.payrollGroupId).subscribe((response: any) => {
      this.masterUserForPayrollGroup = response;
    });
  }
}

