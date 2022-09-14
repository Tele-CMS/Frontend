export class PatientMedicalFamilyHistoryModel {
    id?: number = 0;
    patientID: number = null;
    firstName: string = '';
    lastName: string = '';
    genderID: number;
    gender: string = '';
    dob: Date;
    relationshipID: number;
    relationShipName: string = '';
    dateOfDeath: Date;
    causeOfDeath: string = '';
    observation: string = '';
    patientMedicalFamilyHistoryDiseases?: PatientMedicalFamilyHistoryDiseaseModel[];
    linkedEncounterId: number;
}

export class PatientMedicalFamilyHistoryDiseaseModel {
    id?: number = null;
    patientID?: number = null;
    medicalFamilyHistoryId?: number = null;
    diseaseID?: number = null;
    diseaseStatus?: boolean = false;
    ageOfDiagnosis?: number = null;
}
