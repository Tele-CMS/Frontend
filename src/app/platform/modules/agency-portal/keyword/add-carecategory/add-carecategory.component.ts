import { Component, OnInit, Output, EventEmitter } from '@angular/core';
//import { PayerModel } from '../payers.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
//import { PayersService } from '../payers.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';
//import { PayerModel } from '../../payers/payers.model';
import { PayersService } from '../../payers/payers.service';
import { HealthCareCategoryKeywordsModel, KeywordModel, ProviderCareCategoryModel } from '../../payers/payers.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-add-carecategory',
  templateUrl: './add-carecategory.component.html',
  styleUrls: ['./add-carecategory.component.css']
})
export class AddCareCategoryComponent implements OnInit {
  //@Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  payerModel: ProviderCareCategoryModel;
  payerForm: FormGroup;
  masterCountry: any[];
  masterState: any[];
  masterInsuranceType: any[];
  payerId: number;
  printFormats: any[];
  formValues:ProviderCareCategoryModel;
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder, private payersService: PayersService, private notifier: NotifierService,private activatedRoute: ActivatedRoute,
    private commonService: CommonService,private route: Router,) {
    this.payerModel = new ProviderCareCategoryModel();
    //this.printFormats = [{ id: 1, value: "Normal" }, { id: 1, value: "Pre-Printed" }];
  }

  ngOnInit() {
    //this.initializeFormFields(this.payerModel);
    this.getMasterData();
    this.payerForm = this.formBuilder.group({
      //careCategoryId: [this.payerModel.careCategoryId],
      careCategoryName: [this.payerModel.careCategoryName],
      //'healthCareCategoryKeywords': this.formBuilder.array([]),
    });
    //if (this.payerId != undefined && this.payerId != null)
    this.activatedRoute.queryParams.subscribe(params => {
      this.payerId =
        params.id == undefined
          ? null
          : this.commonService.encryptValue(params.id, false);
      
    });
    if(this.payerId != undefined && this.payerId != null)
    {
      
      this.getPayerById();
    }
      
  }

//   initializeFormFields(keywordObj?: KeywordModel) {
//     keywordObj = keywordObj || new KeywordModel();
//     const configControls = {
//       'id': [keywordObj.id],
//       'careCategoryId': [keywordObj.careCategoryId, Validators.required],  
//       'healthCareCategoryKeywords': this.formBuilder.array([]),
//     }
//     this.payerForm = this.formBuilder.group(configControls);
//     // initialize modifier modal
//     if (keywordObj.healthCareCategoryKeywords && keywordObj.healthCareCategoryKeywords.length) {
//       keywordObj.healthCareCategoryKeywords.forEach(obj => {
//         this.addKeywordFields(obj);
//       })
//     } else {
//       this.addKeywordFields();
//     }
//   }

//   get healthCareCategoryKeywords() {
//     return this.payerForm.get('healthCareCategoryKeywords') as FormArray;
//   }

//   addKeywordFields(diseaseObj?: HealthCareCategoryKeywordsModel) {
//     
//     const keywordControls = diseaseObj || new HealthCareCategoryKeywordsModel();
//     this.healthCareCategoryKeywords.push(this.formBuilder.group(keywordControls));
//   }
//   removeKeywordFields(ix: number) {
//     this.healthCareCategoryKeywords.removeAt(ix);
//   }

  get formControls() {
    return this.payerForm.controls;
  }

  // public handleAddressChange(addressObj: any) {
  //   const pObJ = {
  //     address:addressObj.address1,
  //     countryID: this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase())==null?null:this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase()).id,
  //     city: addressObj.city,
  //     stateID: this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase())==null?null:this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase()).id,
  //     zip: addressObj.zip,
  //     latitude:addressObj.latitude,
  //     longitude:addressObj.longitude
  //   }
  //   this.payerForm.patchValue(pObJ);
  //   // Do some stuff
  // }

  getMasterData() {
    let data = "MASTERPROVIDERCARECATEGORY"
    this.payersService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
       
        this.masterInsuranceType = response.masterprovidercarecategory != null ? response.masterprovidercarecategory : [];
      }
    });
  }
  getPayerById() {
    
    this.payersService.getCareCategorydataById(this.payerId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        
        this.payerModel = response.data;
        this.payerForm.patchValue(this.payerModel)
        //this.initializeFormFields(this.payerModel);
      }
    });
  }


  

  onSubmit(event: any) {
    if (!this.payerForm.invalid) {
      let clickType = event.currentTarget.name;
      this.formValues = this.payerForm.value;
      this.formValues.id=this.payerId;
      this.submitted = true;
      this.payersService.saveCareCategory(this.formValues).subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null && response.data != null) {
          //this.payerId=response.data.id;
          if (response.statusCode == 200) {
            //this.payerId = response.data.id;
            this.notifier.notify('success', response.message);
            this.route.navigate(["web/Masters/carecategorylisting"])
            //if (clickType == "SaveContinue") {
            //this.handleTabChange.next({ tab: "Payer Service Codes", id: response.data.id,clickType:clickType });
            //}
          } else {
            this.notifier.notify('error', response.message)
          }
        }
      });
    }
  }
}
