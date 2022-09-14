export class AuthorizationModel {
    authorizationId: number;
    authorizationNumber: string;
    startDate: Date;
    endDate: Date;
    payerName: string;
    payerPreference: string;
    totalCount: number;
    patientInsuranceId: number;
    authorizationTitle: string;
    payerId: number;
    isExpired: boolean;
    notes: string;
}

export class AuthorizationProcedureModel {
    authorizationId: number;
    totalUnit: number;
    globalCodeName: string;
    authorizationProcedureId: number;
    actualAuthProcedureUnitConsumed: number;
    typeId: number;
}

export class AuthorizationProceduresCPTModel {
    authorizationProcedureId: number;
    serviceCode: string;
    serviceCodeId: number;
    unitConsumed: number;
    blockedUnit: number;
    authProcedureCPTLinkId: number;
    actualAuthProcedureAllowedUnit: number;
    actualAuthProcedureUnitConsumed: number;
    isValid: boolean;
    isRequiredAuthorization: boolean;
    attachedModifiers: string;
}

export class AuthorizationDisplayModel {
    authorizationId: number;
    authorizationNumber: string;
    startDate: Date;
    endDate: Date;
    payerName: string;
    authorizationTitle: string;
    isExpired: boolean;
    authorizationServiceCodesDisplayModel: AuthorizationServiceCodesDisplayModel[];
}

export class AuthorizationServiceCodesDisplayModel {
    serviceCodes: string;
    modifiers: string;
    unitApproved: string;
    unitConsumed: number;
    unitScheduled: number;
    unitRemained: number;
}



//////////////////////// model for single request ////
export class AuthModel {
     id: number;
     patientID: number;
     authorizationTitle: string;
     authorizationNumber: string;
     startDate: string;
     endDate: string;
     notes: string;
     patientInsuranceId: number;
     isVerified?: boolean;
     organizationID?: number;
     authorizationProcedures: AuthProceduresModel[];
}
export class AuthProceduresModel {
    id: number;
    authorizationId: number;
    unit: number;
    unitConsumed?: number;
    unitRemain?: number;
    typeID: number;
    isVerified?: boolean;
    isDeleted: boolean;
    authProcedureCPT: AuthProcedureCPTModel[];
}
export class AuthProcedureCPTModel {
    id: number;
    authorizationProceduresId: number;
    cptid: number;
    unitConsumed?: number;
    blockedUnit?: number;
    isDeleted: boolean;
    authProcedureCPTModifiers: AuthProcedureCPTModifierModel[];
}
export class AuthProcedureCPTModifierModel {
    id: number;
    authProcedureCPTLinkId: number;
    modifier: string;
    isDeleted: boolean;
}