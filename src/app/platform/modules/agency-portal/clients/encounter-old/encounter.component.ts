import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { EncounterModel } from './encounter.model';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { format } from 'date-fns';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})


export class EncounterComponent implements OnInit {
  clientId: number;
  maxDate = new Date();
  encounterFormGroup: FormGroup;
  statusList: any[];
  appointmentType: any[];
  encounterListModel: EncounterModel[];
  header: string = "Patient Past-Appointments";
  metaData: any;
  clientEncounterFilterModel: FilterModel;
  displayedColumns: Array<any> = [
    { displayName: 'APPOINT.#', key: 'patientAppointmentId', isSort: true, class: '', width: '5%' },
    { displayName: 'DATE OF SERVICE', key: 'dateOfService', isSort: true, class: '', width: '20%' },
    { displayName: 'DURATION', key: 'duration', class: '', width: '5%' },
    { displayName: 'PRACTITIONER', key: 'staffName', isSort: true, class: '', width: '12%' },
    { displayName: 'APPT TYPE', key: 'appointmentType', class: '', width: '17%' },
    { displayName: 'STATUS', key: 'status', isSort: true, width: '10%', type: ['RENDERED', 'PENDING'] },
    { displayName: 'Actions', key: 'Actions', class: '', width: '5%' }

  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-eye' }
  ];

  constructor(private activatedRoute: ActivatedRoute, private clientsService: ClientsService, private formBuilder: FormBuilder, private route: Router,private commonService:CommonService) {
    this.encounterListModel = new Array<EncounterModel>();
    this.clientEncounterFilterModel = new FilterModel();
    this.statusList = [{ id: true, value: 'Pending' }, { id: false, value: 'Rendered' }]
  }


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id,false);
    });

    this.encounterFormGroup = this.formBuilder.group({
      appointmentTypeId: 0,
      staffName: "",
      status: "",
      fromDate: "",
      toDate: ""
    });
    this.getMasterData();
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, 0, "", "", "", "");
    this.getUserPermissions();
  }

  get formControls() { return this.encounterFormGroup.controls; }


  getMasterData() {
    let data = "appointmentType";
    this.clientsService.getMasterData(data).subscribe((response: any) => {
      this.appointmentType = response.appointmentType;
    });
  }

  getEncounterList(filterModel: FilterModel, clientId: number, appointmentTypeId: number, staffName: string, status: string, fromDate: string, toDate: string) {
    this.clientsService.getClientEncounters(this.clientEncounterFilterModel, clientId, appointmentTypeId, staffName, status, fromDate, toDate).subscribe((response: ResponseModel) => {
      if (response && response.statusCode == 200)
        this.encounterListModel = response.data;
      this.encounterListModel = (response.data || []).map((obj: any) => {
        obj.dateOfService = format(obj.dateOfService, 'MM/DD/YYYY') + " (" + format(obj.dateOfService, 'h:mm A') + " - " + format(obj.endDateTime, 'h:mm A') + ")";
        return obj;
      });
      this.metaData = response.meta;
    });
  }
  clearFilters() {
    this.encounterFormGroup.reset();
    this.setPaginatorModel(1, this.clientEncounterFilterModel.pageSize, this.clientEncounterFilterModel.sortColumn, this.clientEncounterFilterModel.sortOrder);
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, 0, "", "", "", "");
  }

  applyFilter() {
    let formValues = this.encounterFormGroup.value;
    this.setPaginatorModel(1, this.clientEncounterFilterModel.pageSize, this.clientEncounterFilterModel.sortColumn, this.clientEncounterFilterModel.sortOrder);
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, formValues.appointmentTypeId, formValues.staffName, formValues.status, formValues.fromDate ? format(formValues.fromDate, 'MM/DD/YYYY') : "", formValues.toDate ? format(formValues.toDate, 'MM/DD/YYYY') : "");
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.clientEncounterFilterModel.pageNumber = pageNumber;
    this.clientEncounterFilterModel.pageSize = pageSize;
    this.clientEncounterFilterModel.sortOrder = sortOrder;
    this.clientEncounterFilterModel.sortColumn = sortColumn;
  }

  onPageOrSortChange(changeState?: any) {
    let formValues = this.encounterFormGroup.value;
    this.setPaginatorModel(changeState.pageNumber, this.clientEncounterFilterModel.pageSize, changeState.sort, changeState.order);
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, formValues.appointmentTypeId, formValues.staffName, formValues.status, formValues.fromDate ? format(formValues.fromDate, 'MM/DD/YYYY') : "", formValues.toDate ? format(formValues.toDate, 'MM/DD/YYYY') : "");
  }



  onTableActionClick(actionObj?: any) {
    const apptId = actionObj.data && actionObj.data.patientAppointmentId,
        encId = actionObj.data && actionObj.data.id,
        isBillableEncounter = actionObj.data && actionObj.data.isBillableEncounter;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
      const redirectUrl = isBillableEncounter ? "/web/waiting-room/" : "/web/encounter/non-billable-soap";
      if(isBillableEncounter){
        this.route.navigate(["/web/waiting-room/"+apptId]);
      } else {
      this.route.navigate([redirectUrl], {
        queryParams: {
          apptId: apptId,
          encId: encId
        }});
      }
        break;
      default:
        break;
    }
  }

  getUserPermissions() {
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_ENCOUNTER_LIST');
    const { CLIENT_ENCOUNTER_LIST_VIEW } = actionPermissions;
    if (!CLIENT_ENCOUNTER_LIST_VIEW) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }

  }

}
