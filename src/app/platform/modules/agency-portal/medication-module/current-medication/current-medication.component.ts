import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { MatDialog, MatPaginator } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ResponseModel, Metadata, FilterModel } from '../../../core/modals/common-model';
import { format } from 'date-fns';
import { CommonService, LayoutService } from '../../../core/services';
import { merge } from 'rxjs';
import { MedicationModuleService } from '../medication-module.service';
import { CurrentMedicationModel} from './current-medication.model';
import { CurrentMedicationModalComponent } from './current-medication-modal/current-medication-modal.component';
import { ClientsService } from '../../clients/clients.service';
import { PatientMedicationModel } from '../../clients/client-profile.model';

@Component({
  selector: 'app-current-medication',
  templateUrl: './current-medication.component.html',
  styleUrls: ['./current-medication.component.css']
})
export class CurrentMedicationComponent implements OnInit {
  medicationModel: CurrentMedicationModel;
  medicationList: Array<CurrentMedicationModel> = [];
  clientId: number; 
  addPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  displayedColumns: Array<any>;
  //actionButtons: Array<any>;
  header: string = "Patient Medication";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterModel: FilterModel;
  metaData: any;
  linkedEncounterId: number;
  isRoleClient: boolean;
  loginClientId: number;
  isShowAlert: boolean =false;
  isDisabled: boolean = true
  clientMedicationModel: PatientMedicationModel;
  medicationColumns: Array<any>;
  actionButtons: Array<any> = [];

