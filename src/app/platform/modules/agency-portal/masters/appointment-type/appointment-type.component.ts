import { Component, OnInit } from '@angular/core';
import { MatDialog, } from '@angular/material';
import { AppointmentTypeModalComponent } from './appointment-type-modal/appointment-type-modal.component';
import { AppointmentTypeService } from './appointment-type.service';
import { AppointmentTypeModal } from './appointment-type.model';
import { FilterModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-appointment-type',
  templateUrl: './appointment-type.component.html',
  styleUrls: ['./appointment-type.component.css']
})
export class AppointmentTypeComponent implements OnInit {
  subscription: Subscription
  appoitmentTypeModal: AppointmentTypeModal;
  appopintmentTypeData: AppointmentTypeModal[] = [];
  metaData: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  searchText: string = "";
  filterModel: FilterModel;

  activityTypeId: number;
  loading = false;
  isBillable = false;
  addPermission: boolean;

  constructor(
    public activityModal: MatDialog,
    public appointmentTypeService: AppointmentTypeService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
    this.displayedColumns = [
      { displayName: 'Appt Type', key: 'name', isSort: true, class: '', width: '20%' },
      { displayName: 'Description', key: 'description', isSort: true, class: '', width: '40%', type: "50", isInfo: true },
      { displayName: 'Billable', key: 'isBillable', isSort: true, width: '10%', type: true },
      { displayName: 'BG Color', key: 'color', width: '10%',type:'roundspan' },
      { displayName: 'Font Color', key: 'fontColor', width: '10%',type:'roundspan' },
      { displayName: 'Actions', key: 'Actions', width: '10%' }
    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    ];
  }

  createModel(appointmentTypeModal: AppointmentTypeModal) {
    const modalPopup = this.activityModal.open(AppointmentTypeModalComponent, {
      hasBackdrop: true,
      data: appointmentTypeModal || new AppointmentTypeModal(),
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result === 'SAVE') {
        this.getListData();
      }
    });
  }

  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getListData();
  }
  openDialog(id?: number): void {
    this.appoitmentTypeModal = {
      id: id || 0,
    }
    if (!this.appoitmentTypeModal.id) {
      this.createModel(this.appoitmentTypeModal)
    } else {
      this.appointmentTypeService.get(id).subscribe((response: any) => {
        this.appoitmentTypeModal = {
          ...response,
        };
        this.createModel(this.appoitmentTypeModal)
      })
    }
  }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getListData();
    this.getUserPermissions();
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getListData();
  }

  applyFilter(searchText: string = '') {
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    this.getListData();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.name;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        this.deleteDetails(id, name);
        break;
      default:
        break;
    }
  }

  getListData() {
    this.appointmentTypeService.getAll(this.filterModel)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.appopintmentTypeData = response.data;
            //this.appopintmentTypeData.forEach(x => {
              // x.color = "<span class='bgcolor-circle' style='background-color: " + x.color + ";'></span>"
              //x.color='<span class="bgcolor-circle" style="background-color: rgb(0, 255, 244);">sunny</span>';
            //});
            this.metaData = response.meta;
          } else {
            this.appopintmentTypeData = [];
            this.metaData = {};
          }
          this.metaData.pageSizeOptions = [5,10,25,50,100];
        });
  }

  deleteDetails(id: number, name: string) {
    this.dialogService.confirm(`${name} may be assigned to the payer. Are you sure you want to delete this appointment type?`).subscribe((result: any) => {
      if (result == true) {
        this.appointmentTypeService.delete(id)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifier.notify('success', response.message)
              this.getListData();
            } else if (response.statusCode === 401) {
              this.notifier.notify('warning', response.message)
            } else {
              this.notifier.notify('error', response.message)
            }
          })
      }
    })
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.appointmentTypeService.getUserScreenActionPermissions('MASTERS', 'MASTERS_APPOINTMENTTYPES_LIST');
    const { MASTERS_APPOINTMENTTYPES_LIST_ADD, MASTERS_APPOINTMENTTYPES_LIST_UPDATE, MASTERS_APPOINTMENTTYPES_LIST_DELETE } = actionPermissions;
    if (!MASTERS_APPOINTMENTTYPES_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_APPOINTMENTTYPES_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_APPOINTMENTTYPES_LIST_ADD || false;

  }

}