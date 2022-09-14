import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { ClientsService } from '../clients.service';
import { MatDialog } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from '../../../core/modals/common-model';
import { PatientMedicalFamilyHistoryModel } from './family-history.model';
import { FamilyHistoryModelComponent } from './family-history-model/family-history-model.component';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../core/services';


@Component({
  selector: 'app-family-history',
  templateUrl: './family-history.component.html',
  styleUrls: ['./family-history.component.css']
})
export class FamilyHistoryComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  clientId: number;
  header: string = "Family History";
  patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel;
  patientMedicalFamilyHistoryList: Array<PatientMedicalFamilyHistoryModel> = [];
  addPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  tooltipdMessage="Maximum 7 patients are allowed";
  maxAllowedLimit=7;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private clientsService: ClientsService,
    private patientMedicalFamilyHistoryDialogModal: MatDialog,
    private notifier: NotifierService, private commonService: CommonService
  ) {
    this.patientMedicalFamilyHistoryModel = new PatientMedicalFamilyHistoryModel();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
    });
    this.getPatientMedicalFamilyHistoryList();
    this.getUserPermissions();
  }

  getPatientMedicalFamilyHistoryList() {

    this.clientsService.getPatientMedicalFamilyHistoryList(this.clientId).subscribe((response: ResponseModel) => { 
      if (response != null && response.data != null && response.data.length > 0) {
        this.patientMedicalFamilyHistoryList = response.data; 
      }else{ 
        this.patientMedicalFamilyHistoryList = response.data; 
      }
    }
    );
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientsService.getPatientMedicalFamilyHistoryById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          
          this.patientMedicalFamilyHistoryModel = response.data;
          this.createModal(this.patientMedicalFamilyHistoryModel);
        }
      });
    }
    else {
      this.patientMedicalFamilyHistoryModel = new PatientMedicalFamilyHistoryModel();
      this.createModal(this.patientMedicalFamilyHistoryModel);
    }
  }

  createModal(patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel) {
    this.patientMedicalFamilyHistoryModel.patientID = this.clientId;
    let historyModal;
    historyModal = this.patientMedicalFamilyHistoryDialogModal.open(FamilyHistoryModelComponent, { data: patientMedicalFamilyHistoryModel })
    historyModal.afterClosed().subscribe((result: string) => {
      if (result == 'SAVE')
        this.getPatientMedicalFamilyHistoryList();
    });
  }

  delete(id: number) {
    this.dialogService.confirm('Are you sure you want to delete this family history?').subscribe((result: any) => {
      if (result == true) {
        this.clientsService.deletePatientMedicalFamilyHistory(id).subscribe((response: any) => {
          if (response != null && response.data != null) {
            if (response.statusCode == 204) {
              this.notifier.notify('success', response.message);
              this.getPatientMedicalFamilyHistoryList();
            } else {
              this.notifier.notify('error', response.message)
            }
          }
        });
      }
    });

  }

  getUserPermissions() {
    // this is commented as family history is include in history page
    // const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_FAMILYHISTORY_LIST');
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_HISTORY_LIST');
    const { CLIENT_FAMILYHISTORY_LIST_ADD, CLIENT_FAMILYHISTORY_LIST_UPDATE, CLIENT_FAMILYHISTORY_LIST_DELETE } = actionPermissions;

    this.addPermission = CLIENT_FAMILYHISTORY_LIST_ADD || false;
    this.updatePermission = CLIENT_FAMILYHISTORY_LIST_UPDATE || false;
    this.deletePermission = CLIENT_FAMILYHISTORY_LIST_DELETE || false;

  }
  
  disableButton() {
    return this.patientMedicalFamilyHistoryList && this.patientMedicalFamilyHistoryList.length > this.maxAllowedLimit;
  }
}
