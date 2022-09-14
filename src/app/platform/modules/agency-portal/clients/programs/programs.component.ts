import { Component, OnInit } from '@angular/core';
import { ProgramModel } from './program.model';
import { FilterModel, Metadata } from '../../../core/modals/common-model';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../core/services';
// import { ClientProgramsService } from '../client-programs.service';
import { MatDialog } from '@angular/material';
import { AssignProgramModalComponent } from './assign-program-modal/assign-program-modal.component';
import { NotifierService } from 'angular-notifier';
import { ClientsService } from '../clients.service';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {
  programsListingData: ProgramModel[];
  filterModel: FilterModel;
  metaData: Metadata;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  clientId: number;
  addPermission: boolean;
  isRoleClient: boolean = false;
  loginClientId: number;
  currentLocationId: number;
  loginStaffId: number;
  header: string = "Patient Programs";
  constructor(
    // private clientProgramsService: ClientProgramsService,
    private clientsService: ClientsService,
    private router: Router,
    private notifier: NotifierService,
    private assignProgramModal: MatDialog,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private dialogService:DialogService
    ) {
    this.displayedColumns = [
      { displayName: 'Program Name', key: 'diseaseManageProgram', class: '', width: '20%' },
      { displayName: 'Graduation Date', key: 'graduationDate', class: '', width: '10%', type: "date" },
      { displayName: 'Enrollment Date', key: 'dateOfEnrollment', class: '', width: '15%', type: "date" },
      { displayName: 'Termination Date', key: 'dateOfTermination', class: '', width: '15%', type: "date" },
      { displayName: 'Provider', key: 'careManager', class: '', width: '15%' },
      { displayName: 'Status', key: 'status', class: '', width: '15%' },
      { displayName: 'Frequency', key: 'frequency', class: '', width: '15%' },
      // { displayName: 'Frequency Description', key: 'frequencyDescription', class: '', width: '15%', isInfo: true },
      { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }
    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    ];
    this.filterModel = new FilterModel();
    this.metaData = new Metadata();
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLocationId = user.currentLocationId;
        this.isRoleClient = user.users3 && user.users3.userRoles && (user.users3.userRoles.userType || '').toUpperCase() == 'CLIENT';
        if (this.isRoleClient)
          this.loginClientId = user.id;
        else
          this.loginStaffId = user.id;
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.isRoleClient) {
        this.clientId = this.loginClientId;
      } else {
        this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      }
    });
    this.getPatientDiseaseManagementProgramList();
    this.getUserPermissions();
  }
  assignOrUpdateProgram(data?: any, diseaseManageProgram: string = '') {
    let dmpActivityModal;

    if (data && data.patientDiseaseManagementPrograms) {
      (data.patientDiseaseManagementPrograms || []).map(x => {
        x.programName = diseaseManageProgram;
        return x;
      })
    }

    dmpActivityModal = this.assignProgramModal.open(AssignProgramModalComponent, {
      hasBackdrop: true,
      data: {
        programsData: data,
        clientId: this.clientId,
        diseaseManageProgram,
        currentLocationId: this.currentLocationId,
        loginStaffId: this.loginStaffId
      }
    });
    dmpActivityModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getPatientDiseaseManagementProgramList();
    });
  }
  getPatientDiseaseManagementProgramList() {
    const filterParams = {
      ...this.filterModel,
      sortColumn: this.filterModel.sortColumn,
      sortOrder: this.filterModel.sortOrder,
      patientId: this.clientId,
    } 
    this.clientsService.getPatientDiseaseManagementProgramList(filterParams).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.programsListingData = response.data;
        this.metaData = response.meta || [];
      } else {
        this.programsListingData = [];
        this.metaData = new Metadata(); 
      }
      this.metaData.pageSizeOptions = [5,10,25,50,100];
    }
    );
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order);
    this.getPatientDiseaseManagementProgramList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
  }

  onTableActionClick(actionObj?: any) {
    const diseaseManageProgramId = actionObj.data && actionObj.data.diseaseManageProgramId,
      patientQuestionnaireId = actionObj.data && actionObj.data.patientQuestionnaireId,
      patientId = actionObj.data && actionObj.data.patientId ? this.commonService.encryptValue(actionObj.data.patientId, true) : null;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'VIEW':
        this.router.navigate(['/web/client/programs/program-activity'],
          {
            queryParams: { id: patientId, questionaireId: patientQuestionnaireId, documentTypeId: diseaseManageProgramId }
          });
        break;
      case 'EDIT':
        this.clientsService.getDiseaseManagementProgramDetails(actionObj.data.patientDiseaseManagementProgramId).subscribe((response: any) => {
          console.log("response ",response)
          if (response.statusCode == 200) {
            this.assignOrUpdateProgram(response.data, actionObj.data.diseaseManageProgram);
          } else {
            this.assignOrUpdateProgram(response.data);
          }
        });
        break;
      case 'DELETE':
        this.dialogService.confirm('Are you sure you want to delete this Patient Program?').subscribe((result: any) => {
            if (result == true) {
              this.clientsService.deleteDiseaseManagementProgram(actionObj.data.patientDiseaseManagementProgramId).subscribe((response: any) => {
                if (response.statusCode == 200) {
                  this.notifier.notify('success', response.message)
                  if ((this.programsListingData || []).length == 1)
                    this.filterModel.pageNumber = (this.filterModel.pageNumber - 1) || 1;
                  this.getPatientDiseaseManagementProgramList();
                } else {
                  this.notifier.notify('error', response.message)
                }
              });
            }
          });    
        break;
      case 'TERMINATE':
        this.clientsService.terminateActivity(actionObj.data.patientDiseaseManagementProgramId, new Date(), false).subscribe((response: any) => {
          if (response.statusCode == 200) {
            this.notifier.notify('success', response.message)
            this.getPatientDiseaseManagementProgramList();
          } else {
            this.notifier.notify('error', response.message)
          }
        }
        );
        break;
      default:
        break;
    }
  }

  getUserPermissions() {
    if (this.isRoleClient) {
      this.actionButtons = [];
      return;
    }
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_PROGRAMS_LIST');
    const { CLIENT_PROGRAMS_LIST_ADD, CLIENT_PROGRAMS_LIST_UPDATE, CLIENT_PROGRAMS_LIST_DELETE } = actionPermissions;
    if (!CLIENT_PROGRAMS_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!CLIENT_PROGRAMS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = CLIENT_PROGRAMS_LIST_ADD || false;

  }
}
