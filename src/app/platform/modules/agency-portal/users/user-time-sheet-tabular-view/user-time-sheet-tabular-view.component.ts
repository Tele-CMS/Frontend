import { Component, OnInit } from '@angular/core';
import { UserTimesheetTabularViewModel } from '../user-time-sheet-sheet-view/timesheet-sheet-view.model';
import { UserTimeSheetTabularViewService } from './user-time-sheet-tablular.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { MatDialog } from '@angular/material';

interface DateObject {
  fromDate: string,
  toDate: string
}
@Component({
  selector: 'app-user-time-sheet-tabular-view',
  templateUrl: './user-time-sheet-tabular-view.component.html',
  styleUrls: ['./user-time-sheet-tabular-view.component.css']
})
export class UserTimeSheetTabularViewComponent implements OnInit {
  timesheetStatus: Array<any>;
  userTimeSheetModel: UserTimesheetTabularViewModel;
  staffId: number;
  loadingMasterData: boolean = false;
  currentWeekValue: number = 0;
  ChkAllSubmitStatus: boolean = false;
  timeSheetIdArray: Array<any> = [];
  submitTimeSheetCheck: boolean = false;
  isActionChecked: boolean = false;
  statusArray: Array<any> = [];
  DateObject: DateObject = {
    fromDate: null,
    toDate: null,
  };
  private usersTimesheetTabularData: UserTimesheetTabularViewModel[];
  private userTimeSheetFormGroup: FormGroup;
  private displayedColumns: string[] = ['submitStatus', 'dateOfService', 'appointmentTypeName', 'expectedTimeDuration', 'actualTimeDuration', 'status'];
  constructor(private userTimeSheetTableService: UserTimeSheetTabularViewService, private userTimeSheetDailog: MatDialog, private formBuilder: FormBuilder, private router: Router, private notifier: NotifierService) {
    this.timesheetStatus = [];
    this.DateObject = {
      fromDate: format(startOfWeek(new Date()), 'MM-DD-YYYY'),
      toDate: format(endOfWeek(new Date()), 'MM-DD-YYYY')
    }
  }


  ngOnInit() {
    if (this.staffId) {
      this.getUserTimesheetTabularViewData();
      this.setFilteredDateObject(this.currentWeekValue);
    }
  }
  getUserTimesheetTabularViewData() {
    this.userTimeSheetTableService.getAllUserTimeSheetTabularViewData(this.staffId, this.currentWeekValue)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.usersTimesheetTabularData = response.data.map(x => {
              x.dateOfService = format(x.dateOfService, 'MM/DD/YYYY');
              return x;
            })
            this.statusArray = this.usersTimesheetTabularData.filter((x) => x.status.toLowerCase() == 'pending');

          } else {
            this.usersTimesheetTabularData = [];
          }
        });
  }
  setWeekValue(weekValue) {
    this.currentWeekValue = weekValue;
    this.setFilteredDateObject(weekValue);
  }
  setFilteredDateObject(weekToAdd) {
    let weekStartDate = addWeeks(this.DateObject.fromDate, weekToAdd);
    let weekEndDate = addWeeks(this.DateObject.toDate, weekToAdd);
    this.DateObject = {
      fromDate: format(weekStartDate, 'MM-DD-YYYY'),
      toDate: format(weekEndDate, 'MM-DD-YYYY'),
    };
  }
  changeWeekValue(changeValue) {
    this.currentWeekValue = (this.currentWeekValue) + (changeValue),
      this.setWeekValue(this.currentWeekValue);
    this.getUserTimesheetTabularViewData();
  }
  submitTimeSheetStatusCheck(e, id) {
    let timeSheetIdArray = this.timeSheetIdArray;
    if (e.checked) {
      timeSheetIdArray.push(id);
    } else {
      let index = timeSheetIdArray.indexOf(id);
      timeSheetIdArray.splice(index, 1);
    }
    this.timeSheetIdArray = timeSheetIdArray;
    if (!(timeSheetIdArray.length)) {
      this.ChkAllSubmitStatus = false;
      this.isActionChecked = false;
    } else {
      this.isActionChecked = true;
    }
  }
  checkAllForSubmitTimeSheet(e) {
    let timeSheetDataArray = [], timeSheetIdArray = [];
    timeSheetDataArray = this.usersTimesheetTabularData;
    timeSheetDataArray.forEach((obj) => {
      if (obj.status === 'Pending') {
        if (e.checked) {
          this.isActionChecked = true,
            timeSheetIdArray.push(obj.id);
          this.submitTimeSheetCheck = true;
        } else {
          this.isActionChecked = false,
            timeSheetIdArray = [];
          this.submitTimeSheetCheck = false;
        }
      }
    });
    this.timeSheetIdArray = timeSheetIdArray;
  }
  submitTimeSheetStatus() {
    if (this.timeSheetIdArray.length > 0) {
      this.userTimeSheetTableService.submitTimeSheetStatus(this.timeSheetIdArray).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.timeSheetIdArray = [];
            this.getUserTimesheetTabularViewData();
        } else {
          this.notifier.notify('error', response.message);
        }
      });
    }
    else {
      this.notifier.notify('warning', "Please update status first!");
    }
  }
}