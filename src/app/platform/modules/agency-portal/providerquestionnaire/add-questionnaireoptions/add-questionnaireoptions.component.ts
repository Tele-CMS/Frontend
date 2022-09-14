// import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// //import { PayerModel } from '../payers.model';
// import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
// //import { PayersService } from '../payers.service';
// import { ResponseModel } from '../../../core/modals/common-model';
// import { NotifierService } from 'angular-notifier';
// //import { PayerModel } from '../../payers/payers.model';
// import { PayersService } from '../../payers/payers.service';
// import { HealthCareCategoryKeywordsModel, KeywordModel } from '../../payers/payers.model';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonService } from '../../../core/services';
// import { AddQuestionnaireModel, ProviderQuestionnaireModel, QuestionnaireOptionsModel } from '../providerquestionnaire.model';

// @Component({
//   selector: 'app-add-questionnaireoptions',
//   templateUrl: './add-questionnaireoptions.component.html',
//   styleUrls: ['./add-questionnaireoptions.component.css']
// })
// export class AddQuestionnaireOptionsComponent implements OnInit {
//   //@Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
//   payerModel: AddQuestionnaireModel;
//   questionNameModel: ProviderQuestionnaireModel;
//   payerForm: FormGroup;
//   masterCountry: any[];
//   masterState: any[];
//   masterInsuranceType: any[];
//   payerId: number;
//   providerquestionnaireId: number;
//   printFormats: any[];
//   formValues:AddQuestionnaireModel;
//   submitted: boolean = false;
//   constructor(private formBuilder: FormBuilder, private payersService: PayersService, private notifier: NotifierService,private activatedRoute: ActivatedRoute,
//     private commonService: CommonService,private route: Router,) {
//     this.payerModel = new AddQuestionnaireModel();
//     this.questionNameModel=new  ProviderQuestionnaireModel();
//     this.printFormats = [{ id: 1, value: "Normal" }, { id: 1, value: "Pre-Printed" }];
//   }

//   ngOnInit() {
//     this.initializeFormFields(this.payerModel);
//     this.getMasterData();
//     // this.payerForm = this.formBuilder.group({
//     //   careCategoryId: [this.payerModel.careCategoryId],
//     //   keywordName: [this.payerModel.keywordName],
//     //   'healthCareCategoryKeywords': this.formBuilder.array([]),
//     // });
//     //if (this.payerId != undefined && this.payerId != null)
//     this.activatedRoute.queryParams.subscribe(params => {
//       this.payerId =
//         params.id == undefined
//           ? null
//           : this.commonService.encryptValue(params.id, false);
//           this.providerquestionnaireId =
//           params.providerquestionnaireId == undefined
//             ? null
//             : this.commonService.encryptValue(params.providerquestionnaireId, false);
        
//     });
//     if(this.payerId != undefined && this.payerId != null)
//     {
      
//       this.getPayerById();
//     }
      
//   }

//   initializeFormFields(keywordObj?: AddQuestionnaireModel) {
//     keywordObj = keywordObj || new AddQuestionnaireModel();
//     const configControls = {
//       'id': [keywordObj.id],
//       'questionOptionName': [keywordObj.questionOptionName],  
//       //'questionid': [keywordObj.questionid, Validators.required],  
//       'questionnaireoptions': this.formBuilder.array([]),
//     }
//     this.payerForm = this.formBuilder.group(configControls);
//     // initialize modifier modal
//     if (keywordObj.questionnaireoptions && keywordObj.questionnaireoptions.length) {
//       keywordObj.questionnaireoptions.forEach(obj => {
//         this.addoptionsFields(obj);
//       })
//     } else {
//       this.addoptionsFields();
//     }
//   }

//   get questionnaireoptions() {
//     return this.payerForm.get('questionnaireoptions') as FormArray;
//   }

//   addoptionsFields(diseaseObj?: QuestionnaireOptionsModel) {
  
//     const keywordControls = diseaseObj || new QuestionnaireOptionsModel();
//     this.questionnaireoptions.push(this.formBuilder.group(keywordControls));
//   }
//   removeoptionsFields(ix: number) {
//     this.questionnaireoptions.removeAt(ix);
//   }

