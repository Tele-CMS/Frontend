import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { format } from 'date-fns';
import { SelectionModel } from '@angular/cdk/collections';
import { PrescriptionModel, PrescriptionDownloadModel } from '../prescription.model';
import { FilterModel } from 'src/app/platform/modules/core/modals/common-model';
import { ClientsService } from '../../clients.service';
import { CommonService } from 'src/app/platform/modules/core/services';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { PrescriptionModalComponent } from '../prescription-modal/prescription-modal.component';
import { PrescriptionFaxModalComponent } from '../prescription-fax-modal/prescription-fax-modal.component';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './prescription-addprescription.component.html',
  styleUrls: ['./prescription-addprescription.component.css']
})
export class AddPrescriptionComponent implements OnInit {
  allergyData: PrescriptionModel;
  prescriptionListingData: PrescriptionModel[];
  prescriptiondownloadmodel = new PrescriptionDownloadModel();
  filterModel: FilterModel;
  metaData: any;
  stringprescriptionIds: string;
  actionButtons: Array<any>;
  clientId: number;
  addPermission: boolean;
  header: string = "Patient Prescription";
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  public prescriptionIds: string[] = [];
  displayedColumns: string[] = ['select', 'drugName', 'strength', 'directions', 'startDate', 'endDate', 'actions'];
  @Input("showbuttons") showbuttons = true;
  constructor(private activatedRoute: ActivatedRoute, private notifier: NotifierService, private clientsService: ClientsService, public activityModal: MatDialog, private dialogService: DialogService, private commonService: CommonService) {
    this.metaData = {};
  }

  //on inital load
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);  //
    });
    //initialize filter model
    this.filterModel = new FilterModel();

    //call listing method
    this.getPrescriptionList(this.filterModel);
    this.getUserPermissions();
  }
  //listing of allergies
  getPrescriptionList(filterModel) {
    
    this.clientsService.getPrescriptionList(this.clientId, this.filterModel)
      .subscribe(
        (response: any) => {
          
          if (response.statusCode === 200) {
            this.prescriptionListingData = response.data;
            this.dataSource.data = this.prescriptionListingData;
            this.prescriptionListingData = (response.data || []).map((obj: any) => {
              obj.createdDate = format(obj.createdDate, 'MM/DD/YYYY');
              obj.startDate = format(obj.startDate, 'MM/DD/YYYY');
              obj.endDate = format(obj.endDate, 'MM/DD/YYYY');
              obj.status = obj.isActive ? 'ACTIVE' : 'INACTIVE';
              return obj;
            });
            this.metaData = response.meta || {};
          } else { 
            this.prescriptionListingData = [];
            this.dataSource.data = []
            this.metaData = {};
          }
 
        });
  }

  //page load and sorting
  onPageOrSortChange(changeState?: any) {
    
    changeState.pageNumber = changeState.pageIndex + 1;
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, '', '', this.filterModel.searchText);
    this.getPrescriptionList(this.filterModel);
  }

  //table action
  onTableActionClick(actionObj?: any) {
    
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        this.deleteDetails(id);
        break;
      case 'DOWNLOAD':
        this.DownloadPrescription();
        break;
      case 'FAX':
        this.openfaxDialog(id);
        break;
      default:
        break;
    }
  }

  //open popup
  openDialog(id: number) {
    
    if (id != null && id > 0) {
      this.clientsService.getPrescriptionById(id).subscribe((response: any) => {
        
        if (response != null && response.data != null) {
          this.allergyData = response.data;
          this.createModel(this.allergyData);
        }
      });
    } else {
      this.allergyData = new PrescriptionModel();
      this.createModel(this.allergyData);
    }
  }

  //create modal
  createModel(allergyData: PrescriptionModel) {
    
    allergyData.patientId = this.clientId;
    const modalPopup = this.activityModal.open(PrescriptionModalComponent, {
      hasBackdrop: true,
      data: { allergy: allergyData, refreshGrid: this.refreshGrid.bind(this) }
    });
    
    modalPopup.afterClosed().subscribe(result => {
      
      if (result === 'SAVE') {
        this.getPrescriptionList(this.filterModel);
      }
    });
  }
  refreshGrid() {
    this.getPrescriptionList(this.filterModel);
  }
  deleteDetails(id: number) {
    this.dialogService.confirm('Are you sure you want to delete this prescription?').subscribe((result: any) => {
      if (result == true) {
        this.clientsService.deletePrescription(id)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifier.notify('success', response.message)
              this.getPrescriptionList(this.filterModel);
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
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_ALLERGIES_LIST');
    const { CLIENT_ALLERGIES_LIST_ADD, CLIENT_ALLERGIES_LIST_UPDATE, CLIENT_ALLERGIES_LIST_DELETE } = actionPermissions;
    if (!CLIENT_ALLERGIES_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!CLIENT_ALLERGIES_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = CLIENT_ALLERGIES_LIST_ADD || false;

  }

  DownloadPrescription() {
    if (this.stringprescriptionIds) {
      this.prescriptiondownloadmodel.PrescriptionId = this.stringprescriptionIds;
      this.prescriptiondownloadmodel.patientId = this.clientId;
      this.prescriptiondownloadmodel.Issentprescription = false;
      this.clientsService.DownloadPrescription(this.prescriptiondownloadmodel)
        .subscribe((response: any) => {
          
          this.clientsService.downLoadFile(response, 'application/pdf', `PrescriptionReport`)
        });
    }
    else {
      this.notifier.notify('warning', 'Please select Medication')
    }

  }

  //open popup
  openfaxDialog(id: number) {
    if (this.stringprescriptionIds) {
      if (id != null && id > 0) {
        this.clientsService.getPrescriptionById(id).subscribe((response: any) => {
          
          if (response != null && response.data != null) {
            this.allergyData = response.data;
            this.createFaxModel(this.allergyData);
          }
        });
      } else {
        this.allergyData = new PrescriptionModel();
        this.createFaxModel(this.allergyData);
      }
    }
    else {
      this.notifier.notify('warning', 'Please select Medication')
    }

  }

  //create modal
  createFaxModel(allergyData: PrescriptionModel) {
    allergyData.patientId = this.clientId;
    allergyData.PrescriptionId = this.stringprescriptionIds;
    allergyData.Issentprescription = false;
    const modalPopup = this.activityModal.open(PrescriptionFaxModalComponent, {
      hasBackdrop: true,
      data: { allergy: allergyData, refreshGrid: this.refreshGrid.bind(this) }
    });
    modalPopup.afterClosed().subscribe(result => {
      
      if (result === 'SAVE') {
        //this.getPrescriptionList(this.filterModel);
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  toggle(event, row) {
    let name = row.id;

    if (event.checked) {
      if (this.prescriptionIds.indexOf(name) === -1) {
        this.prescriptionIds.push(name);
        this.selection.select(row);
      }

    } else {
      const index = this.prescriptionIds.indexOf(name);
      if (index > -1) {
        this.prescriptionIds.splice(index, 1);
        this.selection.deselect(row);
      }
    }

    //console.log(this.prescriptionIds);
    this.stringprescriptionIds = this.prescriptionIds.toString();
    //console.log(this.stringprescriptionIds);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(ev) {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row)
      });

    this.prescriptionIds = [];
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        this.prescriptionIds.push(row.id);
      }
    });
    //console.log(this.prescriptionIds);
    this.stringprescriptionIds = this.prescriptionIds.toString();
    //console.log(this.stringprescriptionIds);
  }

}
