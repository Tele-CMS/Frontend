import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lineChartData: Array<any> = [
    { data: [10,15,25,30], label: 'Jan' },
    { data: [25,51,52,51], label: 'Feb' },
    { data: [22,88,55,22], label: 'Mar' },
    { data: [33,15,25,25], label: 'Apr' },
    // { data: [], label: 'May' },
    // { data: [], label: 'Jun' },
    // { data: [], label: 'Jul' },
    // { data: [], label: 'Aug' },
    // { data: [], label: 'Sep' },
    // { data: [], label: 'Oct' },
    // { data: [], label: 'Nov' },
    // { data: [], label: 'Dec' }
  ];

  lineChartLabels: Array<any> = [
    'Jan','Feb','Mar','Apr'
 ];
  lineChartType: string = 'line';
  constructor() { }

  ngOnInit() {
  }

}
