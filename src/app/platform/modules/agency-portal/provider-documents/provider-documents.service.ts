import {
    PaymentFilterModel,
    RefundFilterModel
  } from "./../../core/modals/common-model";
  
  import { Observable } from "rxjs";
  import { Injectable } from "@angular/core";
  import { CommonService } from "src/app/platform/modules/core/services";

  
  @Injectable({
    providedIn: "root"
  })
  export class ProviderDocumentService {
    //private getPaymentUrl = "AppointmentPayment/Payments";
   
    private getLoggedinUserUrl = '/Staffs/GetLoggedinUserDetail';
    constructor(private commonService: CommonService) {}
  
    
    
    getUserRole() {
      return this.commonService.get(this.getLoggedinUserUrl, true);
    }
  }
  