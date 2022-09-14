export class DiagnosisModel {
    id: number;
    primaryInsuredMemberId: string;
    patientID: number;
    serviceBginDate: Date;
    serviceEndDate: Date;
    claimNumber: string;
    diagnosis: string;
    diagnosisICD10Codes: string;
    resolveDate: string;
    totalRecords: number;
    diagnosisDate: string;
    icdid: number;
    isActive: boolean = true;
}

export class DiagnosisDataModel {
    id: number;
    icdid: number;
    patientID: number;
    diagnosisDate: string;
    isActive: boolean=true;
    isPrimary: boolean;
    resolveDate: string;
    isDeleted: boolean;
    diagnosis: string;
    diagnosisName: string;
    linkedEncounterId: number;
}