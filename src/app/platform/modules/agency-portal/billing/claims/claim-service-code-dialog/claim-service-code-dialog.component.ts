import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ClaimsService } from '../claims.service';
import { ClaimServiceCodeModel } from './claim-service-code.model';

@Component({
  selector: 'app-claim-service-code-dialog',
  templateUrl: './claim-service-code-dialog.component.html',
  styleUrls: ['./claim-service-code-dialog.component.css']
})
export class ClaimServiceCodeDialogComponent implements OnInit {
  claimServiceCodeForm: FormGroup;
  ClaimServiceCodeModel: ClaimServiceCodeModel;
  id: number;
  claimId: number;
  serviceCode: string;
  submitted: boolean = false;
  isloadingMasterData: boolean = false;
  masterAllStaff: Array<any>;
  masterPatientLocation: Array<any>;
  officeAndPatientLocations: Array<any>;
  ServiceCodes: Array<any>;
  ServiceCodeModifiers: Array<any>;
  filteredServiceCodeModifiers: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
    private claimsService: ClaimsService,
    public dialogPopup: MatDialogRef<ClaimServiceCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.masterAllStaff = [];
    this.masterPatientLocation = [];
    this.officeAndPatientLocations = data.officeAndPatientLocations || [];
    this.ServiceCodes = (data.ServiceCodes || []).filter((data) => data.isRequiredAuthorization === true);
    this.ServiceCodeModifiers = data.ServiceCodeModifiers || [];
    this.ClaimServiceCodeModel = data.claimServiceLineDetails;
    this.id = this.ClaimServiceCodeModel.id;
    this.claimId = data.claimId;
    this.serviceCode = this.ClaimServiceCodeModel.serviceCode || '';

