import { Component, OnInit, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { PayersService } from '../payers.service';
import { FilterModel, ResponseModel, Metadata } from '../../../core/modals/common-model';
import { PayerServiceCodeModel, PayerServiceCodeWithModifierModel } from '../payers.model';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { merge } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { PayerServiceCodeModalComponent } from './payer-service-code-modal/payer-service-code-modal.component';

@Component({
  selector: 'app-payer-service-codes',
  templateUrl: './payer-service-codes.component.html',
  styleUrls: ['./payer-service-codes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PayerServiceCodesComponent implements OnInit {
  payerId: number;
  filterModel: FilterModel;
  payerServiceCodesGrid: Array<PayerServiceCodeModel>;
  payerServiceCodes: Array<PayerServiceCodeModel>;
  payerServiceCodesOrgValues: Array<PayerServiceCodeModel>;
  metaData: Metadata;
  masterUnitType: any[];
  masterRoundingRules: any[];
  isFirstTimeLoad: boolean = false;
  isParentSelected: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  searchText: string = ''
  constructor(private payersService: PayersService, private notifier: NotifierService, private pscDialogModal: MatDialog, ) {
    this.filterModel = new FilterModel();
    this.metaData = new Metadata();
    this.payerServiceCodesGrid = new Array<PayerServiceCodeModel>();
    this.payerServiceCodes = new Array<PayerServiceCodeModel>();
    this.payerServiceCodesOrgValues = new Array<PayerServiceCodeModel>();
  }
  ngOnInit() {
    // this.onSortOrPageChanges();
    this.getPayerServiceCodes();
    this.getMasterData();
  }
  onSubmit() {
    if (this.payerServiceCodes != null && this.payerServiceCodes.length > 0) {
      let formValues = new Array<PayerServiceCodeWithModifierModel>();
      let formObj = null;
      this.payerServiceCodes.forEach(x => {
        formObj = new PayerServiceCodeWithModifierModel();
        formObj.serviceCode = x.serviceCode;
        formObj.description = x.description;
        formObj.unitType = x.unitTypeID;
        formObj.ratePerUnit = x.ratePerUnit;
        formObj.ruleID = x.ruleID;
        formObj.unitDuration = x.unitDuration;
        formObj.isBillable = x.isBillable;
        formObj.isRequiredAuthorization = x.isRequiredAuthorization;
        formObj.payerId = this.payerId;
        formObj.serviceCodeId = x.masterServiceCodeId;
        formValues.push(formObj);
      });
      this.payersService.savePayerServiceCodes(formValues).subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.getPayerServiceCodes();
        }
        else
          this.notifier.notify('error', response.message)
      });
    }
    else {
      this.notifier.notify('error', "Please select atleast one service code")
    }
  }
  getMasterData() {
    let data = "MASTERINSURANCETYPE,masterCountry,masterState,appointmentType,masterservicecode,masterunittype,masterroundingrules";
    this.payersService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterUnitType = response.masterUnitType != null ? response.masterUnitType : [];
        this.masterRoundingRules = response.masterRoundingRules != null ? response.masterRoundingRules : [];
      }
    });
  }
  applyFilter() {
    if (this.searchText == '' || this.searchText.length > 2) {
      this.filterModel.searchText = this.searchText;
      this.getPayerServiceCodes();
    }
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder);
    this.getPayerServiceCodes();
  }
  getPayerServiceCodes() {
    this.isParentSelected=false;
    this.payersService.getPayerServiceCodes(this.payerId, this.filterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.meta != null) {
        if (response.data.find(x => x.payerServiceCodeId > 0) == null) {
          this.isFirstTimeLoad = true;
          this.payerServiceCodesOrgValues = [];
          this.payerServiceCodesGrid = [];
          response.data.forEach(element => {
            this.payerServiceCodesOrgValues.push(this.createPayerServiceCode(element));
            this.payerServiceCodesGrid.push(this.createPayerServiceCode(element));
          });
          // this.payerServiceCodesGrid = response.data;
          this.payerServiceCodesGrid = this.payerServiceCodesGrid.map(x => {
            if (this.payerServiceCodes.findIndex(y => y.masterServiceCodeId == x.masterServiceCodeId) > -1) {
              x = this.payerServiceCodes.find(z => z.masterServiceCodeId == x.masterServiceCodeId);
              x.isEditable = true;
            }
            return x;
          });
          let checkGrid = this.payerServiceCodesGrid.findIndex(x => x.isEditable == false);
          if (checkGrid == -1)
            this.isParentSelected = true;
          else this.isParentSelected = false;
        }
        else {
          this.isFirstTimeLoad = false;
          this.payerServiceCodesOrgValues = [];
          this.payerServiceCodes = [];
          this.payerServiceCodesGrid = response.data;
          this.payerServiceCodesGrid = this.payerServiceCodesGrid.map(x => {
            x.isEditable = false;
            return x;
          });
        }
        this.metaData = response.meta;
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      }
       
    });
  }

  onParentClick(event: any) {
    this.isParentSelected=event.checked;
    this.payerServiceCodesGrid.forEach(x => {
      this.onChildClick(event, x);
    });
  }

  onChildClick(event: any, payerServiceCode: PayerServiceCodeModel) {
    if (event.checked == true) {
      this.payerServiceCodes.push(this.createPayerServiceCode(payerServiceCode));
      this.payerServiceCodesGrid.find(x => x.masterServiceCodeId == payerServiceCode.masterServiceCodeId).isEditable = true;
    }
    else {
      let index = this.payerServiceCodes.findIndex(y => y.masterServiceCodeId == payerServiceCode.masterServiceCodeId);
      if (index != -1) {
        this.payerServiceCodes.splice(index, 1);
        let gridIndex = this.payerServiceCodesGrid.findIndex(z => z.masterServiceCodeId == payerServiceCode.masterServiceCodeId);
        this.payerServiceCodesGrid[gridIndex] = this.payerServiceCodesOrgValues.find(n => n.masterServiceCodeId == payerServiceCode.masterServiceCodeId);
        this.payerServiceCodesGrid[gridIndex].isEditable = false;
      }
    }
  }

  createPayerServiceCode(payerServiceCode: PayerServiceCodeModel): PayerServiceCodeModel {
    let pscCode = new PayerServiceCodeModel();
    pscCode.masterServiceCodeId = payerServiceCode.masterServiceCodeId;
    pscCode.payerServiceCodeId = payerServiceCode.payerServiceCodeId;
    pscCode.serviceCode = payerServiceCode.serviceCode;
    pscCode.description = payerServiceCode.description;
    pscCode.unitDuration = payerServiceCode.unitDuration;
    pscCode.unitTypeID = payerServiceCode.unitTypeID;
    pscCode.ratePerUnit = payerServiceCode.ratePerUnit;
    pscCode.isBillable = payerServiceCode.isBillable;
    pscCode.ruleID = payerServiceCode.ruleID;
    pscCode.isRequiredAuthorization = payerServiceCode.isRequiredAuthorization;
    pscCode.ruleName = payerServiceCode.ruleName;
    pscCode.unitTypeName = payerServiceCode.unitTypeName;
    pscCode.payerId = payerServiceCode.payerId;
    pscCode.serviceCodeId = payerServiceCode.serviceCodeId;
    pscCode.totalRecords = payerServiceCode.totalRecords;
    pscCode.isEditable = false;
    return pscCode;
  }

  // onSortOrPageChanges(changeState?: any) {
  //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  //   merge(this.sort.sortChange, this.paginator.page)
  //     .subscribe(() => {
  //       const changeState = {
  //         sort: this.sort.active || '',
  //         order: this.sort.direction || '',
  //         pageNumber: (this.paginator.pageIndex + 1)
  //       }
  //       this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order);
  //       this.getPayerServiceCodes();
  //     })
  // } 

  onSortOrPageChanges(changeState?: any) {
    var pageSize;
    if(changeState.pageSize == 5){
      pageSize = 5;
    }else{
      pageSize = changeState.pageSize;
    }

     changeState = {
              sort: this.sort.active || '',
              order: this.sort.direction || '',
              pageNumber: (this.paginator.pageIndex + 1)
            }
    
    this.setPaginatorModel(changeState.pageNumber,pageSize, "", "");
    this.getPayerServiceCodes();
  }
  
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel = {
      pageNumber,
      pageSize,
      sortColumn,
      sortOrder,
      searchText: this.searchText
    }
  }
  updateModel(value: any, type: string, payerServiceCode: PayerServiceCodeModel) {
    let indexItem = this.payerServiceCodes.find(x => x.masterServiceCodeId == payerServiceCode.masterServiceCodeId);
    switch (type) {
      case "description":
        {
          indexItem.description = value;
          break;
        }
      case "unitduration":
        {
          indexItem.unitDuration = value;
          break;
        }
      case "unittype":
        {
          indexItem.unitTypeID = value;
          break;
        }
      case "rate":
        {
          indexItem.ratePerUnit = value;
          break;
        }
      case "rulename":
        {
          indexItem.ruleID = value
          break;
        }
      case "billable":
        {
          indexItem.isBillable = value;
          break;
        }
      case "reqauth":
        {
          indexItem.isRequiredAuthorization = value;
          break;
        }
    }
  }

  addPayerServiceCode(id?: number) {
  }
  deletePayerServiceCode(payerServiceCode: PayerServiceCodeModel) {
    this.payersService.deletePayerServiceCodes(payerServiceCode.payerServiceCodeId).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.notifier.notify('success', response.message)
        this.getPayerServiceCodes();
      }
      else
        this.notifier.notify('error', response.message)
    });
  }

  openDialog(id: number = null) {
    if (id != null && id > 0) {
      this.payersService.getPayerServiceCodeById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else {
      this.createModal(new PayerServiceCodeWithModifierModel());
    }
  }
  createModal(payerServiceCode: PayerServiceCodeWithModifierModel) {
    let payerServiceCodeModal;
    payerServiceCodeModal = this.pscDialogModal.open(PayerServiceCodeModalComponent, { hasBackdrop: true, data: { payerServiceCode: payerServiceCode, payerId: this.payerId } })
    payerServiceCodeModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getPayerServiceCodes();
    });
  }
}