//   get formControls() {
//     return this.payerForm.controls;
//   }

//   // public handleAddressChange(addressObj: any) {
//   //   const pObJ = {
//   //     address:addressObj.address1,
//   //     countryID: this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase())==null?null:this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase()).id,
//   //     city: addressObj.city,
//   //     stateID: this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase())==null?null:this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase()).id,
//   //     zip: addressObj.zip,
//   //     latitude:addressObj.latitude,
//   //     longitude:addressObj.longitude
//   //   }
//   //   this.payerForm.patchValue(pObJ);
//   //   // Do some stuff
//   // }

//   getMasterData() {
//     let data = "MASTERPROVIDERSQUESTIONAREQUESTIONS"
//     this.payersService.getMasterData(data).subscribe((response: any) => {
//       if (response != null) {
       
//         this.masterInsuranceType = response.masterprovidersquestionarequestions != null ? response.masterprovidersquestionarequestions : [];
//       }
//     });
//   }
//   getPayerById() {
    
//     this.payersService.getQuestionOptionDataById(this.payerId).subscribe((response: ResponseModel) => {
//       if (response != null && response.data != null) {
        
//         this.payerModel = response.data;
//         //this.payerForm.patchValue(this.payerModel)
//         this.initializeFormFields(this.payerModel);
//         this.getQuestionNameById(response.data.questionId);
//       }
//     });
//   }

//   getQuestionNameById(Id: number) {
    
//     this.payersService.getQuestiondataById(this.payerId).subscribe((response: ResponseModel) => {
//       if (response != null && response.data != null) {
        
//         this.questionNameModel = response.data;
//         //this.payerForm.patchValue(this.payerModel)
//         //this.initializeFormFields(this.payerModel);
//       }
//     });
//   }




//   onSubmit(event: any) {
    
//     if (this.payerForm.invalid) {
//       return
//     }
//     this.submitted = true;
//     let postData: any;
//     postData = {
//       ...this.payerForm.value,
//       questionnaireoptions: (this.payerForm.value.questionnaireoptions || []).map((obj) => {
//         return {
//           ...obj,
//         //   questionId: this.payerForm.value.careCategoryId,
//         questionId: this.payerId,
//           //medicalFamilyHistoryId: this.familyHistoryForm.value.id,
//         }
//       })
//     }
//       this.payersService.saveQuestionOption(postData).subscribe((response: ResponseModel) => {
//         this.submitted = false;
//         if (response != null && response.data != null) {
//           //this.payerId=response.data.id;
//           if (response.statusCode == 200) {
//             //this.payerId = response.data.id;
//             this.notifier.notify('success', response.message);
//             //this.route.navigate(["web/assign-questionnaire"])
//             this.route.navigate(["/web/assign-questionnaire/questionslist"], { queryParams: { id: this.providerquestionnaireId != null ? this.commonService.encryptValue(this.providerquestionnaireId, true) : null } });
//             //if (clickType == "SaveContinue") {
//             //this.handleTabChange.next({ tab: "Payer Service Codes", id: response.data.id,clickType:clickType });
//             //}
//           } else {
//             this.notifier.notify('error', response.message)
//           }
//         }
//       });
//     }
//   }

//   // onSubmit(event: any) {
//   //   if (!this.payerForm.invalid) {
//   //     let clickType = event.currentTarget.name;
//   //     this.formValues = this.payerForm.value;
//   //     this.formValues.id=this.payerId;
//   //     this.submitted = true;
//   //     this.payersService.saveKeyword(this.formValues).subscribe((response: ResponseModel) => {
//   //       this.submitted = false;
//   //       if (response != null && response.data != null) {
//   //         this.payerId=response.data.id;
//   //         if (response.statusCode == 200) {
//   //           //this.payerId = response.data.id;
//   //           this.notifier.notify('success', response.message);
//   //           this.route.navigate(["web/add-keyword"])
//   //           //if (clickType == "SaveContinue") {
//   //           //this.handleTabChange.next({ tab: "Payer Service Codes", id: response.data.id,clickType:clickType });
//   //           //}
//   //         } else {
//   //           this.notifier.notify('error', response.message)
//   //         }
//   //       }
//   //     });
//   //   }
//   // }

