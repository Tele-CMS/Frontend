import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { merge } from "rxjs";

// const displayedColumns: Array<any> = [
//   { displayName: 'Service Code', key: 'serviceCode', isSort: true, class: '' },
//   { displayName: 'Description', key: 'description', isSort: true, class: '' },
//   { displayName: 'Billable', key: 'isBillable' },
//   { displayName: 'Unit Duration', key: 'unitDuration' },
//   { displayName: 'Rate Per Unit', key: 'ratePerUnit' },
//   { displayName: 'Required Authorization', key: 'isRequiredAuthorization' },
// ];

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit, OnChanges {

  @Input() inputSource: any[];
  @Input() inputColumns: any[];
  @Input() inputMeta: any;
  @Input() inputButtons: any[];
  @Output() onChange = new EventEmitter();
  @Output() onTableActionClick = new EventEmitter();
  @Input() stickyHeader: boolean;
  @Input() showTooltip:boolean;
  displayedColumns: Array<any>;
  extraColumns: Array<any>;
  columnsToDisplay: Array<any>;
  isHRAAction: boolean = false
  // dataSource: MatTableDataSource<Array<any>> = new MatTableDataSource<
  //   Array<any>
  // >();
  dataSource: Array<any> = [];
  metaData: Meta;
  actionButton: Array<any>;
  noRecords: Array<any>;
  isLoadingResults = true;
  tooltipText:any='';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    
    //this.dataSource = new MatTableDataSource<Array<any>>();
    //let data = this.inputSource;
    this.noRecords = [{}];
    
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.isLoadingResults = true;
      const changeState = {
        sort: this.sort.active || "",
        order: this.sort.direction || "",
        pageNumber: this.paginator.pageIndex + 1,
        pageSize:this.paginator.pageSize
      };
      this.onChange.emit(changeState);
    });

    
    
  }
  
  ngOnChanges(value: any) {
    this.tooltipText=this.showTooltip?"Click to view options":" ";
    if (value.inputColumns) { 
      this.displayedColumns = (value.inputColumns.currentValue || []).filter(
        x => x.key != "Actions"
      );
      let changedColumns = (this.displayedColumns || []).map(obj => obj.key);
      if (
        value.inputButtons != null &&
        value.inputButtons.currentValue.length > 0
      )
        changedColumns.push("Actions");
      this.columnsToDisplay = changedColumns;
      this.extraColumns = (value.inputColumns.currentValue || []).filter(
        x => x.key == "Actions"
      );
    }
    if (value.inputSource) {
      this.isLoadingResults = false;
      this.dataSource = value.inputSource.currentValue;  
      
    }
    if (value.inputMeta) {
      this.metaData = value.inputMeta.currentValue || new Meta();
    }
    if (value.inputButtons) {
      this.actionButton = value.inputButtons.currentValue || []; 
    }
    if (value.inputColumns) {
      this.displayedColumns = (value.inputColumns.currentValue || []).filter(x => x.key != 'Actions');
      let changedColumns = (this.displayedColumns || []).map(obj => obj.key);

      if (value.inputButtons != null && value.inputButtons.currentValue.length > 0)
        changedColumns.push('Actions')
      this.columnsToDisplay = changedColumns;
      this.extraColumns = (value.inputColumns.currentValue || []).filter(x => x.key == 'Actions');
      const columnObj = this.extraColumns && this.extraColumns.find(x => x.type != "" || x.type != undefined);
      this.isHRAAction = columnObj && columnObj.type != '' && columnObj.type == 'memberportalhra' ? true : false
    }
  }
  onToggleClick(action: string, data: any, column: string) {
    const actionObj = {
      action,
      data,
      column
    };
    this.onTableActionClick.emit(actionObj);
  }
  onActionClick(action: string, data: any) {
    
    const actionObj = {
      action,
      data
    };
    this.onTableActionClick.emit(actionObj);
  }
  onCellClick(action: string, data: any)
  {
    
    const actionObj = {
      action,
      data
    };
    this.onTableActionClick.emit(actionObj);
  }

  filteredActionButtons(rowObj: any) {
    let actionButtions = this.actionButton;

    if (rowObj.disableActionButtons && rowObj.disableActionButtons.length > 0) {
      actionButtions = actionButtions.filter(x => !rowObj.disableActionButtons.includes(x.key));
    }
    return actionButtions;
  }

}

class Meta {
  totalPages?: number = 0;
  pageSize?: number = 5;
  currentPage?: number = 1;
  defaultPageSize?: number = 5;
  totalRecords?: number = 0;
  pageSizeOptions?: number[] = []
}
