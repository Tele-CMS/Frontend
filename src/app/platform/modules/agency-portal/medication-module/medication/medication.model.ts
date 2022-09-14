export class MedicationModel {
    id: number;
    patientId: number;
    medicineName: string;
    producttypeName: string;
    quantity: string;
    amountPaid: string;
    dosageFormName: Date;
    color:string;
}

export class MedicationDataModel {
    id: number;
    patientId: number = null;
    medicine: string = '';
    dose: string = '';
    startDate: string = '';
    endDate: string = '';
    frequencyID: string = '';
    strength: string = '';
    

    masterMedicationId: number;
    drugName: string
    quantity: number;
    supplyDays: number;
    ndcCode: string;
    prescriberNPI: string;
    pharmacy: string;
    fillDate: string;
    linkedEncounterId: number;
}