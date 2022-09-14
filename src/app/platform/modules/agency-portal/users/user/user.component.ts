import { UserAwardComponent } from "./../user-award/user-award.component";
import { UserQualificationComponent } from "./../user-qualification/user-qualification.component";
import { UserExperienceComponent } from "./../user-experience/user-experience.component";
import { DataTableComponent } from "./../../../../../shared/data-table/data-table.component";
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ViewEncapsulation
} from "@angular/core";
import { AddUserComponent } from "../add-user/add-user.component";
import { CustomFieldsComponent } from "../custom-fields/custom-fields.component";
import { AvailabilityComponent } from "../availability/availability.component";
import { UserModel, UserProfile } from "../users.model";
import { userInfo } from "os";
import { ResponseModel } from "../../../core/modals/common-model";
import { UsersService } from "../users.service";
import { ActivatedRoute } from "@angular/router";
import { format } from "date-fns";
import { CommonService } from "../../../core/services";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  @ViewChild("tabContent", { read: ViewContainerRef })

  tabContent: ViewContainerRef;
  userTabs: any;
  staffId: number = null;
  selectedIndex: number = 0;
  userProfile: UserProfile;
  tabName:any='';
  constructor(
    private cfr: ComponentFactoryResolver,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.userTabs = [
      { TabName: "User Info", Component: AddUserComponent },
      //{ TabName: "Custom Fields", Component: CustomFieldsComponent },
      { TabName: "Availability", Component: AvailabilityComponent },
      { TabName: "Work & Experience", Component: UserExperienceComponent },
      { TabName: "Qualifications", Component: UserQualificationComponent },
      { TabName: "Awards", Component: UserAwardComponent }
    ];
    this.userProfile = new UserProfile();
  }

  ngOnInit() {
    this.tabName=localStorage.getItem('tabToLoad');

    this.activatedRoute.queryParams.subscribe(params => {
      this.staffId =
        params.id == undefined
          ? null
          : this.commonService.encryptValue(params.id, false);
          if (this.tabName != undefined && this.tabName != '') {
        this.selectedIndex = this.userTabs.findIndex(x => x.TabName == this.tabName);

      }

      this.loadChild(this.tabName == ''  || this.tabName==undefined? this.userTabs[0].TabName : this.tabName);
      localStorage.removeItem('tabToLoad');
    });


  }
  loadComponent(eventType: any): any {
    this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {

    if (this.staffId != null && this.staffId > 0) this.getStaffProfileInfo();
    let factory: any;
    factory = this.cfr.resolveComponentFactory(
      this.userTabs.find(x => x.TabName == childName).Component
    );
    this.tabContent.clear();
    let comp: ComponentRef<AddUserComponent> = this.tabContent.createComponent(
      factory
    );
    comp.instance.staffId = this.staffId;
    comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this));
  }

  handleTabChange(data: any): any {

    this.staffId = data.id;
    this.getStaffProfileInfo();



    this.selectedIndex = this.userTabs.findIndex(s => s.TabName == data.tab); // this.userTabs.findIndex(i => i == data.tab);//data.tab == this.userTabs[1] ? 1 : data.tab == this.userTabs[2] ? 2 : 0;

    this.loadChild(data.tab);
  }

  getStaffProfileInfo() {
    this.usersService
      .getStaffHeaderInfo(this.staffId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.userProfile = response.data;
          this.userProfile.dob = format(this.userProfile.dob, "MM/DD/YYYY");
        }
      });
  }
}
