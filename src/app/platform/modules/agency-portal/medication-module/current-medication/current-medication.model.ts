export class CurrentMedicationModel {
    id: number;
    medication: string;
    dose: number;
    frequencyId: number;
    frequency: string;
    quantity: number;
    daySupply: number;
    refills: number;
    conditionId: number;
    condition: string;
    providerId: number;
    providerName: string;
    prescribedDate: string;
    linkedEncounterId: number;
    patientId: number
    medicationId: number
    sourceId: number
    source: string
    notes: string
    color: string;
    dosageForm: string;
    unit: string;
    isManualEntry: boolean = false;
}
