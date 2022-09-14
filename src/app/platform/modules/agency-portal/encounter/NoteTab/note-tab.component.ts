import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { CommonService } from 'src/app/super-admin-portal/core/services';
import { AssesmentnoteComponent } from './assesmentnote/assesmentnote.component';
import { NonBillableSoapComponent } from './non-billable-soap/non-billable-soap.component';

@Component({
  selector: 'app-note-tab',
  templateUrl: './note-tab.component.html',
  styleUrls: ['./note-tab.component.css']
})
export class NoteTabComponent implements OnInit {

  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent: ViewContainerRef;
  timesheetTabs: any;
  masterStaffs: Array<any>;
  loadingMasterData: boolean = false;
  staffId: number;
  selectedIndex: number = 0;
  clientId: number;
  header: string = "Patient Prescription";
  appointmentId: number;
  encounterId: number;
  constructor(private activatedRoute: ActivatedRoute, private cfr: ComponentFactoryResolver) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {

      this.appointmentId = params.apptId == undefined ? 0 : parseInt(params.apptId);
      this.encounterId = params.encId == undefined ? 0 : parseInt(params.encId);
      this.timesheetTabs =
      ["Notes", "Assesment"];
    this.loadChild("Notes");
      //this.GetProvidersQuestionnaireControlsByAppointment();
    });

  }

  loadComponent(eventType: any): any {

      this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    let factory: any;
    if (childName == "Notes"){
      factory = this.cfr.resolveComponentFactory(NonBillableSoapComponent);

        this.tabContent.clear();
        let comp: ComponentRef<NonBillableSoapComponent> = this.tabContent.createComponent(factory);
        comp.instance.appointmentId = this.appointmentId ;
        comp.instance.encounterId = this.encounterId ;
    } else if (childName == "Assesment"){
      factory = this.cfr.resolveComponentFactory(AssesmentnoteComponent);
      this.tabContent.clear();
        let comp: ComponentRef<AssesmentnoteComponent> = this.tabContent.createComponent(factory);
        comp.instance.appointmentId = this.appointmentId ;
    }
  }
}
