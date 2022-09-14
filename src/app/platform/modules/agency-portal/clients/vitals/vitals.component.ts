import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VitalModel } from './vitals.model';
import { ClientsService } from '../clients.service';
import { FilterModel } from '../../../core/modals/common-model';
import { debug } from 'util';
import { MatDialog } from '@angular/material';
import { VitalModalComponent } from './vital-modal/vital-modal.component';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.css']
})
export class VitalsComponent implements OnInit {
  vitalData: VitalModel;
  vitalListingData: VitalModel[];
  filterModel: FilterModel;
  metaData: any;
  inches: any;
  feets: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  clientId: number;
  addPermission: boolean;
  header: string = "Patient Vitals";
  isGrid: boolean = true;

  //Charts
  lineChartData: Array<any> = [];
  lineChartLabels: Array<any> = [];
  lineChartType: string = 'line';

  //constructor
  constructor(private activatedRoute: ActivatedRoute, private notifier: NotifierService, private clientsService: ClientsService, public activityModal: MatDialog, private dialogService: DialogService, private commonService: CommonService) {

    this.displayedColumns = [
      { displayName: 'Date', key: 'vitalDate', isSort: true, width: '20%' },
      { displayName: 'Height', key: 'displayheight', isSort: true, width: '10%' },
      { displayName: 'WEIGHT(LB)', key: 'weightLbs', width: '10%' },
      { displayName: 'H-Rate', key: 'heartRate', width: '10%' },
      { displayName: 'BMI', key: 'bmi', isSort: true, width: '10%' },
      { displayName: 'BP(H/L)', key: 'displayBP', width: '10%' },
      { displayName: 'Pulse', key: 'pulse', width: '10%' },
      { displayName: 'Resp', key: 'respiration', width: '10%' },
      { displayName: 'Temp(°F)', key: 'temperature', width: '10%' },
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
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
    });

    //initialize filter model
    this.filterModel = new FilterModel();

    //call listing method
    this.getVitalList(this.filterModel,'grid');
    this.getUserPermissions();
  }



  //listing of vitals
  getVitalList(filterModel, type: string = '') {
    // if(type == "chart")
    // {
    //   this.vitalsChartData=[];
    //   this.lineChartLabels=[];
    // }
    this.vitalListingData = [];
    this.clientsService.getVitalList(this.clientId, this.filterModel)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.vitalListingData = response.data;
            this.vitalListingData = (response.data || []).map((obj: any) => {
              obj.vitalDate = obj.vitalDate ? format(obj.vitalDate, 'MM/DD/YYYY') : '-';
              obj.displayheight = obj.heightIn ? this.convertInches(obj.heightIn) : '-';
              obj.displayBP = obj.bpDiastolic && obj.bpSystolic ? this.convertBP(obj.bpDiastolic, obj.bpSystolic) : '-';
              obj.heartRate = obj.heartRate || '-';
              obj.weightLbs = obj.weightLbs || '-';
              obj.bmi = obj.bmi || '-';
              obj.pulse = obj.pulse || '-';
              obj.respiration = obj.respiration || '-';
              obj.temperature = obj.temperature || '-';
              return obj;
            });
            this.isGrid = type == 'grid' ? true : false;
            if (type == "chart") {
              //this.vitalListingData = response.data != null ? response.data : {};
              if (this.vitalListingData.length > 0) {
                this.lineChartLabels = this.vitalListingData.map(({ vitalDate }) => format(vitalDate, 'MM/DD/YYYY'));
                this.lineChartData = [
                  { data: this.vitalListingData.map(({ bmi }) => bmi), label: 'BMI' },
                  { data: this.vitalListingData.map(({ bpDiastolic }) => bpDiastolic), label: 'Diastolic BP' },
                  { data: this.vitalListingData.map(({ bpSystolic }) => bpSystolic), label: 'Systolic BP' },
                  { data: this.vitalListingData.map(({ heartRate }) => heartRate), label: 'Heart Rate' },
                  { data: this.vitalListingData.map(({ heightIn }) => heightIn), label: 'Height(In)' },
                  { data: this.vitalListingData.map(({ pulse }) => pulse), label: 'Pulse' },
                  { data: this.vitalListingData.map(({ respiration }) => respiration), label: 'Respiration' },
                  { data: this.vitalListingData.map(({ temperature }) => temperature), label: 'Temperature(c)' },
                  { data: this.vitalListingData.map(({ weightLbs }) => weightLbs), label: 'Weight(Lb)' },
                ];
              }
            }
            this.metaData = response.meta;
          } else {
            this.vitalListingData = [];
            this.metaData = {};
          }
          this.metaData.pageSizeOptions = [5,10,25,50,100];
        });
  }

  toggleView(value: string = '') {
    if (value == 'grid') {
      this.filterModel.pageSize = 5; //This will be a fixed valeu as we need all the parameters
      this.getVitalList(this.filterModel, 'grid');
    }
    else {
      this.filterModel.pageSize = 100;   //This will be changed later
      this.getVitalList(this.filterModel, 'chart');
    }

  }

  //page load and sorting
  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getVitalList(this.filterModel, 'grid');
  // } old one
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getVitalList(this.filterModel, 'grid');
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
      this.clientsService.getVitalById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.vitalData = response.data;
          this.createModel(this.vitalData);
        }
      });
    } else {
      this.vitalData = new VitalModel();
      this.createModel(this.vitalData);
    }
  }

  //create modal
  createModel(vitalData: VitalModel) {
    vitalData.patientID = this.clientId;
    const modalPopup = this.activityModal.open(VitalModalComponent, {
      hasBackdrop: true,
      data: {vital:vitalData,refreshGrid:this.refreshGrid.bind(this)},
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.getVitalList(this.filterModel, (this.isGrid == true ? 'grid' : 'chart'));
      }
    });
  }
  refreshGrid()
  {
    this.getVitalList(this.filterModel,(this.isGrid==true?'grid':'chart'));
  }

  deleteDetails(id: number) {
    this.dialogService.confirm('Are you sure you want to delete this vital?').subscribe((result: any) => {
      if (result == true) {
        this.clientsService.deleteVital(id)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifier.notify('success', response.message)
              this.getVitalList(this.filterModel, 'grid');
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

  convertInches(inches) {
    try {
      if (inches && inches > 0) {
        let feetFromInches = Math.floor(inches / 12);//There are 12 inches in a foot
        let inchesRemainder = inches % 12;
        let result = feetFromInches + "'" + inchesRemainder + "\"";
        return result;
      }
      else { return '0'; }
    }
    catch
    {
      return '0';
    }
  }
  convertBP(D, S) {
    try {
      let systolic = '0';
      let diastolic = '0';
      if (D && D > 0) { diastolic = D; }
      if (S && S > 0) { systolic = S; }
      return S + '/' + D;
    }
    catch
    {
      return '0/0';
    }
  }


  getUserPermissions() {
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_VITALS_LIST');
    const { CLIENT_VITALS_LIST_ADD, CLIENT_VITALS_LIST_UPDATE, CLIENT_VITALS_LIST_DELETE } = actionPermissions;
    if (!CLIENT_VITALS_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!CLIENT_VITALS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = CLIENT_VITALS_LIST_ADD || false;

  }


}
