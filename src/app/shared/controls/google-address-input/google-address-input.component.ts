import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-google-address-input',
  templateUrl: './google-address-input.component.html',
  styleUrls: ['./google-address-input.component.css']
})
export class GoogleAddressInputComponent {

  @Input('control') address: FormControl = new FormControl('');
  @Input() placeholder: string = 'Address';
  @Output() onAddressChange = new EventEmitter();

  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  addressOptions = {
    types: [],
    componentRestrictions: { country: 'US' }
  }
  constructor() {}

  public handleAddressChange(address: Address) {
    let addType = '';
    let city = null;
    let country = null;
    let state = null;
    let postalCode = null;
    let address1 = address.formatted_address;
    let lat = address.geometry.location.lat();
    let long = address.geometry.location.lng();
    for (let i = 0; i <= address.address_components.length; i++) {
      if (address.address_components[i] != undefined) {
        addType = address.address_components[i].types[0];
        if (addType == 'locality')
          city = address.address_components[i].long_name;
        else if (addType == 'country')
          country = address.address_components[i].short_name;
        else if (addType == 'administrative_area_level_1')
          state = address.address_components[i].short_name;
        else if (addType == 'postal_code')
          postalCode = address.address_components[i].long_name;
      }

    }
    let pObJ = {};
    pObJ = {
      address1: address1,
      country: country,
      city: city,
      state: state,
      zip: postalCode,
      latitude: lat,
      longitude: long
    }
    // pAdd.patchValue(pObJ);
    this.onAddressChange.emit(pObJ);
  }

}
