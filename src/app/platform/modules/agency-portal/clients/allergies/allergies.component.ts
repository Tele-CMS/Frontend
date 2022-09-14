import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllergyModel } from './allergies.model';
import { FilterModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';
import { ClientsService } from '../clients.service';
import { MatDialog } from '@angular/material';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { format } from 'date-fns';
import { AllergiesModalComponent } from './allergies-modal/allergies-modal.component';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html',
  styleUrls: ['./allergies.component.css']
})
export class AllergiesComponent implements OnInit {
  allergyData: AllergyModel;
  allergyListingData: AllergyModel[];
  filterModel: FilterModel;
  metaData: any;  
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  clientId: number;
  addPermission: boolean;
  header: string = "Patient Allergies";
  tooltipdMessage="Maximum 7 allergies are allowed";
  maxAllowedLimit=7;
  constructor(private activatedRoute: ActivatedRoute, private notifier: NotifierService, private clientsService: ClientsService, public activityModal: MatDialog, private dialogService: DialogService,private commonService:CommonService) 
  {
    this.displayedColumns = [
      { displayName: 'Allergy Type', key: 'allergyType', isSort: true, width: '20%' },
      { displayName: 'Allergen', key: 'allergen', width: '10%' },
      { displayName: 'Note', key: 'note', width: '10%' },
      { displayName: 'Reaction', key: 'reaction', width: '10%' },
      { displayName: 'Status', key: 'isActive', isSort: true, width: '10%',type:['ACTIVE','INACTIVE'] },
      { displayName: 'Created Date', key: 'createdDate', isSort: true, width: '10%' },
      { displayName: 'Actions', key: 'Actions', width: '10%' }
    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    ];
   }

//on inital load
ngOnInit() {
  this.activatedRoute.queryParams.subscribe(params => {
    this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id,false);
  });
  //initialize filter model
  this.filterModel = new FilterModel();

  //call listing method
  this.getAllergyList(this.filterModel);
  this.getUserPermissions();
}



//listing of allergies
getAllergyList(filterModel) {
  this.clientsService.getAllergyList(this.clientId, this.filterModel)
    .subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.allergyListingData = response.data;
          this.allergyListingData = (response.data || []).map((obj: any) => {
            obj.createdDate = format(obj.createdDate, 'MM/DD/YYYY');
            obj.status=obj.isActive ? 'ACTIVE':'INACTIVE';
            return obj;
          });
          this.metaData = response.meta;
        } else {
          this.allergyListingData = [];
          this.metaData = {};
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      });
}

//page load and sorting
onPageOrSortChange(changeState?: any) {
  this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  this.getAllergyList(this.filterModel);
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
    default:
      break;
  }
}

//open popup
openDialog(id: number) {
  if (id != null && id > 0) {
    this.clientsService.getAllergyById(id).subscribe((response: any) => {
      if (response != null && response.data != null) {
        this.allergyData = response.data;
        this.createModel(this.allergyData);
      }
    });
  } else {
    this.allergyData = new AllergyModel();
    this.createModel(this.allergyData);
  }
}

//create modal
createModel(allergyData: AllergyModel) {
  allergyData.patientId = this.clientId;
  const modalPopup = this.activityModal.open(AllergiesModalComponent, {
    hasBackdrop: true,
    data:{allergy: allergyData,refreshGrid:this.refreshGrid.bind(this)}
  });

  modalPopup.afterClosed().subscribe(result => {
    if (result === 'save') {
      this.getAllergyList(this.filterModel);
    }
  });
}
refreshGrid()
{
  this.getAllergyList(this.filterModel);
}
deleteDetails(id: number) {
  this.dialogService.confirm('Are you sure you want to delete this allergy?').subscribe((result: any) => {
    if (result == true) {
      this.clientsService.deleteAllergy(id)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.notifier.notify('success', response.message)
            this.getAllergyList(this.filterModel);
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

disableButton() {
  return this.allergyListingData && this.allergyListingData.length > this.maxAllowedLimit;
}

}
