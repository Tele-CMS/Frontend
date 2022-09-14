import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild, ComponentRef, Input } from '@angular/core';
import { UserTimeSheetSheetViewComponent } from '../user-time-sheet-sheet-view/user-time-sheet-sheet-view.component';
import { UserTimeSheetTabularViewComponent } from '../user-time-sheet-tabular-view/user-time-sheet-tabular-view.component';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-time-sheet',
  templateUrl: './user-time-sheet.component.html',
  styleUrls: ['./user-time-sheet.component.css']
})
export class UserTimeSheetComponent implements OnInit {
  @Input() staffId: number = null;
  @Input() isSpecificUser: boolean = false;
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent: ViewContainerRef;
  timesheetTabs: any;
  masterStaffs: Array<any>;
  userTimeSheetFormGroup: FormGroup;
  loadingMasterData: boolean = false;

  selectedIndex: number = 0;
  constructor(private cfr: ComponentFactoryResolver, private formBuilder: FormBuilder, ) { }

  ngOnInit() {
    this.timesheetTabs =
      ["Sheet View", "Tabular View"];
    this.staffId
    if (this.isSpecificUser) {
      this.userTimeSheetFormGroup = this.formBuilder.group({
        staffId: [],
      });
      this.loadChild("Sheet View");
    }
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

