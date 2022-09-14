export class AddressModel
{
    id: number=null;
    address1: string=null;
    address2: string=null;
    apartmentNumber: string=null;
    countryId: number=null;
    city: string=null;
    stateId: number=null;
    zip: string=null;
    patientLocationId: number=null;
    addressTypeId: number=null;
    addressTypeName: string=null;
    isPrimary: boolean=false;
    isMailingSame: boolean=false;
    patientId: number=null;
    latitude: number;
    longitude: number;
    isDeleted: boolean=false;
    others: string=null;
}

export class PhoneNumberModel
{
    id: number;
    patientID: number;
    phoneNumberTypeId: number;
    phoneNumber: string;
    preferenceID: number;
    otherPhoneNumberType: string;
    isDeleted: boolean;
}