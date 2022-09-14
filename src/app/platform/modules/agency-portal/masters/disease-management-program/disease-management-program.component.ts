import { Component, OnInit } from '@angular/core';
import { FilterModel, ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { MatDialog } from '@angular/material';
import { DiseaseManagementProgramService } from './disease-management.service';
import { NotifierService } from 'angular-notifier';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { DiseaseMangementProgramModel, DiseaseMangementProgramActivityModel } from './disease-management.model';
import { DiseaseManagementProgramActivityModalComponent } from './disease-management-program-activity-modal/disease-management-program-activity-modal.component';
import { DiseaseManagementProgramModalComponent } from './disease-management-program-modal/disease-management-program-modal.component';

@Component({
  selector: 'app-disease-management-program',
  templateUrl: './disease-management-program.component.html',
  styleUrls: ['./disease-management-program.component.css']
})
export class DiseaseManagementProgramComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel;
  searchText: string = '';
  diseaseMangementProgramData: DiseaseMangementProgramModel[];
  addPermission: boolean;
  displayedColumns: Array<any> = [
    { displayName: 'Description', key: 'description', isSort: true, class: '', width: '50%', type: "50"},
    { displayName: 'Status', key: 'isActive', isSort: true, class: '', width: '30%', type: ['Active', 'Inactive'] },
    { displayName: 'Actions', key: 'Actions', class: '', width: '50%' }
  ];

  actionButtons: Array<any> = [
    { displayName: 'View', key: 'view', class: 'fa fa-eye' },
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' }
  ];

  constructor(
    private diseaseMangementProgramDialogModal: MatDialog,
    private diseaseMangementProgramService: DiseaseManagementProgramService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
  }
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getDiseaseMangementProgramList();
    this.getUserPermissions();
  }

  createModal(diseaseMangementProgramId: number) {
    let diseaseMangementProgramModal;
    diseaseMangementProgramModal = this.diseaseMangementProgramDialogModal.open(DiseaseManagementProgramActivityModalComponent, { hasBackdrop: true, data: diseaseMangementProgramId })
    diseaseMangementProgramModal.afterClosed().subscribe((result: string) => {
  
    });
  }
  clearFilters() {
    if (!this.searchText) {
      return null;
    }
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getDiseaseMangementProgramList();
  }
  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getDiseaseMangementProgramList();
  // } old one
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getDiseaseMangementProgramList();
  }
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'VIEW':
        this.createModal(id);
        break;
        case 'EDIT':
          this.openDialog(id);
        default:
        
        break;
    }
  }
  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.diseaseMangementProgramService.getDiseaseManagementProgramListById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModalForDisease(response.data);
        }
      });
    }
    else
    {
      this.createModalForDisease(new DiseaseMangementProgramModel());
  }
}
createModalForDisease(diseaseMangementProgramModel: DiseaseMangementProgramModel) {
  let diseaseMangementProgramModal;
  diseaseMangementProgramModal = this.diseaseMangementProgramDialogModal.open(DiseaseManagementProgramModalComponent, { hasBackdrop: true, data: diseaseMangementProgramModel })
  diseaseMangementProgramModal.afterClosed().subscribe(result => {
    if (result === 'SAVE')
      this.getDiseaseMangementProgramList();
  });
}
  getDiseaseMangementProgramList() {
    // this.filterModel.sortColumn = this.filterModel.sortColumn || '';
    // this.filterModel.sortOrder = this.filterModel.sortOrder || '';
    this.diseaseMangementProgramService.getDiseaseManagementProgramList(this.filterModel).subscribe((response: ResponseModel) => {
      
      if(response.statusCode == 200){  
        this.diseaseMangementProgramData = response.data;
      this.metaData = response.meta;
      } else {
        this.diseaseMangementProgramData = [];
      this.metaData = null;
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }
  applyFilter(searchText: string = '') {
    if (searchText.trim() == '' || searchText.trim().length >= 3) {
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
      this.getDiseaseMangementProgramList();
    }
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.diseaseMangementProgramService.getUserScreenActionPermissions('MASTERS', 'MASTER_CARE_PLAN');
    const { VIEW_DISEASE_PROGRAM_ACTIVITY_LIST  } = actionPermissions;
    if (!VIEW_DISEASE_PROGRAM_ACTIVITY_LIST) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'view');
      this.actionButtons.splice(spliceIndex, 1)
    }

  }
}
