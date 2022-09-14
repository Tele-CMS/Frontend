import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() lineChartData: any[];
  @Input() lineChartLabels: any[];
  @Input() lineChartOptions: any[];
  @Input() lineChartColors: any[]
  @Output() chartClicked: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("baseChart") chart: BaseChartDirective;
  public lineChartType: string = 'line';

   constructor() {
    this.lineChartData = [];
    this.lineChartLabels = [];
    this.lineChartOptions = [];
    this.lineChartColors = []
  }
  ngOnInit() {

  } 
  onChartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    this.chartClicked.emit({ event, active });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lineChartLabels.previousValue != changes.lineChartLabels.currentValue) {
      if (this.chart !== undefined && this.chart.ctx !== undefined) {
        this.chart.ngOnDestroy();
        this.chart.labels = this.lineChartLabels;
        this.chart.colors = this.lineChartColors;
        this.chart.datasets = this.lineChartData;
        this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
        this.chart.chart.update();
      }
    }
  }
}
