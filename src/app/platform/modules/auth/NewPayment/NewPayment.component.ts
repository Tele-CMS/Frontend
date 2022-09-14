import { Component, Inject, OnInit, Renderer2 } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PasswordValidator } from "src/app/shared/password-validator";
import { first } from "rxjs/operators";
import { AuthenticationService } from "../auth.service";

import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialog } from "@angular/material";
import { TermsConditionModalComponent } from "src/app/front/terms-conditions/terms-conditions.component";
import { CommonService } from "../../core/services/common.service";
import { HomeService } from "src/app/front/home/home.service";
import { DOCUMENT } from "@angular/common";
import { SchedulerService } from "../../scheduling/scheduler/scheduler.service";
//import { DOCUMENT } from "@angular/platform-browser";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}
@Component({
  selector: "app-new-payment",
  templateUrl: "./NewPayment.component.html",
  styleUrls: ["./NewPayment.component.css"]
})
export class NewPaymentComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: any;
  appointmentid: any;
  amount: any;
  loading = false;
  submitted = false;
  errorMessage: string = null;
  successMessage: string = null;
  matcher = new MyErrorStateMatcher();
  isShowPassword: boolean = false;
  Organization: any;
  paymentToken: string = "";
  Message: any;
  isNotBooked: boolean=false;
  isApptTimeExpired: boolean=false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialogModal: MatDialog,
    private commonService: CommonService,
    private homeService: HomeService,
    private schedulerService: SchedulerService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document
  ) {}

  ngOnInit() {
    
    
    this.route.queryParams.subscribe(params => {
      //this.token = params["apptid"];
      this.appointmentid = params["apptid"];
      this.amount = params["amt"];
    }); 
    //this.getOrganizationdtails();
    const s = this.renderer2.createElement("script");
    s.type = "text/javascript";
    s.src = "https://checkout.stripe.com/checkout.js";
    s.text = ``;
    this.renderer2.appendChild(this._document.body, s);
//this.openCheckout();
this.checkAppointmentTimeExpiry();
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

getOrganizationdtails(){
  
  this.homeService.getOrganizationDetail().subscribe(response => {
    
    if (response.statusCode == 200) {
      this.Organization = response.data;
      this.openCheckout();
    }
  });
}

checkAppointmentTimeExpiry()
{
  
  this.schedulerService.checkAppointmentTimeExpiry(this.appointmentid).subscribe((response: any) => {
    
    if (response.statusCode == 200) {
     this.isApptTimeExpired=true;
     this.isNotBooked=false;
    } 
    else if(response.statusCode == 202)
     {
      this.getOrganizationdtails();
    }
    else{

    }
  });
}

  openCheckout() {

    let _amount = this.amount;
   
    // if(this.confirmation.type!="Free")
    // {
      var handler = (<any>window).StripeCheckout.configure({
        key: this.Organization.stripeKey,
        locale: "auto",
        token: function(token: any) {
          //console.log(token);
          if (token.id != "") {
            localStorage.setItem("payment_token", token.id); 
            //this.book(token.id);
          }
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
        }
      });
  
      handler.open({
        name: this.Organization.organizationName,
        description: this.Organization.description,
        image: this.Organization.logo,
        //amount: this.userInfo.payRate * 100,
        amount: _amount * 100,
        email: "",
        closed: () => {
          this.paymentToken = localStorage.getItem("payment_token");
          localStorage.setItem("payment_token", "");
          if (this.paymentToken != "")
             this.bookNewAppointment(this.paymentToken, "Stripe");
            //console.log("hello")
            //this.getOrganizationdtails();
        }
      });
    
    // }
    // else{
    //   this.bookNewFreeAppointment("", "Free");
    // }
  }


  bookNewAppointment(tokenId: string, paymentMode: string): any {
    
    const appointmentData = [
      {
        PatientAppointmentId: this.appointmentid,
        AppointmentTypeID: null,
        //AppointmentStaffs: [{ StaffId: this.staffId }],
        PatientID: null,
        ServiceLocationID:  null,
        StartDateTime: null,
        EndDateTime:null,
        //IsTelehealthAppointment: true,
        //IsTelehealthAppointment: this.confirmation.mode=="Online"?true:false,
        IsExcludedFromMileage: true,
        IsDirectService: true,
        Mileage: null,
        DriveTime: null,
        latitude: 0,
        longitude: 0,
       // Notes: this.formGroup3.Notes.value,
        IsRecurrence: false,
        RecurrenceRule: null,
        //Mode: this.confirmation.mode,
        //Type: this.confirmation.type,
        //PayRate: this.userInfo.payRate,
        PayRate: this.amount,
        PaymentToken: tokenId,
        PaymentMode: paymentMode,
        IsBillable: true
      }
    ];
    const queryParams = {
      IsFinish: !appointmentData[0].RecurrenceRule,
      isAdmin: false
    };

    this.createAppointmentFromPaymentPage(appointmentData[0]);
  }

  createAppointmentFromPaymentPage(appointmentData: any) {
    this.schedulerService
      .bookNewAppointmentFromPaymentPage(appointmentData)
      .subscribe(response => {
        this.submitted = false;
        if (response.statusCode === 200) {
          this.isNotBooked = true;
          //this.notifierService.notify("success", response.message);
          // this.Message = {
          //   title: "Success!",
          //   message:
          //     "Thank you, Your appointment has been successfully booked with us, please contact administation for further assistance.",
          //   imgSrc: "../assets/img/user-success-icon.png"
          // };
          //this.dialogModalRef.close("SAVE");
          //this.saveDocuments(response.data);
        } else {
          //this.notifierService.notify("error", response.message);
        }
      });
  }

  gotologin() {
    this.router.navigate(["/web/login-selection"]);
  }

  
}
