import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UserInvitationService } from "./user-invitation.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { UserInvitationModel } from "../../users/user-invitation/user-invitation.model";
import { Metadata } from "../../../../../super-admin-portal/core/modals/common-model";
import { FilterModel } from "../../../core/modals/common-model";
import { SendUserInvitationModel } from "../user-invitation/user-invitation.model";
import { MatDialog } from "@angular/material";
import { SendUserInvitationComponent } from "./send-user-invitation/send-user-invitation.component";
import { NotifierService } from "angular-notifier";
import { DialogService } from "../../../../../shared/layout/dialog/dialog.service";
import { ResponseModel } from "../../../core/modals/common-model";

@Component({
  selector: "app-user-invitation",
  templateUrl: "./user-invitation.component.html",
  styleUrls: ["./user-invitation.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class UserInvitationComponent implements OnInit {
  userInvitationModel: UserInvitationModel[];
  metaData: any;
  filterModel: FilterModel;
  userFormGroup: FormGroup;
  sendUserInvitationModel: SendUserInvitationModel;
  displayedColumns: Array<any> = [
    {
      displayName: "Name",
      key: "fullName",
      isSort: true,
      class: "",
      width: "15%"
    },
    {
      displayName: "Email",
      key: "email",
      isSort: true,
      class: "",
      width: "15%"
    },
    { displayName: "Phone", key: "phone", class: "", width: "15%" },
    {
      displayName: "Location",
      key: "location",
      class: "",
      width: "15%",
      type: "50",
      isInfo: true
    },
    {
      displayName: "Invite Date",
      key: "invitationSendDate",
      class: "invitationSendDate",
      width: "15%",
      type: "date"
    },
    {
      displayName: "Status",
      key: "invitationStatus",
      class: "invitationStatus",
      width: "10%",
      type: "statusstring"
    },
    //{ displayName: 'Lock User', key: 'isBlock', class: '', width: '10%', type: 'togglespan', permission: true },
    { displayName: "Actions", key: "Actions", class: "", width: "10%" }
  ];
  actionButtons: Array<any> = [
    //{ displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: "Resend", key: "Resend", class: "fa fa-paper-plane-o" },
    { displayName: "Delete", key: "delete", class: "fa fa-times" }
  ];
  constructor(
    private userInvitationService: UserInvitationService,
    private formBuilder: FormBuilder,
    private dialogModal: MatDialog,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
    this.userInvitationModel = Array<UserInvitationModel>();
    this.filterModel = new FilterModel();
    //this.sendUserInvitationModel = new SendUserInvitationModel();
  }

  ngOnInit() {
    this.userFormGroup = this.formBuilder.group({
      searchText: []
    });
    this.getAllUserInvitations(this.filterModel);
  }

  getAllUserInvitations(filterModel: FilterModel) {
    this.userInvitationService
      .getAllUserInvitedListing(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.userInvitationModel = response.data;
          this.metaData = response.meta;
        } else {
          this.userInvitationModel = [];
          this.metaData = new Metadata();
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      });
  }
  onPageOrSortChange(changeState?: any) {
    let formValues = this.userFormGroup.value;
    this.setPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      formValues.searchText
    );
    this.getAllUserInvitations(this.filterModel);
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
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.invitationId;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        break;
      case "DELETE":
        {
          this.notifier.hideAll();
          this.dialogService
            .confirm(`Are you sure you want to delete this invitation?`)
            .subscribe((result: any) => {
              if (result == true) {
                this.userInvitationService
                  .deleteInvitation(id)
                  .subscribe((response: ResponseModel) => {
                    this.notify(response);
                  });
              }
            });
        }
        break;
      case "RESEND":
        {
          this.notifier.hideAll();
          this.dialogService
            .confirm(`Are you sure you want to resend this invitation?`)
            .subscribe((result: any) => {
              if (result == true) {
                this.userInvitationService
                  .getUserInvitationById(id)
                  .subscribe((response: ResponseModel) => {
                    // this.sendUserInvitationModel = new SendUserInvitationModel();
                    // this.sendUserInvitationModel.name = response.data.name;
                    // this.sendUserInvitationModel.invitationId = response.data.invitationId;
                    // this.sendUserInvitationModel.email = response.data.email;
                    // this.sendUserInvitationModel.phone = response.data.phone;
                    this.openDialog(response.data);
                  });
              }
            });
        }
        break;
      default:
        break;
    }
  }
  notify(response: ResponseModel) {
    if (response.statusCode == 200) {
      this.notifier.notify("success", response.message);
      this.getAllUserInvitations(this.filterModel);
    } else if (response.statusCode == 401) {
      this.notifier.notify("warning", response.message);
    } else {
      this.notifier.notify("error", response.message);
    }
  }
  clearFilters() {
    this.userFormGroup.reset();
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      ""
    );
    this.getAllUserInvitations(this.filterModel);
  }
  applyFilter() {
    let formValues = this.userFormGroup.value;
    if (formValues.searchText.length >= 3) {
      this.setPaginatorModel(
        1,
        this.filterModel.pageSize,
        this.filterModel.sortColumn,
        this.filterModel.sortOrder,
        formValues.searchText
      );
      this.getAllUserInvitations(this.filterModel);
    }
  }
  openDialog(sendUserInvitationModel: SendUserInvitationModel = null) {
    this.sendInvitation(sendUserInvitationModel);
  }
  sendInvitation(sendUserInvitationModel: SendUserInvitationModel) {
    let dbModal;
    dbModal = this.dialogModal.open(SendUserInvitationComponent, {
      data: { sendUserInvitationModel }
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") this.getAllUserInvitations(this.filterModel);
    });
  }
}
