import { Component, OnInit } from '@angular/core';
import { FilterModel } from '../core/modals/common-model';
import { Router } from '@angular/router';
import { ManageDatabaseService } from './manage-database.service';
import { ManageDatabaseModel } from './manage-database.model';
import { Metadata, ResponseModel } from '../../platform/modules/core/modals/common-model';
import { MatDialog } from '@angular/material';
import { AddDatabaseComponent } from './add-database/add-database.component';

@Component({
  selector: 'app-manage-database',
  templateUrl: './manage-database.component.html',
  styleUrls: ['./manage-database.component.css']
})
export class ManageDatabaseComponent implements OnInit {
  searchText:string=""
  private filterModel:FilterModel;
  databaseList:Array<ManageDatabaseModel>=[]
  metaData:Metadata;
  displayedColumns: Array<any> = [
    { displayName: 'Database Name', key: 'databaseName', isSort: true, class: '', width: '30%' },
    { displayName: 'Server Name', key: 'serverName', isSort: true, class: '', width: '30%' },
    { displayName: 'User Name', key: 'userName', class: '', width: '30%' },
    { displayName: 'Assigned Count', key: 'noOfOrg', class: '', width: '10%' },
    { displayName: 'Centralized', key: 'isCentralised', class: '', width: '10%',type:true },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }

  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
  ];
  constructor(private router:Router,private databaseService:ManageDatabaseService,private dialogModal: MatDialog) { 
    this.filterModel=new FilterModel();
  }

  ngOnInit() {
    this.getDatabaseList();
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getDatabaseList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.databaseDetailID;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(actionObj.data);
        break
      default:
        break;
    }
  }


  applyFilter(searchText: string = '') {
    if (searchText == '' || searchText.length > 2) {
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
      this.getDatabaseList();
    }
  }

  getDatabaseList() {
    this.databaseService.getAll(this.filterModel).subscribe((response: ResponseModel) => {
      if (response && response.statusCode == 200) {
        this.databaseList = (response.data==null || response.data.length==0)?[]:response.data;
        this.metaData = response.meta;
      }
      else{
        this.databaseList =[];
        this.metaData = new Metadata();
      }
    });
  }
  clearFilters() {
    this.searchText = "";
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getDatabaseList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  openDialog(databaseModel: ManageDatabaseModel=null) {
    this.createModal(databaseModel);   //Please chnage this to get info from db only both in react and angualr code
    // if (id != null && id > 0) {
    //   this.databaseService.getById(id).subscribe((response: any) => {
    //     if (response != null && response.data != null) {
    //       this.createModal(response.data);
    //     }
    //   });
    // }
    // else {
    //   this.createModal(new ManageDatabaseModel());
    // }
  }

  createModal(databaseModel:ManageDatabaseModel) {
    let dbModal;
    dbModal = this.dialogModal.open(AddDatabaseComponent, { data: databaseModel })
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getDatabaseList();
    });
  }
}
