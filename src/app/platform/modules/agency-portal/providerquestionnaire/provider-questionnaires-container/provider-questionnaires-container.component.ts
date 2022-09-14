import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../core/services';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { ProviderquestionnaireService } from '../providerquestionnaire.service';
import { FormControl, Validators } from '@angular/forms';
import { ProviderQuestionnaireControlModel, QuestionnareTypeModel, SwapOrderModel } from '../providerquestionnaire.model';
import { MatDialog, MatTable } from '@angular/material';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { FilterModel, ResponseModel, Metadata } from '../../../core/modals/common-model';
import { Observable, of } from 'rxjs';
import { ControlBase, ControlTypesHelper } from 'src/app/shared/dynamic-form/dynamic-form-models';


@Component({
  selector: 'app-provider-questionnaires-container',
  templateUrl: './provider-questionnaires-container.component.html',
  styleUrls: ['./provider-questionnaires-container.component.scss']
})
export class ProviderQuestionnairesContainerComponent implements OnInit {


  questionnaireTypes: QuestionnareTypeModel[] = [];
  selectedType = new FormControl(undefined, [Validators.required]);
  selectedTabIndex: number = 0;
  providerQuestionnaires: ProviderQuestionnaireControlModel[] = [];
  searchText = "";
  filterModel: FilterModel;
  metaData = new Metadata();
  controls$: ControlBase<any>[];


  displayedColumns: Array<any> = [
    { displayName: 'Order No.', key: 'order', isSort: true, class: '', width: '12%' },
    { displayName: 'Question', key: 'questionText', isSort: true, class: '' },
    { displayName: 'Control Name', key: 'controlName', isSort: true, class: '', width: '15%' },
    { displayName: 'Options', key: 'optionsString', isSort: true, class: '' },
    { displayName: 'Status', key: 'isActive', isSort: true, class: '', width: '6%',type: ['Active', 'Inactive']  },
    { displayName: 'Is Required', key: 'isRequiredString', isSort: true, class: '', width: '14%'  },
    { displayName: 'Actions', key: 'Actions', class: '', width: '11%' }

  ];

  actionButtons: Array<any> = [
    { displayName: 'Move Order Up', key: 'move-order-up', class: 'fa fa-arrow-up' },
    { displayName: 'Move Order Down', key: 'move-order-down', class: 'fa fa-arrow-down' },
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];

  controls:any;
  constructor(
    private addQuestionDailog: MatDialog,
    private notifier: NotifierService,
    private providerquestionnaireService: ProviderquestionnaireService,
    private dialogService: DialogService,
    private commonService: CommonService,
    
  ) {
  
  }



  ngOnInit() {
    
 
    this.getMasterQuestionnaireTypes();
    this.selectedType.valueChanges.subscribe(type => {
      this.fetchQuestions(type.id);
    })

  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);

  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  onTableActionClick(actionObj?: any) {

    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.createAddEditQuestionModel(actionObj.data);
        break;

      case 'DELETE':
        {
          
          this.deleteControl(actionObj.data.questionId)
        }
        break;
      case 'MOVE-ORDER-UP':
        this.changeOrder(actionObj.data, actionObj.action);
        break;
      case 'MOVE-ORDER-DOWN':
        this.changeOrder(actionObj.data, actionObj.action);
        break;
      default:
        break;
    }
  }

  private deleteControl(id) {
    this.notifier.hideAll();
    this.dialogService.confirm(`Are you sure you want to delete this questionnaire?`).subscribe((result: any) => {
      if (result == true) {
        this.providerquestionnaireService.deleteProviderQuestionnaireControl(id).subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.notifier.notify('success', "Deleted successfully")
            this.fetchQuestions();
          } else {
            this.notifier.notify('error', response.message)
          }
        });
      }
    })
  }

  getMasterQuestionnaireTypes() {
    this.commonService.loadingStateSubject.next(true);
    this.providerquestionnaireService.getMasterData("MASTERQUESTIONNAIRETYPES").subscribe(res => {
      this.commonService.loadingStateSubject.next(false);
      this.questionnaireTypes = res.masterQuestionnaireTypes;
      if (this.questionnaireTypes && this.questionnaireTypes.length > 0)
        this.selectedType.setValue(this.questionnaireTypes[0]);
    });
  }

  applyFilter(searchText: string = '') {
    if (searchText == '' || searchText.length > 2) {
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
      //this.getPayersList();
    }
  }

  clearFilters() {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
  }


  onTabChange(selectedTabIndex) {
    this.fetchQuestions(this.questionnaireTypes[selectedTabIndex].id);
  }

  fetchQuestions(type = null) {
    type = type ? type : this.selectedType.value ? this.selectedType.value.id : undefined;
    if (type) {
      this.commonService.loadingStateSubject.next(true);
      this.providerquestionnaireService.getProvidersQuestionnaireControlsByType(type).subscribe(res => {
      if(res.data){
        
        this.providerQuestionnaires = res.data;
        this.providerQuestionnaires.map(m => {
          
          m.isRequiredString = m.isRequired ? "Yes" : "No"
          return m;
        });
      }
        
        this.commonService.loadingStateSubject.next(false);
      });
    }
  }

  createAddEditQuestionModel(_questionControl) {
    if (this.selectedType.invalid) {
      return;
    }
    const type = this.selectedType.value as QuestionnareTypeModel;
    const modalPopup = this.addQuestionDailog.open(
      AddQuestionComponent,
      {
        hasBackdrop: true,
        data: { type: type, questionControl: _questionControl, isUpdate: _questionControl ? true : false },
        width:"55%"
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      this.commonService.loadingStateSubject.next(false);
      if (result === "SAVE") {
        this.fetchQuestions();
        this.notifier.notify("success", "Questionnaire saved");
      }
    });
  }

  changeOrder(quesObj: ProviderQuestionnaireControlModel, direction: string) {
    direction = direction.toUpperCase();
    const toUpdateObject: SwapOrderModel[] = [];
    if (direction == 'MOVE-ORDER-UP') {
      const quesOrder = this.providerQuestionnaires.find(x => x.questionId == quesObj.questionId).order;
      if (quesOrder != 1) {
        const swapWithOrder = quesOrder - 1;
        const swapWithObj = this.providerQuestionnaires.find(x => x.order == swapWithOrder);
        toUpdateObject.push({ id: quesObj.questionId, order: swapWithOrder });
        toUpdateObject.push({ id: swapWithObj.questionId, order: quesOrder });
        this.updateOrder(toUpdateObject);
      }

    }
    else if (direction == 'MOVE-ORDER-DOWN') {
      const quesOrder = this.providerQuestionnaires.find(x => x.questionId == quesObj.questionId).order;

      if (quesOrder != (this.providerQuestionnaires.length)) {
        const swapWithOrder = quesOrder + 1;
        const swapWithObj = this.providerQuestionnaires.find(x => x.order == swapWithOrder);
        toUpdateObject.push({ id: quesObj.questionId, order: swapWithOrder });
        toUpdateObject.push({ id: swapWithObj.questionId, order: quesOrder });
        this.updateOrder(toUpdateObject);
      }
    }
  }

  private updateOrder(list: SwapOrderModel[]) {
    this.commonService.loadingStateSubject.next(true);
    this.providerquestionnaireService.swapQuestionOrder(list).subscribe(res => {
      this.commonService.loadingStateSubject.next(false);
      if (res.data) {
        this.fetchQuestions();
      }

    });
  }

}
