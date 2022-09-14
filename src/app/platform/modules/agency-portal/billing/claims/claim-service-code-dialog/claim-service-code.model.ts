export class ClaimServiceCodeModel {
    id: number;
    claimId: number;
    serviceCode: string;
    rate: number;
    quantity: number;
    totalAmount: number;
    patientInsuranceId: number;
    balance: number;
    modifier1: string;
    modifier2: string;
    modifier3: string;
    modifier4: string;
    isBillable: boolean;
    clinicianId: number;
    renderingProviderId: number;
    serviceLocationId: number;
    patientAddressID: number;
    officeAddressID: number;
    customAddressID: number;
    customAddress: string;
    rateModifier1: number;
    rateModifier2: number;
    rateModifier3: number;
    rateModifier4: number;
    serviceFacilityCode: number;
    isMultiplePractitioner: boolean;
}