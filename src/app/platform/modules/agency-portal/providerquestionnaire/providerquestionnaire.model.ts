export class PayerModel {
    id: number;
    name: string;
    insuranceTypeId: number;
    address: string;
    city: string;
    stateID: number;
    countryID: number;
    fax: string;
    zip: string;
    phone: string;
    email: string;
    carrierPayerID: string;
    dayClubByProvider: boolean;
    tplCode: string;
    isEDIPayer: boolean;
    isPractitionerIsRenderingProvider: boolean;
    form1500PrintFormat: number;
    latitude: number;
    longitude: number;
    apartmentNumber: string;
    isActive: boolean;
    totalRecords: number;
    additionalClaimInfo: string;
}

export class PayerListingModel {
    id: number;
    name: string;
    insuranceTypeId: number;
    insType: string;
    stateID: number;
    email: string;
    dayClubByProvider: boolean;
    isEDIPayer: boolean;
    isPractitionerIsRenderingProvider: boolean;
    form1500PrintFormat: number;
    isActive: boolean;
    totalRecords: number;
}

export class PayerServiceCodeModel {
    masterServiceCodeId: number;
    payerServiceCodeId: number;
    serviceCode: string;
    description: string;
    unitDuration: number;
    unitTypeID: number;
    ratePerUnit: number;
    isBillable: boolean;
    ruleID: number;
    isRequiredAuthorization: boolean;
    ruleName: string;
    unitTypeName: string;
    payerId: number;
    serviceCodeId: number;
    totalRecords: number;
    isEditable: boolean = false;
}

export class PayerServiceCodeModifierModel {
    id: number;
    rowNo: number;
    modifier: string;
    rate: number;
    payerServiceCodeId: number;
    key: string;
    value: string;
    isUsedModifier: boolean;
}

export class PayerServiceCodeWithModifierModel {
    id?: number;
    serviceCode?: string;
    type?: string;
    description?: string;
    unitDuration?: number;
    unitType?: number;
    ratePerUnit?: number;
    isBillable?: boolean;
    ruleID?: number;
    isRequiredAuthorization?: boolean;
    ruleName?: string;
    unitTypeName?: string;
    payerId?: number;
    effectiveDate?: Date;
    newRatePerUnit?: number;
    serviceCodeId?: number;
    totalRecords?: number;
    payerModifierModel: PayerServiceCodeModifierModel[];
}
export class PayerActivityModel {
    appointmentTypeID: number;
    name: string;
    isActive: boolean;
    totalRecords: number;
}
export class PayerActivityServiceCodesModel {
    id: number;
    serviceCodeId: number;
    payerServiceCodeId: number;
    serviceCode: string;
    description: string;
    unitDuration: number;
    unitTypeName: string;
    ratePerUnit: number;
    isBillable: boolean;
    isRequiredAuthorization: boolean;
    totalRecords: number;
    attachedModifiers: string;
}

export class PayerActivityServiceCodeModel {
    id: number;
    description?: string;
    appointmentTypeId: number;
    unitDuration?: number;
    unitType?: number;
    ratePerUnit: number;
    isBillable?: boolean;
    ruleID?: number;
    isRequiredAuthorization?: boolean;
    payerId: number;
    serviceCodeId?: number;
    payerServiceCodeId: number;
    modifier1: string;
    modifier2: string;
    modifier3: string;
    modifier4: string;
    totalRecords?: number;
}
export class ActivityCodeModifierUpdateModel {
    id: number;
    modifier1: string;
    modifier2: string;
    modifier3: string;
    modifier4: string;
    ratePerUnit: string;
}

export class AddQuestionnaireModel {
    id: number;
    questionOptionName: string;
    questionid:number;
    questionnaireoptions?: QuestionnaireOptionsModel[];
}
export class QuestionnaireOptionsModel {
    id?: number = null;
    //careCategoryId?: number = null;
    questionOptionName?: string = null;
    
}

export class ProviderQuestionnaireModel { 
    QuestionId: number;
    questionNameName: string;  
    QuestionnaireId: number;
}
export class ManageQuestionnaireModel { 
    QuestionnareId: number;
    QuestionnnaireName: string;  
}


export class QuestionnareTypeModel{
    id:number;
    value:string;
}

export class QuestionnareControl{
    id: number;
    name:string;
    hasOptions:boolean;
    key: string;
}

export class ProviderQuestionnaireControlModel{
    questionText: string;
    questionnaireTypeControlId: number;
    questionId: number;
    options: string[]=[];
    order:number;
    controlName:string;
    optionsString: string;
    isActive: boolean;
    isRequired: boolean;
    isRequiredString: string;
    type: string;
    control:any;
}

export class SwapOrderModel{
    id:number;
    order:number;
}