
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NavItem } from 'src/app/shared/models';
import { LoginUser } from '../core/modals/loginUser.modal';
import { CommonService } from "../core/services";




@Component({
  templateUrl: './waiting-room-container.component.html'
})
export class WaitingRoomContainerComponent implements OnInit {

  moduleTabs: NavItem[];
  selectedTabIndex: number;
  appointmentId: number;
  isPatient=false;
  isProvider=false;
  apptIdStrP:Number;
  encry_appTId:String;
  constructor(
    private router:Router,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    //private waitingRoomService: WaitingRoomService,
    private commonService: CommonService
  ) {

      this.route.queryParams.subscribe(params => {
        this.encry_appTId = params.id;
        this.apptIdStrP = params.id==undefined?null:parseInt(this.commonService.encryptValue(params.id,false));
      });
      let apptId: number;
      if(this.apptIdStrP){
        apptId = Number(this.apptIdStrP);
        this.inItTabs(apptId);
      }
      else {
        const urlPartsArry = this.router.url.split('/');
        const apptIdStr = urlPartsArry[urlPartsArry.length - 1];
        apptId = Number(apptIdStr);
        if(apptId  == NaN){
              this.notifier.notify("error","AppointmentId is not passed");
            } else {
              this.inItTabs(apptId);
            }

      }


  }
  ngOnInit(): void {

  }
inItTabs(apptId : number){


  this.commonService.loginUser.subscribe(
    (user: LoginUser) => {
        if (user.data) {
            const userRoleName = user.data.users3 && user.data.users3.userRoles.userType;
            if ((userRoleName || "").toUpperCase() === "CLIENT") {
                this.isPatient = true;
            }
            else {
                this.isProvider = true;
            }
        }
    }
);


  this.appointmentId= apptId;
  var apptIdFromLocalStorage = localStorage.getItem("apptId");
  var decryptedApptID = this.commonService.encryptValue(apptIdFromLocalStorage,false);
  this.commonService.appointmentDataSubject.next(decryptedApptID);
  console.log("cdc ",decryptedApptID);


  this.moduleTabs =[
    // {displayName:'Reschedule Appointment', route : "/web/waiting-room/reshedule/" + apptIdFromLocalStorage,iconName:""},
    // {displayName:'Assessment', route : "/web/waiting-room/assessment/"+ this.encry_appTId,iconName:""},
    // {displayName:'Documents', route : "/web/waiting-room/documents/"+ apptIdFromLocalStorage,iconName:""},
    // {displayName:'Vitals', route : "/web/waiting-room/vitalslist/"+ apptIdFromLocalStorage,iconName:""},
    // {displayName:'Pre-Existing Medications', route : "/web/waiting-room/medication/"+ apptIdFromLocalStorage,iconName:""},
    // {displayName:'Check In', route : "/web/waiting-room/check-in/"+ apptIdFromLocalStorage,iconName:""},
    //  {displayName:'Soap Notes', route : "/web/waiting-room/check-in-soap/"+apptIdFromLocalStorage, iconName:""},
  ];

  if(this.isProvider){
    ////this.moduleTabs.push({displayName:'Check In', route : "/web/waiting-room/check-in/"+ apptIdFromLocalStorage,iconName:""});
  // this.moduleTabs = this.moduleTabs.filter(x => x.displayName != "Reschedule Appointment");
   }
  // if(this.isPatient){
  //   this.moduleTabs = this.moduleTabs.filter(x => x.displayName != "Soap Notes");
  // }

  const url = this.router.url;

  if(url.includes('check-in-call') || url.includes('check-in-video-call') ||   url.includes('check-in-soap')){
    this.selectedTabIndex = this.moduleTabs.findIndex(x => x.displayName =='Check In')
  } else {
    const tabRoutes = [...this.moduleTabs];
    const routestabRoutes =  tabRoutes.map(x => x.route);
    const currentIndex = routestabRoutes.findIndex(x => this.router.url.includes(x));
    if(currentIndex != -1) {
      this.selectedTabIndex = currentIndex;
    } else {
      this.selectedTabIndex = 0;
      this.onTabChange(this.selectedTabIndex);
    }
  }



}


  @ViewChild("maintabgroup") demo3Tab: MatTabGroup;
  onTabChange(tabIndex): void {
    const tabGroup = this.demo3Tab;
    if (tabGroup instanceof MatTabGroup) {
      tabGroup.selectedIndex = tabIndex;
    }
     const route = this.moduleTabs[tabIndex].route as string;
    this.router.navigate([route]);
  }

  nextTab(){
    this.onTabChange(this.selectedTabIndex + 1)
  }


}
