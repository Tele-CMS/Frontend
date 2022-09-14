import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddPrescriptionComponent } from './prescription-addprescription/prescription-addprescription.component';
import { SentPrescriptionComponent } from './prescription-sentprescription/prescription-sentprescription.component';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit {
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent: ViewContainerRef;
  timesheetTabs: any;
  masterStaffs: Array<any>;
  loadingMasterData: boolean = false;
  staffId: number;
  selectedIndex: number = 0;
  clientId: number;
  header: string = "Patient Prescription";
  constructor(private activatedRoute: ActivatedRoute, private cfr: ComponentFactoryResolver, private commonService: CommonService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);  //
    });

    this.timesheetTabs =
      ["Add Prescription", "Sent Prescriptions"];
    this.loadChild("Add Prescription");
  }

  loadComponent(eventType: any): any {
    if (this.clientId)
      this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    let factory: any;
    if (childName == "Add Prescription")
      factory = this.cfr.resolveComponentFactory(AddPrescriptionComponent);
    else if (childName == "Sent Prescriptions")
      factory = this.cfr.resolveComponentFactory(SentPrescriptionComponent);
    this.tabContent.clear();
    let comp: ComponentRef<AddPrescriptionComponent> = this.tabContent.createComponent(factory);
  }
}