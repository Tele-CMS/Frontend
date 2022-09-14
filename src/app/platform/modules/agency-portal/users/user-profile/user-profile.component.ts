import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ResponseModel } from '../../../../../super-admin-portal/core/modals/common-model';
import { StaffProfileModel } from '../users.model';
import { CommonService } from '../../../core/services';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  staffId: number;
  userId: number;
  selectedIndex: number = 0;

  staffProfile: StaffProfileModel;
  subscription: Subscription;
  profileTabs: any = ["Documents", "Leaves", "Timesheet"]
  constructor(private userService: UsersService, private commonService: CommonService, private router: Router) {
    this.staffProfile = new StaffProfileModel()
  }

  ngOnInit() {

    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.staffId = user.data.id;
        this.userId = user.data.userID;
        this.getStaffProfileData();
      }
    });
  }
  loadComponent(eventType: any): any {
    this.selectedIndex =eventType.index;
  }
  getStaffProfileData() {
    this.userService.getStaffProfileData(this.staffId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        this.staffProfile = response.data;
      }
    });
  }
  editProfile() {
    this.router.navigate(["/web/manage-users/user"], { queryParams: { id: this.commonService.encryptValue(this.staffId,true) } });
  }
}
