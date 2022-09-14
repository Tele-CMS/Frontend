import { Component, OnInit } from '@angular/core';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { RoundingRuleModel } from './rounding-rules.model';
import { MatDialog } from '@angular/material';
import { RoundingRulesService } from './rounding-rules.service';
import { RoundingRulesModalComponent } from './rounding-rules-modal/rounding-rules-modal.component';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-rounding-rules',
  templateUrl: './rounding-rules.component.html',
  styleUrls: ['./rounding-rules.component.css']
})
export class RoundingRulesComponent implements OnInit {

  roundingRuleModel: RoundingRuleModel;
  roundingRuleData: RoundingRuleModel[];
  metaData: any;
  displayedColumns: Array<any>;
  searchText: String = "";
  filterModel: FilterModel;
  addPermission: boolean;
  constructor(
    private roundingRuleDailog: MatDialog,
    public roundingRuleService: RoundingRulesService,
    private notifier: NotifierService,
    private dialogService: DialogService
  ) {
    this.displayedColumns = [
      { displayName: 'Rule Name', key: 'ruleName', isSort: true, class: '', width: '70%' },
      { displayName: 'Actions', key: 'Actions', isSort: true, class: '', width: '30%' }
    ];
  }
   actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getListData();
    this.getUserPermissions();
  }

  createModel(roundingRuleModel: RoundingRuleModel) {
    const roundingRuleModalPopup = this.roundingRuleDailog.open(RoundingRulesModalComponent, {
      hasBackdrop: true,
      data: roundingRuleModel || new RoundingRuleModel(),
    });

    roundingRuleModalPopup.afterClosed().subscribe(result => {
      if (result === 'SAVE')
        this.getListData()
    });
  }
  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getListData();
  }
  openDialog(id: number): void {
    this.roundingRuleModel = {
      id: id || 0,
    }
    if (!this.roundingRuleModel.id) {
      this.createModel(this.roundingRuleModel)
    } else {
      this.roundingRuleService.get(id).subscribe(response => {
        this.roundingRuleModel = {
          ...response,
          roundingRuleDetail: (response.roundingRuleDetail || []).map(obj => {
            return {
              id: obj.id,
              startRange: obj.startRange,
              endRange: obj.endRange,
              unit: obj.unit,
            }
          }),
        };
        this.createModel(this.roundingRuleModel)
      })
    }
  }

  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
  //   this.getListData();
  // } old new

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getListData();
  }

  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
    if (searchText.trim() == '' || searchText.trim().length >= 3)
      this.getListData();
  }

  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        {
          this.dialogService.confirm(`Are you sure you want to delete this rounding rule?`).subscribe((result: any) => {
            if (result == true) {
              this.roundingRuleService.delete(id).subscribe((response: ResponseModel) => {
                if (response.statusCode === 200) {
                  this.notifier.notify('success', response.message)
                  this.getListData();
                } else if (response.statusCode === 422) {
                  this.notifier.notify('warning', response.message)
                } else {
                  this.notifier.notify('error', response.message)
                }
              });
            }
          })
        } break;
      default:
        break;
    }
  }

  getListData() {
    this.filterModel.sortColumn = this.filterModel.sortColumn || 'id';
    this.filterModel.sortOrder = this.filterModel.sortOrder || 'desc';
    this.roundingRuleService.getAll(this.filterModel)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.roundingRuleData = response.data;
            this.metaData = response.meta;
          } else {
            this.roundingRuleData = [];
            this.metaData = {};
          }
          this.metaData.pageSizeOptions = [5,10,25,50,100];
        });
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.roundingRuleService.getUserScreenActionPermissions('MASTERS', 'MASTERS_ROUNDINGRULES_LIST');
    const { MASTERS_ROUNDINGRULES_LIST_ADD, MASTERS_ROUNDINGRULES_LIST_UPDATE, MASTERS_ROUNDINGRULES_LIST_DELETE } = actionPermissions;
    if (!MASTERS_ROUNDINGRULES_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!MASTERS_ROUNDINGRULES_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = MASTERS_ROUNDINGRULES_LIST_ADD || false;

  }

}
