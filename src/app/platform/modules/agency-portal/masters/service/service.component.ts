import { ServiceModel } from "./service.model";
import { ServiceModalComponent } from "./service-modal/service-modal.component";
import { MasterService } from "./service.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material";

import { FilterModel, ResponseModel } from "../../../core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { DialogService } from "../../../../../shared/layout/dialog/dialog.service";
import { SecurityQuestionService } from "src/app/platform/modules/agency-portal/masters/security-question/security-question.service";

@Component({
  selector: "app-service",
  templateUrl: "./service.component.html",
  styleUrls: ["./service.component.css"]
})
export class ServiceComponent implements OnInit {
  filterModel: FilterModel;
  formGroup: FormGroup;
  metaData: any;
  searchText: string = "";
  serviceData: ServiceModel[];
  addPermission: boolean;
  displayedColumns: Array<any> = [
    {
      displayName: "Service",
      key: "serviceName",
      isSort: true,
      class: "",
      width: "60%"
    },
    {
      displayName: "Status",
      key: "isActive",
      isSort: true,
      class: "",
      width: "30%",
      type: ["Active", "Inactive"]
    },
    { displayName: "Actions", key: "Actions", class: "", width: "10%" }
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "Delete", key: "delete", class: "fa fa-times" }
  ];

  constructor(
    private masterServiceDialogModal: MatDialog,
    private masterService: MasterService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private dialogService: DialogService //private securityQuestionService: SecurityQuestionService
  ) {}
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.formGroup = this.formBuilder.group({
      searchText: [""]
    });
    this.getServiceList();
    //this.getUserPermissions();
  }
  get formControls() {
    return this.formGroup.controls;
  }

  openDialog(id: string = "") {
    if (id != null && id != "") {
      this.masterService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    } else this.createModal(new ServiceModel());
  }
  clearFilters() {
    this.searchText = "";
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      ""
    );
    this.getServiceList();
  }
  createModal(serviceModel: ServiceModel) {
    let ServiceModal;
    ServiceModal = this.masterServiceDialogModal
      .open(ServiceModalComponent, { hasBackdrop: true, data: serviceModel })
      .afterClosed()
      .subscribe(result => {
        if (result === "Save") this.getServiceList();
      });
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.filterModel.searchText
    );
    this.getServiceList();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openDialog(id);
        break;
      case "DELETE":
        this.dialogService
          .confirm(`Are you sure you want to delete the Security question ?`)
          .subscribe((result: any) => {
            if (result == true) {
              this.masterService
                .delete(id)
                .subscribe((response: ResponseModel) => {
                  if (response.statusCode === 200) {
                    this.notifier.notify("success", response.message);
                    this.getServiceList();
                  } else if (response.statusCode === 401) {
                    this.notifier.notify("warning", response.message);
                  } else {
                    this.notifier.notify("error", response.message);
                  }
                });
            }
          });
        break;
      default:
        break;
    }
  }

  getServiceList() {
    this.masterService.getAll(this.filterModel).subscribe((response: any) => {
      if (response.statusCode === 200) {
        this.serviceData = response.data || [];
        this.metaData = response.meta;
      } else {
        this.serviceData = [];
        this.metaData = {};
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    });
  }
  applyFilter(searchText: string = "") {
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      searchText
    );
    if (searchText.trim() == "" || searchText.trim().length >= 3)
      this.getServiceList();
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  // getUserPermissions() {
  //   const actionPermissions = this.securityQuestionService.getUserScreenActionPermissions(
  //     "MASTERS",
  //     "MASTERS_SERVICES_LIST"
  //   );
  //   const {
  //     MASTERS_SERVICES_LIST_ADD,
  //     MASTERS_SERVICES_LIST_UPDATE,
  //     MASTERS_SERVICES_LIST_DELETE
  //   } = actionPermissions;
  //   if (!MASTERS_SERVICES_LIST_UPDATE) {
  //     let spliceIndex = this.actionButtons.findIndex(obj => obj.key == "edit");
  //     this.actionButtons.splice(spliceIndex, 1);
  //   }
  //   if (!MASTERS_SERVICES_LIST_DELETE) {
  //     let spliceIndex = this.actionButtons.findIndex(
  //       obj => obj.key == "delete"
  //     );
  //     this.actionButtons.splice(spliceIndex, 1);
  //   }

  //   this.addPermission = MASTERS_SERVICES_LIST_ADD || false;
  // }
}
