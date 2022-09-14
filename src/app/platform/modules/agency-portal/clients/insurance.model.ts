export class PatientInsuranceModel {
    id: number;
    patientID: number;
    insuranceCompanyID: number;
    insuranceCompanyAddress: string;
    insuranceIDNumber: string;
    insuranceGroupName: string;
    insurancePlanName: string;
    insurancePlanTypeID: number;
    cardIssueDate: Date;
    notes: string;
    insurancePhotoPathFront: string;
    insurancePhotoPathThumbFront: string;
    insurancePhotoPathBack: string;
    insurancePhotoPathThumbBack: string;
    insurancePersonSameAsPatient: boolean = false;
    carrierPayerID: string;
    isDeleted: boolean;
    insuranceCompanyName: string;
}

export class InsuredPersonModel {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    patientID: number;
    patientInsuranceID: number;
    relationshipID: number;
    dob: Date;
    address1: string;
    city: string;
    stateID: number;
    countryID: number;
    zip: string;
    latitude: number= 0.0;
    longitude: number=0.0;
    apartmentNumber: string;
    genderID: number;
    isDeleted: boolean;
}