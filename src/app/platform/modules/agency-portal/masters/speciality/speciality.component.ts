import { SpecialityModel } from "./speciality.model";
import { SpecialityModalComponent } from "./speciality-modal/speciality-modal.component"
import { SpecialityService } from "./speciality.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material";

import { FilterModel, ResponseModel } from "../../../core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { DialogService } from "../../../../../shared/layout/dialog/dialog.service";
import { SecurityQuestionService } from "src/app/platform/modules/agency-portal/masters/security-question/security-question.service";
import { Console } from "console";

@Component({
  selector: "app-speciality",
  templateUrl: "./speciality.component.html",
  styleUrls: ["./speciality.component.css"]
})
export class SpecialityComponent implements OnInit {
  filterModel: FilterModel;
  formGroup: FormGroup;
  metaData: any;
  IsActiveCount: number=0;
  searchText: string = "";
  serviceData: SpecialityModel[];
  addPermission: boolean;0
   buttonData:any = [{
    name: 'ok',
    value: true,
  },{
    
    name: 'Cancel',
    value: false,
  }]
  displayedColumns: Array<any> = [
    {
      displayName: "Speciality",
      key: "globalCodeName",
      isSort: true,
      class: "",
      width: "45%"
    },
    { displayName: "Display In Dashboard", key: "isActive", class: "", width: "45%" ,type: 'togglespan', permission:true},
    {
      displayName: "Actions", key: "Actions", class: "", width: "10%" 
    }
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
    { displayName: "Delete", key: "delete", class: "fa fa-times" }
  ];

  constructor(
    private masterServiceDialogModal: MatDialog,
    private specialityService: SpecialityService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private dialogService: DialogService //private securityQuestionService: SecurityQuestionService
  ) {}
  ngOnInit() {
    this.IsActiveCount = 0;
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
      this.specialityService.getById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    } else this.createModal(new SpecialityModel());
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
  createModal(serviceModel: SpecialityModel) {
    
    let ServiceModal;
    ServiceModal = this.masterServiceDialogModal
      .open(SpecialityModalComponent, { hasBackdrop: true, data: serviceModel })
      .afterClosed()
      .subscribe(result => {
        if (result === "Save") this.getServiceList();
      });
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageNumber,
      this.filterModel.pageSize,
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
          .confirm(`Are you sure you want to delete the Speciality ?`)
          .subscribe((result: any) => {
            if (result == true) {
              this.specialityService
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
        case "TOGGLE":
          console.log(actionObj.data.isActive);
          if(actionObj.data.isActive == true){
            this.IsActiveCount -= 1;
              actionObj.data.isActive = false;
              this.UpdateIsActive(actionObj.data);
          }
          else{
            this.IsActiveCount += 1;
            if (this.IsActiveCount > 5) {
              this.dialogService.confirm(`You can't select more than 5 specialities`,this.buttonData).subscribe((result: any) => {
                    if (result == true) {
                    this.ngOnInit();
                    }
                    else{
                    this.ngOnInit();
                    }
                  });
            }
            else{
            actionObj.data.isActive = true;
            this.UpdateIsActive(actionObj.data);
            }
          }
          break;
      default:
        break
    }
  }

  UpdateIsActive(data){
    this.specialityService.create(data).subscribe((response: any) => {
      if (response.statusCode === 200) {
        
      } 
      else {
        
      }
    })
  };
  getServiceList() {
    this.specialityService.getAll(this.filterModel).subscribe((response: any) => {
      if (response.statusCode === 200) {
        
        this.serviceData = response.data || [];
        if(this.serviceData.length >0){
          
          this.serviceData.forEach(x=>{
            if(x.isActive == true){
              this.IsActiveCount += 1;
            } 
          })
        }
        this.metaData = response.meta;
      } else {
        this.serviceData = [];
        this.metaData = {};
      }
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
