import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonService } from '../../../core/services';

import { FamilyHistoryComponent } from '../family-history/family-history.component';
import { SocialHistoryComponent } from '../social-history/social-history.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  //@ViewChild(ClientHeaderComponent) child: ClientHeaderComponent ;
  // private header:string="Manage Patient";
  @ViewChild('tabContent', { read: ViewContainerRef })
  private tabContent: ViewContainerRef;
  clientTabs: any;
  header: string = "History";
  clientId: number;
  selectedIndex: number = 0;
  dataURL:any;
  constructor(private cfr: ComponentFactoryResolver,
     private activatedRoute: ActivatedRoute,
     private commonService:CommonService,
     private notifier:NotifierService) {
    this.clientTabs =
      ["Family History", "Social History"]
   }

  ngOnInit() {
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
    });
    this.selectedIndex = 0;
    this.loadChild("Family History");
  }
  loadComponent(eventType: any): any {
    this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    this.selectedIndex = this.clientTabs.indexOf(childName);
    let factory: any;
    if (childName == "Family History")
      factory = this.cfr.resolveComponentFactory(FamilyHistoryComponent);
    else if (childName == "Social History")
      factory = this.cfr.resolveComponentFactory(SocialHistoryComponent);
    this.tabContent.clear();
    let comp: ComponentRef<FamilyHistoryComponent> = this.tabContent.createComponent(factory);
    comp.instance.clientId = this.clientId;
    // comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this)); 
  }

  // handleTabChange(data: any): any {
  //   this.clientId = data.id;
  //   if(this.child!=undefined)
  //     this.child.getClientHeaderInfo();
  //   if(data.clickType!="Save")
  //   {
  //     this.loadChild(data.tab);
  //   }
  // }

}
