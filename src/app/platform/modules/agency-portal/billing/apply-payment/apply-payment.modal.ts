export class ClaimServiceLineAdjustment {
    serviceLineId: number;
    patientInsuranceId: number;
    amountAdjusted: string;
    adjustmentGroupCode: number;
    adjustmentReasonCode: string;
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
    paymentAmount: number;
    claimServiceLineAdjustment: ClaimServiceLineAdjustment[];
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
    claimServiceLines: ClaimServiceLine[];
    balance: number;
    submissionType: number;
    isEDIPayer: boolean;
    payerId: number;
    claimPaymentStatusId: number;
    totalServiceLinePayment: number;
    isApplyPayment: boolean;
    isFullPayment: boolean;
}

