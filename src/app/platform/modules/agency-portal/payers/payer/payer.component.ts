import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddPayerComponent } from '../add-payer/add-payer.component';
import { PayerServiceCodesComponent } from '../payer-service-codes/payer-service-codes.component';
import { PayerActivityComponent } from '../payer-activity/payer-activity.component';
import { PayersService } from '../payers.service';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-payer',
  templateUrl: './payer.component.html',
  styleUrls: ['./payer.component.css']
})
export class PayerComponent implements OnInit {
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent: ViewContainerRef;
  payerTabs: any;
  payerId: number;
  selectedIndex: number = 0;
  constructor(private activatedRoute: ActivatedRoute, private cfr: ComponentFactoryResolver, private payersService: PayersService,private commonService:CommonService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.payerId = params.id == undefined ? null : this.commonService.encryptValue(params.id,false);
      this.loadChild("Payer Info");
    });
    this.payerTabs =
      ["Payer Info", "Payer Service Codes", "Payer Activity"]
  }
  loadComponent(eventType: any): any {
    this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    let factory: any;
    if (childName == "Payer Info")
      factory = this.cfr.resolveComponentFactory(AddPayerComponent);
    else if (childName == "Payer Service Codes")
      factory = this.cfr.resolveComponentFactory(PayerServiceCodesComponent);
    else if (childName == "Payer Activity")
      factory = this.cfr.resolveComponentFactory(PayerActivityComponent);
    this.tabContent.clear();
    let comp: ComponentRef<AddPayerComponent> = this.tabContent.createComponent(factory);
    comp.instance.payerId = this.payerId;
    comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this))
  }

  handleTabChange(data: any): any {
    this.payerId = data.id;
    if (data.clickType != "Save") {
      this.selectedIndex = data.tab == "Payer Service Codes" ? 1 : data.tab == "Payer Activity" ? 2 : 0;
      this.loadChild(data.tab);
    }
  }
}
