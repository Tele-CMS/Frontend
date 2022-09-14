import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { format } from 'date-fns';

@Component({
  selector: 'app-recurrence-rule',
  templateUrl: './recurrence-rule.component.html',
  styleUrls: ['./recurrence-rule.component.css']
})
export class RecurrenceRuleComponent implements OnInit, OnChanges {
  @Input() minRecurrenceDate?: any;
  @Output() onChangeRecurrenceRule = new EventEmitter<string>();
  minUntilDate: Date = new Date();
  recurrenceForm: FormGroup;
  weeksArray = [
    { id: 'SU', value: 'Sun' },
    { id: 'MO', value: 'Mon' },
    { id: 'TU', value: 'Tue' },
    { id: 'WE', value: 'Wed' },
    { id: 'TH', value: 'Thu' },
    { id: 'FR', value: 'Fri' },
    { id: 'SA', value: 'Sat' }
  ];

  daysArray = [];
  weekPositionArray = [
    {id: 1, value: 'First'},
    {id: 2, value: 'Second'},
    {id: 3, value: 'Third'},
    {id: 4, value: 'Fourth'}
  ];

  monthsArray = [
  {id: 1, value: 'Jan'},
  {id: 2, value: 'Feb'},
  {id: 3, value: 'Mar'},
  {id: 4, value: 'Apr'},
  {id: 5, value: 'May'},
  {id: 6, value: 'Jun'},
  {id: 7, value: 'Jul'},
  {id: 8, value: 'Aug'},
  {id: 9, value: 'Sep'},
  {id: 10, value: 'Oct'},
  {id: 11, value: 'Nov'},
  {id: 12, value: 'Dec'}
];

  constructor(private formBuilder: FormBuilder) {
    for(let i= 1; i <= 31; i++) {
      this.daysArray.push(i);
    }
   }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['minRecurrenceDate'] && changes['minRecurrenceDate'].currentValue){
      this.minUntilDate = new Date(changes['minRecurrenceDate'].currentValue);
    }
  }

  ngOnInit() {
    let weekControls = {};
    this.weeksArray.forEach((obj) => {
      weekControls[obj.id] = new FormControl()
    })

    let monthControls = {
      isOnDay: new FormControl(true),
      byMonthDay: new FormControl(1),
      bySetPos: new FormControl(1),
      byDay: new FormControl('SU'),
    };

    let yearControls = {
      isOnDay: new FormControl(true),
      byMonth: new FormControl(1),
      byMonthDay: new FormControl(1),
      bySetPos: new FormControl(1),
      byDay: new FormControl('SU'),
    };

    this.recurrenceForm = this.formBuilder.group({
      rule: ['Daily'],
      interval: [1],
      weeksGroup: this.formBuilder.group(weekControls),
      monthsGroup: this.formBuilder.group(monthControls),
      yearsGroup: this.formBuilder.group(yearControls),
      endsOn: [1],
      count: [''],
      until: [this.minUntilDate],
    })

    this.recurrenceForm.patchValue({
      weeksGroup: {
        SU: true
      }
    })

    this.onChangeRule(this.recurrenceForm.value);
    this.recurrenceForm.valueChanges.subscribe(this.onChangeRule.bind(this));
  }

  get formControls() {
    return this.recurrenceForm.controls;
  }

  get monthControls() {
    return (<FormGroup>this.recurrenceForm.get('monthsGroup')).controls;
  }

  get yearControls() {
    return (<FormGroup>this.recurrenceForm.get('yearsGroup')).controls;
  }

  onChangeRule(values: any) {
    let rRuleJson = {
      FREQ: values.rule.toUpperCase(),
    };

    switch((values.rule || '').toUpperCase()){
      case 'DAILY':
        rRuleJson['INTERVAL'] = values.interval && Number.isInteger(parseInt(values.interval)) ? values.interval : 1;
      break;
      case 'WEEKLY':
        rRuleJson['INTERVAL'] = values.interval && Number.isInteger(parseInt(values.interval)) ? values.interval : 1;
        let byDay = [];
        Object.keys(values.weeksGroup).forEach((obj) => {
          if(values.weeksGroup[obj])
            byDay.push(obj);
        })
        rRuleJson['BYDAY'] = byDay.join(',');
      break;
      case 'MONTHLY':
        rRuleJson['INTERVAL'] = values.interval && Number.isInteger(parseInt(values.interval)) ? values.interval : 1;
        if(values.monthsGroup.isOnDay) {
          rRuleJson['BYMONTHDAY'] = values.monthsGroup.byMonthDay;
        } else {
          rRuleJson['BYSETPOS'] = values.monthsGroup.bySetPos;
          rRuleJson['BYDAY'] = values.monthsGroup.byDay;
        }
      break;
      case 'YEARLY':
        if(values.yearsGroup.isOnDay) {
          rRuleJson['BYMONTH'] = values.yearsGroup.byMonth;
          rRuleJson['BYMONTHDAY'] = values.yearsGroup.byMonthDay;
        } else {
          rRuleJson['BYSETPOS'] = values.yearsGroup.bySetPos;
          rRuleJson['BYDAY'] = values.yearsGroup.byDay;
          rRuleJson['BYMONTH'] = values.yearsGroup.byMonth;
        }
      break;
      default:
      break;
    }

    rRuleJson['COUNT'] = values.endsOn == '1' ? values.count && Number.isInteger(parseInt(values.count)) ? values.count : 1 : null,
    rRuleJson['UNTIL'] = values.endsOn == '2' ? format(values.until || new Date(), 'YYYY-MM-DDTHH:mm:ss[Z]') : null

    let rRuleString = [];
    Object.keys(rRuleJson).forEach((obj) => {
      if(rRuleJson[obj])
        rRuleString.push(`${obj}=${rRuleJson[obj]}`);
    })

    const stringValue = rRuleString.join(';');
    this.onChangeRecurrenceRule.emit(stringValue)
  }

}
