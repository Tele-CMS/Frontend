
import { PaymentService } from "./../payment.service";
import { Component, OnInit } from "@angular/core";
import { UserModel } from "../../users/users.model";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { CancelationRule, ManageFeesRefundsModel } from "../payment.models";
import { NotifierService } from "angular-notifier";
import { CommonService } from 'src/app/platform/modules/core/services';
import { LoggedInUserModel } from "../../../core/modals/loginUser.modal";

@Component({
  selector: "app-manage-fees-refunds",
  templateUrl: "./manage-fees-refunds.component.html",
  styleUrls: ["./manage-fees-refunds.component.css"]
})
export class ManageFeesRefundsComponent implements OnInit {
    usersData: UserModel[];
    paymentFormGroup: FormGroup;
    hoursList:number[];
    refundPercentagesList:number[];
    submitted=false;
    manageFeesRefundsData: ManageFeesRefundsModel;
    daysNumbersList: number[];
    isAdminUser = false;
    loggedInUserModel: LoggedInUserModel
    isSubmitted= false;;
    showurgentcarefees:boolean=false;
    constructor(private paymentService: PaymentService,
        private formBuilder: FormBuilder, 
        private notifier: NotifierService,
        private commonService: CommonService
        ){
           
        this.usersData = new Array<UserModel>();
        this.hoursList = [2,4,16,24,48];
        this.refundPercentagesList = [0,10,20,30,40,50,60,70,80,90, 100];
        this.daysNumbersList = [15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];
    }

   
    
    ngOnInit(): void {
        this.createForm(null);
      this.checkLoggedinUser();
    }

    createForm(providers: number[]){
        this.paymentFormGroup = this.formBuilder.group({
            providers: [providers ? providers :undefined,Validators.required],
            f2fFee: [undefined, Validators.required],
            newOnlineFee: [undefined, Validators.required],
            cancelationRules: this.formBuilder.array([]),
            folowupFees:[undefined, Validators.required],
            folowupDays:[undefined, Validators.required],
            urgentcareFee: [undefined],
          });
          //addCancelationRuleControl(null);
    }

    checkLoggedinUser(){
        this.paymentService.getUserRole().subscribe((response: any) => {
            if(response != null && response.statusCode == 200){
                this.loggedInUserModel  =response.data;
                this.isAdminUser = this.loggedInUserModel.userType == 'ADMIN' ? true : false;
                if(this.isAdminUser){
                    this.createForm(null);
                    this.getProviders();
                } else {
                    this.createForm([this.loggedInUserModel.staffId]);
                    this.getProvidersFeesAndRefundsSettings([this.loggedInUserModel.staffId]);
                }
            }   
          });
    }

    addCancelationRuleControl(rule: CancelationRule) {
        this.cancelationRulesFormGroup.push(this.getCancelationRulesForm(rule));
    }
    removeCancelationRuleControl(i) {
        this.cancelationRulesFormGroup.removeAt(i);
    }

    get cancelationRulesFormGroup() {
      return  <FormArray> this.paymentFormGroup.controls['cancelationRules'] ;
    }

    private getCancelationRulesForm(rule:CancelationRule){
        return this.formBuilder.group({
            uptoHours: [rule ? rule.refundPercentage: undefined, [Validators.required]],
            refundPercentage: [rule ? rule.refundPercentage: undefined, [Validators.required]]
        })
    }

    bindForm(model :ManageFeesRefundsModel){
        if(model && model.cancelationRules && model.cancelationRules.length >0){
            model.cancelationRules.forEach(rule => {
               const toAdd:CancelationRule = {refundPercentage : rule.refundPercentage,uptoHours: rule.uptoHours };
               if(!this.hoursList.includes(rule.refundPercentage)){
                this.refundPercentagesList.push(rule.refundPercentage);
                this.refundPercentagesList.sort((a, b) => b - a);
                }
                if(!this.hoursList.includes(rule.uptoHours)){
                    this.hoursList.push(rule.uptoHours);
                    this.hoursList.sort((a, b) => b - a);
                    }
               this.addCancelationRuleControl(toAdd);
            });
          
        } 
        // else {
        //     this.addCancelationRuleControl(null);
        // }

        if (!this.daysNumbersList.includes(model.folowupDays)) {
            this.daysNumbersList.push(model.folowupDays);
            this.daysNumbersList.sort((a, b) => b - a);
        }
       
        
        this.paymentFormGroup.patchValue(model);
    }
    

    get f(){
      return  this.paymentFormGroup.controls;
    }
 
    getProviders(){
        this.paymentService.getProviders().subscribe(response => {
            if(response != null && response.statusCode == 200){
                this.usersData = response.data;
            }
        });
    }

    onProviderDropDownClose(value){
        if(!value) { // on dropdown close
            const provindersIds = this.f.providers.value;
            if(provindersIds && provindersIds.length > 0){
                this.getProvidersFeesAndRefundsSettings(provindersIds);
            }
            
        }
        
    }

