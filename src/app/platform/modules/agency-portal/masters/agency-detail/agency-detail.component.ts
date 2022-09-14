import { Component, OnInit, OnDestroy } from '@angular/core';
import { AgencyDetailService } from './agency-detail.service';
import { OrganizationModel } from './agency-detail.Model';
import { CommonService } from '../../../core/services';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { Subscription } from 'rxjs';
import { userInfo } from 'os';

@Component({
  selector: 'app-agency-detail',
  templateUrl: './agency-detail.component.html',
  styleUrls: ['./agency-detail.component.css']
})
export class AgencyDetailComponent implements OnInit ,OnDestroy {

  subscription:Subscription;
  organizationId:number;
  organizationModel:OrganizationModel;
  constructor(public agencyDetailService: AgencyDetailService,public commonService:CommonService) { 
    this.organizationModel=new OrganizationModel();
  }

  ngOnInit() {
    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.getAgencyData(user.data.organizationID);
      }});
  }

  getAgencyData(id:number) {
    this.agencyDetailService.get(id)
      .subscribe(
        (response: any) => {
          if (response!=null) {
            this.organizationModel = response;            
          } else {
            this.organizationModel = new  OrganizationModel();
          }
        });
  }
  ngOnDestroy(): void {    
    this.subscription.unsubscribe();
  }  
}
