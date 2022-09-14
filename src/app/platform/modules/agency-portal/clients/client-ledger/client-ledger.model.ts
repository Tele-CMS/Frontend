export class ClientLedgerModel {
    claimId: number;
    dos: string;
    patientId: number;
    patientName: string;
    clinician: string;
    renderingProvider: string;
    payer: string;
    status: string;
    totalAmount: number;
    insuranceOwes: number;
    patientOwes: number;
    insurancePayments: number;
    insuranceAdjustments: number;
    patientPayments: number;
    patientAdjustments: number;
    balance: number;
    totalRecords: number;
    xmlString: string;
}

export class ClientLedgerDetailsModel {
    id: number;
    serviceCode: string;
    rate: number;
    quantity: number;
    totalAmount: number;
    insurancePayments: number;
    insuranceAdjustments: number;
    patientPayments: number;
    patientAdjustments: number;
    isBillable: boolean;
    balance: number;
    isExpanded: boolean = false;
}

export class ClientLedgerPaymentDetailsModel {
    id: number;
    amount: number;
    descriptionTypeId: number;
    notes: string;
    paymentDate: string;
    paymentTypeId: number;
    patientInsuranceId: number;
    payerName: string;
    paymentType: string;
    descriptionType: string;
    serviceLineId: number;
    claimId: number;
    adjustmentGroupCode: string;
    adjustmentReasonCode: string;
    patientId: number;
    guarantorId: number;
    patientName:string;
    guardianName:string;
}

export class AdjustmentGroupCodeModel {
    id: number;
    value: string;
    description: string;
}

export class MasterPaymentDescription {
    id: number;
    descriptionType: string;
    value: string;
    key: string;
    organizationID: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: number;
    createdDate: string;
}

export class MasterPaymentType {
    id: number;
    paymentType: string;
    value: string;
    key: string;
    organizationID: number;
    associatedEntity: string;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: number;
    createdDate: string;
}