    private getProvidersFeesAndRefundsSettings(provindersIds: number[]){
       this.paymentService.getProvidersFeesAndRefundsSettings(provindersIds).subscribe(response => {
        if(response != null && response.statusCode == 200){
          
            this.createForm(this.isAdminUser ? null : [this.loggedInUserModel.staffId]);
            if(this.isAdminUser && response.data.length > 1){
               this.notifier.notify('warning',"Displaying only first practitioner's data");
            }
            if(response.data && response.data.length > 0){
            this.bindForm(response.data[0]);
            }
        }
       });
    }

   private  updateProvidersFeesAndRefundsSettings(model:ManageFeesRefundsModel){
       
    this.submitted = true;
        this.paymentService.updateProvidersFeesAndRefundsSettings(model).subscribe(response => {
         if(response != null && response.statusCode == 200){
            this.notifier.notify('success','Updated Successfully');
         }
         this.submitted = false;
         this.isSubmitted = false;
        });
     }

    onF2fFeeChange(value){
        if(value && value!=0 && value!='0'){
            if(value.length ==1){
                value = 0+value;
            }
            value = Number(value);
            this.f.newOnlineFee.setValue(value * 0.70);
            this.f.folowupFees.setValue(value * 0.70);
        }
       
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
          control.markAsTouched();
            
          if (control.controls) {
            this.markFormGroupTouched(control);
          }
        });
      }

    addMoreHourOption(){
        
        Swal({
            title: 'Enter New Hour Option',
            showCancelButton:true,
            confirmButtonText:'Add',
            cancelButtonText:'Cancel',
            input:'number',
            cancelButtonClass:'cancel-btn-alet',
            confirmButtonClass:'cnfm-btn-alrt',
            preConfirm: (value) => {
                if(!value){
                    Swal.showValidationMessage('Enter value')
                } else if(value % 2 != 0){
                    Swal.showValidationMessage('Only 2-Miltiple is allowed')
                }
              },
        }).then((result) => {
            if(result.value && (result.value % 2 == 0)){
                if(!this.hoursList.includes(result.value)){
                this.hoursList.push(result.value);
                this.hoursList.sort((a, b) => b - a);
                }
            }
        })
    }

    addMoreRefundPercentageOption(){
        Swal({
            title: 'Enter New Refund % Option',
            showCancelButton:true,
            confirmButtonText:'Add',
            cancelButtonText:'Cancel',
            input:'number',
            cancelButtonClass:'cancel-btn-alet',
            confirmButtonClass:'cnfm-btn-alrt',
            preConfirm: (value) => {
                if(!value){
                    Swal.showValidationMessage('Enter value')
                } else if(value % 2 != 0){
                    Swal.showValidationMessage('Only 2-Miltiple is allowed')
                }
          },
        }).then((result) => {
            if(result.value){
                if(!this.refundPercentagesList.includes(result.value)){
                this.refundPercentagesList.push(result.value);
                this.refundPercentagesList.sort((a, b) => b - a);
                }
            }
        })
    }

    
    addMoreFollowUpDaysOption(){
        Swal({
            title: 'Enter New Followup days Option',
            showCancelButton:true,
            confirmButtonText:'Add',
            cancelButtonText:'Cancel',
            input:'number',
            cancelButtonClass:'cancel-btn-alet',
            confirmButtonClass:'cnfm-btn-alrt',
            preConfirm: (value) => {
                if(!value){
                    Swal.showValidationMessage('Enter value')
                } 
          },
        }).then((result) => {
            if(result.value){
                if(!this.daysNumbersList.includes(result.value)){
                this.daysNumbersList.push(result.value);
                this.daysNumbersList.sort((a, b) => b - a);
                }
            }
        })
    }

    

    onSubmit(){
       this.isSubmitted = true;
        if(!this.isAdminUser){
            this.f.providers.setValue([this.loggedInUserModel.staffId]);
        }
        this.markFormGroupTouched(this.paymentFormGroup);
        if(this.paymentFormGroup.invalid) return;

        const model = this.paymentFormGroup.value;

        if(!this.checkIfDuplicateHours(model)){
            this.updateProvidersFeesAndRefundsSettings(model);
        } else {
            this.notifier.notify('error','Duplicate hours in cancellation rules');
        }

            
    }

    checkIfDuplicateHours(model: ManageFeesRefundsModel) : boolean{
        let isDuplicate = false;
        if(model && model.cancelationRules && model.cancelationRules.length >1){
            const values: number[] = [];
            model.cancelationRules.forEach(r => {
                    if(values.includes(r.uptoHours)) {
                        isDuplicate = true; 
                        return isDuplicate;
                    } else {
                        values.push(r.uptoHours);
                    }
            });
        } else {
            return isDuplicate;
        }
        return isDuplicate;
    }

    sortFunc(a, b) {
        return 1;
      }
  
      get isShowNoRefundTxt(): boolean{
         // if(this.cancelationRulesFormGroup.)     
         return true;   
      }
      checkboxchecked(event){
          if(event.source.checked){
            this.showurgentcarefees=true;
          }
          else{
            this.showurgentcarefees=false;
          }
      }
}