  constructor(private activatedRoute: ActivatedRoute, private clientsService: MedicationModuleService, private dialogService: DialogService, private medicationDialogModal: MatDialog, private notifier: NotifierService, private commonService: CommonService,private layoutService: LayoutService,
    private clientService: ClientsService) {
    this.filterModel = new FilterModel();
    this.metaData = new Metadata();
    this.displayedColumns = [
      { displayName: 'Alert', key: 'color',  width: '5%',type:'infoWithColor' },
      { displayName: 'Medication', key: 'medication',class: '', width: '10%', isSort: true },
      { displayName: 'Medication Form', key: 'dosageForm', class: '', width: '8%' },
      { displayName: 'Dose', key: 'dose', class: '', width: '8%' },
      { displayName: 'Unit', key: 'unit', class: '', width: '8%' },
      { displayName: 'Quantity', key: 'quantity', class: '', width: '8%', },
      { displayName: 'Days Supply', key: 'daySupply', width: '10%' },
      { displayName: 'Frequency', key: 'frequency', class: '', width: '10%', },
      { displayName: 'Condition', key: 'condition', class: '', width: '10%', },
      { displayName: 'Provider Name', key: 'providerName', width: '12%'},
      { displayName: 'Prescribed Date', key: 'prescribedDate', width: '10%', type:'date', isSort: true },
      { displayName: 'Refills', key: 'refills', width: '8%', isSort: true},
      { displayName: 'Source', key: 'source', width: '8%', type: ['Self Reported', 'Claim'] },
      { displayName: 'Notes', key: 'notes', class: '', width: '20%', type: "8", isInfo: true},
      { displayName: 'Actions', key: 'Actions', width: '8%'}

    ];
    // this.actionButtons = [
    //   { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    //   { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    // ];


    this.medicationColumns = [
      { displayName: "MEDICATION", key: "medicine", class: "", width: "20%",isSort: true },
      { displayName: "DOSE", key: "dose", class: "", width: "20%",isSort: true },
      { displayName: "STRENGTH", key: "strength", class: "", width: "20%",isSort: true },
      {
        displayName: "START DATE",
        key: "startDate",
        width: "20%",
        type: "date",isSort: true
      },
      { displayName: "END DATE", key: "endDate", width: "20%", type: "date",isSort: true },
      {
        displayName: "STATUS",
        key: "isActive",
        width: "10%",
        type: ["Active", "Inactive"],isSort: true
      }
    ];
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.isRoleClient = user.users3 && user.users3.userRoles && (user.users3.userRoles.userType || '').toUpperCase() == 'CLIENT';
        if (this.isRoleClient)
          this.loginClientId = user.id;
          this.clientId = user.id;
          this.getClientMedication();
          // this.getMedicationList();
          this.getUserPermissions();
      }
    });
   
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.isRoleClient) {
        this.clientId = this.loginClientId;
      } else {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
     
    }
    });
    this.layoutService.clientDrawerData.subscribe(({ encounterId }) => {
      this.linkedEncounterId = encounterId;
    });
    //initialization of model
    this.medicationModel = new CurrentMedicationModel;
    this.medicationList = [];

 
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getClientMedication();
  }

  getMedicationList() {
    this.clientsService.getCurrentMedicationList(this.clientId, this.filterModel, this.isShowAlert).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.data.length > 0 && response.statusCode == 200) {
        // this.medicationList = response.data;
        this.medicationList = response.data;
        this.metaData = response.meta;
        this.isDisabled = false;
      }
      else {
        this.medicationList = [];
        this.metaData = new Metadata();
        this.isDisabled = true;
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        this.dialogService.confirm(`Are you sure you want to delete patient's current medication?`).subscribe((result: any) => {
          if (result == true) {
            this.clientsService.deleteCurrentMedication(id, this.linkedEncounterId).subscribe((response: ResponseModel) => {
              if (response.statusCode === 200) {
                this.notifier.notify('success', response.message)
                if ((this.medicationList || []).length == 1)
                  this.filterModel.pageNumber = (this.filterModel.pageNumber - 1) || 1;
                this.getClientMedication();
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
  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientsService.getCurrentmedicationById(id).subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.createModal(response.data);
        }
      });
    }
    else {
      this.createModal(new CurrentMedicationModel());
    }
  }

  openCustomDialog() {
    let customMedicationModel = new CurrentMedicationModel();
    customMedicationModel.isManualEntry = true;
    this.createModal(customMedicationModel);
  }

  createModal(medicationModel: CurrentMedicationModel) {
    medicationModel.patientId = this.clientId;
    medicationModel.linkedEncounterId = this.linkedEncounterId
    let dailogModal;
    dailogModal = this.medicationDialogModal.open(CurrentMedicationModalComponent, { data: { ...medicationModel } })
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
    this.getClientMedication();
 }
  getUserPermissions() {
    if(this.isRoleClient) {
      this.displayedColumns = [
        { displayName: 'Medication', key: 'medication', class: '', width: '10%', isSort: true },
        { displayName: 'Medication Form', key: 'dosageForm', class: '', width: '8%' },
        { displayName: 'Dose', key: 'dose', class: '', width: '8%' },
        { displayName: 'Unit', key: 'unit', class: '', width: '8%' },
        { displayName: 'Quantity', key: 'quantity', class: '', width: '8%', },
        { displayName: 'Days Supply', key: 'daySupply', width: '10%' },
        { displayName: 'Frequency', key: 'frequency', class: '', width: '10%', },
        { displayName: 'Condition', key: 'condition', class: '', width: '10%', },
        { displayName: 'Provider Name', key: 'providerName', width: '12%'},
        { displayName: 'Prescribed Date', key: 'prescribedDate', width: '10%', type:'date', isSort: true },
        { displayName: 'Refills', key: 'refills', width: '8%', isSort: true},
        { displayName: 'Source', key: 'source', width: '8%',type:['Self Reported','Claim'] },
  
      ];
      this.actionButtons = [];
      return;
    }
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CURRENT_MEDICATION_LIST');
    const { CURRENT_MEDICATION_LIST_ADD, CURRENT_MEDICATION_LIST_UPDATE, CURRENT_MEDICATION_LIST_DELETE } = actionPermissions;
    if (!CURRENT_MEDICATION_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!CURRENT_MEDICATION_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }
    this.addPermission = CURRENT_MEDICATION_LIST_ADD || false;
  }
  printPatientCurrentMedication() { 
     this.clientsService.printPatientCurrentMedication(this.clientId).subscribe((response: any) => {
      this.clientsService.downLoadFile(response, 'application/pdf', `Patient Medication List.pdf`)
    })
  } 

  getClientMedication() { 
    this.clientService
      .getMedicationListPaginator(this.filterModel,this.clientId)
      .subscribe((response: ResponseModel) => { 
        if (response != null && response.statusCode == 200) {
          this.clientMedicationModel = response.data;
          this.metaData = response.meta || [];
        }else{
          this.clientMedicationModel = new PatientMedicationModel();
          this.metaData = [];
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      });
  }

 
}
