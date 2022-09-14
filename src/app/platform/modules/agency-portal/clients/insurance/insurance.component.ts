import { Component, OnInit, Output, EventEmitter, ViewContainerRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { PatientInsuranceModel, InsuredPersonModel } from '../insurance.model';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../clients.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { CommonService } from '../../../core/services';
import { format } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  private insuranceCompaniesModel: PatientInsuranceModel;
  private insuredPersonModel: InsuredPersonModel;
  loadingMasterData: boolean = false;
  insurancePlanTypeId: number;
  masterInsuranceCompanies: Array<any> = [];
  patientInsuranceId: number;
  masterInsurancePlanTypes: Array<any> = [];
  masterRelationship: Array<any> = [];
  masterState: Array<any> = [];
  masterCountry: Array<any> = [];
  masterGender: Array<any> = [];
  insuranceForm: FormGroup;
  submitted: boolean = false;
  maxDate = new Date();
  dataURL: any;
  imagePreviewFront: any;
  imagePreviewBack: any;
  imageBase64Front: any;
  imageBase64Back: any;
  clientId: number;
  activeInsurance: string = "primary";
  constructor(private formBuilder: FormBuilder, private commonService: CommonService,
     private clientService: ClientsService, private notifier: NotifierService, private route: Router) {
    this.insuranceCompaniesModel = new PatientInsuranceModel();
    this.insuredPersonModel = new InsuredPersonModel();
  }
  ngOnInit() {
    this.insuranceForm = this.formBuilder.group({
      id: [this.insuranceCompaniesModel.id],
      patientID: [this.insuranceCompaniesModel.patientID],
      insuranceCompanyID: [this.insuranceCompaniesModel.insuranceCompanyID],
      insuranceCompanyAddress: [this.insuranceCompaniesModel.insuranceCompanyAddress],
      insuranceIDNumber: [this.insuranceCompaniesModel.insuranceIDNumber],
      insuranceGroupName: [this.insuranceCompaniesModel.insuranceGroupName],
      insurancePlanTypeID: [this.insuranceCompaniesModel.insurancePlanTypeID],
      cardIssueDate: [this.insuranceCompaniesModel.cardIssueDate],
      insurancePhotoPathFront: [this.insuranceCompaniesModel.insurancePhotoPathFront],
      insurancePhotoPathThumbFront: [this.insuranceCompaniesModel.insurancePhotoPathThumbFront],
      insurancePhotoPathBack: [this.insuranceCompaniesModel.insurancePhotoPathBack],
      insurancePhotoPathThumbBack: [this.insuranceCompaniesModel.insurancePhotoPathThumbBack],
      insurancePersonSameAsPatient: [this.insuranceCompaniesModel.insurancePersonSameAsPatient],
      carrierPayerID: [this.insuranceCompaniesModel.carrierPayerID],
      insuranceCompanyName: [this.insuranceCompaniesModel.insuranceCompanyName],
      insurancePlanName: [this.insuranceCompaniesModel.insurancePlanName],
      notes: [this.insuranceCompaniesModel.notes],
      insuredPerson: this.formBuilder.group({
        id: [this.insuredPersonModel.id],
        firstName: [this.insuredPersonModel.firstName],
        middleName: [this.insuredPersonModel.middleName],
        lastName: [this.insuredPersonModel.lastName],
        genderID: [this.insuredPersonModel.genderID],
        phone: [this.insuredPersonModel.phone],
        patientInsuranceID: [this.insuredPersonModel.patientInsuranceID],
        patientID: [this.insuredPersonModel.patientID],
        dob: [this.insuredPersonModel.dob],
        relationshipID: [this.insuredPersonModel.relationshipID],
        address1: [this.insuredPersonModel.address1],
        city: [this.insuredPersonModel.city],
        stateID: [this.insuredPersonModel.stateID],
        countryID: [this.insuredPersonModel.countryID],
        zip: [this.insuredPersonModel.zip],
        apartmentNumber: [this.insuredPersonModel.apartmentNumber],
        latitude: [this.insuredPersonModel.latitude],
        longitude: [this.insuredPersonModel.longitude]
      })
    });

    this.getMasterData();
    this.formControlValueChanged();
  }
  get formControls() {
    return this.insuranceForm.controls;
  }
  public handleAddressChange(addressObj: any) {
    const pObJ = {
      address1:addressObj.address1,
      countryID: this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase())==null?null:this.masterCountry.find(x=>x.value.toUpperCase()==(addressObj.country||'').toUpperCase()).id,
      city: addressObj.city,
      stateID: this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase())==null?null:this.masterState.find(y=>(y.stateAbbr || '').toUpperCase()==(addressObj.state||'').toUpperCase()).id,
      zip: addressObj.zip,
      latitude:addressObj.latitude,
      longitude:addressObj.longitude
    }
    this.insuredPersonformControls.patchValue(pObJ);
    // Do some stuff
  }
  get insuredPersonformControls() {
    return this.insuranceForm.get('insuredPerson') as FormGroup;
  }
  activeHandler(event?: any, insuranceType?: string) {
    event && event.preventDefault(); 
    this.insuranceForm.reset();  
    const insPlanObj = (this.masterInsurancePlanTypes || []).find((obj) => obj.value.toLowerCase() === insuranceType.toLowerCase());
    this.insurancePlanTypeId = insPlanObj && insPlanObj.id;
    this.activeInsurance = insuranceType;
    if (this.clientId != null)
      this.getPatientInsurance();
  }
  formControlValueChanged() {
    let insuredPersonControl = this.insuredPersonformControls.controls;
    this.insuranceForm.get('insurancePersonSameAsPatient').valueChanges.subscribe(
      (mode: any) => { 
        if (!mode || mode == false) { 
          insuredPersonControl.address1.setValidators([Validators.required]);
          insuredPersonControl.firstName.setValidators([Validators.required]);
          insuredPersonControl.lastName.setValidators([Validators.required]);
          insuredPersonControl.genderID.setValidators([Validators.required]);
          insuredPersonControl.relationshipID.setValidators([Validators.required]);
          insuredPersonControl.dob.setValidators([Validators.required]);
          insuredPersonControl.phone.setValidators([Validators.required]);
          insuredPersonControl.countryID.setValidators([Validators.required]);
          insuredPersonControl.city.setValidators([Validators.required]);
          insuredPersonControl.stateID.setValidators([Validators.required]);
          insuredPersonControl.zip.setValidators([Validators.required]);
        }
        else { 
          insuredPersonControl.address1.clearValidators();
          insuredPersonControl.firstName.clearValidators();
          insuredPersonControl.lastName.clearValidators();
          insuredPersonControl.genderID.clearValidators();
          insuredPersonControl.relationshipID.clearValidators();
          insuredPersonControl.dob.clearValidators();
          insuredPersonControl.phone.clearValidators();
          insuredPersonControl.countryID.clearValidators();
          insuredPersonControl.city.clearValidators();
          insuredPersonControl.stateID.clearValidators();
          insuredPersonControl.zip.clearValidators();
        }
        insuredPersonControl.address1.updateValueAndValidity();
        insuredPersonControl.firstName.updateValueAndValidity();
        insuredPersonControl.lastName.updateValueAndValidity();
        insuredPersonControl.genderID.updateValueAndValidity();
        insuredPersonControl.relationshipID.updateValueAndValidity();
        insuredPersonControl.dob.updateValueAndValidity();
        insuredPersonControl.phone.updateValueAndValidity();
        insuredPersonControl.countryID.updateValueAndValidity();
        insuredPersonControl.city.updateValueAndValidity();
        insuredPersonControl.stateID.updateValueAndValidity();
        insuredPersonControl.zip.updateValueAndValidity();
      });
  }


  handleImageChange(e,type:string) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        if(type=='front') {
        this.imagePreviewFront = reader.result;
        this.imageBase64Front = this.imagePreviewFront;
        }
        else {
        this.imagePreviewBack = reader.result;
        this.imageBase64Back = this.imagePreviewBack;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
    else
      this.notifier.notify('error', "Please select valid file type");
  }
  getMasterData() {
    let data = "masterInsuranceCompany,insurancePlanType,MASTERGENDER,masterRelationship,MASTERSTATE,MASTERCOUNTRY"
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterInsuranceCompanies = response.insuranceCompanies != null ? response.insuranceCompanies : [];
        this.masterCountry = response.masterCountry != null ? response.masterCountry : [];
        this.masterState = response.masterState != null ? response.masterState : [];
        this.masterGender = response.masterGender != null ? response.masterGender : [];
        this.masterRelationship = response.masterRelationship != null ? response.masterRelationship : [];
        this.masterInsurancePlanTypes = response.insurancePlanType != null ? response.insurancePlanType : [];
        this.activeHandler(null, "primary");
      }
    });
  }
  onSubmit(event: any) {
    this.submitted = true;
    let clickType = event.currentTarget.name;
    if (this.insuranceForm.invalid) {
      this.submitted = false;
      return;
    }
    let postData: any;
    let a =this.insuranceForm.value;
    if (!this.insuranceForm.controls.insurancePersonSameAsPatient.value) {
      postData = {
        ...this.insuranceForm.value,
        base64Front: this.imageBase64Front || null,
        base64Back: this.imageBase64Back || null,
        patientID: this.clientId,
        insurancePlanTypeID: this.insurancePlanTypeId,
        insuredPerson: {
          ...this.insuranceForm.value.insuredPerson,
          dob: this.insuranceForm.value.insuredPerson.dob ? format(this.insuranceForm.value.insuredPerson.dob, 'MM-DD-YYYY') : null,
          patientID: this.clientId,
          patientInsuranceID: this.insuranceForm.value.id
        }
      }
    } else {
      postData = {
        ...this.insuranceForm.value,
        base64Front: this.imageBase64Front || null,
        base64Back: this.imageBase64Back || null,
        patientID: this.clientId,
        insurancePlanTypeID: this.insurancePlanTypeId,
        insuredPerson: null
      }
    }
    this.imageBase64Front = null;
    this.imageBase64Back = null;
    let formData = new Array<PatientInsuranceModel>();
    formData.push(postData);
    this.clientService.savePatientInsurance(formData).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message)
        if (clickType == "SaveContinue") {
          this.route.navigate(["web/client/profile"], { queryParams: { id: this.commonService.encryptValue(this.clientId, true) } });
        } else if (clickType == "Save") {
          this.getPatientInsurance();
        }
        // if (clickType == "SaveContinue") {
        //   this.handleTabChange.next({ tab: "Custom Fields", id: this.clientId });
        // } else if (clickType == "Save") {
        //   this.getPatientInsurance();
        // }
      } else {
        this.notifier.notify('error', response.message)
      }
    });
  }
  updateValue(insuranceCompanyId: number) {
    if (this.masterInsuranceCompanies != null && this.masterInsuranceCompanies.length > 0) {
      const addressObj = this.masterInsuranceCompanies.find(x => x.id == insuranceCompanyId);
      this.insuranceForm.patchValue({ insuranceCompanyAddress: addressObj.address, carrierPayerID: addressObj.carrierPayerID });
    }
  }
  getPatientInsurance() {
    this.clientService.getPatientInsurance(this.clientId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.insuranceCompaniesModel = response.data.PatientInsurance.find((obj) => obj.insurancePlanTypeID == this.insurancePlanTypeId);
        this.insuranceCompaniesModel = this.insuranceCompaniesModel || new PatientInsuranceModel();
        this.imagePreviewFront = this.insuranceCompaniesModel.insurancePhotoPathThumbFront || '';
        this.imagePreviewBack = this.insuranceCompaniesModel.insurancePhotoPathThumbBack || '';
        this.imageBase64Front = null;
        this.imageBase64Back = null;
        this.patientInsuranceId = this.insuranceCompaniesModel.id;
        this.insuranceForm.patchValue(this.insuranceCompaniesModel);
        if (this.insuranceCompaniesModel && this.insuranceCompaniesModel.insurancePersonSameAsPatient != true) {
          this.insuredPersonModel = response.data.InsuredPerson.find((obj) =>
            obj.patientInsuranceID == this.insuranceCompaniesModel.id);
          this.insuredPersonModel = this.insuredPersonModel || new InsuredPersonModel();
          this.insuranceForm.patchValue({
            insuredPerson: this.insuredPersonModel
          });
        }
      }
    }
    );
  }
}
