
export class ClaimEncounter {
    patientEncounterId: number;
    dos: Date;
    startDateTime: Date;
    endDateTime: Date;
    appointmentType: string;
}

export class ClaimServiceLine {
    id: number;
    claimId: number;
    serviceCode: string;
    rate: number;
    quantity: number;
    totalAmount: number;
    patientInsuranceId: number;
    balance: number;
    isBillable: boolean;
    clinician: string;
    renderingProvider: string;
    rateModifier1: number;
    rateModifier2: number;
    rateModifier3: number;
    rateModifier4: number;
    serviceFacilityCode: number;
    isMultiplePractitioner: boolean;
    staffNames: string;
}

export class Claim {
    claimId: number;
    dos: Date;
    patientId: number;
    patientName: string;
    clinicianId: number;
    clinician: string;
    renderingProvider: string;
    renderingProviderId: number;
    payer: string;
    patientInsuranceId: number;
    statusId: number;
    status: string;
    totalAmount: number;
    totalRecords: number;
    additionalClaimInfo: string;
    serviceLocationId: number;
    claimEncounters: ClaimEncounter[];
    claimServiceLines: ClaimServiceLine[];
    balance: number;
    submissionType: number;
    isEDIPayer: boolean;
    payerId: number;
}

export class ClaimHistoryModel {
    ClaimDetail: ClaimDetail;
    ClaimHistory: ClaimHistory[];
}

export class ClaimHistory {
    claimId: number;
    action: string;
    oldValue: string;
    newValue: string;
    columnName: string;
    patientName: string;
    logDate: string;
    totalRecords: number;
    serviceLocationId: number;
}

export class ClaimDetail {
    claimId: number = 0;
    dos: string = '';
    patientName: string = '';
    payer: string = '';
}
