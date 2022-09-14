import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicationModel, MedicationDataModel } from './medication.model';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { MatDialog, MatPaginator } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ResponseModel, Metadata, FilterModel } from '../../../core/modals/common-model';
import { format } from 'date-fns';
import { MedicationModalComponent } from './medication-modal/medication-modal.component';
import { CommonService, LayoutService } from '../../../core/services';
import { merge } from 'rxjs';
import { MedicationModuleService } from '../medication-module.service';
import { NgIf } from '@angular/common';
import { Key } from 'protractor';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {
  medicationModel: MedicationModel;
  medicationList: Array<MedicationModel> = [];
  clientId: number;
  addPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  header: string = "Patient Medication";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterModel: FilterModel;
  metaData: Metadata;
  linkedEncounterId: number;
  searchText: string;
  isRoleClient: boolean;
  loginClientId: number;
  isShowAlert: boolean =false ;

  constructor(private activatedRoute: ActivatedRoute, private clientsService: MedicationModuleService, private dialogService: DialogService, private medicationDialogModal: MatDialog, private notifier: NotifierService, private commonService: CommonService, private layoutService: LayoutService) {
    this.filterModel = new FilterModel();
    this.metaData = new Metadata();
    this.displayedColumns = [
      // { displayName: 'Alert', key: 'color',  width: '5%',type:'infoWithColor' },
       { displayName: 'Alert', key: 'flag',  width: '50px',type:'alert' },
       { displayName: 'Medication', key: 'medicineName', class: '', width: '90px' },
      { displayName: 'NDC Detailed Name', key: 'medicineDetails', class: '', width: '90px' },
      { displayName: 'Quantity', key: 'quantity', class: '', width: '80px', },
      { displayName: 'Days Supply', key: 'daySupply', width: '90px' },
      { displayName: 'NDC', key: 'ndc', class: '', width: '90px', },
      { displayName: 'Prescriber NPI', key: 'prescriberNPI', class: '', width: '90px', },
      { displayName: 'Prescriber Name', key: 'prescriberName', class: '', width: '90px', },
      { displayName: 'Pharmacy', key: 'pharmacyName', width: '90px' },
      { displayName: 'Fill Date', key: 'serviceDate', width: '90px', type: 'date' , isSort: true },
      { displayName: 'Actions', key: 'Actions', width: '80px' }
    ];
    this.actionButtons = [
      { displayName: 'Add to Current Medication', key: 'linkToCurrentMed', class: 'fa fa-plus' },
    ];
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
      this.searchText = params.searchText == undefined ? '' : this.commonService.encryptValue(params.searchText,false);
     // this.applyFilter();
     } });
    this.layoutService.clientDrawerData.subscribe(({ encounterId }) => {
      this.linkedEncounterId = encounterId;
    });
    //initialization of model
    this.medicationModel = new MedicationModel;
    this.medicationList = [];
    if(this.searchText != "")
    {
      this.applyFilter();
    }
    else
    {
      this.getMedicationList();
    }
    
    this.getUserPermissions();
  }

  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, searchText, this.filterModel.sortColumn, this.filterModel.sortOrder );
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getMedicationList();
  }

  clearFilters() {
    if (!this.searchText) {
      return;
    }
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, '','','');
    this.getMedicationList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, searchText: string, sort:string, order:string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.searchText = searchText;
    this.filterModel.sortOrder= order;
    this.filterModel.sortColumn=sort;
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, this.filterModel.searchText, changeState.sort, changeState.order,);
    this.getMedicationList();
  }
  
  getMedicationList() {
    this.clientsService.getMedicationList(this.clientId, this.filterModel,this.isShowAlert).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.data.length > 0 && response.statusCode == 200) {
        // this.medicationList = response.data;
      //  this.medicationList = response.data;
      this.medicationList = (response.data || []).map((obj: any) => {
        obj.flag = obj.flag + "," + obj.alertType;
        return obj;
     
    });
    
        this.metaData = response.meta;
      }
      else {
        this.medicationList = [];
        this.metaData = new Metadata();
      }
    }
    );
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'LINKTOCURRENTMED':
        this.addToCurrentMedication(actionObj.data);
        break;
      default:
        break;
    }
  }
  addToCurrentMedication(obj: any) {
    let postData = {
      ndcCode: obj.ndc,
      medSource: obj.id > 0 ? 'MANUALRXCLAIMS' : 'RXCLAIMS',
      recordId: obj.id,
      patientId: this.clientId,
      claimId: obj.claimId
    }
    this.dialogService.confirm(`Are you sure you want to add this selected medication to the current medication list?`).subscribe((result: any) => {
      if (result == true) {
        this.clientsService.addClaimMedToCurrent(postData).subscribe((response: any) => {
          if (response != null && response.statusCode == 200) {
            this.notifier.notify('success', response.message)
          } else if (response.statusCode == 204) {
            this.notifier.notify('warning', response.message)
          } else {
            this.notifier.notify('error', response.message)
          }
        });
    }
  })
}
openDialog(id ?: number) {
  if (id != null && id > 0) {
    this.clientsService.getmedicationById(id).subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {
        this.createModal(response.data);
      }
    });
  }
  else {
    this.createModal(new MedicationDataModel());
  }
}

createModal(medicationModel: MedicationDataModel) {
  medicationModel.patientId = this.clientId;
  medicationModel.linkedEncounterId = this.linkedEncounterId
  let dailogModal;
  dailogModal = this.medicationDialogModal.open(MedicationModalComponent, { data: { ...medicationModel } })
  dailogModal.afterClosed().subscribe((result: string) => {
    if (result == 'SAVE')
      this.getMedicationList();
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
  this.getMedicationList();
}
getUserPermissions() {
  
  if(this.isRoleClient) {
    this.displayedColumns = [
      { displayName: 'Medication', key: 'medicineName', class: '', width: '15%' },
      { displayName: 'NDC Detailed Name', key: 'medicineDetails', class: '', width: '15%' },
     { displayName: 'Quantity', key: 'quantity', class: '', width: '10%', },
     { displayName: 'Days Supply', key: 'daySupply', width: '12%' },
     { displayName: 'NDC', key: 'ndc', class: '', width: '12%', },
     { displayName: 'Prescriber NPI', key: 'prescriberNPI', class: '', width: '14%', },
     { displayName: 'Pharmacy', key: 'pharmacyName', width: '12%' },
     { displayName: 'Fill Date', key: 'serviceDate', width: '10%', type: 'date' , isSort: true },
   ];
   this.actionButtons = [];
    return;
  }
  const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLAIMS_MEDICATION_LIST');
  const { CLAIMS_MEDICATION_LIST_ADD, CLAIMS_MEDICATION_LIST_UPDATE, CLAIMS_MEDICATION_LIST_DELETE } = actionPermissions;
  if (!CLAIMS_MEDICATION_LIST_UPDATE) {
    let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
    this.actionButtons.splice(spliceIndex, 1)
  }
  if (!CLAIMS_MEDICATION_LIST_DELETE) {
    let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
    this.actionButtons.splice(spliceIndex, 1)
  }
  this.addPermission = CLAIMS_MEDICATION_LIST_ADD || false;
}
}
