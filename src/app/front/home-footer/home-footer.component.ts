import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/platform/modules/core/services';
import { TermsConditionModalComponent } from '../terms-conditions/terms-conditions.component';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css']
})
export class HomeFooterComponent implements OnInit {
  isContactUsSubmited=false
  organizationEmailAddress: string="info@smartdatainc.net";
  getOrganizationEmailAddressUrl="api/Organization/GetOrganizationEmailAddress";
  sendContactUsEmailUrl="api/Organization/SendContactUsEmail";
  contactUsText= new FormControl("",[Validators.email,Validators.required]);
    constructor(private commonService: CommonService, private dialogModal: MatDialog,
      private notifier: NotifierService) { 
    this.getOrganizationEmailAddress();
  }


  ngOnInit() {
 
  }

  getOrganizationEmailAddress(){
    this.commonService.get(this.getOrganizationEmailAddressUrl).subscribe( res => this.organizationEmailAddress = res.data);
  }
  opentermconditionmodal() {
    let dbModal;
    dbModal = this.dialogModal.open(TermsConditionModalComponent, {
      hasBackdrop: true,
      width:'70%'
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        
      }
    });
  }

  get mailToAddress() :string{
    if(this.organizationEmailAddress){
      return "mailto:"+this.organizationEmailAddress+"?Subject=Hello%20again";
    } else {
      return "mailto:info@smartdatainc.net?Subject=Hello%20again";
    }
   
  }

  sendContactUsEmail(){
    this.isContactUsSubmited= true;
    if(this.contactUsText.invalid){
      return;
    }
      const model = {EmailAddress:this.contactUsText.value};
      this.commonService.post(this.sendContactUsEmailUrl,model,true).subscribe(res => {
        if(res.data){
          this.notifier.notify('success','Submitted Successfully');
          this.contactUsText.setValue('');
          this.isContactUsSubmited= false;
        }
      });
    
  }



}
