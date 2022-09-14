
export class ClientModel {
    id: number;
    dob: string;
    gender: number;
    ssn: string;
    mrn: string;
    email: string;
    photoPath: string;
    photoThumbnailPath: string;
    isPortalActivate: boolean;
    isBlock: boolean;
    isActive: boolean;
    userID: number;
    firstName: string;
    lastName: string;
    middleName: string;
    note: string;
    locationID: number;
    optOut: boolean;
     race: number=null;
     secondaryRaceID: number=null;
    renderingProviderID: number;
    userName: string;
    icdid: number;
    isPortalRequired: boolean=false;
    patientDiagnosis: PatientDiagnosis[];
    patientTags: PatientTag[];
    tag: number[];
     ethnicity: number=null;
    primaryProvider: string;
    emergencyContactRelationship: number;
    emergencyContactFirstName: string;
    emergencyContactLastName: string;
    emergencyContactPhone: string;
    PhotoBase64: string;
    linkedEncounterId: number;
    isBBEnabled: boolean;
    identifier: any;
}
export class PatientDiagnosis {
    id?: number;
    patientID?: number;
    icdid?: number;
    isPrimary?: boolean;
}

export class PatientTag {
    id?: number;
    patientID?: number;
    tagID?: number;
    isDeleted: boolean;
}

export class SocialHistoryModel
{
    id:number;
    alcohalID:number;
    drugID:number;
    patientID:number;
    occupation:string;
    tobaccoID:number;
    travelID:number;
    linkedEncounterId: number;
}

export class AddUserDocumentModel {
    base64: any[]
    documentTitle: string
    documentTypeIdStaff: number
    expiration: string
    key: string
    otherDocumentType: string
    userId: number
}

export class UserDocumentModel {
    id: number;
    userId: number;
    documentTitle: string;
    url: string;
    documentTypeIdStaff: number;
    documentTypeNameStaff: string;
    expiration: Date;
    extenstion: string;
    otherDocumentType: string;
    createdDate: Date;
    key: string;
}
