import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PayerModel } from '../payers.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayersService } from '../payers.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-payer',
  templateUrl: './add-payer.component.html',
  styleUrls: ['./add-payer.component.css']
})
export class AddPayerComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  payerModel: PayerModel;
  payerForm: FormGroup;
  masterCountry: any[];
  masterState: any[];
  masterInsuranceType: any[];
  payerId: number;
  printFormats: any[];
  formValues:PayerModel;
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder, private payersService: PayersService, private notifier: NotifierService) {
    this.payerModel = new PayerModel();
    this.printFormats = [{ id: 1, value: "Normal" }, { id: 1, value: "Pre-Printed" }];
  }

  ngOnInit() {
    this.getMasterData();
    this.payerForm = this.formBuilder.group({
      insuranceTypeId: [this.payerModel.insuranceTypeId],
      name: [this.payerModel.name],
      tplCode: [this.payerModel.tplCode],
      carrierPayerID: [this.payerModel.carrierPayerID],
      email: [this.payerModel.email,[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: [this.payerModel.phone],
      fax: [this.payerModel.fax],
      address: [this.payerModel.address],
      apartmentNumber: [this.payerModel.apartmentNumber],
      countryID: [this.payerModel.countryID],
      city: [this.payerModel.city],
      stateID: [this.payerModel.stateID],
      zip: [this.payerModel.zip],
      latitude: [this.payerModel.latitude],
      longitude: [this.payerModel.longitude],
      dayClubByProvider: [this.payerModel.dayClubByProvider],
      isActive: [this.payerModel.isActive],
      isEDIPayer: [this.payerModel.isEDIPayer],
      isPractitionerIsRenderingProvider: [this.payerModel.isPractitionerIsRenderingProvider],
      form1500PrintFormat: [this.payerModel.form1500PrintFormat],
      additionalClaimInfo: [this.payerModel.additionalClaimInfo]
    });
    if (this.payerId != undefined && this.payerId != null)
      this.getPayerById();
  }
  get formControls() {
    return this.payerForm.controls;
  }

  public handleAddressChange(addressObj: any) {
    const pObJ = {
      address:addressObj.address1,
      countryID: this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase())==null?null:this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase()).id,
      city: addressObj.city,
      stateID: this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase())==null?null:this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase()).id,
      zip: addressObj.zip,
      latitude:addressObj.latitude,
      longitude:addressObj.longitude
    }
    this.payerForm.patchValue(pObJ);
    // Do some stuff
  }

  getMasterData() {
    let data = "masterCountry,masterInsuranceType,masterServiceCode,masterState"
    this.payersService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterCountry = response.masterCountry != null ? response.masterCountry : [];
        this.masterState = response.masterState != null ? response.masterState : [];
        this.masterInsuranceType = response.masterInsuranceType != null ? response.masterInsuranceType : [];
      }
    });
  }
  getPayerById() {
    this.payersService.getPayerById(this.payerId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        this.payerModel = response.data;
        this.payerForm.patchValue(this.payerModel)
      }
    });
  }
  onSubmit(event: any) {
    if (!this.payerForm.invalid) {
      let clickType = event.currentTarget.name;
      this.formValues = this.payerForm.value;
      this.formValues.id=this.payerId;
      this.submitted = true;
      this.payersService.savePayer(this.formValues).subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null && response.data != null) {
          this.payerId=response.data.id;
          if (response.statusCode == 200) {
            this.payerId = response.data.id;
            this.notifier.notify('success', response.message)
            //if (clickType == "SaveContinue") {
            this.handleTabChange.next({ tab: "Payer Service Codes", id: response.data.id,clickType:clickType });
            //}
          } else {
            this.notifier.notify('error', response.message)
          }
        }
      });
    }
  }
}
