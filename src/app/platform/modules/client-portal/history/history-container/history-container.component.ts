import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NavItem } from 'src/app/shared/models';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-history-container',
  templateUrl: './history-container.component.html',
  styleUrls: ['./history-container.component.css']
})
export class HistoryContainerComponent implements OnInit {

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
    {displayName:'family-history', route : "/web/client/history/my-family-history",iconName:""},
    {displayName:'social-history', route : "/web/client/history/my-social-history",iconName:""},
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

  // nextTab(){
  //   this.onTabChange(this.selectedTabIndex + 1)
  // }


}

