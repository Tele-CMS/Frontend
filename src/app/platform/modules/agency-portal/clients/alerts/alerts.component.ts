import { Component, OnInit } from '@angular/core';
import { FilterModel } from '../../../core/modals/common-model';
import { ActivatedRoute, Router } from '@angular/router'; 
import { FormBuilder } from '@angular/forms';
import { CommonService } from '../../../core/services';
import { AlertsFilterModel } from './alert.model';
import { format } from 'date-fns';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  metaData: any;
  filterModel: AlertsFilterModel;
  isRoleClient: boolean;
  displayedColumns: Array<any> = [
    { displayName: 'Load Date', key: 'loadDate', class: '', width: '20%', type: 'date' },
    { displayName: 'Alert Type', key: 'alertType', class: '', width: '30%' },
    { displayName: 'Details', key: 'details', class: '', width: '50%', type: "70", isInfo: true },
  ];
  actionButtons: Array<any> = [];
  isAdminLogin: boolean;
  clientId: number;
  loginClientId: number;
  alertsList: Array<any>;
  masterAlertTypes: Array<any>;
  header: string = "Patient Alerts";
  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientsService,
    private formBuilder: FormBuilder,
    private route: Router,
    private commonService: CommonService
  ) {
    this.filterModel = new AlertsFilterModel();
    this.filterModel = {
      ...this.filterModel,
      AlertTypeIds: [],
      startDate: null,
      endDate: null,
    }
    this.alertsList = [];
    this.masterAlertTypes = [];
  }
  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.isRoleClient = user.users3 && user.users3.userRoles && (user.users3.userRoles.userType || '').toUpperCase() == 'CLIENT';
        if (this.isRoleClient)
          this.loginClientId = user.id;
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.isRoleClient) {
        this.clientId = this.loginClientId;
      } else {
        this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      }
      let alertId = params.alertId ? this.commonService.encryptValue(params.alertId, false) : null;
      this.filterModel.AlertTypeIds = alertId > 0 ? [parseInt(alertId, 10)] : [];
      this.filterModel.PatientId = this.clientId;
    });

    this.getMasterAlertTypes();
    this.getPatientAlertsList();
  }

  getMasterAlertTypes() {
    this.clientService.getMasterData('alertsindicatorfilter').subscribe((response: any) => {
      if (response != null) {
        this.masterAlertTypes = response.masterLoadAlerts != null ? response.masterLoadAlerts : [];
      }
    });
  }

  onSelectDeselectAll(key: string = '') {
    if((key || '').toUpperCase() == 'SELECTALL') {
      if((this.filterModel.AlertTypeIds || []).length == this.masterAlertTypes.length) {
        return;
      }
      this.filterModel.AlertTypeIds = this.masterAlertTypes.map(x => x.id);
    } else {
      if ((this.filterModel.AlertTypeIds || []).length == 0) {
        return;
      }
      this.filterModel.AlertTypeIds = [];
    }
  }

  clearFilters() {
    this.filterModel = {
      ...this.filterModel,
      startDate: null,
      endDate: null,
      AlertTypeIds: [],
    }
    this.getPatientAlertsList();
  }

  applyFilter() {
    this.getPatientAlertsList();
  }
  getPatientAlertsList() {
    const filters = {
      ...this.filterModel,
      startDate: this.filterModel.startDate && format(this.filterModel.startDate, 'YYYY-MM-DD'),
      endDate: this.filterModel.endDate && format(this.filterModel.endDate, 'YYYY-MM-DD'),
    }
    this.clientService.getPatientAlertsList(filters).subscribe(
      (response: any) => {
        if (response && response.statusCode == 200) {
          this.alertsList = response.data || [];
          this.metaData = response.meta;
        } else {
          this.alertsList = [];
          this.metaData = {};
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      });
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getPatientAlertsList();
  }
}

