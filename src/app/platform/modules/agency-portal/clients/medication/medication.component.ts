import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicationModel } from './medication.model';
import { ClientsService } from '../clients.service';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { MatDialog } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from '../../../core/modals/common-model';
import { format } from 'date-fns';
import { MedicationModalComponent } from './medication-modal/medication-modal.component';
import { CommonService } from '../../../core/services';
import { AddPrescriptionComponent } from '../prescription/prescription-addprescription/prescription-addprescription.component';

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
  header: string = "Patient Medication";
  tooltipdMessage = "Maximum 7 medications are allowed";
  maxAllowedLimit = 7;
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent: ViewContainerRef;
  constructor(private activatedRoute: ActivatedRoute, private clientsService: ClientsService, private dialogService: DialogService, private medicationDialogModal: MatDialog, private notifier: NotifierService, private commonService: CommonService, private cfr: ComponentFactoryResolver) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
    });

    //initialization of model
    this.medicationModel = new MedicationModel;
    this.medicationList = [];


    this.getMedicationList();
    this.getUserPermissions();
   // this.showPrescription();
  }
  showPrescription() {
    let factory = this.cfr.resolveComponentFactory(AddPrescriptionComponent);
    this.tabContent.clear();
    let comp: ComponentRef<AddPrescriptionComponent> = this.tabContent.createComponent(factory);
    comp.instance.showbuttons = false;
  }


  getMedicationList() {
    this.clientsService.getMedicationList(this.clientId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.data.length > 0 && response.statusCode == 200) {
        this.medicationList = response.data;
        this.medicationList = (response.data || []).map((obj: any) => {
          obj.startDate = format(obj.startDate, 'MM/DD/YYYY');
          obj.endDate = format(obj.endDate, 'MM/DD/YYYY');
          return obj;
        });
      }
      else {
        this.medicationList = [];
      }
    }
    );
  }


  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientsService.getmedicationById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.medicationModel = response.data;
          this.createModal(this.medicationModel);
        }
      });
    }
    else {
      this.medicationModel = new MedicationModel();
      this.createModal(this.medicationModel);
    }
  }

  createModal(medicationModel: MedicationModel) {
    this.medicationModel.patientId = this.clientId;
    let medicationModal;
    medicationModal = this.medicationDialogModal.open(MedicationModalComponent, { data: { medication: this.medicationModel, refreshGrid: this.refreshGrid.bind(this) } })
    medicationModal.afterClosed().subscribe((result: string) => {
      if (result == 'SAVE')
        this.getMedicationList();
    });
  }
  refreshGrid() {
    this.getMedicationList();
  }

  delete(id: number) {
    this.dialogService.confirm('Are you sure you want to delete this family history?').subscribe((result: any) => {
      if (result == true) {
        this.clientsService.deleteMedication(id).subscribe((response: any) => {
          if (response != null && response.data != null) {
            if (response.statusCode == 200) {
              this.notifier.notify('success', response.message);
              this.getMedicationList();
            } else {
              this.notifier.notify('error', response.message)
            }
          }
        });
      }
    });
  }

  getUserPermissions() {
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_MEDICATION_LIST');
    const { CLIENT_MEDICATION_LIST_ADD, CLIENT_MEDICATION_LIST_UPDATE, CLIENT_MEDICATION_LIST_DELETE } = actionPermissions;

    this.addPermission = CLIENT_MEDICATION_LIST_ADD || false;
    this.updatePermission = CLIENT_MEDICATION_LIST_UPDATE || false;
    this.deletePermission = CLIENT_MEDICATION_LIST_DELETE || false;

  }

  disableButton() {
    return this.medicationList && this.medicationList.length > this.maxAllowedLimit;
  }
}