    // for selected service location
    let locationObj = null;
    if (this.ClaimServiceCodeModel.patientAddressID || this.ClaimServiceCodeModel.officeAddressID) {
      // here find the key to know which address is choosen
      let findKey = this.ClaimServiceCodeModel.patientAddressID ? 'PATIENT' : this.ClaimServiceCodeModel.officeAddressID ? 'OFFICE' : '';
      let selectedId = this.ClaimServiceCodeModel.patientAddressID || this.ClaimServiceCodeModel.officeAddressID;
      locationObj = (this.officeAndPatientLocations || []).find((address) => (address.key || '').toUpperCase() === findKey && (address.id === selectedId));
    } else if (this.ClaimServiceCodeModel.customAddressID) {
      locationObj = (this.officeAndPatientLocations || []).find((obj) => ((obj.key || '').toUpperCase() === 'OTHER'));
    }
    this.ClaimServiceCodeModel.serviceLocationId = locationObj && locationObj.rowNo;
    if (this.ClaimServiceCodeModel.id > 0 && this.ClaimServiceCodeModel.serviceCode) {
      const selectedServiceCode = this.ServiceCodes.find(obj => obj.serviceCode == this.ClaimServiceCodeModel.serviceCode);
      this.ClaimServiceCodeModel.serviceCode = selectedServiceCode && selectedServiceCode.serviceCodeId;
      this.filterServiceCodeModifiers(selectedServiceCode && selectedServiceCode.payerServiceCodeId);
    }
  }

  ngOnInit() {
    this.initializeFormFields(this.ClaimServiceCodeModel);
    this.fetchMasterData();
  }

  initializeFormFields(model?: ClaimServiceCodeModel) {
    model = model || new ClaimServiceCodeModel();
    const configControls = {
      'serviceCode': [model.serviceCode],
      'quantity': [model.quantity],
      'rate': [model.rate],
      'isBillable': [model.isBillable],
      'modifier1': [model.modifier1],
      'modifier2': [model.modifier2],
      'modifier3': [model.modifier3],
      'modifier4': [model.modifier4],
      'clinicianId': [model.clinicianId],
      'renderingProviderId': [model.renderingProviderId],
      'serviceLocationID': [model.serviceLocationId],
      'customAddressID': [model.customAddressID],
      'customAddress': [model.customAddress],
    }
    this.claimServiceCodeForm = this.formBuilder.group(configControls);

  }

  get formControls() { return this.claimServiceCodeForm.controls; }

  get selectedServiceLocation(): any {
    const selectedObj = (this.officeAndPatientLocations || []).find(obj => obj.rowNo === this.formControls.serviceLocationID.value)
    return selectedObj;

  }

  onClose(): void {
    this.dialogPopup.close();
  }

  onServiceCodeSelected(event: any) {
    const selectedValue = event.value;

    const selectObj: MatSelect = event.source;
    this.serviceCode = selectObj.triggerValue;

    const currentCPTObj = (this.ServiceCodes || []).find((obj) => obj.serviceCodeId === selectedValue);
    this.filterServiceCodeModifiers(currentCPTObj && currentCPTObj.payerServiceCodeId);

    if (currentCPTObj && currentCPTObj.payerServiceCodeId) {
      this.getPayerServiceCodeDetails(currentCPTObj.payerServiceCodeId);
    }
  }

  filterServiceCodeModifiers(id: number) {
    this.filteredServiceCodeModifiers = (this.ServiceCodeModifiers || []).filter((obj) => {
      return obj.payerServiceCodeId === id;
    });
  }

  getRateOfModifier(modifier: string): number {
    let rate = 0;
    const modifierObj = (this.filteredServiceCodeModifiers || []).find(obj => obj.modifier == modifier);
    if (modifierObj)
      rate = modifierObj.rate;
    return rate;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.claimServiceCodeForm.invalid) {
      this.submitted = false;
      return;
    }

    let addressesObj = {
      'customAddressID': null,
      'customAddress': null,
      'patientAddressID': null,
      'officeAddressID': null
    };
    if (this.selectedServiceLocation && (this.selectedServiceLocation.key || '').toUpperCase() === 'OTHER') {
      addressesObj.customAddress = this.claimServiceCodeForm.get('customAddress').value
      addressesObj.customAddressID = this.claimServiceCodeForm.get('customAddressID').value;
    } else if (this.selectedServiceLocation && (this.selectedServiceLocation.key || '').toUpperCase() === 'PATIENT') {
      addressesObj.patientAddressID = this.selectedServiceLocation.id;
    } else if (this.selectedServiceLocation && (this.selectedServiceLocation.key || '').toUpperCase() === 'OFFICE') {
      addressesObj.officeAddressID = this.selectedServiceLocation.id;
    }

    let modifiers = {
      'modifier1': this.claimServiceCodeForm.value.modifier1,
      'modifier2': this.claimServiceCodeForm.value.modifier2,
      'modifier3': this.claimServiceCodeForm.value.modifier3,
      'modifier4': this.claimServiceCodeForm.value.modifier4,
      'rateModifier1': this.getRateOfModifier(this.claimServiceCodeForm.value.modifier1),
      'rateModifier2': this.getRateOfModifier(this.claimServiceCodeForm.value.modifier2),
      'rateModifier3': this.getRateOfModifier(this.claimServiceCodeForm.value.modifier3),
      'rateModifier4': this.getRateOfModifier(this.claimServiceCodeForm.value.modifier4),
    }
    const postData = {
      ...this.claimServiceCodeForm.value,
      'id': this.id,
      'claimId': this.claimId,
      'serviceCode': this.serviceCode,
      // 'isMultiplePractitioner': false,
      // 'patientInsuranceId': 0,
      // 'practitioners': null,
      // 'serviceAddress': null,
      // 'serviceFacilityCode': 0,
      // 'balance': 0,
      ...addressesObj,
      ...modifiers
    }
    this.claimsService.saveClaimServiceLine(postData, this.claimId)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.notifier.notify('success', response.message);
          this.dialogPopup.close('SAVE');
        } else {
          this.notifier.notify('error', response.message);
        }
      });
  }

  fetchMasterData(): void {
    // load master data
    this.isloadingMasterData = true;
    const masterData = { masterdata: "MASTERALLSTAFF,MASTERPATIENTLOCATION" };
    this.claimsService.getMasterData(masterData)
      .subscribe((response: any) => {
        this.isloadingMasterData = false;
        this.masterAllStaff = response.allStaffs || [];
        this.masterPatientLocation = response.masterPatientLocation || [];
      });
  }

  getPayerServiceCodeDetails(id: number) {
    this.claimsService.getPayerServiceCodeById(id)
      .subscribe((response: any) => {
        let data = {
          ratePerUnit: 0,
          isBillable: false
        };
        if (response.statusCode == 200) {
          data = response.data;
        }
        this.claimServiceCodeForm.patchValue({
          rate: data.ratePerUnit,
          isBillable: data.isBillable
        });
      })
  }

}

