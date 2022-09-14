import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemographicInfoComponent } from '../demographic-info/demographic-info.component';
import { AddressComponent } from '../address/address.component';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../../core/modals/common-model';
import { ClientsService } from '../clients.service';
import { CommonService } from '../../../core/services';
import { NotifierService } from 'angular-notifier';
// import { ClientHeaderComponent } from '../client-header/client-header.component';
import { Router } from "@angular/router";
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClientComponent implements OnInit {
  // @ViewChild(ClientHeaderComponent) child: ClientHeaderComponent ;
  private header:string="Manage Patient";
  @ViewChild('tabContent', { read: ViewContainerRef })
  private tabContent: ViewContainerRef;
  clientTabs: any;
  clientId: number;
  selectedIndex: number = 0;
  dataURL:any;
  returnUrl: string;
    code: string;
    state: string;
    isBBEnabled: boolean = false;
    enc_ClientId: any;
    isProcessing: boolean =  false;
  constructor(private cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,private clientService:ClientsService,
    private commonService:CommonService,private notifier:NotifierService,private route: Router) {
    this.clientTabs =
      ["Demographic Info",  "Address"]
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.enc_ClientId = params.id==undefined?null:params.id;
      this.clientId = params.id==undefined?null:parseInt(this.commonService.encryptValue(params.id,false));
      this.code = params.code==undefined?null:params.code;
      this.state = params.state==undefined?null:params.state;
      this.selectedIndex = 0;
      this.loadChild("Demographic Info");
    });

    this.route.navigate(['.'], {relativeTo: this.activatedRoute, queryParams: { id: this.enc_ClientId }, replaceUrl: true});

    console.log("got code", this.code);
    this.getIsBBEnabled();
    if(this.code)
       this.getPatientDetailsBB(this.code);
       //else


    // if(localStorage.getItem('cid'))
    // this.clientId = JSON.parse(localStorage.getItem('cid'));

         // get return url from route parameters or default to '/'
        //  this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';

        //  var index = this.returnUrl.indexOf( "code" );
        //  this.code = this.returnUrl.substr(index + 5, 30)

        //  this.code = this.activatedRoute.snapshot.queryParams['code'];
  }

  moveBack()
  {
    this.route.navigate(["web/client/my-profile"]);
  }
  loadComponent(eventType: any): any {
    this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    this.selectedIndex = this.clientTabs.indexOf(childName);
    let factory: any;
    if (childName == "Demographic Info")
      factory = this.cfr.resolveComponentFactory(DemographicInfoComponent);

    else if (childName == "Address")
      factory = this.cfr.resolveComponentFactory(AddressComponent);

    this.tabContent.clear();
    let comp: ComponentRef<DemographicInfoComponent> = this.tabContent.createComponent(factory);
    comp.instance.clientId = this.clientId;
    comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this));
  }

  handleTabChange(data: any): any {
    this.clientId = data.id;
     //if(this.child!=undefined)
      //this.child.getClientHeaderInfo();
    if(data.clickType!="Save")
    {
      this.loadChild(data.tab);
    }
  }

  getIsBBEnabled(){
    this.clientService.checkBlueButtonStatus(this.clientId).subscribe((response: any) => {
      if(response != null){
       if (response.statusCode === 200) {
        this.isBBEnabled = response.data;
       }
      }
     });
  }

  patientAuthorization(){
    //this.clientService.getBlueButtonToken("");
    //this.clientService.getBlueButtonToken("", "", this.code, this.route);
    //localStorage.setItem('cid', this.clientId.toString())
    //https://localhost:4200/web/client/client-profile?id=NQ%3D%3D
    this.returnUrl = window.location.href;
    localStorage.setItem('url', this.returnUrl);
    window.location.href="https://sandbox.bluebutton.cms.gov/v1/o/authorize/?client_id=D5gj1ilrpy0mM4D6e0yOoLl5j6EL4QOvZAslgdK2&response_type=code&state=testvv&redirect_uri=" + this.returnUrl;
  }

  getPatientDetailsBB(code: any){
    this.isProcessing = true;
    this.returnUrl = localStorage.getItem('url');
    var data ={
      code: this.code,
      state: this.state,
      clientId: this.clientId,
      returnURL: this.returnUrl
    }
    this.commonService.loadingStateSubject.next(true);
    this.clientService.getPatientDetailsBB(data).subscribe((response: any) => {
         console.log("data", response);
         if(response != null){
           this.isProcessing = false;
          if (response.statusCode === 200) {
            this.isBBEnabled = false;
            this.commonService.loadingStateSubject.next(false);
            this.notifier.notify("success", response.message);
            localStorage.removeItem('url');
            // this.route.navigate(['.'], {relativeTo: this.activatedRoute, queryParams: { id: this.enc_ClientId }, replaceUrl: true});
           this.code = '';
           this.state = '';
            this.loadChild("Demographic Info");
          }
          else{
            this.notifier.notify("error", response.message);
          }
         }

        });
  }
}
