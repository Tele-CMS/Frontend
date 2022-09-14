import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DashboardService } from '../dashboard.service';
import { Metadata, FilterModel, ResponseModel } from '../../../../../super-admin-portal/core/modals/common-model';
import { AuthorizationModel } from '../dashboard.model';
import { merge } from 'rxjs';
import { CommonService } from '../../../core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-list',
  templateUrl: './auth-list.component.html',
  styleUrls: ['./auth-list.component.css']
})
export class AuthListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  authMeta: Metadata;
  authList: Array<AuthorizationModel> = [];
  authFilterModel: FilterModel;
  constructor(
    private dashboardService:DashboardService,
    private commonService: CommonService,
    private route: Router
  ) {
    this.authMeta = new Metadata();
    this.authFilterModel=new FilterModel()
   }
  ngOnInit() {
    this.getAuthListForDashboard();
    this.onSortOrPageChanges();
  }
  getAuthListForDashboard() {
    this.dashboardService.getAuthListForDashboard(this.authFilterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.authList = response.data != null && response.data.length > 0 ? response.data : [];
        this.authMeta = response.meta;
      }
    });
  }

  onSortOrPageChanges() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.paginator.page)
      .subscribe(() => {
        const changeState = {
          sort: this.sort.active || '',
          order: this.sort.direction || '',
          pageNumber: (this.paginator.pageIndex + 1)
        }
        this.setAuthPaginatorModel(changeState.pageNumber, this.authFilterModel.pageSize, changeState.sort, changeState.order);
        this.getAuthListForDashboard();
      })
  }
  onAuthTableActionClick(clientId: number) {
    this.route.navigate(["web/member/authorization"], { queryParams: { id: this.commonService.encryptValue(clientId, true) } });
  }
  setAuthPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.authFilterModel.pageNumber = pageNumber;
    this.authFilterModel.pageSize = pageSize;
    this.authFilterModel.sortOrder = sortOrder;
    this.authFilterModel.sortColumn = sortColumn;
  }
}
