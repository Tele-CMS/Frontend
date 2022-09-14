import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild, ComponentRef } from '@angular/core';
import { UserTimeSheetSheetViewComponent } from '../user-time-sheet-sheet-view/user-time-sheet-sheet-view.component';
import { UserTimeSheetTabularViewComponent } from '../user-time-sheet-tabular-view/user-time-sheet-tabular-view.component';
import { ActivatedRoute } from '@angular/router';
import { UserTimeSheetService } from './user-time-sheet.service';

@Component({
  selector: 'app-user-time-sheet',
  templateUrl: './user-time-sheet.component.html',
  styleUrls: ['./user-time-sheet.component.css']
})
export class UserTimeSheetComponent implements OnInit {
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent: ViewContainerRef;
  timesheetTabs: any;
  masterStaffs: Array<any>;
  loadingMasterData: boolean = false;
  staffId: number;
  selectedIndex: number = 0;
  constructor(private activatedRoute: ActivatedRoute, private cfr: ComponentFactoryResolver, private userTimeSheetService: UserTimeSheetService) { }

  ngOnInit() {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.loadChild("Sheet View");
    // });
    this.timesheetTabs =
      ["Sheet View", "Tabular View"];
    this.loadMasterData();
  }
  getStaffId(value: number) {
    this.staffId = value;
    this.loadChild("Sheet View");
  }
  loadMasterData() {
    // load master data
    this.loadingMasterData = true;
    const masterData = { masterdata: 'masterstaff' };
    this.userTimeSheetService.getMasterData(masterData).subscribe((response: any) => {
      this.loadingMasterData = false;
      this.masterStaffs = response.staffs || [];
    });
  }
  clearFilter() {
    this.staffId = null;
    this.loadChild("Sheet View");
  }
  loadComponent(eventType: any): any {
    if (this.staffId)
      this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    let factory: any;
    if (childName == "Sheet View")
      factory = this.cfr.resolveComponentFactory(UserTimeSheetSheetViewComponent);
    else if (childName == "Tabular View")
      factory = this.cfr.resolveComponentFactory(UserTimeSheetTabularViewComponent);
    this.tabContent.clear();
    let comp: ComponentRef<UserTimeSheetSheetViewComponent> = this.tabContent.createComponent(factory);
    comp.instance.staffId = this.staffId;
  }
}

