import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ClientsService } from '../clients.service';
import { AddressModel, PhoneNumberModel } from '../address.model';
import { ResponseModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  addressForm: FormGroup;
  masterCountry: any = [];
  masterState: any = [];
  masterPatientLocation: any = [];
  masterPhoneType: any[];
  masterPhonePreferences: any = [];
  masterAddressType: any[];
  patientAddress: Array<AddressModel> = [];
  phoneNumber: Array<PhoneNumberModel> = [];
  existingAddress: any[];
  existingPhoneNumber: any[];
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  clientId: number;
  submitted: boolean = false;
  sameAsPrimary: boolean = false;

  constructor(private formBuilder: FormBuilder, private clientService: ClientsService, private notifier: NotifierService,private route: Router,) { }
  ngOnInit() {
    this.addressForm = this.formBuilder.group({
      addresses: this.formBuilder.array([]),
      phoneNumbers: this.formBuilder.array([]),
    });
    this.getMasterData();
    this.getAddressesAndPhoneNumbers();
  }
  get formControls() {
    return this.addressForm.controls;
  }
  get addresses() {
    return this.addressForm.get('addresses') as FormArray;
  }

  get phoneNumbers() {
    return this.addressForm.get('phoneNumbers') as FormArray;
  }

  getAddressControl(ix: number) {
    const pAdrr = this.addresses.get([ix]) as FormGroup;
    return pAdrr.controls['address1'];
  }

  public handleAddressChange(addressObj: any,index:number) {
    let pAdd = this.addresses.get([index]) as FormGroup;
    const pObJ = {
      address1:addressObj.address1,
      countryId: this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase())==null?null:this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase()).id,
      city: addressObj.city,
      stateId: this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase())==null?null:this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase()).id,
      zip: addressObj.zip,
      latitude:addressObj.latitude,
      longitude:addressObj.longitude
    }
    pAdd.patchValue(pObJ);
    // Do some stuff
  }
  onSubmit(event: any) {
    if (!this.addressForm.invalid) {
      let clickType = event.currentTarget.name;
      let addressList = this.addressForm.value.addresses;
      let phoneNumberList = this.addressForm.value.phoneNumbers;
      let data = {
        patientId: this.clientId,
        patientAddress: addressList,
        phoneNumbers: phoneNumberList
      }
      let pAddressTypeId = null;
      let mAddressTypeId = null;
      if (this.masterAddressType != null && this.masterAddressType.length > 0) {
        pAddressTypeId = this.masterAddressType.find(x => x.globalCodeName == "Primary Home").id;   //Manage this with key from Gobal Code Name key
        mAddressTypeId = this.masterAddressType.find(x => x.globalCodeName == "Mailing Home").id;   //Manage this with key from Gobal Code Name key
      }
      addressList[0] != null ? addressList[0].addressTypeId = pAddressTypeId : null;
      addressList[0] != null ? addressList[0].isPrimary = true : false;
      addressList[0] != null ? addressList[0].isMailingSame = this.sameAsPrimary : false;
      addressList[1] != null ? addressList[1].addressTypeId = mAddressTypeId : null;
      //This should be removed from front end and should be managed in backend ---------Added by Sunny Bhardwaj
      this.patientAddress.filter((x: AddressModel) => {
        if (addressList.findIndex(y => (y.id == x.id)) == -1) {
          x.isDeleted = true;
          addressList.push(x);
        }
      });

      //This should be removed from front end and should be managed in backend ---------Added by Sunny Bhardwaj
      this.phoneNumber.filter((x: PhoneNumberModel) => {
        if (phoneNumberList.findIndex(y => (y.id == x.id)) == -1) {
          x.isDeleted = true;
          phoneNumberList.push(x);
        }
      });

      this.submitted = true;
      this.clientService.savePatientAddressesAndPhoneNumbers(data).subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          if (clickType == "Save")
            this.getAddressesAndPhoneNumbers()
           if (clickType == "SaveContinue")
           this.route.navigate(["web/client/my-profile"])
          //  this.handleTabChange.next({ tab: "Insurance", id: this.clientId });
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  getMasterData() {
    let data = "ADDRESSTYPE,MASTERSTATE,MASTERCOUNTRY,MASTERPATIENTLOCATION,PHONETYPE,MASTERPHONEPREFERENCES"
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterCountry = response.masterCountry != null ? response.masterCountry : [];
        this.masterState = response.masterState != null ? response.masterState : [];
        this.masterPatientLocation = response.masterPatientLocation != null ? response.masterPatientLocation : [];
        this.masterPhoneType = response.masterPhoneType != null ? response.masterPhoneType : [];
        this.masterPhonePreferences = response.masterPhonePreferences != null ? response.masterPhonePreferences : [];
        this.masterAddressType = response.masterAddressType != null ? response.masterAddressType : [];
      }
    });
  }
  addAddress(obj: AddressModel) {
    const control = (<FormArray>this.addressForm.controls['addresses']);
    control.push(this.formBuilder.group({
      id: obj.id, address1: obj.address1, countryId: obj.countryId, city: obj.city,
      apartmentNumber: obj.apartmentNumber, stateId: obj.stateId, zip: obj.zip,
      patientLocationId: obj.patientLocationId
      , patientId: this.clientId, isPrimary: obj.isPrimary, isMailingSame: obj.isMailingSame,
      addressTypeId: obj.addressTypeId, latitude: obj.latitude, longitude: obj.longitude
    }));
  }

  addPhoneNumber(obj: PhoneNumberModel) {
    const control = (<FormArray>this.addressForm.controls['phoneNumbers']);
    control.push(this.formBuilder.group({
      id: obj.id,
      phoneNumberTypeId: obj.phoneNumberTypeId,
      phoneNumber: obj.phoneNumber,
      preferenceID: obj.preferenceID,
      otherPhoneNumberType: obj.otherPhoneNumberType,
      isDeleted: obj.isDeleted,
      patientID: this.clientId,
    }));
  }
  addAdditionalAddress() {
    this.addAddress(new AddressModel());
  }

  removeAdress(index: number) {
    this.addresses.removeAt(index);;
  }
  addAdditionalPhoneNumber() {
    this.addPhoneNumber(new PhoneNumberModel());
  }

  removePhoneNumber(index: number) {
    this.phoneNumbers.removeAt(index);;
  }
  getAddressesAndPhoneNumbers() {
    let addressArrayLength = 2;
    let phoneArrayLength = 1
    this.clientService.getPatientAddressesAndPhoneNumbers(this.clientId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        while (this.addresses.length !== 0) {
          this.addresses.removeAt(0)
        }
        while (this.phoneNumbers.length !== 0) {
          this.phoneNumbers.removeAt(0)
        }
        if (response.data.PatientAddress != null && response.data.PatientAddress.length > 0) {
          this.patientAddress = response.data.PatientAddress;
          addressArrayLength = this.patientAddress.length > 2 ? this.patientAddress.length : addressArrayLength;
          for (let i = 0; i < addressArrayLength; i++) {
            if (this.patientAddress[i] != null) {
              if (i == 0)
                this.sameAsPrimary = this.patientAddress[i].isMailingSame;
              this.addAddress(this.patientAddress[i]);
            }
            else
              this.addAddress(new AddressModel());
          }
        }
        else {
          this.addAddress(new AddressModel());
          this.addAddress(new AddressModel());
        }
        if (response.data.PhoneNumbers != null && response.data.PhoneNumbers.length > 0) {
          this.phoneNumber = response.data.PhoneNumbers;
          phoneArrayLength = this.phoneNumber.length > 1 ? this.phoneNumber.length : phoneArrayLength;
          for (let i = 0; i < phoneArrayLength; i++) {
            if (this.phoneNumber[i] != null)
              this.addPhoneNumber(this.phoneNumber[i]);
            else
              this.addPhoneNumber(new PhoneNumberModel());
          }
        }
        else {
          this.addPhoneNumber(new PhoneNumberModel());
        }
      }
    });
  }

  sameAsPrimaryClick(event: any) {
    this.sameAsPrimary = event.checked;
    let pObJ = {};
    let pAdd = this.addresses.get([0]) as FormGroup;
    let mAdd = this.addresses.get([1]) as FormGroup;
    if (event.checked) {
      pObJ = {
        address1: pAdd.controls["address1"].value,
        countryId: pAdd.controls["countryId"].value,
        city: pAdd.controls["city"].value,
        apartmentNumber: pAdd.controls["apartmentNumber"].value,
        stateId: pAdd.controls["stateId"].value,
        zip: pAdd.controls["zip"].value,
        patientLocationId: pAdd.controls["patientLocationId"].value
      }
    }
    else {
      pObJ = {
        address1: "",
        countryId: null,
        city: "",
        apartmentNumber: "",
        stateId: null,
        zip: "",
        patientLocationId: null
      }
    }
    mAdd.patchValue(pObJ);
  }
}

