import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavItem } from '../../../../../shared/models';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-medication-tabs',
  templateUrl: './medication-tabs.component.html',
  styleUrls: ['./medication-tabs.component.css']
})
export class MedicationTabsComponent implements OnInit {
  moduleTabs: NavItem[];
  selectedTabIndex: number;
  appointmentId: number;
  isPatient=false;
  isProvider=false;
  constructor(
    private router:Router,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    //private waitingRoomService: WaitingRoomService,
    private commonService: CommonService
  ) {
    this.inItTabs();

  }

inItTabs(){
  this.moduleTabs =[
    {displayName:'current medications', route : "/web/client/my-medications/current",iconName:""},
    {displayName:'claims medications', route : "/web/client/my-medications/claim",iconName:""},
  ];

  // if(this.isProvider){
  //   this.moduleTabs = this.moduleTabs.filter(x => x.displayName != "Reschedule Appointment");
  //}
  const tabRoutes = [...this.moduleTabs];
  const routestabRoutes =  tabRoutes.map(x => x.route);
  const currentIndex = routestabRoutes.findIndex(x => this.router.url.includes(x));
  if(currentIndex != -1) {
    this.selectedTabIndex = currentIndex;
  } else {
    this.selectedTabIndex = 0;
    // this.onTabChange(this.selectedTabIndex);
  }
}

  ngOnInit(): void {

  }

  onTabChange(tabIndex): void {
     const route = this.moduleTabs[tabIndex].route as string;
    this.router.navigate([route]);
  }
}
