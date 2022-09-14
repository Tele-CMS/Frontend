import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { ImmunizationModel } from '../immunization.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientsService } from '../../clients.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { LayoutService } from 'src/app/platform/modules/core/services';

@Component({
  selector: 'app-immunization-modal',
  templateUrl: './immunization-modal.component.html',
  styleUrls: ['./immunization-modal.component.css']
})
export class ImmunizationModalComponent implements OnInit {
  maxDate = new Date();
  patientId: number;
  immunizationModel: ImmunizationModel;
  immunizationForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Immunization';
  //master models
  masterStaff: any[];
  masterVFC: any[];
  masterImmunization: any[];
  masterManufacture: any[];
  masterAdministrationSite: any[];
  masterRouteOfAdministration: any[];
  masterImmunityStatus: any[];
  masterRejectionReason: any[];
  linkedEncounterId: number;
  //////////////////
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();


  //Construtor
  constructor(private formBuilder: FormBuilder, private immunizationDialogModalRef: MatDialogRef<ImmunizationModalComponent>, private clientService: ClientsService,
     @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService, private layoutService: LayoutService) {

    //assign data
    this.immunizationModel = data.immunization;
    this.refreshGrid.subscribe(data.refreshGrid);
    this.patientId = this.immunizationModel.patientID;
    //update header text
    if (this.immunizationModel.id != null && this.immunizationModel.id > 0)
      this.headerText = 'Edit Immunization';
    else
      this.headerText = 'Add Immunization';

  }

  //inital loading
  ngOnInit() {
    this.immunizationForm = this.formBuilder.group({
      id: [this.immunizationModel.id],
      patientID: [this.immunizationModel.patientID],
      administeredBy: [this.immunizationModel.administeredBy],
      administeredDate: [this.immunizationModel.administeredDate],
      administrationSiteID: [this.immunizationModel.administrationSiteID],
      amountAdministered: [this.immunizationModel.amountAdministered],
      expireDate: [this.immunizationModel.expireDate],
      immunityStatusID: [this.immunizationModel.immunityStatusID],
      immunization: [this.immunizationModel.immunization],
      manufactureID: [this.immunizationModel.manufactureID],
      orderBy: [this.immunizationModel.orderBy],
      rejectedImmunization: [this.immunizationModel.rejectedImmunization],
      rejectionReasonID:[this.immunizationModel.rejectionReasonID],
      rejectionReasonNote: [this.immunizationModel.rejectionReasonNote],
      routeOfAdministrationID: [this.immunizationModel.routeOfAdministrationID],
      vaccineLotNumber: [this.immunizationModel.vaccineLotNumber],
      vfcid: [this.immunizationModel.vfcid]
    });

    //page load calling master data for dropdowns
    this.getMasterData();

    this.layoutService.clientDrawerData.subscribe(({ encounterId }) => {
      this.linkedEncounterId = encounterId;
    });
  }


  //get the form controls on html page
  get formControls() { return this.immunizationForm.controls; }

  //submit for create update of immunization
  onSubmit(event: any) {
    if (!this.immunizationForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.immunizationModel = this.immunizationForm.value;
      this.immunizationModel.patientID = this.patientId;
      this.immunizationModel.linkedEncounterId = this.linkedEncounterId;
      this.clientService.createImmunization(this.immunizationModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          if (clickType == "Save")
            this.closeDialog('save');
          else if (clickType == "SaveAddMore") {
            this.refreshGrid.next();
            this.immunizationForm.reset();
          }
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }


  //call master data api
  getMasterData() {
    let data = "MASTERSTAFF,MASTERVFC,MASTERIMMUNIZATION,MASTERMANUFACTURE,MASTERADMINISTRATIONSITE,MASTERROUTEOFADMINISTRATION,MASTERIMMUNITYSTATUS,MASTERREJECTIONREASON";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterStaff = response.staffs != null ? response.staffs : [];
        this.masterVFC = response.masterVFC != null ? response.masterVFC : [];
        this.masterRouteOfAdministration = response.masterRouteOfAdministration != null ? response.masterRouteOfAdministration : [];
        this.masterRejectionReason = response.masterRejectionReason != null ? response.masterRejectionReason : [];
        this.masterManufacture = response.masterManufacture != null ? response.masterManufacture : [];
        this.masterImmunization = response.masterImmunization != null ? response.masterImmunization : [];
        this.masterImmunityStatus = response.masterImmunityStatus != null ? response.masterImmunityStatus : [];
        this.masterAdministrationSite = response.masterAdministrationSite != null ? response.masterAdministrationSite : [];
      }
    });
  }


  //close popup
  closeDialog(action: string): void {
    this.immunizationDialogModalRef.close(action);
  }

}
