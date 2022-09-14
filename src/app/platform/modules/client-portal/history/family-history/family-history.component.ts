import { MatDialog } from "@angular/material";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { NotifierService } from "angular-notifier";
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";

//import { FamilyHistoryModelComponent } from "src/app/platform/modules/client-portal/family-history/family-history-model/family-history-model.component";
import { PatientMedicalFamilyHistoryModel } from "src/app/platform/modules/agency-portal/clients/family-history/family-history.model";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { Subscription } from "rxjs";
import { FamilyHistoryModelComponent } from "./family-history-model/family-history-model.component";

@Component({
  selector: "app-family-history",
  templateUrl: "./family-history.component.html",
  styleUrls: ["./family-history.component.css"]
})
export class FamilyHistoryComponent implements OnInit {
  clientId: number;
  header: string = "Family History";
  patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel;
  patientMedicalFamilyHistoryList: Array<PatientMedicalFamilyHistoryModel> = [];
  addPermission: boolean;
  updatePermission: boolean;
  tooltipdMessage="Maximum 7 members are allowed";
  maxAllowedLimit=7;
  deletePermission: boolean;
  userInfo: any;
  subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private clientsService: ClientsService,
    private patientMedicalFamilyHistoryDialogModal: MatDialog,
    private notifier: NotifierService,
    private commonService: CommonService
  ) {
    this.patientMedicalFamilyHistoryModel = new PatientMedicalFamilyHistoryModel();
  }

  ngOnInit() {
    this.addPermission = true;
    this.updatePermission = true;
    this.deletePermission = true;
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.clientId = user.id;
          this.getPatientMedicalFamilyHistoryList();
          //this.getUserPermissions();
        }
      }
    );
  }

  getPatientMedicalFamilyHistoryList() {
    this.clientsService
      .getPatientMedicalFamilyHistoryList(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0
        ) {
          this.patientMedicalFamilyHistoryList = response.data;
        }
      });
  }

  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientsService
        .getPatientMedicalFamilyHistoryById(id)
        .subscribe((response: any) => {
          if (response != null && response.data != null) {
            this.patientMedicalFamilyHistoryModel = response.data;
            this.createModal(this.patientMedicalFamilyHistoryModel);
          }
        });
    } else {
      this.patientMedicalFamilyHistoryModel = new PatientMedicalFamilyHistoryModel();
      this.createModal(this.patientMedicalFamilyHistoryModel);
    }
  }

  createModal(
    patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel
  ) {
    this.patientMedicalFamilyHistoryModel.patientID = this.clientId;
    let historyModal;
    historyModal = this.patientMedicalFamilyHistoryDialogModal.open(
      FamilyHistoryModelComponent,
      { data: patientMedicalFamilyHistoryModel }
    );
    historyModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") this.getPatientMedicalFamilyHistoryList();
    });
  }

  delete(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this family history?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientsService
            .deletePatientMedicalFamilyHistory(id)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 204) {
                  this.notifier.notify("success", response.message);
                  this.getPatientMedicalFamilyHistoryList();
                } else {
                  this.notifier.notify("error", response.message);
                }
              }
            });
        }
      });
  }
  disableButton()
  {
    return this.patientMedicalFamilyHistoryList && this.patientMedicalFamilyHistoryList.length>this.maxAllowedLimit
  }
  // getUserPermissions() {
  //   const actionPermissions = this.clientsService.getUserScreenActionPermissions(
  //     "CLIENT",
  //     "CLIENT_FAMILYHISTORY_LIST"
  //   );
  //   const {
  //     CLIENT_FAMILYHISTORY_LIST_ADD,
  //     CLIENT_FAMILYHISTORY_LIST_UPDATE,
  //     CLIENT_FAMILYHISTORY_LIST_DELETE
  //   } = actionPermissions;

  //   this.addPermission = CLIENT_FAMILYHISTORY_LIST_ADD || false;
  //   this.updatePermission = CLIENT_FAMILYHISTORY_LIST_UPDATE || false;
  //   this.deletePermission = CLIENT_FAMILYHISTORY_LIST_DELETE || false;
  // }
}
