import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @Input() pieChartData: any[];
  @Input() pieChartLabels: any[];
  @Input() pieChartOptions: any[];
  @Input() pieColors: any[];
  @Output() chartClicked: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("pieChart") chart: BaseChartDirective;

  // pieChartOptions = {
  //   tooltips:  {enabled : false}
  // }
  public pieChartType: string = 'pie';
  constructor() {
    this.pieChartData = [];
    this.pieChartLabels = []; this.pieColors = [];
    this.pieChartOptions = [];
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pieChartLabels && changes.pieChartLabels.previousValue != changes.pieChartLabels.currentValue) {
      if (this.chart !== undefined && this.chart.ctx !== undefined) {
        this.chart.ngOnDestroy();
        this.chart.labels = this.pieChartLabels;
        this.chart.data = this.pieChartData;
        this.chart.colors = this.pieColors;
        this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
        this.chart.chart.update();
      }
    }
    if (changes.pieChartData && changes.pieChartData.previousValue != changes.pieChartData.currentValue) {
      if (this.chart !== undefined && this.chart.ctx !== undefined) {
        this.chart.ngOnDestroy();
        this.chart.labels = this.pieChartLabels;
        this.chart.data = this.pieChartData;
        //this.chart.colors = this.pieColors;
        this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
        this.chart.chart.update();
      }
    }
  }

  onChartClicked(e: any) {
    this.chartClicked.emit(e);
  }

  chartHovered(event: any) {
    // console.log(event);
  }
}


