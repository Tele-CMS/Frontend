import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TasksDialogService } from '../tasks-dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { TaskModal } from './tasks.modal';
import { format, isThisISOWeek } from 'date-fns';
import { ReplaySubject, Subject, of, Observable, Subscription } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, finalize, catchError, delay } from 'rxjs/operators';
import { CommonService, LayoutService } from '../../../core/services';


interface ClientModal {
  id: number;
  value: string;
  dob: Date;
  mrn: string;
}

@Component({
  selector: 'app-tasks-dialog',
  templateUrl: './tasks-dialog.component.html',
  styleUrls: ['./tasks-dialog.component.css']
})
export class TasksDialogComponent implements OnInit, OnDestroy {
  patientId: number;
  taskform: FormGroup;
  submitted: boolean;
  taskModal: TaskModal;
  masterTaskTypes: Array<any>;
  masterTaskPriority: Array<any>;
  staffs: Array<any>;
  assigneeArray: Array<any>;
  isAssignedToPatient: boolean;
  subscription: Subscription;
  selectedLocationId: number;
  loginStaffId: number;
  dialogFromHeader: boolean;
  patientcaregapDD: Array<any>;
  isStaff: boolean = false;
  assignTaskToCMPermission: boolean;
  disableCareGap: boolean;
  maxDate: Date;
  taskKey: string;
  linkedEncounterId: number;
  overallTaskStatus: boolean;
  headerText: string;
  markTaskStatus: Array<any>
  // autocomplete
  memberFilterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideMembers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideMembers: Array<any>;
  selectFilteredServerSideMembers: Array<any>;
  protected _onDestroy = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private tasksService: TasksDialogService,
    private dialogModalRef: MatDialogRef<TasksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private commonService: CommonService,
    private layoutService: LayoutService
  ) {
    this.taskModal = data.taskModal || new TaskModal();
    this.taskKey = data.taskKey
    this.disableCareGap = this.taskModal.associatedCareGapId && this.taskModal.key == 'Care Plan Screen' ? true : false;
    this.assignTaskToCMPermission = this.taskModal.associatedCareGapId && this.taskModal.key == 'Care Plan Screen' ? true : data.assignTaskToCMPermission;
    this.patientId = data ? data.taskModal.patientId : null;
    this.dialogFromHeader = data.key == 'fromHeader' ? true : false;
    this.taskModal.key = ''
    this.taskModal.assignedDate = this.taskModal.assignedDate == null ? format(new Date(), 'YYYY-MM-DD') : format(this.taskModal.assignedDate, 'YYYY-MM-DD');
    this.isStaff = this.taskModal.assignedCareManagerId > 0 ? true : false;
    this.submitted = false;
    this.masterTaskTypes = [];
    this.masterTaskPriority = [];
    this.staffs = [];
    this.selectFilteredServerSideMembers = [];
    this.fetchedFilteredServerSideMembers = [];
    this.overallTaskStatus = data.taskModal.overallTaskStatus;
    if (this.taskModal.id != null && this.taskModal.id > 0)
      this.headerText = 'Edit Task';
    else
      this.headerText = 'Create Task';

    if(data.updatedHeaderText) {
      this.headerText = data.updatedHeaderText;
    }
    this.assigneeArray = [
      { id: true, value: 'Patient' },
      { id: false, value: 'Provider' },
    ];
    this.markTaskStatus = [
      { id: 0, value: 'Open' },
      { id: 1, value: 'Closed' },
    ];
    if (this.taskModal.assignedPatientId > 0 && this.taskModal.assignedPatientName) {
      const clientObj: ClientModal = { id: this.taskModal.assignedPatientId, value: this.taskModal.assignedPatientName, mrn: '', dob: null };
      this.selectFilteredServerSideMembers = [clientObj];
    }


    let filteredDate = new Date();
    if (this.taskModal && this.taskModal.dueDate) {
      filteredDate = new Date(this.taskModal.dueDate) > new Date() ? new Date() : new Date(this.taskModal.dueDate);
    }
    this.maxDate = filteredDate;
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.layoutService.clientDrawerData.subscribe(({ encounterId }) => {
      this.linkedEncounterId = encounterId;
    });
    this.subscription = this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.loginStaffId = user.id;
        this.selectedLocationId = user.currentLocationId;
      }
    });
    this.getPatientCareGapForDData();
    this.getMasterData();
    this.getTaskTypeData();
    this.getStaffsByLocation(this.selectedLocationId);
    this.taskform = this.formBuilder.group({
      "id": this.taskModal.id,
      "masterTaskTypeId": this.taskModal.masterTaskTypeId,
      "assignedBy": this.taskModal.assignedBy,
      "assignedDate": this.taskModal.assignedDate,
      "assignedPatientId": this.taskModal.assignedPatientId,
      "assignedCareManagerId": this.taskModal.assignedCareManagerId,
      "carePlan": this.taskModal.carePlan,
      "description": this.taskModal.description,
      "patientRisk": this.taskModal.patientRisk,
      "priorityId": this.taskModal.priorityId,
      "dueDate": this.taskModal.dueDate,
      "associatedCareGapId": this.taskModal.associatedCareGapId,
      "overallTaskStatus": this.taskModal.overallTaskStatus,
      "statusId": this.taskModal.id > 0 ? this.taskModal.overallTaskStatus == false ? 0 : 1 : this.taskModal.statusId
    });
    this.memberFilterCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search: string) => {

          // simulate server fetching and filtering data
          if (search.length > 2) {
            return this._filter(search).pipe(
              finalize(() => this.searching = false),
            )
          } else {
            // if no value is present, return null
            return of([]);
          }
        }),
        delay(500)
      )
      .subscribe(filteredMembers => {
        this.searching = false;
        filteredMembers.subscribe(res => { this.fetchedFilteredServerSideMembers = res; this.filteredServerSideMembers.next(res) });
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });
  }

  _filter(value: string): Observable<any> {
    const filterValue = value.toLowerCase();
    return this.tasksService
      .getPatientsByLocation(filterValue, this.selectedLocationId)
      .pipe(
        map(
          (response: any) => {
            if (response.statusCode !== 201)
              return [];
            else
              return (response.data || []).map((clientObj: any) => {
                const Obj: ClientModal = {
                  id: clientObj.patientId,
                  value: clientObj.firstName + ' ' + clientObj.lastName,
                  dob: new Date(clientObj.dob),
                  mrn: clientObj.mrn
                }
                return Obj;
              });
          }),
        catchError(_ => {
          return [];
        })
      );
  }

  get getSlectFilteredServerSideMembers() {
    return (this.selectFilteredServerSideMembers || []).filter(x => {
      if ((this.fetchedFilteredServerSideMembers || []).findIndex(y => y.id == x.id) > -1)
        return false;
      else
        return true;
    })
  }
  getPatientCareGapForDData() {
    this.tasksService.getPatientCareGapForDD(this.patientId)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.patientcaregapDD = response.data;
          } else {
            this.patientcaregapDD = [];
          }
        });
  }
  onPatientSelect(id) {
    let clientsArray = this.fetchedFilteredServerSideMembers || [];
    clientsArray = [...this.selectFilteredServerSideMembers, ...clientsArray];
    clientsArray = Array.from(new Set(clientsArray.map(s => s)));
    this.selectFilteredServerSideMembers = clientsArray.filter(x => x.id == id);
  }
  onClickCheckbox(event: any, keytext: string) {
    if (event.checked) {
      if (keytext.toLowerCase() == 'patient') {
        this.taskModal.assignedCareManagerId = this.loginStaffId
        this.taskModal.assignedPatientId = this.patientId
      } else if (keytext.toLowerCase() == 'staff') {
        this.isStaff = !this.isStaff
        this.formCtrls.assignedCareManagerId.setValidators([Validators.required]);
        this.formCtrls.assignedCareManagerId.updateValueAndValidity();
      }
    } else {
      if (keytext.toLowerCase() == 'patient') {
        this.taskModal.assignedPatientId = null
      }
      if (keytext.toLowerCase() == 'staff') {
        this.taskModal.assignedCareManagerId = null
        this.isStaff = !this.isStaff
        this.formCtrls.assignedCareManagerId.clearValidators();
        this.formCtrls.assignedCareManagerId.updateValueAndValidity();
      }
    }
  }

  onSelecttaskStatus(event: any) {

    if (event.value == 1) {
      this.taskModal.overallTaskStatus = true;
      this.taskModal.patientTaskStatus =true;
      
    }
    else if (event.value == 0) {
      this.taskModal.overallTaskStatus = false;
      this.taskModal.patientTaskStatus =false;
    }
  }

  get formCtrls() { return this.taskform.controls }

  onSubmit() {
    this.submitted = true;
    if (this.taskform.invalid) {
      this.submitted = false;
      return;
    }

    const formData = { ...this.taskform.value };
    formData.assignedBy = formData.assignedBy || this.loginStaffId;

    if (this.dialogFromHeader) {
      formData.assignedCareManagerId = null;
      formData.assignedPatientId = null;
    } else {
      formData.assignedCareManagerId = formData.assignedCareManagerId && this.isStaff ? formData.assignedCareManagerId : null;
      formData.assignedPatientId = this.taskModal.assignedPatientId || null;
      formData.patientId = this.patientId
    }
    formData.patientTaskStatus = this.taskModal.patientTaskStatus ? this.taskModal.patientTaskStatus : null
    formData.patientTaskUpdatedDate = this.taskModal.patientTaskUpdatedDate ? this.taskModal.patientTaskUpdatedDate : null
    formData.overallTaskStatus = this.taskModal.overallTaskStatus ? this.taskModal.overallTaskStatus : false
    formData.dueDate = format(formData.dueDate, 'YYYY-MM-DD');
    formData.linkedEncounterId = this.linkedEncounterId;
    formData.assignedDate = format(new Date(),'YYYY-MM-DD')
    this.tasksService.saveTask(formData).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message)
        this.closeDialog('save');
        // this.commonService.updateTasksFromHeaderChange(true);
      } else {
        this.notifier.notify('error', response.message)
      }
    });
  }

  getMasterData() {
    const masterDataObj = { masterdata: 'MASTERTASKPRIORITY' }
    this.tasksService.getMasterData(masterDataObj).subscribe(
      response => {
        if (response != null) {
          this.masterTaskPriority = response.masterTaskPriority;
        }
      }
    )
  }
  getTaskTypeData() {
    this.tasksService.getTaskDD(this.taskKey).subscribe(
      response => {
        if (response != null) {
          this.masterTaskTypes = response.data;
        }
      }
    )
  }
  getStaffsByLocation(id: number) {
    this.tasksService.getStaffsByLocation(id).subscribe(
      response => {
        if (response.statusCode == 200)
          this.staffs = response.data.staff || [];
      }
    )
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

}
