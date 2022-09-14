export class PatientBasicHeaderInfo {
    patientID: number;
    name: string='';
    dob: string='';
    gender: string='';
    ssn: string='';
    mrn: string='';
    status: string;
    phone: string='';
    email: string='';
    address: string='';
    photoPath: string;
    photoThumbnailPath: string='';
    primaryProvider: string='';
    userId: number = null;
}

export class PatientTagsHeaderInfo {
    tag: string='';
    colorCode: string;
    colorName: string;
    fontColorCode: string;
}

export class PatientPhoneHeaderInfo {
    phoneNumber: string;
    phoneNumberType: string;
    preference: string;
}

export class PatientAllergyHeaderInfo {
    allergen: string='';
    allergyType: string;
    reaction: string;
    note: string;
}

export class ClientHeaderModel {
    patientBasicHeaderInfo=new PatientBasicHeaderInfo();
    patientTagsHeaderInfo=new Array<PatientTagsHeaderInfo>();
    patientPhoneHeaderInfo=new Array<PatientPhoneHeaderInfo>();
    patientAllergyHeaderInfo=new Array<PatientAllergyHeaderInfo>();
}