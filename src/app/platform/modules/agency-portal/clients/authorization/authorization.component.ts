import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationModel, AuthorizationProcedureModel, AuthorizationProceduresCPTModel, AuthorizationDisplayModel, AuthorizationServiceCodesDisplayModel, AuthModel } from './authorization.model';
import { ClientsService } from '../clients.service';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { AuthorizationModalComponent } from './authorization-modal/authorization-modal.component';
import { NotifierService } from 'angular-notifier';
import { CommonService } from '../../../core/services';

class AuthorizationFilterModel extends FilterModel {
  authType: string = null;
}

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {
  clientId: number;
  expandedAuthIds: Array<number>;
  authorizationModel: AuthorizationModel[];
  authorizationProcedureModel: AuthorizationProcedureModel[];
  authorizationProceduresCPTModel: AuthorizationProceduresCPTModel[];
  authorizationFilterModel: AuthorizationFilterModel;
  addPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  header: string = "Patient Authorizations";
  //
  authorizationDisplayModel: AuthorizationDisplayModel[];
  authModel: AuthModel;

  constructor(private activatedRoute: ActivatedRoute, private notifier: NotifierService, private clientsService: ClientsService, public activityModal: MatDialog, private dialogService: DialogService,private commonService:CommonService) {
    this.expandedAuthIds = [];
    this.authorizationModel = [];
    this.authorizationProcedureModel = [];
    this.authorizationProceduresCPTModel = [];
    this.authorizationDisplayModel = [];
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id,false);
    });

    this.authorizationFilterModel = new AuthorizationFilterModel;
    //listing of all authorization
    this.getAllAuthorization();
    this.getUserPermissions();
  }

  //get all authorizations
  getAllAuthorization() {
    this.clientsService.getAllAuthorization(this.clientId, this.authorizationFilterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        if (response.data) {
          this.authorizationModel = response.data.Authorization || [];
          this.authorizationProcedureModel = response.data.AuthorizationProcedure || [];
          this.authorizationProceduresCPTModel = response.data.AuthorizationProceduresCPT || [];
          //this.expandedAuthIds = this.authorizationModel.map(obj => obj.authorizationId);
          this.filterModel();
        }
      }
      else {
        this.authorizationModel = [];
        this.authorizationProcedureModel = [];
        this.authorizationProceduresCPTModel = [];
        this.expandedAuthIds = [];
      }
    })
  }

  //expand row event
  handleExpandRow(authId: number) {
    const authIndex = this.expandedAuthIds.findIndex(obj => obj == authId);
    if (authIndex > -1) {
      this.expandedAuthIds.splice(authIndex, 1);
    } else {
      this.expandedAuthIds.push(authId);
    }
  }


  //after get all authorization filter into single model
  filterModel() {    
    if (this.authorizationModel != null && this.authorizationModel.length > 0) {
      this.authorizationDisplayModel = [];
      this.authorizationModel.forEach(element => {
        let authDispModel = new AuthorizationDisplayModel();
        authDispModel.authorizationId = element.authorizationId;
        authDispModel.authorizationNumber = element.authorizationNumber;
        authDispModel.startDate = element.startDate;
        authDispModel.endDate = element.endDate;
        authDispModel.payerName = element.payerName;
        authDispModel.authorizationTitle = element.authorizationTitle;
        authDispModel.isExpired = element.isExpired;

        let authServiceCodeDispModel: AuthorizationServiceCodesDisplayModel[] = [];
        this.authorizationProcedureModel.filter(obj => obj.authorizationId == element.authorizationId).forEach(ele => {
          let authSerCode = new AuthorizationServiceCodesDisplayModel();
          let serviceCodes = this.authorizationProceduresCPTModel.filter(ob => ob.authorizationProcedureId == ele.authorizationProcedureId);
          authSerCode.serviceCodes = serviceCodes.map(obj => obj.serviceCode).join(',');
          authSerCode.modifiers = serviceCodes.map(obj => obj.attachedModifiers).join(',').replace(/^,|,$/g, '');
          authSerCode.unitApproved = ele.totalUnit + ' per ' + ele.globalCodeName;
          let blockUnits = 0;
          serviceCodes.map(obj => { blockUnits = blockUnits + obj.blockedUnit; });
          authSerCode.unitScheduled = blockUnits;
          authSerCode.unitConsumed = ele.actualAuthProcedureUnitConsumed;
          authSerCode.unitRemained = ele.totalUnit - (ele.actualAuthProcedureUnitConsumed + blockUnits);
          authServiceCodeDispModel.push(authSerCode);
        })
        authDispModel.authorizationServiceCodesDisplayModel = authServiceCodeDispModel;
        this.authorizationDisplayModel.push(authDispModel);
      });
    }
  }

  //on html page filter expired and non expired authorization
  isExpired(type) {
    return this.authorizationDisplayModel.filter(x => x.isExpired == type);
  }


  //open popup
  openDialog(id: number) {
    if (id != null && id > 0) {
      this.clientsService.getAuthorizationById(id).subscribe((response: any) => {
        if (response != null && response.statusCode == 200 && response.data != null) {
          this.authModel = response.data;
          this.createModel(this.authModel);
        }
      });
    } else {
      this.authModel = new AuthModel();
      this.authModel.patientID = this.clientId;
      this.createModel(this.authModel);
    }
  }

  //create modal
  createModel(authModel: AuthModel) {
    authModel.patientID = this.clientId;
    const modalPopup = this.activityModal.open(AuthorizationModalComponent, {
      hasBackdrop: true,
      data: authModel || new AuthModel(),
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result === 'save') {

        this.authorizationFilterModel = new AuthorizationFilterModel;
        //listing of all authorization
        this.getAllAuthorization();
      }
    });
  }

  deleteDetails(id: number) {
    this.dialogService.confirm('Are you sure you want to delete this authorization?').subscribe((result: any) => {
      if (result == true) {
        this.clientsService.deleteAuthorization(id)
          .subscribe((response: any) => {
            if (response.statusCode == 200 || response.statusCode == 204) {
              this.notifier.notify('success', response.message)
              this.authorizationFilterModel = new AuthorizationFilterModel;
              //listing of all authorization
              this.getAllAuthorization();
            } else if (response.statusCode === 401) {
              this.notifier.notify('warning', response.message)
            } else {
              this.notifier.notify('error', response.message)
            }
          })
      }
    })
  }

  getUserPermissions() {
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_AUTHORIZATION_LIST');
    const { CLIENT_AUTHORIZATION_LIST_ADD, CLIENT_AUTHORIZATION_LIST_UPDATE, CLIENT_AUTHORIZATION_LIST_DELETE } = actionPermissions;
      
    this.addPermission = CLIENT_AUTHORIZATION_LIST_ADD || false;
    this.updatePermission = CLIENT_AUTHORIZATION_LIST_UPDATE || false;
    this.deletePermission = CLIENT_AUTHORIZATION_LIST_DELETE || false;
  
  }
}
