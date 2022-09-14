import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadyToBillComponent } from '../ready-to-bill/ready-to-bill.component';
import { CommonService } from '../../../core/services';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { Subscription } from 'rxjs';
import { SubmittedClaimsComponent } from '../submitted-claims/submitted-claims.component';
import { EDIResponseComponent } from '../edi-response/edi-response.component';
import { SettledComponent } from '../settled/settled.component';
import { Edi837historyComponent } from '../edi837history/edi837history.component';
import { ClaimHistoryComponent } from '../claim-history/claim-history.component';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClaimsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent: ViewContainerRef;
  claimTabs: any;
  staffId: number = null;
  selectedIndex: number = 0;
  currentLocationId: number;
  claimId: number;
  constructor(
    private cfr: ComponentFactoryResolver,
    private commonService: CommonService
  ) {
    this.claimTabs =
      ["Ready To Bill"]
      //["Ready To Bill", "Submitted Claims", "EDI Response", "Settled Claims", "EDI 837 History"]
  }

  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.currentLocationId = user.currentLocationId;
      }
    })
    this.loadChild(this.claimTabs[0]);

  }
  loadComponent(eventType: any): any {
    let index = this.claimTabs.indexOf("Claim History");
    if (this.claimId && index > -1 && eventType.tab.textLabel != "Claim History") {
      this.claimId = null;
      this.claimTabs.splice(index, 1);
    }
    this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    let factory: any;
    if (childName == this.claimTabs[0]) {
      this.selectedIndex = 0;
      factory = this.cfr.resolveComponentFactory(ReadyToBillComponent);
    } else if (childName == this.claimTabs[1]) {
      this.selectedIndex = 1;
      factory = this.cfr.resolveComponentFactory(SubmittedClaimsComponent);
    } else if (childName == this.claimTabs[2]) {
      this.selectedIndex = 2;
      factory = this.cfr.resolveComponentFactory(EDIResponseComponent);
    } else if (childName == this.claimTabs[3]) {
      this.selectedIndex = 3;
      factory = this.cfr.resolveComponentFactory(SettledComponent);
    } else if (childName == this.claimTabs[4]) {
      this.selectedIndex = 4;
      factory = this.cfr.resolveComponentFactory(Edi837historyComponent);
    } else if (childName == this.claimTabs[5]) {
      this.selectedIndex = 5;
      factory = this.cfr.resolveComponentFactory(ClaimHistoryComponent);
    } this.tabContent.clear();
    let comp: ComponentRef<ReadyToBillComponent> = this.tabContent.createComponent(factory);
    comp.instance.claimId = this.claimId;
    comp.instance.currentLocationId = this.currentLocationId;
    comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this));
  }
  handleTabChange(data: any, ): any {
    this.claimId = data.claimId;
    if (this.claimId) {
      this.claimTabs.push("Claim History");
      this.selectedIndex = 5;
      this.loadChild(data.tab)
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
