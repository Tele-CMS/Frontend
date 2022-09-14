import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocationModel } from '../location-master.model';
import { LocationService } from '../location-master.service';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { format } from 'date-fns';

@Component({
  selector: 'app-location-master-modal',
  templateUrl: './location-master-modal.component.html',
  styleUrls: ['./location-master-modal.component.css']
})
export class LocationModalComponent implements OnInit {
  locationModel: LocationModel;
  locationForm: FormGroup;
  // master value fields
  loadingMasterData: boolean = false;
  masterCountry: Array<any> = [];
  masterPatientLocation: Array<any> = [];
  masterState: Array<any> = [];
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private locationDialogModalRef: MatDialogRef<LocationModalComponent>,
    private locationService: LocationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.locationModel = data; 
    this.locationModel.officeStartHour = format(this.locationModel.officeStartHour || new Date(), 'HH:mm');
    this.locationModel.officeEndHour = format(this.locationModel.officeEndHour || new Date(), 'HH:mm');
  }

  ngOnInit() {
    this.loadMasterData();
    this.locationForm = this.formBuilder.group({
      id: [this.locationModel.id],
      address: [this.locationModel.address],
      apartmentNumber: [this.locationModel.apartmentNumber],
      billingNPINumber: [this.locationModel.billingNPINumber],
      billingProviderInfo: [this.locationModel.billingProviderInfo],
      billingTaxId: [this.locationModel.billingTaxId],
      city: [this.locationModel.city],
      countryID: [this.locationModel.countryID],
      daylightOffset: [this.locationModel.daylightOffset],
      daylightSavingTime: [this.locationModel.daylightSavingTime],
      facilityCode: [this.locationModel.facilityCode, Validators.required],
      facilityNPINumber: [this.locationModel.facilityNPINumber],
      facilityProviderNumber: [this.locationModel.facilityProviderNumber],
      latitude: [this.locationModel.latitude],
      longitude: [this.locationModel.longitude],
      locationDescription: [this.locationModel.locationDescription],
      locationName: new FormControl(this.locationModel.locationName, {
        validators: [Validators.required],
        asyncValidators: [this.validateLocationName.bind(this)],
        updateOn: 'blur'
      }),
      mileageRate: [this.locationModel.mileageRate],
      officeEndHour: [this.locationModel.officeEndHour],
      officeStartHour: [this.locationModel.officeStartHour],
      organizationID: [this.locationModel.organizationID],
      phone: [this.locationModel.phone],
      standardOffset: [this.locationModel.standardOffset],
      standardTime: [this.locationModel.standardTime],
      stateID: [this.locationModel.stateID, Validators.required],
      zip: [this.locationModel.zip],
    });
  }
  get formControls() { return this.locationForm.controls; }

  public handleAddressChange(addressObj: any) {
    const pObJ = {
      address: addressObj.address1,
      countryID: this.masterCountry.find(x => x.value.toUpperCase() == (addressObj.country || '').toUpperCase()) == null ? null : this.masterCountry.find(x => x.value.toUpperCase() == (addressObj.country || '').toUpperCase()).id,
      city: addressObj.city,
      stateID: this.masterState.find(y => (y.stateAbbr || '').toUpperCase() == (addressObj.state || '').toUpperCase()) == null ? null : this.masterState.find(y => (y.stateAbbr || '').toUpperCase() == (addressObj.state || '').toUpperCase()).id,
      zip: addressObj.zip,
      latitude: addressObj.latitude,
      longitude: addressObj.longitude
    }
    this.locationForm.patchValue(pObJ);
    // Do some stuff
  }

  onSubmit() {
    if (!this.locationForm.invalid) {
      this.submitted = true;
      this.locationModel = this.locationForm.value;
      this.locationService.create(this.locationModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.closeDialog('save');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.locationDialogModalRef.close(action);
  }
  loadMasterData() {
    // load master data
    this.loadingMasterData = true;
    const masterData = { masterdata: 'masterCountry,masterState,MASTERPATIENTLOCATION' };
    this.locationService.getMasterData(masterData).subscribe((response: any) => {
      this.loadingMasterData = false;
      this.masterCountry = response.masterCountry || [];
      this.masterPatientLocation = response.masterPatientLocation || [];
      this.masterState = response.masterState || [];
    });
  }

  validateLocationName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Location name",
        "tableName": "MASTER_LOCATION_LOCATIONNAME",
        "value": ctrl.value,
        "colmnName": "LOCATIONNAME",
        "id": this.locationModel.id,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
        this.locationService.validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode !== 202)
              resolve({ uniqueName: true })
            else
              resolve();
          })
    })
  }
}
