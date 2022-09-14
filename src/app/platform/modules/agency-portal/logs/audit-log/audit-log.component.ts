import { Component, OnInit } from '@angular/core';
import { AudiLogModel } from '../logs.model';
import { ResponseModel, FilterModel, Metadata } from '../../../core/modals/common-model';
import { LogsService } from '../logs.service';
import { format } from 'date-fns';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
   metaData: any;
   filterModel :FilterModel;
   auditLogData: AudiLogModel[];
   searchText: string = "";
   addPermission: boolean;
   displayedColumns: Array<any> = [
    { displayName: 'Screen', key: 'screenName', isSort: true, class: ''},
    { displayName: 'Column', key: 'columnName', isSort: false, class: ''},
    { displayName: 'Old Value', key: 'oldValue', class: ''},
    { displayName: 'New Value', key: 'newValue', class: ''},
    { displayName: 'Name', key: 'patientName', class: ''},
    { displayName: 'Action', key: 'action', class: ''},
    { displayName: 'Date', key: 'logDate', class: ''},
    { displayName: 'Created By', key: 'createdByName', class: ''},
    { displayName: 'Actions', key: 'Actions', class: '' }
  ];
  actionButtons: Array<any> = [ 
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times'},
  ]; 
  constructor(
    private auditLogService: LogsService,
    private dialogService: DialogService,
    private notifier: NotifierService,
  ) {
  }
  ngOnInit() {
    this.filterModel=new FilterModel();
    this.getAuditLogList();
    this.getUserPermissions();
  }


  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber,this.filterModel.pageSize,changeState.sort,changeState.order,this.filterModel.searchText);
  //   this.getAuditLogList();
  // } old one
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getAuditLogList();
  }

  getAuditLogList() {
    this.filterModel.sortColumn = this.filterModel.sortColumn || '';
    this.filterModel.sortOrder = this.filterModel.sortOrder || ''; 
    this.auditLogService.getAuditLogListing(this.filterModel).subscribe((response: ResponseModel) => {
      this.auditLogData = response.data;
      this.auditLogData = (response.data || []).map((obj: any) => {
        obj.logDate = format(obj.logDate, 'DD-MM-YYYY hh:mm:ss');
        obj.patientName = obj.patientName ? obj.patientName : '-'
        obj.oldValue = obj.oldValue ? obj.oldValue : '-'
        obj.newValue = obj.newValue ? obj.newValue : '-'
        return obj;
      })
       
      if (response != null && response.statusCode == 200) { 
        this.metaData = response.meta;
      }
      else { 
        this.metaData = new Metadata();
      } 
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }

  applyFilter(searchText:string='')
  {    
    this.setPaginatorModel(1,this.filterModel.pageSize,this.filterModel.sortColumn,this.filterModel.sortOrder,searchText);
    if(searchText.trim() =='' || searchText.trim().length >= 3)
       this.getAuditLogList();
  } 

  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getAuditLogList();
  }

  setPaginatorModel(pageNumber:number,pageSize:number,sortColumn:string,sortOrder:string,searchText:string)
  {
    this.filterModel.pageNumber=pageNumber;
    this.filterModel.pageSize=pageSize;
    this.filterModel.sortOrder=sortOrder;
    this.filterModel.sortColumn=sortColumn;
    this.filterModel.searchText=searchText;
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) { 
      case 'DELETE':
        {
          this.dialogService.confirm(`Are you sure you want to delete this Audit Log ?`).subscribe((result: any) => {
            if (result == true) {
              this.auditLogService.delete(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  this.getAuditLogList();
                } else if (response.statusCode === 401) {
                  this.notifier.notify('warning', response.message)
                } else {
                  this.notifier.notify('error', response.message)
                }
              });
            }
          })
        }
        break;
      default:
        break;
    }
  }

  getUserPermissions() {
    const actionPermissions = this.auditLogService.getUserScreenActionPermissions('LOGS', 'LOGS_AUDIT_LOGS_LIST'); 
    console.log("actions ",actionPermissions);
    
    const { LOGS_AUDIT_LOGS_LIST_DELETE } = actionPermissions;
     
    if (!LOGS_AUDIT_LOGS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    // this.addPermission = PAYER_LIST_ADD || false;

  }
}
