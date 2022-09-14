export class PrescriptionModel {
    id: number;
    patientId: number;
    medicine: string;
    dose: string;
    strength: string;
    startDate: string;
    endDate: string;
    frequencyID: number;
    masterMedicationId: number;
    duration: string;
    notes: string;
    drugID: number;
    createdBy: number;
    createdDate: string;
    directions: string;
    PrescriptionId: string;
    Issentprescription: boolean;
}


export class PrescriptionFaxModel {
    id: number;
    patientId: number;
    sourceFaxNumber: number;
    countryID: number;
    stateID: number;
    cityID: number;
    pharmacyID: number;
    pharmacyAddress: string;
    pharmacyFaxNumber: number;
    createdBy: number;
    PrescriptionId: string;
    Issentprescription: boolean;
}

export class PrescriptionDownloadModel {
    patientId: number;
    PrescriptionId: string;
    Issentprescription: boolean;
}
