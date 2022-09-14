import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  EventEmitter,
  Output
} from "@angular/core";
import { BaseChartDirective } from "ng2-charts";

@Component({
  selector: "app-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.css"]
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() barChartData: any[];
  @Input() barChartLabels: any[];
  @Input() barChartOptions: any[];
  @Input() barChartColors: any[] = null;
  @Output() chartClicked: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("barChart") chart: BaseChartDirective;
  barChartType: string = "bar";
  constructor() {
    this.barChartData = [];
    this.barChartLabels = [];
    this.barChartOptions = [];
    this.barChartColors = [];
  }

  ngOnInit() {}

  onChartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
    this.chartClicked.emit({ event, active });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.barChartLabels &&
      changes.barChartLabels.previousValue !=
        changes.barChartLabels.currentValue
    ) {
      if (this.chart !== undefined && this.chart.ctx !== undefined) {
        this.chart.ngOnDestroy();
        this.chart.labels = this.barChartLabels;
        this.chart.datasets = this.barChartData;
        this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
        this.chart.chart.update();
      }
    }
    if (
      changes.barChartColors &&
      changes.barChartColors.previousValue !=
        changes.barChartColors.currentValue
    ) {
      if (this.chart !== undefined && this.chart.ctx !== undefined) {
        this.chart.ngOnDestroy();
        this.chart.colors = this.barChartColors;
        this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
        this.chart.chart.update();
      }
    }
  }

  public chartHovered({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}
