import { Component, OnInit } from '@angular/core';
import { DiagnosisModel, DiagnosisDataModel } from './diagnosis.model';
import { NotifierService } from 'angular-notifier';
import { ResponseModel, Metadata, FilterModel } from '../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { DiagnosisModalComponent } from './diagnosis-modal/diagnosis-modal.component';
import { ActivatedRoute } from '@angular/router';
import { CommonService, LayoutService } from '../../core/services';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {
  clientId: number;
  diagnosisModel: DiagnosisModel;
  diagnosisList: Array<DiagnosisModel> = [];
  addPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  metaData: any;
  filterModel: FilterModel;
  linkedEncounterId: number;
  isRoleClient: boolean;
  loginClientId: number;
  searchText: string;
  isShowAlert: boolean =false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private clientsService: ClientsService,
    private diagnosisDialogModal: MatDialog,
    private notifier: NotifierService,
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private layoutService: LayoutService
  ) {
    this.filterModel = new FilterModel();
    this.metaData = new Metadata()
  }

  DiagnosisColumns: Array<any> = [
    // { displayName: 'ALERT', key: 'flag', width: '10px', type:'alert'},
    { displayName: 'Diagnosis Date', key: 'diagnosisDate', isSort: true, class: '', type: "date" },
    { displayName: 'Diagnosis Code', isSort: true, key: 'code', class: '' },
    { displayName: 'Diagnosis Description', isSort: true, key: 'diagnosis', class: '' },
    // { displayName: 'Source', key: 'source', class: '', width: '30%' },
    { displayName: 'Actions', key: 'Actions', class: '', width: '0%' },
  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
 

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.isRoleClient = user.users3 && user.users3.userRoles && (user.users3.userRoles.userType || '').toUpperCase() == 'CLIENT';
        this.clientId = user.id;
        this.getDiagnosisList();
        if (this.isRoleClient)
          this.loginClientId = user.id;
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.isRoleClient) { 
        this.clientId = this.loginClientId;
      } else {
        this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
        this.searchText = params.searchText == undefined ? '' : this.commonService.encryptValue(params.searchText,false);
       
      }
    });
    // if(this.searchText != "")
    // {
    //   this.applyFilter();
    // }
    // else
    // {
    //   this.getDiagnosisList();
    // }
    
    this.getUserPermissions();

    this.layoutService.clientDrawerData.subscribe(({ encounterId }) => {
      this.linkedEncounterId = encounterId;
    });
  }

  applyFilter() {
    this.searchText = this.searchText || '';
    if (this.searchText == '' || this.searchText.trim().length >= 3) {
      this.filterModel.searchText = this.searchText;
      this.getDiagnosisList();
    }
  }

  clearFilters() {
    this.searchText = '';
    this.applyFilter();
  }

  getDiagnosisList() { 
    this.clientsService.getDiagnosisList(this.clientId, this.filterModel,this.isShowAlert).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.data.length > 0) {
        this.diagnosisList = (response.data || []).map(x => {
          x['disableActionButtons'] = x.id > 0 ? [] : ['edit', 'delete'];
          x.flag = x.flag + "," + x.alertType;
          return x;
        });
        this.metaData = response.meta || {}; 
        
      } else {
        this.diagnosisList = [];
        this.metaData = new Metadata(); 
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }

  //page load and sorting
  onPageOrSortChange(changeState?: any) {
    
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getDiagnosisList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  refreshGrid() {
    this.getDiagnosisList();
  }

  openDialog(id?: number) {
    if (id > 0) {
      if (id != null && id > 0) {
        this.clientsService.getDiagnosisById(id).subscribe((response: any) => {
          if (response != null && response.data != null) {
            this.createModal(response.data);
          }
        });
      }
    } else {
      this.createModal();
    }
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        this.dialogService.confirm(`Are you sure you want to delete patient's diagnosis ?`).subscribe((result: any) => {
          if (result == true) {
            this.clientsService.deleteDiagnosis(id).subscribe((response: ResponseModel) => {
              if (response.statusCode === 200) {
                this.notifier.notify('success', response.message)
                if ((this.diagnosisList || []).length == 1)
                  this.filterModel.pageNumber = (this.filterModel.pageNumber - 1) || 1;
                this.getDiagnosisList();
              } else if (response.statusCode === 401) {
                this.notifier.notify('warning', response.message)
              } else {
                this.notifier.notify('error', response.message)
              }
            });
          }
        })
        break;
      default:
        break;
    }
  }
  createModal(diagnosis?: DiagnosisDataModel) {
    diagnosis = diagnosis || new DiagnosisDataModel();
    diagnosis.patientID = this.clientId;
    diagnosis.linkedEncounterId = this.linkedEncounterId;
    const modalPopup = this.dialogModal.open(DiagnosisModalComponent, {
      hasBackdrop: true,
      data: { ...diagnosis }
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.getDiagnosisList();
      }
    });
  }
  isAlertChecked(event: any) {
    if (event.checked) {
     this.isShowAlert = true;
    }
    else
    {
     this.isShowAlert = false;
    }
    this.getDiagnosisList();
 }
  getUserPermissions() {
    if (this.isRoleClient) {
      this.actionButtons = [];
      return;
    }
    const actionPermissions = this.commonService.getUserScreenActionPermissions('CLIENT', 'CLIENT_DIAGNOSIS_LIST');
    const { CLIENT_DIAGNOSIS_LIST_ADD, CLIENT_DIAGNOSIS_LIST_UPDATE, CLIENT_DIAGNOSIS_LIST_DELETE } = actionPermissions;
    if (!CLIENT_DIAGNOSIS_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!CLIENT_DIAGNOSIS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }
    this.addPermission = CLIENT_DIAGNOSIS_LIST_ADD || false;

  }
}
