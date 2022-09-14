import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImmunizationModel } from './immunization.model';
import { ClientsService } from '../clients.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { ImmunizationModalComponent } from './immunization-modal/immunization-modal.component';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { NotifierService } from 'angular-notifier';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-immunization',
  templateUrl: './immunization.component.html',
  styleUrls: ['./immunization.component.css']
})
export class ImmunizationComponent implements OnInit {
  clientId: number;
  immunizationModel: ImmunizationModel;
  immunizationList: Array<ImmunizationModel> = [];
  addPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  header: string = "Patient Immunization";
  
  tooltipdMessage="Maximum 7 immunization are allowed";
  maxAllowedLimit=7;
  constructor(private activatedRoute: ActivatedRoute, private clientsService: ClientsService, private immunizationService: DialogService, private immunizationDialogModal: MatDialog, private notifier: NotifierService,private commonService:CommonService) { }


  //inital loading
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id,false);
    });

    //on initial page load call listing of immunization
    this.getImmunizationList();
    this.getUserPermissions();
  }

  //listing of immunization
  getImmunizationList() {
    this.clientsService.getImmunizationList(this.clientId).subscribe((response: ResponseModel) => { 
      if (response != null && response.data != null && response.data.length > 0) {
        this.immunizationList = response.data;
      }else{ 
        this.immunizationList = [];
      }
    }
    );
  }

  //open popup and map model on popup
  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientsService.getImmunizationById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.immunizationModel = response.data;
          this.createModal(this.immunizationModel);
        }
      });
    }
    else {
      this.immunizationModel = new ImmunizationModel();
      this.createModal(this.immunizationModel);
    }

  }

  //create modal popup of immunization for create or update
  createModal(immunizatioModel: ImmunizationModel) {
    this.immunizationModel.patientID = this.clientId;
    let immunizationModal ;
    immunizationModal = this.immunizationDialogModal.open(ImmunizationModalComponent, { data:{immunization: immunizatioModel,refreshGrid:this.getImmunizationList.bind(this)} })
    immunizationModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
        this.getImmunizationList()
      }
    });
  }
  refreshGrid()
  {
    this.getImmunizationList();
  }


  //delete immunization
  delete(id: number) {
    this.immunizationService.confirm('Are you sure you want to delete this immunization?').subscribe((result: any) => {
      if (result == true) {
        this.clientsService.deleteImmunization(id).subscribe((response: any) => {
          if (response != null && response.data != null) {
            if (response.statusCode == 200) {
              this.notifier.notify('success', response.message);
              this.getImmunizationList();
            } else {
              this.notifier.notify('error', response.message)
            }
          }
        });
      }
    });

  }

  getUserPermissions() {
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_IMMUNIZATION_LIST');
    const { CLIENT_IMMUNIZATION_LIST_ADD, CLIENT_IMMUNIZATION_LIST_UPDATE, CLIENT_IMMUNIZATION_LIST_DELETE } = actionPermissions;
    
    this.addPermission = CLIENT_IMMUNIZATION_LIST_ADD || false;
    this.updatePermission = CLIENT_IMMUNIZATION_LIST_UPDATE || false;
    this.deletePermission = CLIENT_IMMUNIZATION_LIST_DELETE || false;

  }
  disableButton() {
    return this.immunizationList && this.immunizationList.length > this.maxAllowedLimit;
  }
}
