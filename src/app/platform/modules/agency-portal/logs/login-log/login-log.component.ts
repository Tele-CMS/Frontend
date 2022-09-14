import { Component, OnInit } from '@angular/core';
import { LogsService } from '../logs.service';
import { FilterModel, Metadata, ResponseModel } from '../../../core/modals/common-model';
import { LoginLogModel } from '../logs.model';
import { format } from 'date-fns';

@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.css']
})
export class LoginLogComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel;
  loginLogData: LoginLogModel[];
  searchText: string = "";
  displayedColumns: Array<any> = [
    { displayName: 'Login By', key: 'createdByName', isSort: true, class: '', width: '20%' },
    { displayName: 'Username', key: 'userName', isSort: false, class: '', width: '10%' },
    { displayName: 'Role Name', key: 'roleName', class: '', width: '10%' },
    { displayName: 'IP Address', key: 'ipAddress', class: '', width: '10%' },
    { displayName: 'Login Attempt', key: 'loginAttempt', class: '', width: '15%' },
    { displayName: 'Login Date', key: 'logDate', class: '', width: '15%' },
  ];
  constructor(
    private loginLogService: LogsService,
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getLoginLogList();
  }


  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getLoginLogList();
  // } old one
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getLoginLogList();
  }
  getLoginLogList() {
    this.filterModel.sortColumn = this.filterModel.sortColumn || '';
    this.filterModel.sortOrder = this.filterModel.sortOrder || '';
    this.loginLogService.getLoginLogListing(this.filterModel).subscribe((response: ResponseModel) => {
      this.loginLogData = response.data;
      this.loginLogData = (response.data || []).map((obj: any) => {
        obj.logDate = format(obj.logDate, 'DD-MM-YYYY hh:mm:ss');
        // this.loginAttemptClass = obj.loginAttempt ? 'greenfont' : 'orangefont';
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
  applyFilter(searchText: string = '') { 
    
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getLoginLogList();
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getLoginLogList();
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
}
