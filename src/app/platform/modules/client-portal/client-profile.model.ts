export class Metadata {
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  defaultPageSize: number;
  totalPages: number;
}

export class PatientInfo {
    patientID: number;
    name: string;
    dob: Date;
    age: number;
    gender: string;
    ssn: string;
    mrn: string;
    status: string;
    phone: string;
    email: string;
    address: string;
    photoPath: string;
    photoThumbnailPath: string = '';
    isPortalActivate: boolean;
    isBlock: boolean;
    isActive: boolean;
    userID: number;
    city: string;
    countryName: string;
    ethnicity: string;
    firstName: string;
    lastName: string;
    raceName: string;
    stateName: string;
    zip: string;
    note: string;
    isPortalRequired: boolean;
    renderingProviderId?: number;
    renderingProviderName?: string;
    renderingProviderThumbnail?: string;
}

export class PatientVital {
    patientVitalID: number;
    heartRate: number;
    bmi: number;
    bpDiastolic: number;
    bpSystolic: number;
    pulse: number;
    respiration: number;
    temperature: number;
    heightIn: number;
    weightLbs: number;
    vitalDate: Date;
}

export class PatientDiagnosisDetail {
    code: string;
    description: string;
    isPrimary: boolean;
    diagnosisDate: Date;
}

export class PhoneNumberModel {
    phoneNumberId: number;
    phoneNumber: string;
    phoneNumberTypeId: number;
    phoneNumberType: string;
    preferenceID: number;
    preference: string;
    otherPhoneNumberType: string;
}

export class PatientTagsModel {
    patientTagID: number;
    tagID: number;
    tag: string;
    colorCode: string;
    colorName: string;
    roleTypeID: number;
    fontColorCode: string;
    isDeleted: boolean;
}

export class PatientAddressesModel {
    addressID: number;
    isMailingSame: boolean;
    address1: string;
    address2: string;
    city: string;
    stateID: number;
    stateName: string;
    stateAbbr: string;
    countryID: number;
    countryName: string;
    zip: string;
    addressTypeID: number;
    addressType: string;
    isPrimary: boolean;
    others: string;
}

export class PatientAllergyModel {
    patientAllergyId: number;
    allergen: string;
    allergyTypeId: number;
    allergyType: string;
    reactionID: number;
    reaction: string;
    note: string;
    createdDate: Date;
    isActive: boolean;
}
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
export class PatientMedicalFamilyHistoryModel {
    medicalFamilyHistoryId: number;
    dob: Date;
    dateOfDeath: Date;
    firstName: string;
    genderID: number;
    gender: string;
    lastName: string;
    observation: string;
    relationShipID: number;
    relationshipName: string;
}

export class PatientMedicationModel {
    patientMedicationId: number;
    dose: string;
    endDate: Date;
    startDate: Date;
    frequencyID: number;
    frequency: string;
    medicine: string;
    strength: string;
}

export class PatientSocialHistory {
    id: number;
    patientID: number;
    alcohalID: number;
    tobaccoID: number;
    drugID: number;
    occupation: string;
    travelID: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: number;
    createdDate: Date;
    updatedDate: Date;
    updatedBy: number;
}

export class PatientImmunization {
    id: number;
    patientID: number;
    orderBy: number;
    vfcid: number;
    administeredDate: Date;
    immunization: number;
    amountAdministered: number;
    manufactureID: number;
    expireDate: Date;
    vaccineLotNumber: string;
    administrationSiteID: number;
    routeOfAdministrationID: number;
    administeredBy: number;
    immunityStatusID: number;
    rejectedImmunization: boolean;
    rejectionReasonID: number;
    rejectionReasonNote: string;
    manufacturerName: string;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: number;
    createdDate: Date;
}

export class Organization {
    id: number;
    organizationName: string;
    businessName: string;
    value: string;
    description: string;
    address1: string;
    city: string;
    stateName: string;
    zip: string;
    phone: string;
    fax: string;
    email: string;
    logo: string;
    favicon: string;
    contactPersonFirstName: string;
    contactPersonLastName: string;
    contactPersonPhoneNumber: string;
    contactPersonMaritalStatus: number;
    databaseDetailId: number;
    isActive: boolean;
    createdDate: Date;
    isDeleted: boolean;
    createdBy: number;
    updatedDate: Date;
    latitude: number;
    longitude: number;
    apartmentNumber: string;
    vendorIdDirect: string;
    vendorIdIndirect: string;
    vendorNameDirect: string;
    vendorNameIndirect: string;
    payrollStartWeekDay: string;
    payrollEndWeekDay: string;
}

export class ClientProfileModel {
    patientInfo = new Array<PatientInfo>();
    patientVitals = new Array<PatientVital>();
    lastAppointmentDetails: any[] = [];
    upcomingAppointmentDetails: any[] = [];
    patientDiagnosisDetails = new Array<PatientDiagnosisDetail>();
    phoneNumberModel = new Array<PhoneNumberModel>();
    patientTagsModel = new Array<PatientTagsModel>();
    patientAddressesModel = new Array<PatientAddressesModel>()
    patientAllergyModel = new Array<PatientAllergyModel>();
    patientLabTestModel: any[] = [];
    patientMedicalFamilyHistoryModel = new Array<PatientMedicalFamilyHistoryModel>();
    patientCustomLabelModel: any[];
    patientMedicationModel = new Array<PatientMedicationModel>();
    staffs: any[] = [];
    patientSocialHistory = new Array<PatientSocialHistory>();
    patientEncounter: any[];
    patientImmunization = new Array<PatientImmunization>();
    organization = new Array<Organization>();
    claimServiceLine: any[] = [];
    patientEligibilityModel:any;
}
export class PatientAppointmentListModel {
    patientAppointmentId: number;
    startDateTime: Date;
    endDateTime: Date;
    appointmentTypeName: string;
    appointmentTypeID: number;
    color: string;
    fontColor: string;
    defaultDuration: number;
    isBillable: boolean;
    patientName: string;
    patientID: number;
    patientEncounterId: number;
    claimId: number;
    canEdit: boolean;
    patientAddressID: number;
    serviceLocationID: number;
    appointmentStaffs: AppointmentStaff[];
    isClientRequired: boolean;
    isRecurrence: boolean;
    offSet: number;
    allowMultipleStaff: boolean;
    cancelTypeId: number;
    isExcludedFromMileage: boolean;
    isDirectService: boolean;
    patientPhotoThumbnailPath: string;
    statusId: number;
    statusName: string;
    address: string;
    latitude: number;
    longitude: number;
    isTelehealthAppointment: boolean;
    customAddress: string;
    customAddressID?: number;
    notes: string;
    officeAddressID?: number;
    recurrenceRule: string;
    parentAppointmentId?: number;
}
export class AppointmentStaff {
    staffId: number;
    staffName: string;
    isDeleted: boolean;
}
export class PatientAuthorizationModel {
    authorizationId: number;
    authorizationNumber: string;
    startDate: Date;
    endDate: Date;
    payerName: string;
    payerPreference: string;
    totalCount: number;
    patientInsuranceId: number;
    authorizationTitle: string;
    notes: string;
    payerId: number;
    isExpired: boolean;
}
//chat
export class ChatHistoryModel {
    id?: number;
    message: string;
    isSeen?: boolean;
    fromUserId?: number;
    toUserId?: number;
    chatDate?: string;
    isRecieved?: boolean;
}


