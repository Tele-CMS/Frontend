import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UsersService } from '../users.service';
import { ResponseModel, FilterModel, Metadata } from '../../../core/modals/common-model';
import { UserModel, StaffLeaveModel } from '../users.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { NotifierService } from 'angular-notifier';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { merge } from 'rxjs';
import { ApplyLeaveModalComponent } from './apply-leave-modal/apply-leave-modal.component';

class statusModel {
  staffLeaveId: number;
  leaveStatusId: number;
}

@Component({
  selector: 'app-user-leaves',
  templateUrl: './user-leaves.component.html',
  styleUrls: ['./user-leaves.component.css']
})
export class UserLeavesComponent implements OnInit {
  masterStaffs: Array<any>;
  @Input() staffId: number = null;
  @Input() isSpecificUser: boolean = false;
  staffLeaveFormGroup: FormGroup;
  selectedStaffSelectedId: number = null;
  masterLeaveStatus: Array<any>;
  statusObj: Array<statusModel>;
  metaData: Metadata;
  filterModel: FilterModel;
  usersData: StaffLeaveModel[];
  userFormGroup: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private userService: UsersService, private formBuilder: FormBuilder, private router: Router, private notifier: NotifierService, private staffLeaveDialogModal: MatDialog, ) {
    this.filterModel = new FilterModel();
    this.masterStaffs = [];
    this.masterLeaveStatus = [];
    this.statusObj = [];
    this.metaData = new Metadata();
  }

  ngOnInit() {
    this.onSortOrPageChanges();
    this.userService.getMasterData('masterstaff,leavestatus').subscribe((response: any) => {
      this.masterStaffs = response.staffs;
      this.masterLeaveStatus = response.leaveStatus;
    })
    this.staffId
    if (!this.isSpecificUser) {
      this.staffLeaveFormGroup = this.formBuilder.group({
        filterStaffId: [],
      });
      this.getStaffLeaves(0);
    } else {
      this.getStaffLeaves(this.staffId);
    }
  }
  get formControls() {
    return this.staffLeaveFormGroup.controls;
  }
  getStaffLeaves(value: number) {
    this.selectedStaffSelectedId = this.staffId ? this.staffId : value;
    this.userService.getStaffLeaves(this.filterModel, this.selectedStaffSelectedId).subscribe((response: ResponseModel) => {
      this.usersData = response.data;
      this.usersData = (response.data || []).map((obj: any) => {
        obj.toDate = format(obj.toDate, 'DD-MM-YYYY');
        obj.fromDate = format(obj.fromDate, 'DD-MM-YYYY');
        return obj;
      })
      this.metaData = response.meta;
    });
    this.statusObj = [];
  }

  clearFilter() {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    
    // this.staffId = null;
    this.staffLeaveFormGroup.patchValue({
      filterStaffId: null,
    })
    //call empty list with 0 no id
    this.getStaffLeaves(0);
    this.statusObj = [];
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  addStatus(staffLeaveId: number, leaveStatusId: number) {
    let index = this.statusObj.findIndex(a => a.staffLeaveId == staffLeaveId);
    if (index > -1) {
      this.statusObj.splice(index, 1, { "staffLeaveId": staffLeaveId, "leaveStatusId": leaveStatusId });
    }
    else { this.statusObj.push({ "staffLeaveId": staffLeaveId, "leaveStatusId": leaveStatusId }); }
  }
  openDialog(id?: number) {
    if (id != null && id > 0) {
      this.userService.getStaffLeaveById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.createModal(response.data);
        }
      });
    }
    else
      this.createModal(new StaffLeaveModel());
  }
  editAppliedLeave(id: number) {
    this.openDialog(id);
  }
  deleteAppliedLeave(id: number) {
    this.userService.deleteStaffLeave(id)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.notifier.notify('success', response.message)
          this.getStaffLeaves(0);
        } else if (response.statusCode === 401) {
          this.notifier.notify('warning', response.message)
        } else {
          this.notifier.notify('error', response.message)
        }
      })
  }
  createModal(staffLeaveModel: StaffLeaveModel) {
    let staffLeaveModal;
    staffLeaveModal = this.staffLeaveDialogModal.open(ApplyLeaveModalComponent, { hasBackdrop: true, data: { staffLeaveModel: staffLeaveModel, staffId: this.staffId ? this.staffId : null } })
    staffLeaveModal.afterClosed().subscribe((result: string) => {
      if (result == 'save')
        this.getStaffLeaves(0);
    });
  }
  submitLeaves() {
    if (this.statusObj.length > 0) {
      this.userService.updateLeaveStatus(this.statusObj).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.statusObj = [];

        } else {
          this.notifier.notify('error', response.message);
        }
      });
    }
    else {
      this.notifier.notify('warning', "Please update status first!");
    }
  }

  onSortOrPageChanges() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .subscribe(() => {
        const changeState = {
          sort: this.sort.active || '',
          order: this.sort.direction || '',
          pageNumber: (this.paginator.pageIndex + 1)
        }
        this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order, "");
        this.getStaffLeaves(this.staffId?this.staffId:this.selectedStaffSelectedId);
      })
  }
}